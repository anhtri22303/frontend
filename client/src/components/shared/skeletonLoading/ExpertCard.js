
import React from "react";

const ExpertCard = () => {
  return (
    <section className="flex flex-col gap-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="h-[96px] bg-gray-200 animate-pulse rounded" />
        <div className="h-[96px] bg-gray-200 animate-pulse rounded" />
        <div className="h-[96px] bg-gray-200 animate-pulse rounded" />
        <div className="h-[96px] bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="flex flex-col gap-y-2.5">
        <div className="flex flex-row gap-x-2">
          <div className="h-4 w-24 rounded-primary bg-gray-200 animate-pulse" />
          <div className="h-4 w-24 rounded-primary bg-gray-200 animate-pulse" />
        </div>
        <div className="h-6 rounded bg-gray-200 animate-pulse" />
        <div className="flex flex-row justify-between">
          <div className="h-4 w-24 rounded-primary bg-gray-200 animate-pulse" />
          <div className="h-4 w-16 rounded-primary bg-gray-200 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default ExpertCard;
