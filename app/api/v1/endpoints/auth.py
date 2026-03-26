from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.config import settings
from app.core.database import get_session
from app.core.security import authenticate_user, create_access_token, get_current_user, get_password_hash
from app.models.user import User
from app.schemas.auth import TokenResponse, UserLogin, UserRegister, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
def register(payload: UserRegister, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        role=payload.role,
        password_hash=get_password_hash(payload.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, session: Session = Depends(get_session)):
    user = authenticate_user(session, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(str(user.id), expires_delta=timedelta(minutes=settings.access_token_expire_minutes))
    return TokenResponse(access_token=token, user_id=user.id, role=user.role)


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user
