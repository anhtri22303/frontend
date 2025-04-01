'use client';

import { Package, Truck, ArrowLeftRight, Shield, Clock } from 'lucide-react';

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shipping & Returns
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about shipping and returning your products
          </p>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-6">
            <Truck className="h-8 w-8 text-pink-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Shipping Information
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Processing Time
              </h3>
              <p className="text-gray-600">
                Orders are typically processed within 1-2 business days after payment confirmation. 
                You will receive a shipping confirmation email with tracking information once your order ships.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Shipping Methods
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Standard Shipping (3-5 business days)</li>
                <li>Express Shipping (1-2 business days)</li>
                <li>Free Shipping on orders over $50</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                International Shipping
              </h3>
              <p className="text-gray-600">
                We ship to most countries worldwide. International orders may be subject to customs duties 
                and taxes. These charges are the responsibility of the customer.
              </p>
            </div>
          </div>
        </div>

        {/* Returns Policy */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-6">
            <ArrowLeftRight className="h-8 w-8 text-pink-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Returns Policy
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Return Window
              </h3>
              <p className="text-gray-600">
                We offer a 30-day return window for all unopened products. Products must be returned in 
                their original packaging with all seals intact.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How to Return
              </h3>
              <ol className="list-decimal list-inside text-gray-600 space-y-2">
                <li>Log into your account and go to your order history</li>
                <li>Select the order you want to return</li>
                <li>Choose the items you want to return</li>
                <li>Print the return shipping label</li>
                <li>Package your items securely</li>
                <li>Drop off the package at any authorized shipping location</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Refund Process
              </h3>
              <p className="text-gray-600">
                Once we receive your return, we will inspect the items and process your refund within 
                5-7 business days. The refund will be issued to your original payment method.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-8 w-8 text-pink-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Additional Information
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Damaged Items
              </h3>
              <p className="text-gray-600">
                If you receive a damaged item, please contact our customer service team within 48 hours 
                of delivery. We will arrange for a replacement or refund at no additional cost.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tracking Your Order
              </h3>
              <p className="text-gray-600">
                You can track your order status at any time through your account dashboard or using the 
                tracking number provided in your shipping confirmation email.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-gray-600">
                Our customer service team is available Monday through Friday, 9:00 AM to 6:00 PM EST. 
                You can reach us via email at support@skincare.com or by phone at (555) 123-4567.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 