import { Search, X } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "Search...", label = "Search", className = "" }) => (
  <div className={`relative ${className}`}>
    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
    <input
      type="search"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-9 text-sm text-text placeholder:text-muted/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 [&::-webkit-search-cancel-button]:hidden"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        aria-label="Clear search"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-text"
      >
        <X size={14} />
      </button>
    )}
  </div>
);

export default SearchInput;
