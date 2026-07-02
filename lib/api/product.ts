import axiosInstance from "./axios";
import axios from "./axios";
import { API } from "./endpoint";

export const createProduct = async (formData: FormData) => {
  try {
    const response = await axios.post(API.PRODUCT.CREATE, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Create Product failed",
    );
  }
};

export const getAllProduct = async (params?: {
  page?: number;
  size?: number;
  search?: string;
}) => {
  try {
    const response = await axios.get(API.PRODUCT.GET_ALL, {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch products",
    );
  }
};
export const getMyFavoriteProducts = async () => {
  const res = await axiosInstance.get(API.PRODUCT.FAVORITES_ME, {
    withCredentials: true,
  });
  return res.data;
};
export const getProductById = async (id: string) => {
  if (!id) throw new Error("Product id is required");
  try {
    const response = await axiosInstance.get(API.PRODUCT.GET_ONE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch product",
    );
  }
};

// UPDATE PRODUCT (JSON body)
export const updateProduct = async (id: string, payload: any) => {
  try {
    const response = await axiosInstance.put(API.PRODUCT.UPDATE(id), payload, {
      headers: {
        "Content-Type": "multipart/form-data", //for file upload/multer
      },
    });
    return response.data;
  } catch (err: Error | any) {
    throw new Error(err.response?.data?.message || "Updating Product Failed");
  }
};

// UPDATE PRODUCT IMAGE (multipart)
export const updateProductImage = async (formData: FormData) => {
  try {
    const response = await axios.put(API.PRODUCT.UPDATE_IMAGE, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Update image failed",
    );
  }
};

// DELETE PRODUCT
export const deleteProduct = async (id: string) => {
  try {
    const response = await axios.delete(API.PRODUCT.DELETE(id), {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Delete product failed",
    );
  }
};

// FILTERS / LISTS
export const getProductsByCategory = async (category: string) => {
  try {
    const response = await axios.get(API.PRODUCT.BY_CATEGORY(category));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch category products",
    );
  }
};

export const getRecentProducts = async (page = 1, size = 10) => {
  const res = await axios.get(API.PRODUCT.RECENT, {
    params: { page, size },
  });
  return res.data;
};

export const getTrendingProducts = async (page = 1, size = 10) => {
  const res = await axios.get(API.PRODUCT.TRENDING, {
    params: { page, size },
  });
  return res.data;
};

export const getPopularProducts = async (page = 1, size = 10) => {
  const res = await axios.get(API.PRODUCT.POPULAR, {
    params: { page, size },
  });
  return res.data;
};

export const getTopRatedProducts = async (page = 1, size = 10) => {
  const res = await axios.get(API.PRODUCT.TOP_RATED, {
    params: { page, size },
  });
  return res.data;
};

export const restockProduct = async (
  id: string,
  payload: { quantity: number; mode?: "set" | "add" },
) => {
  if (!id) throw new Error("Product id is required");

  try {
    const response = await axios.put(API.PRODUCT.RESTOCK(id), payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Restock failed",
    );
  }
};

export const incrementProductView = async (id: string) => {
  if (!id) throw new Error("Product id is required");
  try {
    const response = await axios.patch(API.PRODUCT.INCREMENT_VIEW(id));
    return response.data;
  } catch (error: any) {
    return null;
  }
};

export const getOutOfStockProducts = async (params?: {
  page?: number;
  size?: number | "all";
  search?: string;
  category?: string;
}) => {
  try {
    const response = await axios.get(API.PRODUCT.OUT_OF_STOCK, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch out of stock products",
    );
  }
};
// RATE PRODUCT
export const rateProduct = async (id: string, payload: { rating: number }) => {
  if (!id) throw new Error("Product id is required");

  try {
    const response = await axiosInstance.post(API.PRODUCT.RATE(id), payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Rating product failed",
    );
  }
};

export const toggleFavoriteProduct = async (id: string) => {
  if (!id) throw new Error("Product id is required");

  try {
    const response = await axiosInstance.post(
      API.PRODUCT.FAVORITE_TOGGLE(id),
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Toggling favorite failed",
    );
  }
};

export const addProductComment = async (
  id: string,
  payload: { comment: string },
) => {
  if (!id) throw new Error("Product id is required");

  try {
    const response = await axiosInstance.post(
      API.PRODUCT.ADD_COMMENT(id),
      payload,
      { withCredentials: true },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Adding comment failed",
    );
  }
};

// GET PRODUCT COMMENTS
export const getProductComments = async (id: string) => {
  if (!id) throw new Error("Product id is required");

  try {
    const response = await axios.get(API.PRODUCT.GET_COMMENTS(id));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Fetching comments failed",
    );
  }
};
