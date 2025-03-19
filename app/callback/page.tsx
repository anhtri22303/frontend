"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwtToken = urlParams.get("jwtToken");
    const role = urlParams.get("role");
    const email = urlParams.get("email");
    const fullName = urlParams.get("fullName");

    console.log("Callback params:", { jwtToken, role, email, fullName });

    if (jwtToken && role && email && fullName) {
      localStorage.setItem("jwtToken", jwtToken);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", fullName);

      switch (role) {
        case "MANAGER":
          router.push("/manager");
          break;
        case "STAFF":
          router.push("/staff");
          break;
        case "CUSTOMER":
          router.push("/");
          break;
        default:
          router.push("/");
      }
    } else {
      console.error("Missing params in callback:", { jwtToken, role, email, fullName });
      router.push("/login?error=Missing required parameters");
    }
  }, [router]);

  return <div>Loading...</div>;
}