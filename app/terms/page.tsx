'use client';

import { Scale, FileText, AlertTriangle, ShoppingBag, CreditCard, Shield, Mail } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: March 15, 2024
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Introduction
              </h2>
            </div>
            <p className="text-gray-600">
              Welcome to GlowCorner. By accessing and using our website, you agree to be bound by these 
              Terms and Conditions. Please read these terms carefully before using our services. If you 
              do not agree with any part of these terms, please do not use our website.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Definitions
              </h2>
            </div>
            <div className="space-y-4">
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>"Website" refers to GlowCorner's online platform</li>
                <li>"User," "you," and "your" refer to individuals accessing or using our website</li>
                <li>"We," "us," and "our" refer to GlowCorner and its affiliates</li>
                <li>"Products" refers to all items available for purchase on our website</li>
                <li>"Services" refers to all services provided through our website</li>
              </ul>
            </div>
          </section>

          {/* Account Terms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Account Terms
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                To use our services, you must:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Be at least 18 years of age</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any security breaches</li>
              </ul>
            </div>
          </section>

          {/* Product Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Product Information
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Regarding our products:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>All product descriptions are accurate to the best of our knowledge</li>
                <li>Product images may vary from actual products</li>
                <li>Prices are subject to change without notice</li>
                <li>We reserve the right to modify or discontinue products</li>
                <li>Products are subject to availability</li>
              </ul>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Payment Terms
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Payment and pricing information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>All prices are in the specified currency</li>
                <li>Payment must be made in full before order processing</li>
                <li>We accept various payment methods as displayed at checkout</li>
                <li>Prices include applicable taxes unless otherwise stated</li>
                <li>Shipping costs are additional unless specified</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Intellectual Property
              </h2>
            </div>
            <p className="text-gray-600">
              All content on this website, including text, graphics, logos, images, and software, is 
              the property of GlowCorner and is protected by intellectual property laws. You may not 
              use, reproduce, or distribute any content without our express written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Limitation of Liability
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                GlowCorner shall not be liable for:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Any indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or use</li>
                <li>Service interruptions or errors</li>
                <li>Third-party actions or content</li>
                <li>Personal injury or property damage</li>
              </ul>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Changes to Terms
              </h2>
            </div>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting to the website. Your continued use of our services after any 
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Contact Information
              </h2>
            </div>
            <p className="text-gray-600">
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="mt-2 text-gray-600">
              <p>Email: legal@glowcorner.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Skincare Street, Beauty District, City, State 12345</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 