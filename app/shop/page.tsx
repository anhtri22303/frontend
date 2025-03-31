"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchProducts, fetchProductsByFilters } from "@/app/api/productApi";

interface Product {
  productID: string;
  productName: string;
  category?: string;
  price: number;
  description: string;
  rating: number;
  image_url: string;
  skinType: string;
  isNew?: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); // Giá trị mặc định
  const [maxPrice, setMaxPrice] = useState(1000); // Giá trị mặc định

  const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Mask", "Sunscreen"];
  const skinTypes = ["Dry", "Oily", "Combination", "Normal", "Sensitive"];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
      // Kiểm tra nếu danh sách sản phẩm rỗng
      if (data && data.length > 0) {
        const maxProductPrice: number = Math.max(...data.map((product: Product) => product.price));
        setMaxPrice(maxProductPrice);
        setPriceRange([0, maxProductPrice]);
      } else {
        // Nếu không có sản phẩm, đặt giá trị mặc định
        setMaxPrice(1000);
        setPriceRange([0, 1000]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setMaxPrice(1000); // Giá trị mặc định nếu có lỗi
      setPriceRange([0, 1000]);
    }
  };

  const applyFilters = async () => {
    try {
      const filters = {
        categories: selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
        skinTypes: selectedSkinTypes.length > 0 ? selectedSkinTypes.join(",") : undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1] === Infinity ? undefined : priceRange[1], // Không gửi maxPrice nếu là Infinity
      };

      const data = await fetchProductsByFilters(filters);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredProducts([]);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedSkinTypes, priceRange]);

  const handleCategoryChange = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
  };

  const handleSkinTypeChange = (skinType: string) => {
    const updatedSkinTypes = selectedSkinTypes.includes(skinType)
      ? selectedSkinTypes.filter((s) => s !== skinType)
      : [...selectedSkinTypes, skinType];
    setSelectedSkinTypes(updatedSkinTypes);
  };

  const handlePriceChange = (newPriceRange: [number, number]) => {
    setPriceRange(newPriceRange);
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
        step={1}
      />
      <div className="flex justify-between text-sm mt-2">
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}</span>
      </div>
    </div>

    {/* Products Grid */}
    <div className="w-3/4">
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
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{product.productName}</h3>
                      <p className="text-sm text-muted-foreground">ID: {product.productID}</p>
                    </div>
                    <p className="font-semibold">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>Category: {product.category || "N/A"}</p>
                    <p>For {product.skinType ? product.skinType : "All"} skin</p>
                    <div className="flex items-center mt-1">
                      <span>Rating: {product.rating}/5</span>
                      <div className="ml-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center col-span-full py-12">
            <h3 className="text-2xl font-bold text-gray-700">No Products Found</h3>
            <p className="text-md text-gray-500 mt-2">Try adjusting your filters to find more products.</p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );
}