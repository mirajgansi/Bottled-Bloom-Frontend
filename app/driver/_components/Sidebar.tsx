"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
} from "lucide-react";

const DRIVER_LINKS = [
  { href: "/driver", label: "Dashboard", icon: LayoutDashboard },
  { href: "/driver/assigned", label: "Assigned", icon: ShoppingCart },
  { href: "/driver/delivered", label: "Delivered", icon: Truck },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/driver" ? pathname === href : pathname?.startsWith(href);

  return (
    <aside
      className="w-20 xl:w-64 min-h-full flex flex-col"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <nav className="flex flex-col gap-1 p-2">
        {DRIVER_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={
                active
                  ? {
                      backgroundColor: "var(--gold-primary)",
                      color: "var(--text-on-gold)",
                      boxShadow: "0 4px 14px -4px rgba(201, 161, 93, 0.4)",
                    }
                  : { color: "var(--text-secondary)" }
              }
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "var(--bg-elevated)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon
                size={20}
                className="shrink-0"
                style={{ color: active ? "var(--text-on-gold)" : "var(--text-secondary)" }}
              />
              <span className="hidden xl:inline">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}