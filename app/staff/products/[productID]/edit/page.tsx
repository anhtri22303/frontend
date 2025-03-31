"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchProductById, updateProduct } from "@/app/api/productApi";

interface EditProductPageProps {
  params: {
    productID: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState({
    productID: "",
    productName: "",
    description: "",
    price: 0,
    category: "",
    rating: 0,
    image_url: null as File | null, // Thay đổi kiểu dữ liệu thành File | null
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null); // URL tạm thời để xem trước ảnh

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetchProductById(params.productID); // Lấy dữ liệu sản phẩm từ API
        setProduct({
          ...response.data,
          image_url: null, // Đặt giá trị ban đầu của image_url là null
        });
        setPreviewImage(response.data.image_url); // Hiển thị ảnh hiện tại
      } catch (error) {
        console.error("Error loading product:", error);
        toast({
          title: "Error",
          description: "Failed to load product data. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.productID, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProduct({ ...product, image_url: file }); // Gán file vào state
    if (file) {
      const fileURL = URL.createObjectURL(file); // Tạo URL tạm thời để xem trước ảnh
      setPreviewImage(fileURL);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Tạo FormData để gửi dữ liệu
      const formData = new FormData();
      formData.append("productID", product.productID);
      formData.append("productName", product.productName);
      formData.append("description", product.description);
      formData.append("price", product.price.toString());
      formData.append("category", product.category);
      formData.append("rating", product.rating.toString());
      if (product.image_url) {
        formData.append("image_url", product.image_url); // Gửi file trực tiếp
      }

      await updateProduct(product.productID, formData); // Gửi FormData đến API
      toast({
        title: "Success",
        description: "Product has been updated successfully",
        duration: 3000,
      });
      router.push("/manager/products"); // Điều hướng về trang danh sách sản phẩm
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-8">
        <div className="text-center">Loading product data...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-1 block">Product Name</label>
          <Input
            required
            value={product.productName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, productName: e.target.value })
            }
            placeholder="Enter product name"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <Input
            required
            value={product.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, description: e.target.value })
            }
            placeholder="Enter product description"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Price</label>
          <Input
            type="number"
            required
            value={product.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, price: parseFloat(e.target.value) })
            }
            placeholder="Enter product price"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Input
            required
            value={product.category}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, category: e.target.value })
            }
            placeholder="Enter product category"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Rating</label>
          <Input
            type="number"
            required
            value={product.rating}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, rating: parseFloat(e.target.value) })
            }
            placeholder="Enter product rating"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-4 h-32 w-32 object-cover rounded-md"
            />
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}