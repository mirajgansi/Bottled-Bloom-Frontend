import { emitCartUpdated } from "../cart-event"; // <-- make sure path is correct
import axios from "./axios";
import { API } from "./endpoint";

export const getMyCart = async () => {
  const res = await axios.get(API.CART.GET_MY_CART);
  return res.data;
};

export const addCartItem = async (payload: {
  productId: string;
  quantity?: number;
}) => {
  try {
    const res = await axios.post(API.CART.ADD_ITEM, payload);

    emitCartUpdated();

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to add item",
    );
  }
};

export const updateCartItemQuantity = async (
  productId: string,
  quantity: number,
) => {
  try {
    const res = await axios.put(API.CART.UPDATE_ITEM_QTY(productId), {
      quantity,
    });

    emitCartUpdated(); // ✅ here

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update quantity",
    );
  }
};

export const removeCartItem = async (productId: string) => {
  try {
    const res = await axios.delete(API.CART.REMOVE_ITEM(productId));

    emitCartUpdated(); // ✅ here

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to remove item",
    );
  }
};

export const clearCart = async () => {
  try {
    const res = await axios.delete(API.CART.CLEAR);

    emitCartUpdated(); // ✅ here

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to clear cart",
    );
  }
};
