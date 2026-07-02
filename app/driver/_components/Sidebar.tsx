"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,

  ShoppingCart,
  Truck,
} from "lucide-react";

const driver_LINKS = [
  { href: "/driver", label: "Dashboard", icon: LayoutDashboard },
  { href: "/driver/assigned", label: "Assigned", icon: ShoppingCart },
  { href: "/driver/delivered", label: "Deliverd", icon: Truck },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/driver" ? pathname === href : pathname?.startsWith(href);

  return (
    <aside
      className="A
        w-20 xl:w-64
        min-h-full
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        flex flex-col
      "
    >
      <nav className="flex flex-col gap-1 p-2">
        {driver_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);

           return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                group flex items-center gap-3
                px-3 py-2.5 rounded-lg
                text-sm font-medium
                transition-all
                ${
                  active
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-800 hover:bg-green-50"
                }
              `}
            >
              {/* Icon */}
              <Icon
                size={20}
                className={`
                  shrink-0
                  ${active ? "text-current" : "text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"}
                `}
              />

              {/* Label (hidden on compact mode) */}
              <span className="hidden xl:inline">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
