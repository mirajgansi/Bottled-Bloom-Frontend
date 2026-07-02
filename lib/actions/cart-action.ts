"use server";

import {
  getMyCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "@/lib/api/cart"; // adjust path if needed
import { revalidatePath } from "next/cache";

type ActionResponse<T = any> =
  | { success: true; message?: string; data?: T }
  | { success: false; message: string; issues?: any };

function toMessage(err: any, fallback: string) {
  return err?.message || err?.response?.data?.message || fallback;
}

// GET MY CART
export async function handleGetMyCart(): Promise<ActionResponse> {
  try {
    const data = await getMyCart();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: toMessage(err, "Failed to fetch cart") };
  }
}

// ADD ITEM
export async function handleAddCartItem(payload: {
  productId: string;
  quantity?: number;
}): Promise<ActionResponse> {
  try {
    const data = await addCartItem(payload);
    revalidatePath("/cart"); // change to your cart page path
    return { success: true, message: "Added to cart", data };
  } catch (err: any) {
    return { success: false, message: toMessage(err, "Failed to add item") };
  }
}

// UPDATE QTY
export async function handleUpdateCartQty(
  productId: string,
  quantity: number,
): Promise<ActionResponse> {
  try {
    const data = await updateCartItemQuantity(productId, quantity);
    revalidatePath("/cart");
    return { success: true, message: "Cart updated", data };
  } catch (err: any) {
    return {
      success: false,
      message: toMessage(err, "Failed to update quantity"),
    };
  }
}

// REMOVE ITEM
export async function handleRemoveCartItem(
  productId: string,
): Promise<ActionResponse> {
  try {
    const data = await removeCartItem(productId);
    revalidatePath("/cart");
    return { success: true, message: "Item removed", data };
  } catch (err: any) {
    return { success: false, message: toMessage(err, "Failed to remove item") };
  }
}

// CLEAR CART
export async function handleClearCart(): Promise<ActionResponse> {
  try {
    const data = await clearCart();
    revalidatePath("/cart");
    return { success: true, message: "Cart cleared", data };
  } catch (err: any) {
    return { success: false, message: toMessage(err, "Failed to clear cart") };
  }
}
