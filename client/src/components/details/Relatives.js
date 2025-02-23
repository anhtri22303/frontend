
"use client";

import React, { useEffect } from "react";
import Container from "../shared/Container";
import Card from "../shared/Card";
import { useRouter } from "next/navigation";
import { useGetProductsQuery } from "@/services/product/productApi";
import ProductCard from "../shared/skeletonLoading/ProductCard";

const Relatives = () => {
  const router = useRouter();

  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
  } = useGetProductsQuery();
  const products = productsData?.data || [];

  useEffect(() => {
    if (productsError) {
      alert(productsError?.data?.description);
    }
  }, [productsError]);

  return (
    <section className="flex flex-col gap-y-10">
      <h1 className="text-4xl">
        Related. <span className="">Products</span>
      </h1>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 md:gap-x-6 gap-y-8">
        {productsLoading || products?.length === 0 ? (
          <>
            {[1, 2, 3, 4].map((_, index) => (
              <ProductCard key={index} />
            ))}
          </>
        ) : (
          <>
            {products?.slice(0, 8)?.map((product, index) => (
              <Card key={index} product={product} />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Relatives;
