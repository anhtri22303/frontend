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
import { fetchFeedbacks } from "@/app/api/feedbackApi";
import { addToCart } from "@/app/api/cartApi";
import { toast } from "react-hot-toast";

// Define Product interface
interface Product {
  productID: string;
  productName: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  skinType: string;
  rating: number;
  reviewCount: number;
  image_url: string;
  features?: string[];
}

interface Feedback {
  feedbackID: string;
  customerID: string;
  feedbackDate: string;
  rating: number;
  comment: string;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productID = params?.productID as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const productsPerPage = 4;

  useEffect(() => {
    if (productID) {
      loadProduct();
      loadRelatedProducts();
    }
  }, [productID]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const productData = await fetchProductById(productID);
      setProduct(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const data = await fetchProducts();
      setRelatedProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching related products:", error);
      setRelatedProducts([]);
    }
  };

  const loadFeedbacks = async () => {
    try {
      const data = await fetchFeedbacks();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setFeedbacks([]);
    }
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    try {
      const userID = localStorage.getItem("userID");
      if (!userID) {
        toast.error("Please log in to add items to cart!");
        return;
      }

      await addToCart(userID, productID, quantity);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart.");
    } finally {
      setCartLoading(false);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = relatedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (indexOfLastProduct < relatedProducts.length) setCurrentPage(currentPage + 1);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  if (isLoading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (!product) {
    return <div className="container py-8">Product not found</div>;
  }

  return (
    <div className="container py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
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

          <div>
            <h3 className="text-xl font-bold text-black">Category</h3>
            <p className="text-sm mt-1">{product.category}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-black">Skin Type</h3>
            <div className="flex gap-2 mt-1">
              {product.skinType.split(",").map((type, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-sm border rounded-md text-muted-foreground"
                >
                  {type.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="text-2xl font-bold">
            {product.discountedPrice ? (
              <div className="flex items-center gap-2">
                <p className="text-red-500">${product.discountedPrice.toFixed(2)}</p>
                <p className="text-gray-500 line-through">${product.price.toFixed(2)}</p>
              </div>
            ) : (
              <p>${product.price.toFixed(2)}</p>
            )}
          </div>

          <p className="text-muted-foreground text-sm">{product.description}</p>

          <div className="flex items-center border rounded-md w-fit">
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
              disabled={cartLoading}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {cartLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>

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
              {product.features?.map((feature, index) => (
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <Button
                onClick={() => router.push(`/shop/product/${productID}/create`)}
                variant="outline"
              >
                Create Feedback
              </Button>
            </div>
            <div className="space-y-6">
              {feedbacks.map((feedback) => (
                <div key={feedback.feedbackID} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt={feedback.customerID} />
                      <AvatarFallback>{feedback.customerID.charAt(0)}</AvatarFallback>
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

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">You May Also Like</h2>
        <div className="flex items-center justify-between">
          <button
            className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-4 gap-6">
            {currentProducts.map((relatedProduct) => (
              <Card key={relatedProduct.productID} className="overflow-hidden">
                <Link href={`/shop/product/${relatedProduct.productID}`} className="block">
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
                    <h3 className="font-medium">{relatedProduct.productName}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{relatedProduct.category}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Skin Type: {relatedProduct.skinType || "N/A"}
                  </p>
                  <p className="font-semibold mt-2">${relatedProduct.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>

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