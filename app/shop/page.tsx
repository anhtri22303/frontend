"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchProducts, fetchProductsByFilters } from "@/app/api/productApi";
import { addToCart } from "@/app/api/cartApi";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

interface Product {
  productID: string;
  productName: string;
  category?: string;
  price: number;
  description: string;
  rating: number;
  image_url: string;
  skinTypes: string[]; // Kept as string[] to match the desired format
  isNew?: boolean;
  discountedPrice?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const searchParams = useSearchParams();

  const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Mask", "Sunscreen"];
  const skinTypes = ["Dry", "Oily", "Combination", "Normal", "Sensitive"];

  useEffect(() => {
    loadProducts();
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
      const maxProductPrice = Math.max(...data.map((product: Product) => product.price), 1000);
      setMaxPrice(maxProductPrice);
      setPriceRange([0, maxProductPrice]);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMaxPrice(1000);
      setPriceRange([0, 1000]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const filters = {
        categories: selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
        skinTypes: selectedSkinTypes.length > 0 ? selectedSkinTypes.join(",") : undefined, // Join array into comma-separated string for API
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      };

      const data = await fetchProductsByFilters(filters);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedSkinTypes, priceRange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSkinTypeChange = (skinType: string) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(skinType) ? prev.filter((s) => s !== skinType) : [...prev, skinType]
    );
  };

  const handlePriceChange = (newPriceRange: number[]) => {
    setPriceRange(newPriceRange as [number, number]);
  };

  const handleQuantityChange = (productId: string, value: string) => {
    const newQuantity = parseInt(value) || 1;
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, newQuantity),
    }));
  };

  const handleAddToCart = async (productId: string) => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        toast.error("Please log in to add items to your cart!");
        return;
      }

      const quantity = quantities[productId] || 1;
      await addToCart(userId, productId, quantity);
      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 mx-auto max-w-screen-xl">
      <div className="flex gap-6 justify-center">
        {/* Sidebar */}
        <div className="w-1/4">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  disabled={isLoading}
                />
                {category}
              </label>
            ))}
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-4">Skin Type</h3>
          <div className="flex flex-col gap-2">
            {skinTypes.map((skinType) => (
              <label key={skinType} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSkinTypes.includes(skinType)}
                  onChange={() => handleSkinTypeChange(skinType)}
                  disabled={isLoading}
                />
                {skinType}
              </label>
            ))}
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-4">Price Range</h3>
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            min={0}
            max={maxPrice}
            step={10}
            disabled={isLoading}
          />
          <div className="flex justify-between text-sm mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-3/4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Card key={product.productID} className="overflow-hidden group">
                    <Link href={`/shop/product/${product.productID}`}>
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
                      <CardContent className="pt-4">
                        <h3 className="font-medium truncate w-full">{product.productName}</h3>
                        <div className="mt-2">
                          {product.discountedPrice && product.discountedPrice < product.price ? (
                            <>
                              <span className="text-green-600">${product.discountedPrice.toFixed(2)}</span>
                              <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="font-semibold">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="mt-2 text-sm">
                          <p className="text-muted-foreground">{product.category || "N/A"}</p>
                        </div>
                        <div className="mt-2 text-sm">
                          <p className="block">Skin Type:</p>
                          <p className="text-muted-foreground">
                            {product.skinTypes && product.skinTypes.length > 0
                              ? [...new Set(product.skinTypes)].join("/") // Join with "/" to match the image format
                              : "All"}
                          </p>
                        </div>
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
                    </Link>
                    <CardFooter className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 w-full">
                        <label htmlFor={`quantity-${product.productID}`} className="text-sm">
                          Qty:
                        </label>
                        <input
                          id={`quantity-${product.productID}`}
                          type="number"
                          min="1"
                          value={quantities[product.productID] || 1}
                          onChange={(e) => handleQuantityChange(product.productID, e.target.value)}
                          className="w-16 border rounded px-2 py-1"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleAddToCart(product.productID)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Adding..." : "Add to Cart"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center col-span-full py-12">
                  <h3 className="text-2xl font-bold text-gray-700">No Products Found</h3>
                  <p className="text-md text-gray-500 mt-2">
                    Try adjusting your filters to find more products.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}