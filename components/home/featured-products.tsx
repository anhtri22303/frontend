'use client';


import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchProducts } from "@/app/api/productApi";


interface Product {
  productID: string;
  productName: string;
  price: number;
  image_url: string;
  category?: string;
  rating: number;
  skinType: string;
  isNew?: boolean;
}


export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4; // Số sản phẩm hiển thị trên mỗi trang


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts();
        console.log("Products data:", response.data);
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, []);


  // Tính toán các sản phẩm hiển thị dựa trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Array.isArray(products)
    ? products.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];


  // Hàm chuyển sang trang trước
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  // Hàm chuyển sang trang tiếp theo
  const handleNextPage = () => {
    if (indexOfLastProduct < products.length) {
      setCurrentPage(currentPage + 1);
    }
  };


  if (loading) {
    return (
      <section className="container py-8">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4">Featured Products</h2>
        <p className="text-center">Loading products...</p>
      </section>
    );
  }


  return (
    <section className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
          <p className="text-muted-foreground mt-2">Our most popular skincare solutions loved by customers</p>
        </div>
        <Link href="/shop" className="mt-4 md:mt-0 text-primary hover:underline">
          View All Products
        </Link>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <Card key={product.productID} className="overflow-hidden group">
            <Link href={`/shop/product/${product.productID}`} className="block">
              <div className="relative aspect-square">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.productName}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {product.isNew && (
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    New
                  </Badge>
                )}
              </div>
            </Link>
            <CardContent className="pt-4">
                  {/* Tên sản phẩm */}
                  <h3 className="font-medium truncate w-full">{product.productName}</h3>


                  {/* Giá sản phẩm */}
                  <p className="font-semibold mt-2">${product.price.toFixed(2)}</p>


                  {/* Category */}
                  <div className="mt-2 text-sm">
                    <p className="text-muted-foreground">{product.category || "N/A"}</p>
                  </div>


                  {/* Skin Type */}
                  <div className="mt-2 text-sm">
                    <p className="block">Skin Type:</p>
                    <p className="text-muted-foreground">{product.skinType || "All"}</p>
                  </div>


                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    <span>Rating: {product.rating}/5</span>
                    <div className="ml-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </CardContent>
          </Card>
        ))}
      </div>


      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {Math.ceil(products.length / productsPerPage)}
        </span>
        <button
          className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
          onClick={handleNextPage}
          disabled={indexOfLastProduct >= products.length}
        >
          Next
        </button>
      </div>
    </section>
  );
}
