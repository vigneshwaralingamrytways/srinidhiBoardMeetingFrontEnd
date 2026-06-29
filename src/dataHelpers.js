

/** Number of days in a given month (month is 0-based). */
export const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

/** 0-based weekday index of the 1st of the month. */
export const getFirstDayOfMonth = (year, month) =>
  new Date(year, month, 1).getDay();

/** Zero-pad a number to 2 digits. */
export const pad = (n) => String(n).padStart(2, "0");

/**
 * Format year / 0-based month / day to "YYYY-MM-DD".
 * @example fmtDate(2026, 5, 9) ? "2026-06-09"
 */
export const fmtDate = (year, month, day) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

/**
 * Parse a "YYYY-MM-DD" string and return { y, m, d }
 * where m is 0-based (mirrors JS Date.getMonth()).
 */
export const parseDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return { y, m: m - 1, d };
};

/** True if the given Date object falls today. */
export const isToday = (year, month, day) => {
  const now = new Date();
  return (
    now.getFullYear() === year &&
    now.getMonth()    === month &&
    now.getDate()     === day
  );
};

/** True if a "YYYY-MM-DD" date string is in the future (= today). */
export const isFuture = (dateStr) =>
  new Date(dateStr) >= new Date(new Date().toDateString());
