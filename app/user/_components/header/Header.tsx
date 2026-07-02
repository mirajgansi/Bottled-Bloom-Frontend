"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Nav from "./Nav";
import Actions from "./Actions";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-gray-100" aria-label="Open menu">
                  <Menu size={22} />
                </button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>

                <div className="mt-6">
                  <Nav isMobile onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="text-xl font-bold text-green-600">Click Shop</div>
        </div>

        {/* Desktop nav */}
        <Nav />

        {/* Right */}
        <Actions />
      </div>
    </header>
  );
}