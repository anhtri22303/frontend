'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is our skincare consultation service?",
    answer: "Our skincare consultation service provides personalized recommendations based on your skin type, concerns, and lifestyle. We use advanced skin analysis tools and expert knowledge to create a customized skincare routine just for you."
  },
  {
    question: "How do I book a consultation?",
    answer: "You can book a consultation through our website by navigating to the consultation page, selecting your preferred date and time, and completing the booking process. We offer both in-person and virtual consultations."
  },
  {
    question: "What products do we offer?",
    answer: "We offer a wide range of high-quality skincare products including cleansers, toners, serums, moisturizers, and sunscreens. All our products are carefully selected and tested to ensure they meet our high standards of quality and effectiveness."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is placed, you'll receive a confirmation email with your order number and tracking information. You can use this information to track your order status through our website or the shipping carrier's website."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all unopened products. If you're not satisfied with your purchase, you can return it within 30 days of delivery for a full refund. Please contact our customer service team to initiate a return."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach our customer support team through multiple channels: email support@example.com, phone at (555) 123-4567, or through our website's contact form. We typically respond within 24 hours."
  }
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our products and services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 