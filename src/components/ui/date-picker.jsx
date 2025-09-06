import React, { useEffect, useRef, useState } from "react";

const toYmd = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseYmd = (value) => {
  if (!value) return new Date();
  const [y, m, d] = value.split("-").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d);
};

const monthLabel = (date) =>
  date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const buildMonthDays = (date) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  // Make Monday the first day (0..6 with Monday=0)
  const wkStart = (first.getDay() + 6) % 7;
  const days = [];
  for (let i = 0; i < wkStart; i += 1) days.push(null);
  for (let d = 1; d <= last.getDate(); d += 1) days.push(d);
  return days;
};

const DatePicker = ({ value, onChange, className = "" }) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseYmd(value));
  const ref = useRef(null);

  useEffect(() => {
    setViewDate(parseYmd(value));
  }, [value]);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", onDoc);
      document.addEventListener("touchstart", onDoc, { passive: true });
    }
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, [open]);

  const days = buildMonthDays(viewDate);
  const selectedDateObj = parseYmd(value);
  const isSameDay = (d) =>
    d &&
    selectedDateObj.getFullYear() === viewDate.getFullYear() &&
    selectedDateObj.getMonth() === viewDate.getMonth() &&
    selectedDateObj.getDate() === d;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-10 px-3 inline-flex items-center rounded-md border bg-white text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2EA9B0]"
      >
        {parseYmd(value).toLocaleDateString("pt-BR")}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-2 text-[#2EA9B0]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg border bg-white shadow-lg p-3 z-50">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
                )
              }
            >
              <span className="sr-only">Prev</span>‹
            </button>
            <div className="text-sm font-semibold capitalize">
              {monthLabel(viewDate)}
            </div>
            <button
              type="button"
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
                )
              }
            >
              <span className="sr-only">Next</span>›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
            {weekdays.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((d, idx) => (
              <button
                key={idx}
                type="button"
                disabled={!d}
                onClick={() => {
                  if (!d) return;
                  const newDate = new Date(
                    viewDate.getFullYear(),
                    viewDate.getMonth(),
                    d
                  );
                  onChange(toYmd(newDate));
                  setOpen(false);
                }}
                className={`h-9 w-9 mx-auto rounded-full text-sm ${
                  d
                    ? isSameDay(d)
                      ? "bg-[#2EA9B0] text-white"
                      : "text-gray-700"
                    : "opacity-0 cursor-default"
                }`}
              >
                {d || ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
