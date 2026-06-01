import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { checkSessionFn } from "../actions";

export function SiteNav({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const base =
    "inline-flex items-center rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition duration-200 outline-none";
  const active = variant === "dark" 
    ? "bg-[#F9BF29] text-[#12223A] shadow-sm" 
    : "bg-[#FF5900] text-white shadow-sm";
  const inactive = variant === "dark"
    ? "text-white/80 hover:text-white hover:bg-white/5"
    : "text-neutral-700 hover:text-[#FF5900] hover:bg-neutral-100";

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    checkSessionFn()
      .then((res) => setIsAdmin(res.isAuthenticated))
      .catch((err) => console.error("Nav session check failed:", err));
  }, []);

  return (
    <nav aria-label="Primary" className="flex flex-wrap items-center gap-1.5">
      <Link
        to="/"
        activeOptions={{ exact: true }}
        activeProps={{ className: `${base} ${active}` }}
        inactiveProps={{ className: `${base} ${inactive}` }}
      >
        Home
      </Link>
      <Link
        to="/candidates"
        activeProps={{ className: `${base} ${active}` }}
        inactiveProps={{ className: `${base} ${inactive}` }}
      >
        Placement Brochure
      </Link>
      <Link
        to="/contact-us"
        activeProps={{ className: `${base} ${active}` }}
        inactiveProps={{ className: `${base} ${inactive}` }}
      >
        Contact
      </Link>
      {isAdmin ? (
        <Link
          to="/admin"
          activeProps={{ className: `${base} ${active}` }}
          inactiveProps={{ className: `${base} ${inactive}` }}
        >
          Admin Panel
        </Link>
      ) : (
        <Link
          to="/login"
          activeProps={{ className: `${base} ${active}` }}
          inactiveProps={{ className: `${base} ${inactive}` }}
        >
          Login
        </Link>
      )}
    </nav>
  );
}
