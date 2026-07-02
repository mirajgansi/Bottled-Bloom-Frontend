"use server";
import { createUser, deleteUser, getAllUsers } from "@/lib/api/admin/user";
import { revalidatePath } from "next/cache";

export const handleCreateUser = async (data: FormData) => {
  try {
    const response = await createUser(data);
    if (response.success) {
      revalidatePath("/admin/users");
      return {
        success: true,
        message: "Registration successful",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Registration failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Registration action failed",
    };
  }
};

export const handleGetAllUSER = async (params?: {
  page?: number;
  size?: number;
  search?: string;
}) => {
  try {
    const response = await getAllUsers(params);

    // If your backend returns: { success, data, message }
    if (response.success) {
      return {
        success: true,
        message: "All users fetched successfully",
        users: response.data.users ?? response.data,
        pagination: response.data.pagination,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch users",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch users",
    };
  }
};

export async function handleDeleteUser(userId: string) {
  try {
    const result = await deleteUser(userId);

    if (result.success) {
      revalidatePath("/admin/users");
      return {
        success: true,
        message: result.message || "User deleted successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Failed to delete user",
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to delete user" };
  }
}
