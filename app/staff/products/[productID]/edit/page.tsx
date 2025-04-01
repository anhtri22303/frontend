"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProductById, updateProduct } from "@/app/api/productApi";

interface EditProductPageProps {
  params: {
    productID: string;
  };
}

interface Product {
  productID: string;
  productName: string;
  description: string;
  price: number;
  category: string;
  skinTypes: string[]; // Thay skinType bằng skinTypes
  rating: number;
  imageFile: File | null;
  imagePreview: string;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSkinTypeSelect, setShowSkinTypeSelect] = useState(false); // Điều khiển hiển thị Select
  const [product, setProduct] = useState<Product>({
    productID: "",
    productName: "",
    description: "",
    price: 0,
    category: "",
    skinTypes: [],
    rating: 0,
    imageFile: null,
    imagePreview: "",
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetchProductById(params.productID);
        if (response) {
          setProduct({
            productID: response.productID || "",
            productName: response.productName || "",
            description: response.description || "",
            price: response.price || 0,
            category: response.category || "",
            skinTypes: response.skinTypes || (response.skinType ? [response.skinType] : []), // Hỗ trợ cả trường hợp backend trả skinType hoặc skinTypes
            rating: response.rating || 0,
            imageFile: null,
            imagePreview: response.image_url || "",
          });
        } else {
          throw new Error("Product not found");
        }
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
    setProduct((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: file ? URL.createObjectURL(file) : prev.imagePreview,
    }));
  };

  // Thêm skin type mới
  const handleAddSkinType = (value: string) => {
    if (!product.skinTypes.includes(value)) {
      setProduct({
        ...product,
        skinTypes: [...product.skinTypes, value],
      });
    }
    setShowSkinTypeSelect(false); // Ẩn Select sau khi chọn
  };

  // Xóa skin type
  const handleRemoveSkinType = (skinType: string) => {
    setProduct({
      ...product,
      skinTypes: product.skinTypes.filter((type) => type !== skinType),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const productData = {
        productName: product.productName,
        description: product.description,
        price: product.price,
        category: product.category,
        skinTypes: product.skinTypes, // Gửi mảng skinTypes
        rating: product.rating,
      };

      const formData = new FormData();
      formData.append("product", JSON.stringify(productData));
      if (product.imageFile) {
        formData.append("image", product.imageFile);
      }

      await updateProduct(product.productID, formData);
      toast({
        title: "Success",
        description: "Product has been updated successfully",
        duration: 3000,
      });
      router.push("/staff/products");
    } catch (error: any) {
      console.error("Error updating product:", error);
      if (error.response?.status === 403) {
        toast({
          title: "Access Denied",
          description: "You do not have permission to update this product.",
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update product. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
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
              setProduct({ ...product, price: parseFloat(e.target.value) || 0 })
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
          <label className="text-sm font-medium mb-1 block">Skin Types</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {product.skinTypes.map((type) => (
              <div
                key={type}
                className="flex items-center bg-gray-100 px-2 py-1 rounded-md"
              >
                <span>{type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 p-0 h-4 w-4"
                  onClick={() => handleRemoveSkinType(type)}
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          {showSkinTypeSelect ? (
            <Select onValueChange={handleAddSkinType} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select skin type" />
              </SelectTrigger>
              <SelectContent>
                {["Dry", "Oily", "Combination", "Sensitive", "Normal"]
                  .filter((type) => !product.skinTypes.includes(type)) // Lọc các loại đã chọn
                  .map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSkinTypeSelect(true)}
              disabled={isSubmitting || product.skinTypes.length >= 5} // Vô hiệu hóa nếu đã chọn đủ 5
            >
              <Plus className="h-4 w-4 mr-1" /> Add Skin Type
            </Button>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Rating</label>
          <Input
            type="number"
            required
            value={product.rating}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, rating: parseFloat(e.target.value) || 0 })
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
          {product.imagePreview && (
            <img
              src={product.imagePreview}
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