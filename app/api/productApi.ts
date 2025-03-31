import axiosInstance from "@/lib/axiosInstance";

export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    console.log("Get product success", response.data);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Create new product
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
    const response = await axiosInstance.post("/products", productData);
    console.log("Create success");
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  product: {
    name: string;
    description: string;
    category: string;
    price: string;
    rating: number;
    image_url: string;
    skinType: string;
  }
) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, product);
    console.log("Update success");
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
    console.log("Get by category success");
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

export const fetchProductsByName = async (productName: string) => {
  try {
    const response = await axiosInstance.get(`/products/name/${productName}`);
    console.log("Get by name success");
    return response.data;
  } catch (error) {
    console.error("Error fetching products by name:", error);
    return [];
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    console.log("Get by ID success");
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

export const fetchProductsBySkinType = async (skinType: string) => {
  try {
    const response = await axiosInstance.get(`/products/skinType/${skinType}`);
    console.log("Get by skin type success");
    return response.data;
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
    if (response.data.status === 200) {
      return response.data.data || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching products by filters:", error);
    return [];
  }
};