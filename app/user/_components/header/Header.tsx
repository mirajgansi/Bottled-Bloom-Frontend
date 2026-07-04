"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Nav from "./Nav";
import Actions from "./Actions";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  aria-label="Open menu"
                >
                  <Menu size={22} />
                </button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[280px] sm:w-[320px] border-none"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <SheetHeader>
                  <SheetTitle
                    className="text-left"
                    style={{ color: "var(--text-primary)", fontFamily: "Georgia, serif" }}
                  >
                    Menu
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6">
                  <Nav isMobile onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div
            className="text-xl font-semibold tracking-wide"
            style={{ color: "var(--gold-primary)", fontFamily: "Georgia, serif" }}
          >
            Bottled Bloom
          </div>
        </div>

        {/* Desktop nav */}
        <Nav />

        {/* Right */}
        <Actions />
      </div>
    </header>
  );
}