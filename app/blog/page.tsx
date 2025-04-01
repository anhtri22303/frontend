'use client';

import { useState } from 'react';
import { Calendar, Clock, Tag, Search } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Understanding Your Skin Type: A Complete Guide",
    excerpt: "Learn how to identify your skin type and choose the right products for your unique needs.",
    category: "Skincare Basics",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: "/blog/skin-types.jpg",
    tags: ["Skin Types", "Skincare Basics", "Product Selection"]
  },
  {
    id: 2,
    title: "The Importance of Sunscreen in Your Daily Routine",
    excerpt: "Discover why sunscreen is crucial for skin health and how to choose the right one for you.",
    category: "Sun Protection",
    date: "March 10, 2024",
    readTime: "4 min read",
    image: "/blog/sunscreen.jpg",
    tags: ["Sunscreen", "Sun Protection", "Daily Routine"]
  },
  {
    id: 3,
    title: "Natural Ingredients for Glowing Skin",
    excerpt: "Explore the benefits of natural ingredients and how they can transform your skincare routine.",
    category: "Natural Skincare",
    date: "March 5, 2024",
    readTime: "6 min read",
    image: "/blog/natural-ingredients.jpg",
    tags: ["Natural Ingredients", "Organic Skincare", "Clean Beauty"]
  },
  {
    id: 4,
    title: "Anti-Aging Tips for Your 30s",
    excerpt: "Essential skincare tips and products to maintain youthful skin in your 30s and beyond.",
    category: "Anti-Aging",
    date: "March 1, 2024",
    readTime: "7 min read",
    image: "/blog/anti-aging.jpg",
    tags: ["Anti-Aging", "Skincare Tips", "Age Prevention"]
  },
  {
    id: 5,
    title: "The Truth About Acne: Myths and Facts",
    excerpt: "Separate fact from fiction when it comes to acne treatment and prevention.",
    category: "Acne",
    date: "February 25, 2024",
    readTime: "5 min read",
    image: "/blog/acne.jpg",
    tags: ["Acne", "Skin Health", "Treatment"]
  },
  {
    id: 6,
    title: "Building Your Perfect Skincare Routine",
    excerpt: "A step-by-step guide to creating a skincare routine that works for your skin type.",
    category: "Skincare Routine",
    date: "February 20, 2024",
    readTime: "6 min read",
    image: "/blog/skincare-routine.jpg",
    tags: ["Skincare Routine", "Product Order", "Daily Care"]
  }
];

const categories = [
  "All",
  "Skincare Basics",
  "Sun Protection",
  "Natural Skincare",
  "Anti-Aging",
  "Acne",
  "Skincare Routine"
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Skincare Blog
          </h1>
          <p className="text-lg text-gray-600">
            Discover expert tips, skincare advice, and the latest beauty trends
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-pink-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results Message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No articles found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 