
"use client";

import { useGetBrandsQuery } from "@/services/brand/brandApi";
import { useGetCategoriesQuery } from "@/services/category/categoryApi";
import { useGetStoresQuery } from "@/services/store/storeApi";
import React, { useEffect } from "react";
import { AiOutlineReload } from "react-icons/ai";
import SelectCard from "../shared/skeletonLoading/SelectCard";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFilter,
  setBrand,
  setCategory,
  setStore,
} from "@/features/filter/filterSlice";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const FilterSidebar = () => {
  const {
    data: brandsData,
    error: brandsError,
    isLoading: brandsLoading,
  } = useGetBrandsQuery();
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();
  const {
    data: storesData,
    error: storesError,
    isLoading: storesLoading,
  } = useGetStoresQuery();

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = useSelector((state) => state.filter);

  const brand = searchParams.get("brand");
  const category = searchParams.get("category");
  const store = searchParams.get("store");

  const brands = brandsData?.data || [];
  const categories = categoriesData?.data || [];
  const stores = storesData?.data || [];

  useEffect(() => {
    if (brandsError?.data) {
      toast.error(brandsError?.data?.description, { id: "brands-data" });
    }

    if (categoriesError?.data) {
      toast.error(categoriesError?.data?.description, {
        id: "categories-data",
      });
    }

    if (storesError?.data) {
      toast.error(storesError?.data?.description, { id: "stores-data" });
    }
  }, [brandsError, categoriesError, storesError]);

  return (
    <aside className="lg:col-span-3 md:col-span-4 col-span-12">
      <section className="flex flex-col gap-y-4 md:sticky md:top-4">
        {/* reset */}
        <div className="flex flex-row items-center justify-between border py-2 px-4 rounded">
          <h2 className="text-lg">Reset Filter</h2>
          <button
            className="p-1 border rounded-secondary"
            onClick={() => {
              dispatch(clearFilter());

              // Uncheck all checkboxes for categories
              categories.forEach((category) => {
                document.getElementById(category._id).checked = false;
              });

              // Uncheck all checkboxes for brands
              brands.forEach((brand) => {
                document.getElementById(brand._id).checked = false;
              });

              // Uncheck all checkboxes for stores
              stores.forEach((store) => {
                document.getElementById(store._id).checked = false;
              });

              // Use setTimeout to delay the navigation
              router.push("/products");
            }}
          >
            <AiOutlineReload className="h-5 w-5" />
          </button>
        </div>

        {/* Choose Category */}
        <div className="flex flex-col gap-y-4 border py-2 px-4 rounded-xl max-h-96 overflow-y-auto scrollbar-hide">
          <h2 className="text-lg">Choose Category</h2>
          <div className="flex flex-col gap-y-2.5">
            {categoriesLoading || categories?.length === 0 ? (
              <>
                {[1, 2, 3].map((_, index) => (
                  <SelectCard key={index} />
                ))}
              </>
            ) : (
              <>
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/products?category=${category._id}&brand=${brand}&store=${store}`}
                  >
                    <label
                      htmlFor={category._id}
                      className="text-sm flex flex-row items-center gap-x-1.5"
                      onChange={() => dispatch(setCategory(category._id))}
                    >
                      <input
                        type="radio"
                        name="category"
                        id={category._id}
                        value={category._id}
                        checked={
                          category._id === filter.category ||
                          category._id === category
                        }
                        className="rounded-secondary checked:bg-primary checked:text-black checked:outline-none checked:ring-0 checked:border-0 focus:outline-none focus:ring-0 focus:border-1 focus:text-black"
                      />
                      {category.title}
                    </label>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Choose Brand */}
        <div className="flex flex-col gap-y-4 border py-2 px-4 rounded-xl max-h-96 overflow-y-auto scrollbar-hide">
          <h2 className="text-lg">Choose Brand</h2>
          <div className="flex flex-col gap-y-2.5">
            {brandsLoading || brands?.length === 0 ? (
              <>
                {[1, 2, 3].map((_, index) => (
                  <SelectCard key={index} />
                ))}
              </>
            ) : (
              <>
                {brands.map((brand) => (
                  <Link
                    key={brand._id}
                    href={`/products?category=${category}&brand=${brand._id}&store=${store}`}
                  >
                    <label
                      htmlFor={brand._id}
                      className="text-sm flex flex-row items-center gap-x-1.5"
                      onChange={() => dispatch(setBrand(brand._id))}
                    >
                      <input
                        type="radio"
                        name="brand"
                        id={brand._id}
                        value={brand._id}
                        checked={brand._id == filter.brand}
                        className="rounded-secondary checked:bg-primary checked:text-black checked:outline-none checked:ring-0 checked:border-0 focus:outline-none focus:ring-0 focus:border-1 focus:text-black"
                      />
                      {brand.title}
                    </label>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Choose Store */}
        <div className="flex flex-col gap-y-4 border py-2 px-4 rounded-xl max-h-96 overflow-y-auto scrollbar-hide">
          <h2 className="text-lg">Choose Store</h2>
          <div className="flex flex-col gap-y-2.5">
            {storesLoading || stores?.length === 0 ? (
              <>
                {[1, 2, 3].map((_, index) => (
                  <SelectCard key={index} />
                ))}
              </>
            ) : (
              <>
                {stores.map((store) => (
                  <Link
                    key={store._id}
                    href={`/products?category=${category}&brand=${brand}&store=${store._id}`}
                  >
                    <label
                      htmlFor={store._id}
                      className="text-sm flex flex-row items-center gap-x-1.5"
                      onChange={() => dispatch(setStore(store._id))}
                    >
                      <input
                        type="radio"
                        name="store"
                        id={store._id}
                        value={store._id}
                        checked={store._id == filter.store}
                        className="rounded-secondary checked:bg-primary checked:text-black checked:outline-none checked:ring-0 checked:border-0 focus:outline-none focus:ring-0 focus:border-1 focus:text-black"
                      />
                      {store.title}
                    </label>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
};

export default FilterSidebar;
