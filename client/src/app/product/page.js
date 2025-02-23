
"use client";

import Left from "@/components/details/Left";
import Relatives from "@/components/details/Relatives";
import Right from "@/components/details/Right";
import Banner2 from "@/components/home/Banner2";
import Container from "@/components/shared/Container";
import Main from "@/components/shared/layouts/Main";
import { useGetProductQuery } from "@/services/product/productApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

const Detail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("product_id");
  const {
    data: productData,
    error: productError,
    isLoading: productLoading,
  } = useGetProductQuery(id);
  const product = useMemo(() => productData?.data || {}, [productData]);

  useEffect(() => {
    if (productError) {
      toast.error(productError?.data?.description, { id: "productData" });
    }
  }, [productError]);

  return (
    <Main>
      <Container>
        <div className="h-full w-full flex flex-col gap-y-20">
          <div className="grid grid-cols-12 gap-8">
            {productLoading || !product ? (
              <>
                <div className="lg:col-span-6 md:col-span-6 col-span-12">
                  <div className="h-[200px] w-full rounded bg-gray-200 animate-pulse" />
                </div>
                <div className="lg:col-span-6 md:col-span-6 col-span-12">
                  <div className="w-full flex flex-col gap-y-4">
                    <div className="h-[200px] w-full rounded bg-gray-200 animate-pulse" />
                    <div className="h-[100px] w-full rounded bg-gray-200 animate-pulse" />
                    <div className="h-[50px] w-full rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <Left product={product} />
                <Right product={product} />
              </>
            )}
          </div>
          <Relatives />
          <Banner2 className={"!px-0"} />
        </div>
      </Container>
    </Main>
  );
};

export default Detail;
