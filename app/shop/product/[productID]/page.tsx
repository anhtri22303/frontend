"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchProductById, fetchProducts } from "@/app/api/productApi";
import { fetchFeedbacks, Feedback } from "@/app/api/feedbackApi";
import { addToCart } from "@/app/api/cartApi";
import { toast } from "react-hot-toast";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter(); // Sử dụng useRouter để điều hướng
  console.log("Params:", params); // Kiểm tra giá trị params
  const productID = params?.productID; // Sử dụng params.productID thay vì params.id
  console.log("Product ID:", productID);

  const [product, setProduct] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quantity, setQuantity] = useState(1)
  const productsPerPage = 4;

  useEffect(() => {
    if (productID) {
      loadProduct();
      loadRelatedProducts();
    }
  }, [productID]);

  const loadProduct = async () => {
    try {
      if (!productID) {
        console.error("Product ID is undefined");
        return;
      }
      if (typeof productID === "string") {
        const response = await fetchProductById(productID); // Truyền productID vào API
        setProduct(response.data);
      } else {
        console.error("Invalid productID:", productID);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const data = await fetchProducts();
      setRelatedProducts(data);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const loadFeedbacks = async () => {
    try {
      const data = await fetchFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const userID = localStorage.getItem("userID"); // Lấy userID từ localStorage
      if (!userID) {
        toast.error("User not logged in!");
        return;
      }

      await addToCart(userID, productID, quantity); // Gọi API với userID và productID
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tính toán các sản phẩm hiển thị dựa trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = relatedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Hàm chuyển sang trang trước
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Hàm chuyển sang trang tiếp theo
  const handleNextPage = () => {
    if (indexOfLastProduct < relatedProducts.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8">
      {/* Nút Back */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden border">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.productName}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between h-full space-y-2">
          <div>
            <h1 className="text-3xl font-bold">{product.productName}</h1>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-primary fill-primary"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Hiển thị Category */}
          <div>
            <h3 className="text-xl font-bold text-black">Category</h3>
            <p className="text-sm mt-1">{product.category}</p>
          </div>

          {/* Hiển thị Skin Type */}
          <div>
            <h3 className="text-xl font-bold text-black">Skin Type</h3>
            <div className="flex gap-2 mt-1">
              {product.skinType
                ?.split(",")
                .map((type: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm border rounded-md text-muted-foreground"
                  >
                    {type.trim()}
                  </span>
                ))}
            </div>
          </div>

          <div className="text-2xl font-bold">${product.price}</div>

          <p className="text-muted-foreground text-sm">{product.description}</p>
          
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>


          <div className="flex items-center gap-2 mt-auto">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <Tabs defaultValue="details" className="mb-16">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews" onClick={loadFeedbacks}>
            Reviews ({feedbacks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Features</h3>
            <ul className="space-y-2">
              {product.features?.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-6">
          <div className="space-y-8">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            <div className="space-y-6">
              {feedbacks.map((feedback) => (
                <div key={feedback.feedbackID} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={feedback.customerID}
                      />
                      <AvatarFallback>
                        {feedback.customerID.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{feedback.customerID}</div>
                      <div className="text-sm text-muted-foreground">
                        {feedback.feedbackDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < feedback.rating
                            ? "text-primary fill-primary"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{feedback.comment}</p>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">You May Also Like</h2>
        <div className="flex items-center justify-between">
          {/* Nút Previous */}
          <button
            className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Danh sách sản phẩm */}
          <div className="grid grid-cols-4 gap-6">
            {currentProducts.map((relatedProduct) => (
              <Card key={relatedProduct.productID} className="overflow-hidden">
                <Link
                  href={`/shop/product/${relatedProduct.productID}`}
                  className="block"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={relatedProduct.image_url || "/placeholder.svg"}
                      alt={relatedProduct.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link
                    href={`/shop/product/${relatedProduct.productID}`}
                    className="hover:underline"
                  >
                    <h3 className="font-medium">
                      {relatedProduct.productName}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {relatedProduct.category}
                  </p>
                  {/* Hiển thị Skin Type */}
                  <p className="text-sm text-muted-foreground mt-1">
                    Skin Type: {relatedProduct.skinType || "N/A"}
                  </p>
                  <p className="font-semibold mt-2">${relatedProduct.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Nút Next */}
          <button
            className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
            onClick={handleNextPage}
            disabled={indexOfLastProduct >= relatedProducts.length}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
