"use client";

import * as React from "react";
import { Control, FieldValues, Path, Controller } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string; // style for trigger button
  disabled?: boolean;
  error?: string;
};

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select an option",
  options,
  className,
  disabled,
  error,
}: FormSelectProps<T>) {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </label>
      ) : null}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const current = options.find((o) => o.value === String(field.value));
          const text = current?.label ?? placeholder;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={disabled}>
                <Button
                  type="button"
                  variant="outline"
                  className={
                    className ??
                    "h-14 w-full justify-between rounded-lg px-3 text-sm"
                  }
                  disabled={disabled}
                >
                  <span className={current ? "text-gray-900" : "text-gray-500"}>
                    {text}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)]"
              >
                {options.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    disabled={opt.disabled}
                    onSelect={() => {
                      field.onChange(opt.value);
                    }}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }}
      />

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
