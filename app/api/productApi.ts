import axiosInstance from "@/lib/axiosInstance";

export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    console.log("Get product success", response.data);
    if (response.data.success) {
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const createProduct = async (productData: {
  productName: string;
  description: string;
  price: number;
  category: string;
  skinType: string;
  rating: number;
  imageFile: File | null;
  imagePreview: string;
}) => {
  try {
    const formData = new FormData();
    const { imageFile, imagePreview, ...productInfo } = productData;
    formData.append("product", JSON.stringify(productInfo));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axiosInstance.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Create success", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Update success", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    console.log("Delete success");
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const fetchProductsByCategory = async (category: string) => {
  try {
    const response = await axiosInstance.get(`/products/category/${category}`);
    console.log("Get by category success", response.data);
      return response.data || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

export const fetchProductsByName = async (productName: string) => {
  try {
    const response = await axiosInstance.get(`/products/name/${productName}`);
    console.log("Get by name success", response.data);
      return response.data || [];
  } catch (error) {
    console.error("Error fetching products by name:", error);
    return [];
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    console.log("Get by ID success", response.data);
    if (response.data.success) { // Sửa từ isSuccess thành success
      return response.data.data || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

export const fetchProductsBySkinType = async (skinType: string) => {
  try {
    const response = await axiosInstance.get(`/products/skinType/${skinType}`);
    console.log("Get by skin type success", response.data);
    if (response.data.success) { // Sửa từ isSuccess thành success
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching products by skin type:", error);
    return [];
  }
};

export const fetchProductsByFilters = async (filters: {
  categories?: string;
  skinTypes?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  try {
    const response = await axiosInstance.get("/products/filter", {
      params: filters,
    });
    console.log("Get by filters success", response.data);
    if (response.data.success) { // Sửa từ status === 200 thành success
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching products by filters:", error);
    return [];
  }
};