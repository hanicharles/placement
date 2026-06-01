import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { checkSessionFn } from "../actions";

export function SiteNav({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkSessionFn()
      .then((res) => setIsAdmin(res.isAuthenticated))
      .catch((err) => console.error("Nav session check failed:", err));
  }, []);

  const base =
    "inline-flex items-center rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition duration-200 outline-none";
  
  const active = variant === "dark" 
    ? "bg-[#F9BF29] text-[#12223A] shadow-sm" 
    : "bg-[#FF5900] text-white shadow-sm";
    
  const inactive = variant === "dark"
    ? "text-white/80 hover:text-white hover:bg-white/5"
    : "text-neutral-700 hover:text-[#FF5900] hover:bg-neutral-100";

  // Dropdown background classes
  const drawerBg = variant === "dark"
    ? "bg-[#12223A] border border-white/10 shadow-2xl"
    : "bg-white border border-black/5 shadow-2xl";

  const toggleOpen = () => setIsOpen(!isOpen);

  const navLinks = [
    { to: "/", label: "Home", exact: true },
    { to: "/candidates", label: "Placement Brochure" },
    { to: "/contact-us", label: "Contact" },
    ...(isAdmin 
      ? [{ to: "/admin", label: "Admin Panel" }]
      : [{ to: "/login", label: "Login" }]
    )
  ];

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <nav aria-label="Primary" className="hidden md:flex items-center gap-1.5">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            activeOptions={link.exact ? { exact: true } : undefined}
            activeProps={{ className: `${base} ${active}` }}
            inactiveProps={{ className: `${base} ${inactive}` }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Hamburger Button */}
      <div className="flex md:hidden items-center">
        <button
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className={`p-2 rounded-lg transition duration-200 cursor-pointer ${
            variant === "dark" 
              ? "text-white hover:bg-white/10" 
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          {isOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <>
          {/* Transparent Backdrop Click Catcher */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className={`absolute right-0 top-full mt-2 z-50 w-56 rounded-xl p-3 flex flex-col gap-1.5 animate-scale-up ${drawerBg}`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                activeOptions={link.exact ? { exact: true } : undefined}
                activeProps={{ className: `${base} w-full ${active}` }}
                inactiveProps={{ className: `${base} w-full ${inactive}` }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
