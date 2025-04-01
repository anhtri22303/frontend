'use client';

import { useState } from 'react';
import { Search, Plus, Minus, ShoppingBag, Truck, ArrowLeftRight, CreditCard, Shield, Mail } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  icon: JSX.Element;
  title: string;
  faqs: FAQ[];
}

const faqCategories: FAQCategory[] = [
  {
    icon: <ShoppingBag className="h-6 w-6" />,
    title: "Products & Shopping",
    faqs: [
      {
        question: "How do I choose the right skincare products?",
        answer: "To choose the right skincare products, consider your skin type, concerns, and goals. Take our skin quiz for personalized recommendations, or consult with our beauty advisors for expert guidance."
      },
      {
        question: "Are your products cruelty-free?",
        answer: "Yes, all our products are cruelty-free and never tested on animals. We are committed to ethical beauty practices and sustainable sourcing."
      },
      {
        question: "Do you offer samples with purchases?",
        answer: "Yes, you can select up to 2 free samples with every order over $50. Available samples will be shown during checkout."
      }
    ]
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Shipping Information",
    faqs: [
      {
        question: "What are your shipping options?",
        answer: "We offer Standard Shipping (3-5 business days) and Express Shipping (1-2 business days). Free shipping is available on orders over $50."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location."
      },
      {
        question: "How can I track my order?",
        answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order through your account dashboard."
      }
    ]
  },
  {
    icon: <ArrowLeftRight className="h-6 w-6" />,
    title: "Returns & Refunds",
    faqs: [
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return window for unopened products in their original packaging. Contact our customer service team to initiate a return."
      },
      {
        question: "How do I return a product?",
        answer: "To return a product, log into your account, go to your orders, select the items you wish to return, and follow the return instructions. We'll provide a return shipping label."
      },
      {
        question: "When will I receive my refund?",
        answer: "Refunds are processed within 5-7 business days after we receive your return. The refund will be issued to your original payment method."
      }
    ]
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Payment & Pricing",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Shop Pay."
      },
      {
        question: "Do you offer installment payments?",
        answer: "Yes, we offer installment payments through Afterpay and Klarna for orders over $35."
      },
      {
        question: "Are prices inclusive of tax?",
        answer: "Product prices shown do not include sales tax. Applicable taxes will be calculated at checkout based on your location."
      }
    ]
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Account & Security",
    faqs: [
      {
        question: "How do I create an account?",
        answer: "Click the 'Sign Up' button in the top right corner and follow the registration process. You'll need to provide your email address and create a password."
      },
      {
        question: "How can I reset my password?",
        answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email to reset your password."
      },
      {
        question: "Is my personal information secure?",
        answer: "Yes, we use industry-standard encryption and security measures to protect your personal and payment information."
      }
    ]
  }
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  const toggleCategory = (title: string) => {
    setOpenCategory(openCategory === title ? null : title);
  };

  const toggleQuestion = (question: string) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(question)) {
      newOpenQuestions.delete(question);
    } else {
      newOpenQuestions.add(question);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-100 to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find answers to common questions about our products, services, and policies
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleCategory(category.title)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-pink-100 p-2 rounded-lg">
                    {React.cloneElement(category.icon, { className: "h-6 w-6 text-pink-600" })}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                </div>
                {openCategory === category.title ? (
                  <Minus className="h-5 w-5 text-gray-400" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {openCategory === category.title && (
                <div className="px-6 pb-4">
                  <div className="space-y-4">
                    {category.faqs.map((faq) => (
                      <div key={faq.question} className="border-b border-gray-100 last:border-0">
                        <button
                          onClick={() => toggleQuestion(faq.question)}
                          className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
                        >
                          <h3 className="text-lg font-medium text-gray-900 pr-8">{faq.question}</h3>
                          {openQuestions.has(faq.question) ? (
                            <Minus className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <Plus className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {openQuestions.has(faq.question) && (
                          <p className="text-gray-600 pb-4">{faq.answer}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* No Results Message */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-600 mb-4">
                Contact our support team and we'll be happy to help.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
              >
                Contact Support
                <span className="ml-2">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 