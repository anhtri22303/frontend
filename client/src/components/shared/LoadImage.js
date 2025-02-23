
import Image from "next/image";
import React from "react";
// import React, { useState } from "react";

const LoadImage = ({ src, alt, height, width, ...rest }) => {
  function toBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function shimmer(width, height) {
    return `https://placehold.co/${width}x${height}.svg`;
  }

  return (
    <Image
      src={src}
      alt={alt}
      height={height}
      width={width}
      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(20, 10))}`}
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(20, 10))}`}
      {...rest}
    />
  );
};

export default LoadImage;
