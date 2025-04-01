"use client";

import { useState } from "react";
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

export default function CreateProductPage() {
  const [newProduct, setNewProduct] = useState({
    productName: "",
    description: "",
    price: 0,
    category: "Cleanser",
    skinType: "Dry",
    rating: 0,
    imageFile: null as File | null,
    imagePreview: "",
  });

  const router = useRouter();

  const handleCreateProduct = async () => {
    try {
      await createProduct(newProduct);
      router.push("/manager/products");
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
          <label className="text-sm font-medium mb-1 block">Skin Type</label>
          <Select
            value={newProduct.skinType}
            onValueChange={(value) =>
              setNewProduct({ ...newProduct, skinType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select skin type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dry">Dry</SelectItem>
              <SelectItem value="Oily">Oily</SelectItem>
              <SelectItem value="Combination">Combination</SelectItem>
              <SelectItem value="Sensitive">Sensitive</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
            </SelectContent>
          </Select>
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
        <Button variant="outline" onClick={() => router.push("/manager/products")}>
          Cancel
        </Button>
        <Button onClick={handleCreateProduct}>Create Product</Button>
      </div>
    </div>
  );
}