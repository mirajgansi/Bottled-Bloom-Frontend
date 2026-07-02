import { error } from "console";
import axios from "./axios";
import { API } from "./endpoint";

export const register = async (registrationData: any) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER, registrationData);
    return response.data; // expected: { success, message, data?, field? }
  } catch (err: any) {
    return {
      success: false,
      // if backend sends field, keep it (optional)
      field: err?.response?.data?.field,
      message:
        err?.response?.data?.message || err?.message || "Registration Failed",
    };
  }
};

export const login = async (data: any) => {
  try {
    const res = await axios.post(API.AUTH.LOGIN, data);
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      field: err?.response?.data?.field,
      message: err?.response?.data?.message || "Invalid email or password",
    };
  }
};

export const whoami = async () => {
  try {
    const response = await axios.get(API.AUTH.WHOAMI);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(err.response?.data?.message || "Fetching User Data Failed");
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await axios.put(API.AUTH.UPDATEPROFILE, profileData, {
      headers: {
        "Content-Type": "multipart/form-data", //for file upload/multer
      },
    });
    return response.data;
  } catch (err: Error | any) {
    throw new Error(err.response?.data?.message || "Updating Profile Failed");
  }
};
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, {
      email,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Request password reset failed",
    );
  }
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  try {
    const response = await axios.post(API.AUTH.RESET_PASSWORD, {
      email,
      code: code.trim(),
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Reset password failed",
    );
  }
};

export const deleteMe = async (password: string) => {
  try {
    const response = await axios.delete(API.AUTH.DELETEME, {
      data: { password },
      withCredentials: true,
    });

    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Deleting account failed");
  }
};
export const verifyResetCode = async (email: string, code: string) => {
  try {
    const response = await axios.post(API.AUTH.VERIFY_RESET_CODE, {
      email,
      code: code.trim(),
    });
    return response.data; // { success, message }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Verify reset code failed",
    );
  }
};
