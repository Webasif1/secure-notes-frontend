const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

// "2 hours ago", "yesterday", or a date for older notes
export function timeAgo(date) {
  const seconds = (new Date(date) - Date.now()) / 1000;
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      if (unit === "year" || unit === "month") return formatDate(date);
      return rtf.format(Math.round(seconds / size), unit);
    }
  }
  return "just now";
}

export function formatDate(date, withTime = false) {
  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime && { hour: "numeric", minute: "2-digit" }),
  });
}

export const isEdited = (note) => new Date(note.updatedAt) - new Date(note.createdAt) > 1000;

export function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
