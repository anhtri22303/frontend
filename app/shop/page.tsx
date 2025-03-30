"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchProductsBySkinType,
} from "@/app/api/productApi";

interface Product {
  productID: string;
  productName: string;
  category: string;
  price: number;
  description: string;
  rating: number;
  image_url: string;
  skinType: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [maxPrice, setMaxPrice] = useState(50);

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
      const maxProductPrice: number = Math.max(...data.map((product: Product) => product.price));
      setMaxPrice(maxProductPrice);
      setPriceRange([0, maxProductPrice]);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCategoryChange = async (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);

    try {
      const response = await fetchProductsByCategory(updatedCategories.join(","));
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error filtering by category:", error);
    }
  };

  const handleSkinTypeChange = async (skinType: string) => {
    const updatedSkinTypes = selectedSkinTypes.includes(skinType)
      ? selectedSkinTypes.filter((s) => s !== skinType)
      : [...selectedSkinTypes, skinType];
    setSelectedSkinTypes(updatedSkinTypes);

    try {
      const response = await fetchProductsBySkinType(updatedSkinTypes.join(","));
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error filtering by skin type:", error);
    }
  };

  const handlePriceChange = (newPriceRange: [number, number]) => {
    setPriceRange(newPriceRange);
    const filteredByPrice = products.filter(
      (product) => product.price >= newPriceRange[0] && product.price <= newPriceRange[1]
    );
    setFilteredProducts(filteredByPrice);
  };

  return (
    <div className="flex gap-6">
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
              <Link
                key={product.productID}
                href={`/shop/product/${product.productID}`}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    width={150}
                    height={150}
                    className="rounded-md object-cover w-full h-40"
                    alt={`${product.productName} thumbnail`}
                  />
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">{product.productName}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-md font-semibold mt-2">${product.price}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center col-span-full py-12">
              <h3 className="text-lg font-semibold">No Products Found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
