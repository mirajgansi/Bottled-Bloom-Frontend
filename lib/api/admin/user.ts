import axios from "../axios";
import { API } from "../endpoint";

export const createUser = async (userData: any) => {
  try {
    const response = await axios.post(API.ADMIN.USER.CREATE, userData, {
      headers: {
        "Content-Type": "multipart/form-data", // for file upload/multer
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Create user failed",
    );
  }
};

export const getAllUsers = async (params?: {
  page?: number;
  size?: number;
  search?: string;
}) => {
  try {
    const response = await axios.get(API.ADMIN.USER.GETALLUSER, {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch users",
    );
  }
};

export async function deleteUser(userId: string) {
  try {
    const response = await axios.delete(API.ADMIN.USER.DELETEUSER(userId), {
      headers: {
        "Content-Type": "multipart/form-data", // for file upload/multer
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Create user failed",
    );
  }
}
