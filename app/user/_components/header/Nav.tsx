"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export default function Nav({
  onNavigate,
  isMobile = false,
}: {
  onNavigate?: () => void;
  isMobile?: boolean;
}) {
  return (
    <div className={isMobile ? "flex flex-col gap-2" : "hidden md:flex items-center gap-8"}>
      <Link
        href="/user/dashboard"
        onClick={onNavigate}
        className={`${isMobile ? "px-3 py-2 rounded-lg" : "text-sm font-medium"} transition-colors`}
        style={{ color: "var(--text-primary)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
      >
        Home
      </Link>

      <Link
        href="/user/orders"
        onClick={onNavigate}
        className={`${isMobile ? "px-3 py-2 rounded-lg" : "text-sm font-medium"} transition-colors`}
        style={{ color: "var(--text-primary)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
      >
        My orders
      </Link>

      {/* Desktop dropdown only */}
      {!isMobile && (
        <div className="relative group">
          <button
            className="flex items-center gap-1 text-sm font-medium transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            <span className="group-hover:text-[var(--gold-primary)] transition-colors">
              Categories
            </span>
            <ChevronDown
              size={16}
              className="transition-transform group-hover:rotate-180 group-hover:text-[var(--gold-primary)]"
            />
          </button>

          <div
            className="absolute left-0 top-full mt-2 w-56 rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-deep)",
            }}
          >
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/user/category/${c.slug}`}
                className="block px-4 py-2 rounded-lg text-sm transition-colors"
                style={{ color: "var(--text-primary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                  e.currentTarget.style.color = "var(--gold-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile categories list */}
      {isMobile && (
        <div className="mt-3">
          <p
            className="px-3 text-xs font-semibold tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            CATEGORIES
          </p>
          <div className="mt-2 flex flex-col gap-1">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/user/category/${c.slug}`}
                onClick={onNavigate}
                className="px-3 py-2 rounded-lg text-sm transition-colors"
                style={{ color: "var(--text-primary)" }}
                onTouchStart={(e) => (e.currentTarget.style.color = "var(--gold-primary)")}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}