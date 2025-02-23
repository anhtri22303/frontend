
import React from "react";

const CategoryCard = () => {
  return (
    <section className="flex flex-row items-start gap-x-2.5 w-full">
      <div className="!h-8 !w-10 rounded bg-gray-200 animate-pulse" />
      <div className="flex flex-col gap-y-1 w-full">
        <div className="h-4 w-full rounded-secondary bg-gray-200 animate-pulse" />
        <div className="h-3 w-3/4 rounded-secondary bg-gray-200 animate-pulse" />
        <div className="h-2 w-1/2 rounded-secondary bg-gray-200 animate-pulse" />
      </div>
    </section>
  );
};

export default CategoryCard;
