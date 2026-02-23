"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string; // YYYY-MM-DD
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  minDate,
  placeholder = "Select Date",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  });

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

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const formatDateStr = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const isMinDateExceeded = (y: number, m: number, d: number) => {
    if (!minDate) return false;
    const dateStr = formatDateStr(y, m, d);
    return dateStr < minDate;
  };

  const isSelected = (d: number) => {
    if (!value || d === null) return false;
    return formatDateStr(year, month, d) === value;
  };

  const handleSelectDate = (d: number) => {
    if (d === null) return;
    if (isMinDateExceeded(year, month, d)) return;
    onChange(formatDateStr(year, month, d));
    setIsOpen(false);
  };

  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
      >
        <span className={displayValue ? "" : "text-text-muted/50"}>
          {displayValue || placeholder}
        </span>
        <CalendarIcon size={18} className="text-text-muted" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-surface border border-border rounded-2xl shadow-xl z-50 w-[280px] sm:w-[320px] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-full hover:bg-border/50 text-text-muted hover:text-text transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-heading font-semibold text-text">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-full hover:bg-border/50 text-text-muted hover:text-text transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-text-muted py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (d === null) {
                return <div key={`empty-${i}`} className="h-8" />;
              }
              const disabled = isMinDateExceeded(year, month, d);
              const selected = isSelected(d);

              const isToday =
                formatDateStr(year, month, d) ===
                formatDateStr(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  new Date().getDate(),
                );

              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDate(d)}
                  className={`
                    h-8 rounded-full flex items-center justify-center text-sm transition-all
                    ${disabled ? "opacity-30 cursor-not-allowed text-text-muted" : "hover:bg-primary/10 hover:text-primary cursor-pointer text-text"}
                    ${selected ? "bg-primary text-white hover:bg-primary hover:text-white font-semibold shadow-md" : ""}
                    ${!selected && isToday ? "border border-primary/30 text-primary font-medium" : ""}
                  `}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
