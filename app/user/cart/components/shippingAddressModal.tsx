"use client";

import { useEffect, useState } from "react";
import { X, MapPin } from "lucide-react";

type ShippingAddress = {
  userName?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
};

const REQUIRED_FIELDS: (keyof ShippingAddress)[] = ["userName", "phone", "address1"];

export default function ShippingAddressModal({
  open,
  initialData,
  onClose,
  onSave,
}: {
  open: boolean;
  initialData?: ShippingAddress;
  onClose: () => void;
  onSave: (data: ShippingAddress) => void;
}) {
  const [form, setForm] = useState<ShippingAddress>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialData ?? {});
      setTouched({});
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [initialData, open]);

  if (!mounted) return null;

  const update = (k: keyof ShippingAddress, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const markTouched = (k: keyof ShippingAddress) =>
    setTouched((p) => ({ ...p, [k]: true }));

  const isMissing = (k: keyof ShippingAddress) =>
    REQUIRED_FIELDS.includes(k) && touched[k] && !form[k]?.trim();

  const canSubmit = REQUIRED_FIELDS.every((k) => form[k]?.trim());

  const submit = () => {
    if (!canSubmit) {
      setTouched(Object.fromEntries(REQUIRED_FIELDS.map((k) => [k, true])));
      return;
    }
    onSave(form);
  };

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-3xl transition-all duration-200 ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.98] opacity-0"
        }`}
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-deep)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
              style={{ backgroundColor: "rgba(201, 161, 93, 0.12)" }}
            >
              <MapPin className="h-5 w-5" style={{ color: "var(--gold-primary)" }} />
            </div>
            <div>
              <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                Shipping address
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Where should we deliver your order?
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 px-5 py-5">
          <Field
            label="Full name"
            required
            value={form.userName || ""}
            onChange={(v) => update("userName", v)}
            onBlur={() => markTouched("userName")}
            error={isMissing("userName") ? "Full name is required" : undefined}
            placeholder="e.g. Aarav Sharma"
          />
          <Field
            label="Phone"
            required
            value={form.phone || ""}
            onChange={(v) => update("phone", v)}
            onBlur={() => markTouched("phone")}
            error={isMissing("phone") ? "Phone number is required" : undefined}
            placeholder="98XXXXXXXX"
          />
          <Field
            label="Address line 1"
            required
            value={form.address1 || ""}
            onChange={(v) => update("address1", v)}
            onBlur={() => markTouched("address1")}
            error={isMissing("address1") ? "Address is required" : undefined}
            placeholder="Street, house/apartment number"
          />
          <Field
            label="Address line 2"
            value={form.address2 || ""}
            onChange={(v) => update("address2", v)}
            placeholder="Landmark, floor, etc. (optional)"
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="City"
              value={form.city || ""}
              onChange={(v) => update("city", v)}
              placeholder="Kathmandu"
            />
            <Field
              label="ZIP / Postal code"
              value={form.zip || ""}
              onChange={(v) => update("zip", v)}
              placeholder="44600"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-full px-5 py-2 text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            style={{
              backgroundColor: "var(--gold-primary)",
              color: "var(--text-on-gold)",
              boxShadow: "0 10px 30px -8px rgba(201, 161, 93, 0.4)",
            }}
          >
            Save address
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  required,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
        {label}
        {required && <span style={{ color: "var(--gold-primary)" }}> *</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
        style={{
          backgroundColor: "var(--bg-elevated)",
          color: "var(--text-primary)",
          border: `1px solid ${error ? "#D14343" : "var(--border-strong)"}`,
        }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderColor = "var(--gold-bright)";
        }}
        onFocusCapture={(e) => {
          if (!error) e.currentTarget.style.borderColor = "var(--gold-bright)";
        }}
      />
      {error && (
        <p className="mt-1 text-xs" style={{ color: "#E57373" }}>
          {error}
        </p>
      )}
    </div>
  );
}