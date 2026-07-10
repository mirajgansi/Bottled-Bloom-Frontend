"use server";

import { set } from "zod";
import {
  register,
  login,
  whoami,
  updateProfile,
  requestPasswordReset,
  resetPassword,
  deleteMe,
  verifyResetCode,
  verifyLoginOtp,
} from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";
import { revalidatePath } from "next/cache";

export async function handleRegister(formData: any) {
  try {
    const result = await register(formData);

    if (!result) {
      return { success: false, message: "No response from server" };
    }

    if (result.success === false) {
      return {
        success: false,
        field: result.field,
        message: result.message || "Registration failed",
      };
    }

    return {
      success: true,
      message: result.message || "Registered successfully",
      data: result.data ?? result,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Network error",
    };
  }
}

export type LoginActionResult =
  | { success: true; requiresOtp: true; tempToken: string; message?: string }
  | { success: true; requiresOtp?: false; data: any; message?: string }
  | { success: false; field?: string; message: string };

export async function handleLogin(formData: any): Promise<LoginActionResult> {
  try {
    const result = await login(formData);

    if (!result || result.success !== true) {
      return {
        success: false,
        field: result?.field,
        message: result?.message || "Invalid email or password",
      };
    }

    // ✅ Step 1: password correct, OTP sent — do NOT set any session cookie yet
    if (result.requiresOtp && result.tempToken) {
      return {
        success: true,
        requiresOtp: true,
        tempToken: result.tempToken,
        message: result.message || "Verification code sent to your email",
      };
    }

    // Fallback: OTP disabled server-side, backend returned a real session directly
    if (result.data && result.token) {
      await setUserData(result.data);
      await setAuthToken(result.token);

      return {
        success: true,
        requiresOtp: false,
        data: result.data,
        message: "Login successful",
      };
    }

    // Defensive: shouldn't happen, but avoids setting cookies to undefined
    return {
      success: false,
      message: "Unexpected response from server",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Server error. Please try again.",
    };
  }
}

export type VerifyOtpActionResult =
  | { success: true; data: any; message?: string }
  | { success: false; message: string };

export async function handleVerifyLoginOtp(
  tempToken: string,
  code: string,
): Promise<VerifyOtpActionResult> {
  try {
    const data = await verifyLoginOtp(tempToken, code); // already parsed JSON via axios

    if (data?.success && data?.token) {
      await setUserData(data.data);
      await setAuthToken(data.token);

      return {
        success: true,
        message: "Login successful",
        data: data.data,
      };
    }

    return {
      success: false,
      message: data?.message || "Invalid or expired code",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Server error. Please try again.",
    };
  }
}

export async function handleWhoami() {
  try {
    const result = await whoami();

    if (result.success) {
      return {
        success: true,
        message: "message successful",
        data: result.data,
      };
    }

    return { success: false, message: result.message ?? "Login failed" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function handleUpdateProfile(formData: any) {
  try {
    const result = await updateProfile(formData);
    if (result.success) {
      await setUserData(result.data); //update cookie
      return {
        success: true,
        message: "Profile updated successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Profile update failed",
    };
  } catch (err: Error | any) {
    return { success: false, message: err.message };
  }
}
export const handleRequestPasswordReset = async (email: string) => {
  try {
    const response = await requestPasswordReset(email);
    if (response.success) {
      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Request password reset failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Request password reset action failed",
    };
  }
};

export const handleResetPassword = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  try {
    const response = await resetPassword(email, code, newPassword);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Password has been reset successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Reset password failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Reset password action failed",
    };
  }
};

export async function handleDeleteMe(password: string) {
  try {
    const result = await deleteMe(password);

    if (result.success) {
      return {
        success: true,
        message: "Account deleted successfully",
      };
    }

    return {
      success: false,
      message: result.message ?? "Deleting failed",
    };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
export const handleVerifyResetCode = async (email: string, code: string) => {
  try {
    const response = await verifyResetCode(email, code);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Code verified",
      };
    }

    return {
      success: false,
      message: response.message || "Invalid reset code",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Verify reset code action failed",
    };
  }
};
