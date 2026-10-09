const colors = ["bg-indigo-500", "bg-violet-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];

// initials with a stable color per name
const Avatar = ({ name = "?", size = "md" }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  const color = colors[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % colors.length];
  const sizeClass = size === "sm" ? "h-7 w-7 text-[11px]" : size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-xs";

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${color} ${sizeClass}`}
    >
      {initials || "?"}
    </span>
  );
};

export default Avatar;
