"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/products" className="text-sm font-semibold text-ink">
          Product admin
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user && <span className="hidden text-ink/60 sm:inline">{user.username}</span>}
          <button
            onClick={handleLogout}
            className="rounded-md border border-line px-3 py-1.5 font-medium text-ink hover:bg-paper"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
