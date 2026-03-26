// Authentication Service using Lovable Cloud
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
  isVerified: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

// Register user — auto-confirmed, no OTP needed
export async function initiateRegistration(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  if (!name || name.trim().length < 2) {
    return { success: false, error: "Name must be at least 2 characters" };
  }
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { success: false, error: "Please enter a valid email address" };
  }
  if (!password || password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  const { error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: { data: { name: name.trim() } },
  });

  if (error) {
    if (error.message.includes("already registered") || error.message.includes("already been registered")) {
      return { success: false, error: "An account with this email already exists. Please login instead." };
    }
    return { success: false, error: error.message };
  }

  return { success: true, message: `Account created successfully for ${normalizedEmail}.` };
}

// Legacy OTP functions — kept for compatibility but simplified
export async function verifyRegistrationOTP(
  email: string,
  _otpCode: string
): Promise<{ success: boolean; error?: string; user?: User; welcomeMessage?: string }> {
  // OTP no longer required — account is auto-confirmed
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return {
      success: true,
      user: {
        id: user.id,
        name: user.user_metadata?.name || "",
        email: user.email || email,
        createdAt: new Date(user.created_at),
        isVerified: true,
      },
      welcomeMessage: `Welcome! Your account is ready.`,
    };
  }
  return { success: false, error: "Session not found. Please login." };
}

export async function resendOTP(
  _email: string
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; session?: AuthSession; welcomeMessage?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  if (!normalizedEmail) return { success: false, error: "Please enter your email address" };
  if (!password) return { success: false, error: "Please enter your password" };

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login") || error.message.includes("invalid_credentials")) {
      return { success: false, error: "Incorrect email or password. Please try again." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { success: false, error: "Please verify your email first. Check your inbox for the verification link." };
    }
    return { success: false, error: error.message };
  }

  if (data.session && data.user) {
    // Check if account is active
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_active")
      .eq("id", data.user.id)
      .single();

    if (profile && !profile.is_active) {
      await supabase.auth.signOut();
      return { success: false, error: "Your account has been deactivated. Please contact an administrator." };
    }

    const userName = data.user.user_metadata?.name || data.user.email || "";
    const session: AuthSession = {
      user: {
        id: data.user.id,
        name: userName,
        email: data.user.email || normalizedEmail,
        createdAt: new Date(data.user.created_at),
        isVerified: !!data.user.email_confirmed_at,
      },
      token: data.session.access_token,
      expiresAt: new Date(data.session.expires_at! * 1000),
    };
    return {
      success: true,
      session,
      welcomeMessage: `Welcome back, ${userName}! 🌾`,
    };
  }

  return { success: false, error: "Login failed. Please try again." };
}

// Get current session
export async function getCurrentSession(): Promise<AuthSession | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  return {
    user: {
      id: session.user.id,
      name: session.user.user_metadata?.name || session.user.email || "",
      email: session.user.email || "",
      createdAt: new Date(session.user.created_at),
      isVerified: !!session.user.email_confirmed_at,
    },
    token: session.access_token,
    expiresAt: new Date(session.expires_at! * 1000),
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return {
    id: user.id,
    name: user.user_metadata?.name || user.email || "",
    email: user.email || "",
    createdAt: new Date(user.created_at),
    isVerified: !!user.email_confirmed_at,
  };
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function initiateAccountDeletion(): Promise<{
  success: boolean;
  error?: string;
  message?: string;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "You must be logged in to delete your account." };
  return {
    success: true,
    message: `To delete your account, please contact support or use the admin portal.`,
  };
}

export async function updateUserProfile(updates: {
  name?: string;
  age?: number;
  phone?: string;
  village?: string;
  mandal?: string;
  district?: string;
  state?: string;
  pin_code?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };

  if (updates.name) {
    await supabase.auth.updateUser({ data: { name: updates.name } });
  }

  return { success: true };
}

export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data;
}

// Legacy compatibility
export function registerUser(name: string, email: string, password: string) {
  return initiateRegistration(name, email, password);
}
