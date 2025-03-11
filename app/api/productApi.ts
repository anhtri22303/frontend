import axiosInstance from "@/lib/axiosInstance"

const staticProducts = [
  {
    id: "1",
    name: "Cleanser",
    category: "Cleanser",
    skinType: ["All"],
    price: 10,
    rating: 4.5,
    image: "/images/cleanser.jpg",
  },
  {
    id: "2",
    name: "Toner",
    category: "Toner",
    skinType: ["All"],
    price: 15,
    rating: 4.0,
    image: "/images/toner.jpg",
  },
  // Thêm các sản phẩm tĩnh khác ở đây
]

export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/products")
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    // Trả về dữ liệu tĩnh khi có lỗi
    return staticProducts
  }
}