"use client";

import { X } from "lucide-react";

export default function DeleteAccountModal({
  open,
  password,
  setPassword,
  deleting,
  onClose,
  onConfirm,
}: {
  open: boolean;
  password: string;
  setPassword: (v: string) => void;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-red-600">
            Delete Account
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body */}
        <p className="mt-3 text-sm text-gray-600">
          This action is <span className="font-semibold text-red-600">permanent</span>.
          Please enter your password to confirm.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="mt-4 h-11 w-full rounded-lg border px-3 text-sm outline-none focus:border-red-500"
        />

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
