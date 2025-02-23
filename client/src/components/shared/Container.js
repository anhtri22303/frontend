
import React from "react";

const Container = ({ className, children, ...props }) => {
  return (
    <section
      {...props}
      className={"max-w-7xl mx-auto px-4 w-full" + (className ? " " + className : "")}
    >
      {children}
    </section>
  );
};

export default Container;
