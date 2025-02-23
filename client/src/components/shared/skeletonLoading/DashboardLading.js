
import Image from "next/image";
import React from "react";

const DashboardLading = () => {
  return (
    <section className="!h-full !w-full flex justify-center items-center">
      <Image
        src="/loading.gif"
        alt="loading"
        height={540}
        width={960}
        className="max-w-full"
      />
    </section>
  );
};

export default DashboardLading;
