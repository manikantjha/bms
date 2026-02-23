"use client";

import React from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  id?: string;
}

export function Checkbox({ checked, onChange, label, id }: CheckboxProps) {
  return (
    <label
      className="flex items-center gap-3 cursor-pointer group select-none"
      htmlFor={id}
    >
      <div
        className={`w-5 h-5 flex flex-shrink-0 items-center justify-center rounded transition-colors border focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-1 focus-within:ring-offset-background ${
          checked
            ? "bg-primary border-primary text-white"
            : "border-border bg-background group-hover:border-primary/50"
        }`}
      >
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        {checked && (
          <Check
            size={14}
            strokeWidth={3}
            className="animate-in zoom-in-50 duration-200"
          />
        )}
      </div>
      {label && (
        <span className="text-sm text-text-muted group-hover:text-text transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}
