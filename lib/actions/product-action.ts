"use server";
import {
  addProductComment,
  createProduct,
  deleteProduct,
  getAllProduct,
  getMyFavoriteProducts,
  getOutOfStockProducts,
  getPopularProducts,
  getProductById,
  getProductComments,
  getProductsByCategory,
  getRecentProducts,
  getTrendingProducts,
  incrementProductView,
  rateProduct,
  restockProduct,
  toggleFavoriteProduct,
  updateProduct,
} from "@/lib/api/product";
import { revalidatePath } from "next/cache";

export const handleCreateProduct = async (data: FormData) => {
  try {
    const response = await createProduct(data);
    if (response.success) {
      revalidatePath("/products");

      return {
        success: true,
        message: "Create Product successful",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to create Product",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Failed to create Product",
    };
  }
};
export const handleGetAllProducts = async (params?: {
  page?: number;
  size?: number;
  search?: string;
}) => {
  try {
    const response = await getAllProduct(params);

    if (response.success) {
      return {
        success: true,
        message: "All products fetched successfully",
        products: response.data.products ?? response.data,
        pagination: response.data.pagination,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch products",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch products",
    };
  }
};
export const handleGetProductById = async (id: string) => {
  try {
    if (!id) return { success: false, message: "Missing product id" };

    const response = await getProductById(id);

    if (response.success) {
      return {
        success: true,
        product: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch product",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch product",
    };
  }
};

export async function handleDeleteProduct(id: string) {
  try {
    const result = await deleteProduct(id);

    if (result?.success) {
      revalidatePath("/admin/products");
      revalidatePath("/user/products");

      return {
        success: true,
        message: result.message || "Product deleted successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result?.message || "Delete product failed",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Delete product failed",
    };
  }
}
export const handleGetProductsByCategory = async (
  category: string,
  params?: {
    page?: number;
    size?: number;
    search?: string;
  },
) => {
  try {
    if (!category) return { success: false, message: "Missing category" };

    const response = await getProductsByCategory(category); // or pass params if your backend supports it

    if (response.success) {
      return {
        success: true,
        message: "Category products fetched successfully",
        products: response.data.products ?? response.data,
        pagination: response.data.pagination,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch category products",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch category products",
    };
  }
};

export async function handleUpdateProduct(
  productId: string,
  formData: FormData,
) {
  try {
    const res = await updateProduct(productId, formData);

    if (res?.success) {
      revalidatePath("/admin/products");
      revalidatePath(`/admin/products/edit/${productId}`);
    }
    console.log("FILES:", (res as any).files?.length);
    console.log("existingImages:", res?.existingImages);
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update product",
    };
  }
}

export async function handleGetRecentProducts(page = 1, size = 10) {
  try {
    const res = await getRecentProducts(page, size);
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch recent product",
    };
  }
}

export async function handleGetTrendingProducts(page = 1, size = 10) {
  try {
    const res = await getTrendingProducts(page, size);
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch trending product",
    };
  }
}

export async function handleGetPopularProducts(page = 1, size = 10) {
  try {
    const res = await getPopularProducts(page, size);
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch popular product",
    };
  }
}

// export async function handleGetTopRatedProducts(limit = 10) {
//   try {
//     const res = await axios.get(PRODUCT_API.TOP_RATED, { params: { limit } });
//     return res.data;
//   } catch (error: any) {
//     return {
//       success: false,
//       message: getErrorMessage(error, "Failed to fetch top rated products"),
//     };
//   }
// }
export async function handleRestockProduct(
  productId: string,
  payload: { quantity: number; mode?: "set" | "add" },
) {
  try {
    const res = await restockProduct(productId, payload);

    if (res?.success) {
      revalidatePath("/admin/products");
      revalidatePath(`/admin/products/edit/${productId}`);
      revalidatePath(`/products/${productId}`);
      revalidatePath("/products");
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to restock product",
    };
  }
}

export async function handleIncrementProductView(productId: string) {
  try {
    await incrementProductView(productId);
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function handleGetOutOfStockProducts(params?: {
  page?: number;
  size?: number | "all";
  search?: string;
  category?: string;
}) {
  try {
    const res = await getOutOfStockProducts(params);
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch out of stock products",
    };
  }
}
export async function handleRateProduct(
  productId: string,
  payload: { rating: number },
) {
  try {
    const res = await rateProduct(productId, payload);

    if (res?.success) {
      revalidatePath(`/products/${productId}`);
      revalidatePath("/products");
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to rate product",
    };
  }
}

export async function handleToggleFavoriteProduct(productId: string) {
  try {
    const res = await toggleFavoriteProduct(productId);

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to toggle favorite",
    };
  }
}

export async function handleAddProductComment(
  productId: string,
  payload: { comment: string },
) {
  try {
    const res = await addProductComment(productId, payload);

    if (res?.success) {
      revalidatePath(`/products/${productId}`);
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add comment",
    };
  }
}
export async function handleGetFavoritesMe() {
  try {
    const res = await getMyFavoriteProducts();
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch favorites",
    };
  }
}
export async function handleGetProductComments(productId: string) {
  try {
    const res = await getProductComments(productId);

    // res should already be { success, data, message } from backend
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch product comments",
    };
  }
}
