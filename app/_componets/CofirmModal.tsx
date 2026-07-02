"use client";

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText,
  cancelText,
  disabled,
  error,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText: string;
  cancelText: string;
  disabled?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-lg ring-1 ring-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-base font-bold text-gray-900">{title}</p>
          {description ? (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          ) : null}
        </div>

        {error ? (
          <div className="mx-5 mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2 px-5 py-4">
          <button
            onClick={onClose}
            disabled={disabled}
            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={disabled}
            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
