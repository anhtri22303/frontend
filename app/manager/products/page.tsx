"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchProducts, deleteProduct, fetchProductsByCategory, fetchProductsByName, fetchProductsBySkinType, fetchProductById } from "@/app/api/productApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Product {
  productID: string;
  productName: string;
  category: string;
  price: number;
  discountedPrice?: number;
  rating: number;
  image_url: string;
  skinTypes: string | string[]; // Cập nhật kiểu dữ liệu để hỗ trợ cả chuỗi và mảng
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchSkinType, setSearchSkinType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen", "Mask"];
  const skinTypes = ["Dry", "Oily", "Combination", "Sensitive", "Normal"];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsResponse = await fetchProducts();
      console.log("Products Response:", productsResponse);
      setProducts(productsResponse);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Cải thiện hàm parseSkinTypes để xử lý cả chuỗi và mảng
  const parseSkinTypes = (skinTypes: string | string[]): string[] => {
    // Nếu skinTypes là mảng, trả về ngay mảng đó
    if (Array.isArray(skinTypes)) {
      return skinTypes;
    }

    // Nếu skinTypes không tồn tại hoặc là chuỗi rỗng, trả về mảng rỗng
    if (!skinTypes) return [];

    try {
      // Xử lý chuỗi JSON như "[\"Dry\",\"Oily\"]"
      if (typeof skinTypes === "string" && skinTypes.startsWith('[')) {
        return JSON.parse(skinTypes);
      }
      // Xử lý chuỗi phân tách bằng dấu phẩy như "Dry,Oily,Combination"
      if (typeof skinTypes === "string" && skinTypes.includes(',')) {
        return skinTypes.split(',').map(type => type.trim());
      }
      // Xử lý chuỗi dính liền như "OilySensitiveCombination"
      if (typeof skinTypes === "string") {
        const result: string[] = [];
        let currentWord = '';

        for (let i = 0; i < skinTypes.length; i++) {
          const char = skinTypes[i];
          // Nếu gặp chữ cái in hoa và đã có từ trước đó, thêm từ hiện tại vào kết quả
          if (/[A-Z]/.test(char) && currentWord) {
            result.push(currentWord);
            currentWord = char;
          } else {
            currentWord += char;
          }
        }
        // Thêm từ cuối cùng vào kết quả
        if (currentWord) {
          result.push(currentWord);
        }

        // Nếu không tách được, trả về chuỗi gốc như một giá trị đơn
        return result.length > 0 ? result : [skinTypes.trim()];
      }

      // Fallback: trả về chuỗi gốc như một giá trị đơn
      return [skinTypes.toString()];
    } catch (error) {
      console.error("Error parsing skinTypes:", error);
      // Fallback: Coi như một giá trị đơn
      return [skinTypes.toString()];
    }
  };

  const handleSearchByName = async () => {
    if (!searchName.trim()) {
      loadProducts();
      return;
    }
    try {
      setLoading(true);
      const response = await fetchProductsByName(searchName);
      if (response.success) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setError("Failed to search products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    if (category === "all") {
      loadProducts();
      return;
    }
    try {
      setLoading(true);
      const response = await fetchProductsByCategory(category);
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error filtering products by category:", error);
      setError("Failed to filter products by category.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const skinTypeColors: { [key: string]: string } = {
    Dry: "bg-blue-100 text-blue-800 border-blue-200",
    Oily: "bg-green-100 text-green-800 border-green-200",
    Combination: "bg-purple-100 text-purple-800 border-purple-200",
    Sensitive: "bg-pink-100 text-pink-800 border-pink-200",
    Normal: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await deleteProduct(productId);
        await loadProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      loadProducts();
      return;
    }
    try {
      setLoading(true);
      const product = await fetchProductById(searchId);
      setProducts(product ? [product] : []);
    } catch (error) {
      console.error("Error searching product by ID:", error);
      setError("Failed to search product by ID.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchBySkinType = async () => {
    if (!searchSkinType.trim()) {
      loadProducts();
      return;
    }
    try {
      setLoading(true);
      const response = await fetchProductsBySkinType(searchSkinType);
      setProducts(response);
    } catch (error) {
      console.error("Error searching products by skin type:", error);
      setError("Failed to search products by skin type.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchId("");
    setSearchSkinType("");
    setSelectedCategory("");
    loadProducts();
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-8">
        <p className="text-red-600">{error}</p>
        <Button onClick={loadProducts} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => router.push("/manager/products/create")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter Product ID"
              value={searchId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSearchById()}
            />
            <Button onClick={handleSearchById}>Search</Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Select value={searchSkinType} onValueChange={setSearchSkinType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Skin Type" />
              </SelectTrigger>
              <SelectContent>
                {skinTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearchBySkinType}>Search</Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="col-span-3 flex justify-end">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          {Array.isArray(products) && products.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Product ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Skin Types</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const skinTypesArray = parseSkinTypes(product.skinTypes);
                  return (
                    <tr key={product.productID} className="border-b">
                      <td className="px-4 py-3 text-sm">{product.productID}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.image_url || "/placeholder.png"}
                            width={48}
                            height={48}
                            className="rounded-md object-cover"
                            alt={`${product.productName}`}
                          />
                          <div className="font-medium">{product.productName}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{product.category}</td>
                      <td className="px-4 py-3 text-sm">
                        {product.discountedPrice && product.discountedPrice < product.price ? (
                          <>
                            <span className="text-green-600">${product.discountedPrice.toFixed(2)}</span>
                            <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          `$${product.price.toFixed(2)}`
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">{product.rating || "N/A"}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {skinTypesArray.length > 0 ? (
                            skinTypesArray.map((type) => (
                              <Badge
                                key={type}
                                className={`${
                                  skinTypeColors[type] || "bg-gray-100 text-gray-800 border-gray-200"
                                } px-2 py-1 text-xs font-medium rounded-full border shadow-sm`}
                              >
                                {type}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-xs">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/manager/products/${product.productID}/edit`)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProduct(product.productID)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Products Found</h3>
              <p className="text-sm text-gray-500">
                {searchName || selectedCategory || searchId || searchSkinType
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "There are no products available at the moment."}
              </p>
            </div>
          )}
        </div>
        {products.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{products.length}</span> of{" "}
              <span className="font-medium">{products.length}</span> products
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}