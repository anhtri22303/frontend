'use client';

import { Shield, Lock, Cookie, User, Mail, CreditCard, Share2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: March 15, 2024
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Introduction
              </h2>
            </div>
            <p className="text-gray-600">
              At GlowCorner, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website or use our services. 
              Please read this privacy policy carefully. By using our website, you consent to the practices 
              described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <User className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Personal Information
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Name and contact information</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information</li>
                  <li>Order history</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Usage Information
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited</li>
                  <li>Time spent on website</li>
                  <li>Referring website</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                How We Use Your Information
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Process your orders and payments</li>
                <li>Send you order confirmations and shipping updates</li>
                <li>Provide customer support</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Analyze website usage and trends</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Data Security
              </h2>
            </div>
            <p className="text-gray-600">
              We implement appropriate technical and organizational security measures to protect your 
              personal information. This includes encryption of data in transit and at rest, regular 
              security assessments, and restricted access to personal information.
            </p>
          </section>

          {/* Cookies Policy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Cookies Policy
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                We use cookies and similar tracking technologies to track activity on our website and 
                store certain information. You can instruct your browser to refuse all cookies or to 
                indicate when a cookie is being sent.
              </p>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Types of Cookies We Use
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Essential cookies for website functionality</li>
                  <li>Analytics cookies to understand website usage</li>
                  <li>Preference cookies to remember your settings</li>
                  <li>Marketing cookies for targeted advertising</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Third-Party Services
              </h2>
            </div>
            <p className="text-gray-600">
              We may use third-party services that collect, monitor, and analyze data to improve our 
              service. These third-party service providers have their own privacy policies addressing 
              how they use such information.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Rights
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
            </div>
          </section>

          {/* Contact Us */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-pink-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Contact Us
              </h2>
            </div>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-2 text-gray-600">
              <p>Email: privacy@glowcorner.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Skincare Street, Beauty District, City, State 12345</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 