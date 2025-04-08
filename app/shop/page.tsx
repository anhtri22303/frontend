"use client";


import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchProducts, fetchProductsByFilters, fetchProductsByName, fetchProductsBySkinType } from "@/app/api/productApi";
import { addToCart } from "@/app/api/cartApi";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface Product {
  productID: string;
  productName: string;
  category?: string;
  price: number;
  description: string;
  rating: number;
  image_url: string;
  skinTypes: string[];
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
 
  // Add the searchSkinType state
  const [searchSkinType, setSearchSkinType] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
 
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8; // Show 8 products per page


  const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Mask", "Sunscreen"];
  const skinTypes = ["Dry", "Oily", "Combination", "Normal", "Sensitive"];


  useEffect(() => {
    loadProducts();
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);


  useEffect(() => {
    // Calculate total pages whenever filtered products array changes
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    // Reset to first page when data changes
    setCurrentPage(1);
  }, [filteredProducts]);


  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const productsData = await fetchProducts();
      if (!Array.isArray(productsData)) {
        throw new Error("Invalid products data");
      }
      setProducts(productsData);
      setFilteredProducts(productsData);
      
      // Set max price for price range filter
      const maxProductPrice = Math.max(...productsData.map((p) => p.price));
      setMaxPrice(maxProductPrice);
      setPriceRange([0, maxProductPrice]);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };


  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const filters = {
        categories: selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
        skinTypes: selectedSkinTypes.length > 0 ? selectedSkinTypes.join(",") : undefined,
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


  // New search functions
  const handleSearchByName = async () => {
    if (!searchName.trim()) {
      applyFilters();
      return;
    }
   
    setIsLoading(true);
    try {
      const response = await fetchProductsByName(searchName);
      if (response.success) {
        setFilteredProducts(response.data);
        if (response.data.length === 0) {
          toast.error("No products found with that name");
        }
      } else {
        setFilteredProducts([]);
        toast.error("No products found with that name");
      }
    } catch (error) {
      console.error("Error searching products by name:", error);
      toast.error("Failed to search products");
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this new function to handle search by skin type
  const handleSearchBySkinType = async () => {
    if (!searchSkinType.trim()) {
      applyFilters();
      return;
    }
   
    setIsLoading(true);
    try {
      const response = await fetchProductsBySkinType(searchSkinType);
      if (response && response.length > 0) {
        setFilteredProducts(response);
        toast.success(`Found ${response.length} products for ${searchSkinType} skin type`);
      } else {
        setFilteredProducts([]);
        toast.error(`No products found for ${searchSkinType} skin type`);
      }
    } catch (error) {
      console.error("Error searching products by skin type:", error);
      toast.error("Failed to search products by skin type");
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleResetFilters = () => {
    setSearchName("");
    setSearchId("");
    setSearchSkinType("");
    setSelectedCategories([]);
    setSelectedSkinTypes([]);
   
    const maxProductPrice = Math.max(...products.map((product: Product) => product.price), 1000);
    setPriceRange([0, maxProductPrice]);
   
    setFilteredProducts(products);
    toast.success("Filters reset");
  };


  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  // Get current page data
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };


  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
   
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always add first page
      pages.push(1);
     
      // Calculate start and end pages to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
     
      // Adjust if we're near the start or end
      if (currentPage <= 2) {
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
     
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pages.push('...');
      }
     
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
     
      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
     
      // Always add last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
   
    return pages;
  };


  return (
    <div className="container py-8 mx-auto max-w-screen-xl">
      {/* Enhanced Search Filters Row */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4">Find Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search by name */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search by product name"
              value={searchName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSearchByName()}
              className="flex-1"
            />
            <Button onClick={handleSearchByName} className="bg-red-500 hover:bg-red-600">
              Search
            </Button>
          </div>

          {/* Search by skin type */}
          <div className="flex items-center gap-2">
            <Select value={searchSkinType} onValueChange={setSearchSkinType}>
              <SelectTrigger className="flex-1">
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
            <Button onClick={handleSearchBySkinType} className="bg-red-500 hover:bg-red-600">
              Search
            </Button>
          </div>

          {/* Reset button */}
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="w-full md:w-auto border-gray-300"
            >
              Reset All Filters
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-6 justify-center flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
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


          {/* <h3 className="text-lg font-semibold mt-6 mb-4">Skin Type</h3>
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
          </div> */}


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
        <div className="w-full md:w-3/4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                  getCurrentPageProducts().map((product) => (
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
                                ? [...new Set(product.skinTypes)].join("/")
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuantityChange(product.productID, e.target.value)}
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
             
              {/* Pagination Controls */}
              {filteredProducts.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                    </span> of{" "}
                    <span className="font-medium">{filteredProducts.length}</span> products
                  </div>
                 
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="w-8 h-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                   
                    {getPageNumbers().map((page, index) => (
                      typeof page === 'number' ? (
                        <Button
                          key={index}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ) : (
                        <span key={index} className="px-1">
                          {page}
                        </span>
                      )
                    ))}
                   
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
