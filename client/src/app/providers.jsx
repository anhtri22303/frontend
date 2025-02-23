
"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import React from "react";
import AnimatedCursor from "react-animated-cursor";

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
      <AnimatedCursor
        innerSize={10}
        color="0, 0, 0"
        showSystemCursor={false}
      />
    </Provider>
  );
};

export default Providers;
