'use client';

import { Mail, Phone, MapPin, Clock, HelpCircle, Instagram, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-100 to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Get in Touch with Us
            </h1>
            <p className="text-lg text-gray-600">
              We're here to help and answer any questions you might have. 
              We look forward to hearing from you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Options Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Email Support */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Email Us</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <a href="mailto:support@glowcorner.com" 
               className="text-pink-600 hover:text-pink-700 font-medium">
              support@glowcorner.com
            </a>
          </div>

          {/* Phone Support */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Call Us</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Speak directly with our customer service team.
            </p>
            <a href="tel:+15551234567" 
               className="text-pink-600 hover:text-pink-700 font-medium">
              (555) 123-4567
            </a>
          </div>

          {/* Help Center */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <HelpCircle className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Help Center</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Find answers to common questions in our help center and FAQs.
            </p>
            <Link 
              href="/faqs" 
              className="text-pink-600 hover:text-pink-700 font-medium inline-flex items-center"
            >
              Visit Help Center
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Business Hours */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-pink-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Business Hours</h2>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
                <p className="mt-4 text-sm">
                  * All times are in EST
                </p>
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-pink-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Visit Us</h2>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>123 Skincare Street</p>
                <p>Beauty District</p>
                <p>City, State 12345</p>
                <p className="mt-4">
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Get Directions →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Connect With Us
          </h2>
          <div className="flex justify-center gap-6">
            <Link href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-gray-600 hover:text-pink-600 transition-colors">
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 