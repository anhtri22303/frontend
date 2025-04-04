"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Search, MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchProducts, deleteProduct, fetchProductsByCategory, fetchProductsByName } from "@/app/api/productApi";
import { fetchPromotions } from "@/app/api/promotionApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  productID: string;
  productName: string;
  category: string;
  price: number;
  rating: number;
  image_url: string;
  skinType: string;
  promotion?: Promotion;
  discountedPrice?: number;
}

interface Promotion {
  productID: string;
  discount: number;
  startDate: string;
  endDate: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const router = useRouter();
  const { toast } = useToast();

  const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen", "Mask"];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const productsResponse = await fetchProducts();
      if (!Array.isArray(productsResponse)) {
        throw new Error("Invalid products data");
      }
      console.log("Fetched Products:", productsResponse);

      let promotions: Promotion[] = [];
      try {
        promotions = await fetchPromotions();
      } catch (promoError) {
        console.error("Failed to fetch promotions:", promoError);
        promotions = [];
      }

      const productsWithPromotions: Product[] = productsResponse.map((product: Product): Product => {
        const currentDate = new Date().toISOString().split("T")[0];
        const promotion: Promotion | undefined = promotions.find((promo: Promotion) => {
          return (
            promo.productID === product.productID &&
            promo.startDate <= currentDate &&
            promo.endDate >= currentDate
          );
        });
        const discountedPrice: number | undefined = promotion
          ? parseFloat((product.price * (1 - promotion.discount / 100)).toFixed(2))
          : undefined;
        return { ...product, promotion, discountedPrice };
      });

      console.log("Products with Promotions:", productsWithPromotions);
      setProducts(productsWithPromotions);
    } catch (error: any) {
      console.error("Error loading products with promotions:", error);
      if (error.response?.status === 403) {
        setError("You do not have permission to view products.");
      } else {
        setError("Failed to load products. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByName = async () => {
    if (!searchName.trim()) {
      loadProducts();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetchProductsByName(searchName);
      console.log("Search Response:", response);
      if (response.success) {
        // Extract the array from response.data
        const productsData = Array.isArray(response?.data) ? response.data : [];
        setProducts(productsData);
      } else {
        setProducts([]);
      }
    } catch (error: any) {
      console.error("Error searching products:", error);
      if (error.response?.status === 403) {
        setError("You do not have permission to search products.");
      } else {
        setError("Failed to search products. Please try again.");
      }
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
      setError(null);
      const response = await fetchProductsByCategory(category);
      console.log("Get success", response);
  
      // Extract the array of products from the response.data property
      const productsData = Array.isArray(response?.data) ? response.data : [];
      setProducts(productsData);
    } catch (error: any) {
      console.error("Error filtering products:", error);
      if (error.response?.status === 403) {
        setError("You do not have permission to filter products.");
      } else {
        setError("Failed to filter products by category.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        setError(null);
        await deleteProduct(productId);
        toast({
          title: "Success",
          description: "Product has been deleted successfully.",
          duration: 3000,
        });
        await loadProducts();
      } catch (error: any) {
        console.error("Error deleting product:", error);
        if (error.response?.status === 403) {
          toast({
            title: "Access Denied",
            description: "You do not have permission to delete this product.",
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to delete product. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // Add a safeguard to ensure products is an array before slicing
  const currentProducts = Array.isArray(products) ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (indexOfLastProduct < products.length) {
      setCurrentPage(currentPage + 1);
    }
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
        <Button onClick={() => router.push("/staff/products/create")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 w-full"
              value={searchName}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchName(e.target.value)}
              onKeyDown={(e: { key: string }) => e.key === "Enter" && handleSearchByName()}
            />
          </div>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadProducts}>
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          {Array.isArray(currentProducts) && currentProducts.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      onChange={() => {
                        if (selectedProducts.length === currentProducts.length) {
                          setSelectedProducts([]);
                        } else {
                          setSelectedProducts(currentProducts.map((product) => product.productID));
                        }
                      }}
                      checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Promotion</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Rating</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.productID} className="border-b">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedProducts.includes(product.productID)}
                        onChange={() => toggleProductSelection(product.productID)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
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
                      {product.discountedPrice ? (
                        <>
                          <span className="text-green-600">${product.discountedPrice.toFixed(2)}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        `$${product.price.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {product.promotion ? `${product.promotion.discount}% OFF` : "No Promotion"}
                    </td>
                    <td className="px-4 py-3 text-sm">{product.rating || "N/A"}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/staff/products/${product.productID}/edit`)}>
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
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Products Found</h3>
              <p className="text-sm text-gray-500">
                {searchName || selectedCategory
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "There are no products available at the moment."}
              </p>
            </div>
          )}
        </div>
        {products.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastProduct, products.length)}</span> of{" "}
              <span className="font-medium">{products.length}</span> products
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={indexOfLastProduct >= products.length}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}