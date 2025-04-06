"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
    skinType: "",
    rating: 0,
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // List of skin types and categories for selection
  const skinTypes = ["Dry", "Oily", "Combination", "Sensitive", "Normal"];
  const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen", "Mask"];

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        // Fetch product data
        const productData = await fetchProductById(params.productID);
        
        console.log("Fetched product data:", productData);
        
        // Check if data is available
        if (!productData) {
          toast({
            title: "Error",
            description: "Product not found or could not be loaded.",
            variant: "destructive",
          });
          router.push("/manager/products");
          return;
        }
        
        // Set product data to state
        setProduct({
          productID: productData.productID || "",
          productName: productData.productName || "",
          description: productData.description || "",
          price: productData.price || 0,
          category: productData.category || "",
          skinType: productData.skinType || "",
          rating: productData.rating || 0,
          image_url: productData.image_url || "",
        });
        
        // Set preview image
        if (productData.image_url) {
          setPreviewImage(productData.image_url);
        }
        
      } catch (error) {
        console.error("Error loading product:", error);
        toast({
          title: "Error",
          description: "Failed to load product data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.productID, router, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreviewImage(fileURL);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Create FormData for the request
      const formData = new FormData();
      
      // Add product data as a JSON string
      const productData = {
        productID: product.productID,
        productName: product.productName,
        description: product.description,
        price: product.price,
        category: product.category,
        skinType: product.skinType,
        rating: product.rating,
      };
      
      formData.append("product", JSON.stringify(productData));
      
      // Add image if a new one is selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await updateProduct(product.productID, formData);
      
      toast({
        title: "Success",
        description: "Product has been updated successfully",
      });
      
      router.push("/manager/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Product ID</label>
            <Input
              value={product.productID}
              disabled
              className="bg-gray-50"
            />
          </div>
          
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
            <Textarea
              required
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              placeholder="Enter product description"
              disabled={isSubmitting}
              className="min-h-[100px]"
            />
          </div>

            <div>
            <label className="text-sm font-medium mb-1 block">Price ($)</label>
            <Input
              type="number"
              required
              value={product.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, price: parseFloat(e.target.value) })
              }
              placeholder="Enter product price"
              step="0.01"
              min="0"
              disabled={isSubmitting}
            />
            </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <Select 
              value={product.category} 
              onValueChange={(value) => setProduct({ ...product, category: value })}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Skin Type</label>
            <Select 
              value={product.skinType} 
              onValueChange={(value) => setProduct({ ...product, skinType: value })}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a skin type" />
              </SelectTrigger>
              <SelectContent>
                {skinTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

            <div>
            <label className="text-sm font-medium mb-1 block">Rating (0-5)</label>
            <Input
              type="number"
              required
              value={product.rating}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProduct({ ...product, rating: parseFloat(e.target.value) })
              }
              placeholder="Enter product rating"
              step="0.1"
              min="0"
              max="5"
              disabled={isSubmitting}
            />
            </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Product Image</label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="flex-1"
              />
            </div>
            {previewImage && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Image Preview:</p>
                <img
                  src={previewImage}
                  alt="Product preview"
                  className="h-48 object-contain rounded-md border"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
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
    </div>
  );
}