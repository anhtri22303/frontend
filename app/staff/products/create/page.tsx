"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct } from "@/app/api/productApi";
import Image from "next/image";
import { Plus, X } from "lucide-react"; // Thêm icon X để xóa

export default function CreateProductPage() {
  const [newProduct, setNewProduct] = useState({
    productName: "",
    description: "",
    price: 0,
    category: "Cleanser",
    skinTypes: ["Dry"] as string[], // Thay skinType bằng skinTypes là mảng
    rating: 0,
    imageFile: null as File | null,
    imagePreview: "",
  });

  const [showSkinTypeSelect, setShowSkinTypeSelect] = useState(false); // Điều khiển hiển thị Select
  const router = useRouter();

  const handleCreateProduct = async () => {
    try {
      // Chuẩn bị dữ liệu gửi lên, đảm bảo skinTypes là mảng
      const productData = {
        ...newProduct,
        skinTypes: newProduct.skinTypes, // Gửi mảng skinTypes
      };
      await createProduct(productData);
      router.push("/staff/products");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct({
        ...newProduct,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  // Thêm skin type mới
  const handleAddSkinType = (value: string) => {
    if (!newProduct.skinTypes.includes(value)) {
      setNewProduct({
        ...newProduct,
        skinTypes: [...newProduct.skinTypes, value],
      });
    }
    setShowSkinTypeSelect(false); // Ẩn Select sau khi chọn
  };

  // Xóa skin type
  const handleRemoveSkinType = (skinType: string) => {
    setNewProduct({
      ...newProduct,
      skinTypes: newProduct.skinTypes.filter((type) => type !== skinType),
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="text-sm font-medium mb-1 block">Product Name</label>
          <Input
            placeholder="Enter product name"
            value={newProduct.productName}
            onChange={(e) =>
              setNewProduct({ ...newProduct, productName: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <Textarea
            placeholder="Enter product description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Price (USD)</label>
          <Input
            type="number"
            placeholder="Enter price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select
            value={newProduct.category}
            onValueChange={(value) =>
              setNewProduct({ ...newProduct, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cleanser">Cleanser</SelectItem>
              <SelectItem value="Toner">Toner</SelectItem>
              <SelectItem value="Serum">Serum</SelectItem>
              <SelectItem value="Moisturizer">Moisturizer</SelectItem>
              <SelectItem value="Sunscreen">Sunscreen</SelectItem>
              <SelectItem value="Mask">Mask</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Skin Types</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {newProduct.skinTypes.map((type) => (
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
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          {showSkinTypeSelect ? (
            <Select
              onValueChange={handleAddSkinType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select skin type" />
              </SelectTrigger>
              <SelectContent>
                {["Dry", "Oily", "Combination", "Sensitive", "Normal"]
                  .filter((type) => !newProduct.skinTypes.includes(type)) // Lọc các loại đã chọn
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
              disabled={newProduct.skinTypes.length >= 5} // Vô hiệu hóa nếu đã chọn đủ 5
            >
              <Plus className="h-4 w-4 mr-1" /> Add Skin Type
            </Button>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Rating</label>
          <Input
            type="number"
            placeholder="Enter rating"
            value={newProduct.rating}
            onChange={(e) =>
              setNewProduct({ ...newProduct, rating: Number(e.target.value) })
            }
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        {/* --- Image Upload --- */}
        <div>
          <label className="text-sm font-medium mb-1 block">Product Image</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="cursor-pointer px-4 py-2 bg-gray-200 rounded-md text-sm"
            >
              Choose File
            </label>
            {newProduct.imagePreview && (
              <Image
                src={newProduct.imagePreview}
                width={80}
                height={80}
                alt="Preview"
                className="rounded-md object-cover border"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="outline" onClick={() => router.push("/staff/products")}>
          Cancel
        </Button>
        <Button onClick={handleCreateProduct}>Create Product</Button>
      </div>
    </div>
  );
}