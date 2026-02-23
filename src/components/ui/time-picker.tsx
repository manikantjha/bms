"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value: string; // HH:mm format
  onChange: (time: string) => void;
  placeholder?: string;
  interval?: number; // minutes interval, e.g. 30
  startTime?: string; // HH:mm (e.g. 09:00)
  endTime?: string; // HH:mm (e.g. 20:00)
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Select Time",
  interval = 30,
  startTime = "09:00",
  endTime = "21:00",
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const timeSlots = useMemo(() => {
    const slots = [];
    let [startH, startM] = startTime.split(":").map(Number);
    let [endH, endM] = endTime.split(":").map(Number);

    // Safety check fallback
    if (isNaN(startH)) startH = 9;
    if (isNaN(startM)) startM = 0;
    if (isNaN(endH)) endH = 21;
    if (isNaN(endM)) endM = 0;

    let currentH = startH;
    let currentM = startM;

    while (currentH < endH || (currentH === endH && currentM <= endM)) {
      const timeString = `${String(currentH).padStart(2, "0")}:${String(currentM).padStart(2, "0")}`;
      slots.push(timeString);

      currentM += interval;
      if (currentM >= 60) {
        currentH += Math.floor(currentM / 60);
        currentM = currentM % 60;
      }
    }
    return slots;
  }, [startTime, endTime, interval]);

  const displayFormat = (timeStr: string) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return timeStr;
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
      >
        <span className={value ? "" : "text-text-muted/50"}>
          {displayFormat(value) || placeholder}
        </span>
        <Clock size={18} className="text-text-muted" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-2xl shadow-xl z-50 w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto py-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  onChange(slot);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                  ${
                    value === slot
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-text hover:bg-border/50"
                  }
                `}
              >
                {displayFormat(slot)}
                {value === slot && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
