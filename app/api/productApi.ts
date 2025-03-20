import axiosInstance from "@/lib/axiosInstance"

export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/products")
    console.log("Get success")
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

interface ProductCreate {
  productID: string
  productName: string
  description: string
  price: number
  category: string
  rating: number
  image_url: string
}

export const createProduct = async (product: ProductCreate) => {
  try {
    const response = await axiosInstance.post("/products", product)
    console.log("Create success")
    return response.data
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export const updateProduct = async (id: string, product: { name: string, category: string, price: string, stock: number, status: string }) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, product)
    console.log("Update success")
    return response.data
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export const deleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`)
    console.log("Delete success")
    return response.data
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

export const fetchProductsByCategory = async (category: string) => {
  try {
    const response = await axiosInstance.get(`/products/category/${category}`)
    console.log("Get by category success")
    return response.data
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

export const fetchProductsByName = async (productName: string) => {
  try {
    const response = await axiosInstance.get(`/products/name/${productName}`)
    console.log("Get by name success")
    return response.data
  } catch (error) {
    console.error("Error fetching products by name:", error)
    return []
  }
}

export const fetchProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`)
    console.log("Get by ID success")
    return response.data
  } catch (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }
}