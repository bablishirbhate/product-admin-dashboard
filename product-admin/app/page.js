"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { ready, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!ready) return;
    router.replace(isLoggedIn ? "/products" : "/login");
  }, [ready, isLoggedIn, router]);

  return null;
}
