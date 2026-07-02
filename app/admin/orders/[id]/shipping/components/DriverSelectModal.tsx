"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { X, Search, Truck } from "lucide-react";
import { handleGetDrivers, handleAssignDriver } from "@/lib/actions/order-action";
import { toast } from "react-toastify";

type Driver = {
  _id: string;
  username: string;
  phoneNumber?: string;
  vehicleType?: "bike" | "van" | "truck";
  isAvailable?: boolean;
};

export default function DriverSelectModal({
  open,
  onClose,
  orderId, 
}: {
  open: boolean;
  onClose: () => void;
  orderId: string;
}) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();
const [openDriver, setOpenDriver] = useState(false);
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        setLoading(true);
        const res = await handleGetDrivers();
        if (res?.success) setDrivers(res.data.users);
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return drivers;
    return drivers.filter(
      (d) =>
        d.username.toLowerCase().includes(s) ||
        (d.phoneNumber || "").toLowerCase().includes(s) ||
        (d.vehicleType || "").toLowerCase().includes(s),
    );
  }, [q, drivers]);

  const onConfirm = () => {
    if (!selected) return;

    startTransition(async () => {
      const res = await handleAssignDriver(orderId, selected);

      if (res?.success) {
        onClose();
        setSelected(null);
      } else {
toast.error(res?.message || "Failed to assign driver");
      }
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white ring-1 ring-gray-200 shadow-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-base font-bold text-gray-900">Assign Driver</p>
            <p className="text-sm text-gray-500">Select a driver</p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-2xl grid place-items-center hover:bg-gray-50 ring-1 ring-gray-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search driver by name, phone, vehicle..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div className="m-2 space-y-2 max-h-[320px] overflow-auto p-1">
            {loading ? (
              <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 ring-1 ring-gray-100">
                Loading drivers...
              </div>
            ) : (
              filtered.map((d) => {
                const available = d.isAvailable ?? true;
                return (
                  <button
                    key={d._id}
                    disabled={!available || pending}
                    onClick={() => setSelected(d._id)}
                    className={`w-full text-left rounded-2xl p-4 ring-1 transition ${
                      selected === d._id
                        ? "ring-gray-900 bg-gray-50"
                        : "ring-gray-200 hover:bg-gray-50"
                    } ${!available ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{d.username}</p>
                        <p className="text-sm text-gray-600">
                          {d.phoneNumber || "No phone"} • {d.vehicleType || " Truck"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                          available
                            ? "bg-green-50 text-green-700 ring-green-200"
                            : "bg-gray-50 text-gray-600 ring-gray-200"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${available ? "bg-green-500" : "bg-gray-400"}`} />
                        {available ? "Available" : "Busy"}
                      </span>
                    </div>
                  </button>
                );
              })
            )}

            {!loading && !filtered.length ? (
              <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 ring-1 ring-gray-100">
                No drivers found.
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <button
              onClick={onClose}
              disabled={pending}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50
              cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={!selected || pending}
              className="inline-flex items-center gap-2 rounded-2xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 cursor-pointer disabled:opacity-50"
            >
              <Truck className="h-4 w-4" />
              {pending ? "Assigning..." : "Confirm Driver"}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}
