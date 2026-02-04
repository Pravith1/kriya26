"use client";

import { useRouter } from "next/navigation";
import { useEffect, useContext } from "react";
import { AuthContext } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { checkAuth, getAuth } = useContext(AuthContext);

  useEffect(() => {
    if (!checkAuth()) {
      router.push("/auth?type=login");
    } else {
      console.log("PROTECTED ROUTE", getAuth());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hasVideoPlayed", "false");
  }, []);
  return checkAuth() ? children : null;
};

export default ProtectedRoute;
