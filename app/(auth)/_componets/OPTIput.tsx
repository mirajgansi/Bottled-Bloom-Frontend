"use client";

import { useEffect, useMemo, useRef } from "react";

export default function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
}) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const chars = useMemo(() => {
    const v = value.replace(/\D/g, "").slice(0, length);
    return Array.from({ length }, (_, i) => v[i] ?? "");
  }, [value, length]);

  useEffect(() => {
    // keep value always numeric
    const v = value.replace(/\D/g, "").slice(0, length);
    if (v !== value) onChange(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setAt(index: number, digit: string) {
    const v = value.replace(/\D/g, "").slice(0, length).split("");
    v[index] = digit;
    const next = v.join("").slice(0, length);
    onChange(next);
  }

  function focusIndex(i: number) {
    inputsRef.current[i]?.focus();
    inputsRef.current[i]?.select();
  }

  return (
    <div className="flex gap-2">
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={c}
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-12 rounded-xl border text-center text-lg tracking-widest outline-none focus:ring"
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(0, 1);
            setAt(i, d);
            if (d && i < length - 1) focusIndex(i + 1);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              if (chars[i]) {
                setAt(i, "");
              } else if (i > 0) {
                focusIndex(i - 1);
                setAt(i - 1, "");
              }
            }
            if (e.key === "ArrowLeft" && i > 0) focusIndex(i - 1);
            if (e.key === "ArrowRight" && i < length - 1) focusIndex(i + 1);
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            onChange(pasted);
            const nextFocus = Math.min(pasted.length, length - 1);
            setTimeout(() => focusIndex(nextFocus), 0);
          }}
        />
      ))}
    </div>
  );
}
