
import React from "react";

const SelectCard = () => {
  return (
    <section className="flex flex-row gap-x-1.5 items-center">
      <div className="h-6 w-6 rounded-secondary bg-gray-200 animate-pulse" />
      <div className="flex-1 h-4 rounded-secondary bg-gray-200 animate-pulse" />
    </section>
  );
};

export default SelectCard;
