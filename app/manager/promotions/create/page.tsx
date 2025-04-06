"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPromotion } from "@/app/api/promotionApi"; // Adjust the import path

export default function CreatePromotionForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    promotionName: "",
    productIDs: [],
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");

  // Sample product list (in a real app, fetch this from an API)
  const availableProducts = [
    { id: "1001", name: "Phyto Peptide Cleanser" },
    { id: "1003", name: "Klairs Supple Preparation Unscented Toner" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductSelect = (productId) => {
    setFormData((prev) => ({
      ...prev,
      productIDs: prev.productIDs.includes(productId)
        ? prev.productIDs.filter((id) => id !== productId)
        : [...prev.productIDs, productId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.promotionName) {
      setError("Promotion Name is required.");
      return;
    }
    const discount = parseFloat(formData.discount);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      setError("Discount must be a number between 0 and 100.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setError("Start Date and End Date are required.");
      return;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("Start Date must be before End Date.");
      return;
    }
    if (formData.productIDs.length === 0) {
      setError("At least one product must be selected.");
      return;
    }

    try {
      const promotionData = {
        promotionName: formData.promotionName,
        productIDs: formData.productIDs,
        discount: discount,
        startDate: formData.startDate, // Already in YYYY-MM-DD format from input type="date"
        endDate: formData.endDate,
      };
      console.log("Submitting promotion:", promotionData);
      await createPromotion(promotionData);
      alert("Promotion created successfully!");
      router.push("/promotions"); // Redirect to promotions list or another page
    } catch (error) {
      console.error("Failed to create promotion:", error);
      setError("Failed to create promotion. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Promotion</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Promotion Name</label>
          <input
            type="text"
            name="promotionName"
            value={formData.promotionName}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
            min="0"
            max="100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Products</label>
          {availableProducts.map((product) => (
            <div key={product.id} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.productIDs.includes(product.id)}
                onChange={() => handleProductSelect(product.id)}
                className="mr-2"
              />
              <span>
                {product.name} (ID: {product.id})
              </span>
            </div>
          ))}
          <p className="text-sm text-gray-500 mt-1">
            {formData.productIDs.length} product(s) selected
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="border p-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-red-500 text-white p-2 rounded"
          >
            Create Promotion
          </button>
        </div>
      </form>
    </div>
  );
}