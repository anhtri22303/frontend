
"use client";

import React from "react";
import Container from "../Container";
import Image from "next/image";
import Categories from "./Categories";
import Auth from "./Auth";
import Dashboard from "@/components/icons/Dashboard";
import SearchFilter from "./SearchFilter";
import MyCart from "./MyCart";
import { useSelector } from "react-redux";

const Header = () => {
  const user = useSelector((state) => state?.auth?.user);

  return (
    <Container className="">
      <nav className="rounded-xl p-4 flex flex-row justify-between">
        <div className="flex flex-row gap-x-4 items-center relative">
          <Image
            src="/logo.png"
            alt="logo"
            width={141}
            height={40}
            className="h-[40px] object-contain md:block hidden cursor-pointer"
            onClick={() => window.open("/", "_self")}
          />

          <div className="border-l h-7 rounded" />

          <Categories />
        </div>
        <div className="flex flex-row gap-x-2 relative">
          {user && Object?.keys(user)?.length > 0 && (
            <button
              className="p-2 rounded-secondary hover:bg-slate-100 transition-colors"
              onClick={() => window.open("/dashboard", "_self")}
            >
              <Dashboard className="h-6 w-6" />
            </button>
          )}
          <SearchFilter />
          <Auth />
          <MyCart />
        </div>
      </nav>
    </Container>
  );
};

export default Header;
