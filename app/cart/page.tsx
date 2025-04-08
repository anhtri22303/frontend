"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { fetchCartByUserId, updateCartItem, removeFromCart } from "@/app/api/cartApi"
import { fetchProductById } from "@/app/api/productApi"
import toast from "react-hot-toast"
import { createCustomerOrder } from "@/app/api/orderCustomerApi"
import stripePromise from "@/lib/stripe-client"

interface CartItem {
  userID: string
  productID: string
  quantity: number
  totalAmount: number
  discountedTotalAmount?: number
  name?: string
  image?: string
  price: number; // Giá gốc
  discountedPrice?: number; // Giá sau khi giảm (nếu có)
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [userID, setUserID] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [address, setAddress] = useState("");
  const router = useRouter()

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID")
    if (storedUserID) {
      setUserID(storedUserID)
    } else {
      console.error("User ID not found in localStorage")
    }
  }, [])

  useEffect(() => {
    if (userID) {
      loadCartItems()
    }
  }, [userID])

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetchCartByUserId(userID!);

      if (response && response.items) {
        // The response now includes all the details we need
        setCartItems(response.items);

        // Add image data from product API if not provided in cart response
        const cartItemsWithImages = await Promise.all(
          response.items.map(async (item) => {
            if (!item.image) {
              try {
                const productDetails = await fetchProductById(item.productID);
                return {
                  ...item,
                  image: productDetails?.image_url || "/placeholder.svg",
                };
              } catch (error) {
                console.error(`Error fetching product details for ${item.productID}:`, error);
                return {
                  ...item,
                  image: "/placeholder.svg",
                };
              }
            }
            return item;
          })
        );

        setCartItems(cartItemsWithImages);
      }
      console.log("Cart items loaded:", response.items);
    } catch (error) {
      console.error("Error loading cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          toast.error("User ID not found!");
          return;
        }

        const cartData = await fetchCartByUserId(userId);
        setCartItems(cartData.items || []);

        // Lấy thông tin address từ localStorage hoặc API
        const storedAddress = localStorage.getItem("userAddress") || "";
        setAddress(storedAddress);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productID: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Không cho phép số lượng nhỏ hơn 1

    try {
      await updateCartItem(userID!, productID, newQuantity); // Gọi API cập nhật số lượng
      toast.success("Quantity updated successfully!");
      await loadCartItems(); // Tải lại danh sách giỏ hàng
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (productID: string) => {
    try {
      await removeFromCart(userID!, productID);
      console.log("Item removed from cart");
      toast.success("Item removed from cart!");
      await loadCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item.");
    }
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const userID = localStorage.getItem("userID");
      if (!userID) {
        toast.error("User ID not found. Please log in.");
        return;
      }

      const orderData = {
        customerID: userID,
        orderDate: new Date().toISOString(),
        status: "PENDING",
        totalAmount: discountedTotalAmount, // Sử dụng discountedTotalAmount
        orderDetails: cartItems.map((item) => ({
          productID: item.productID,
          quantity: item.quantity,
          price: item.totalAmount,
        })),
      };

      console.log("Creating order with data:", orderData);
      const orderResponse = await createCustomerOrder(userID, orderData);
      console.log("Order created response:", orderResponse);

      if (!orderResponse?.data) {
        throw new Error("Invalid response from API");
      }

      if (!orderResponse.data.orderID) {
        throw new Error("Order ID is undefined. Check API response.");
      }
      toast.success("Order created successfully!");

      sessionStorage.setItem("orderID", orderResponse.data.orderID);

      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe failed to initialize.");
        return;
      }
      console.log("discountedTotalAmount" , discountedTotalAmount);
      console.log("Sending request to /api/stripe", {
        totalAmount: orderResponse.data.discountedTotalAmount, // Sử dụng discountedTotalAmount
        orderID: orderResponse.data.orderID,
      });

      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: orderResponse.data.discountedTotalAmount, // Sử dụng discountedTotalAmount
          orderID: orderResponse.data.orderID,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment failed");
      }

      const data = await response.json();
      if (!data.sessionId) {
        throw new Error("Invalid response from server");
      }

      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success("Checkout successful!");
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (!address) {
      toast.error("Please add your address before proceeding to checkout.");
      return;
    }
    router.push("/checkout");
  };

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.discountedPrice ? item.discountedPrice : item.price) * item.quantity,
    0
  );

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountedTotalAmount = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.discountedPrice ? item.discountedPrice : item.price) * item.quantity,
    0
  );

  const shipping = subtotal > 50 ? 0 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.productID}
                className="flex items-center space-x-4 border-b pb-4"
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.productName || `Product ${item.productID}`}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">
                    {item.productName || `Product ${item.productID}`}
                  </h3>
                  <div className="mt-1">
                    {item.discountPercentage ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-semibold">
                          $
                          {(
                            item.productPrice -
                            item.productPrice * (item.discountPercentage / 100)
                          ).toFixed(2)}
                        </span>
                        <span className="text-gray-500 line-through">
                          ${item.productPrice?.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold">
                        ${item.productPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleUpdateQuantity(item.productID, item.quantity - 1)
                      }
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleUpdateQuantity(item.productID, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium mb-1">Sales:</p>
                  {item.discountPercentage && (
                    <span className="text-xs text-green-600">
                      {item.discountPercentage}% off
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleRemoveItem(item.productID)}
                >
                  Remove
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-xl mb-4">Your cart is empty</p>
              <Button onClick={() => (window.location.href = "/shop")}>
                Continue Shopping
              </Button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>PreTotal</span>
              <span>
                $
                {cartItems
                  .reduce((sum, item) => sum + item.totalAmount, 0)
                  .toFixed(2)}
              </span>
            </div>

            {cartItems.some((item) => item.discountedTotalAmount) && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>
                  -$
                  {(
                    cartItems.reduce((sum, item) => sum + item.totalAmount, 0) -
                    cartItems.reduce(
                      (sum, item) =>
                        sum + (item.discountedTotalAmount || item.totalAmount),
                      0
                    )
                  ).toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Final Total</span>
              <span>
                $
                {cartItems
                  .reduce(
                    (sum, item) =>
                      sum + (item.discountedTotalAmount || item.totalAmount),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              onClick={() => router.push("/informCustomer")}
              className="w-full"
            >
              Enter Information
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={isProcessing || cartItems.length === 0}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Proceed to Checkout"}
            </Button>
            {!address && (
              <p className="text-sm text-red-500 mt-2">
                Please add your address to proceed.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}