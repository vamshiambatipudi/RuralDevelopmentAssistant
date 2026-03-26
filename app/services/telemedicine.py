from uuid import uuid4


def generate_secure_room() -> dict[str, str]:
    room_id = f"rda-room-{uuid4().hex[:12]}"
    # In production, replace with Twilio Video / Agora / Daily token generation.
    return {
        "secure_room_id": room_id,
        "meeting_link": f"https://example-health.local/rooms/{room_id}",
    }
