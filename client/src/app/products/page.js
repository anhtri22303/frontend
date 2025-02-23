
"use client";

import Banner3 from "@/components/home/Banner3";
import ExpertChoice from "@/components/home/ExpertChoice";
import FilterSidebar from "@/components/porducts/FilterSidebar";
import FilteredProducts from "@/components/porducts/FilteredProducts";
import Container from "@/components/shared/Container";
import Main from "@/components/shared/layouts/Main";
import React from "react";

const Products = () => {
  return (
    <Main>
      <Container className="flex flex-col gap-y-12 py-8">
        <section className="grid grid-cols-12 gap-8 pb-12 md:relative">
          <FilterSidebar />
          <FilteredProducts />
        </section>
        <ExpertChoice className="!px-0" />
        <Banner3 className="!px-0" />
      </Container>
    </Main>
  );
};

export default Products;
