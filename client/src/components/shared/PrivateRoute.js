
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, allowedRoles }) => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      router.push("/auth/signin");
    } else {
      if (!allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
      } else {
        setLoading(false);
      }
    }
  }, [user, allowedRoles, router]);

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
