"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  id: string;
  editHref: string;
  onRestock: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function ActionMenu({ id, editHref, onRestock, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative flex justify-end">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="h-9 w-9 grid place-items-center rounded-xl ring-1 ring-gray-200 hover:bg-white"
        aria-label="More"
      >
        <MoreVertical className="h-4 w-4 text-gray-600" />
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-10 z-50 w-40 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
        >
          <button
            type="button"
            onClick={() => {
              onRestock(id);
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm font-semibold text-green-700 hover:bg-green-50"
          >
            Restock
          </button>

          <Link
            href={editHref}
            onClick={() => setOpen(false)}
            className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() => {
              onDelete(id);
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
