import { LayoutGrid, List } from "lucide-react";

const options = [
  { value: "grid", icon: LayoutGrid, label: "Grid view" },
  { value: "list", icon: List, label: "List view" },
];

const ViewToggle = ({ view, onChange }) => (
  <div role="radiogroup" aria-label="Layout" className="flex rounded-lg border border-border bg-surface p-0.5">
    {options.map(({ value, icon: Icon, label }) => (
      <button
        key={value}
        role="radio"
        aria-checked={view === value}
        aria-label={label}
        title={label}
        onClick={() => onChange(value)}
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150 ${
          view === value ? "bg-primary-soft text-primary" : "text-muted hover:text-text"
        }`}
      >
        <Icon size={16} />
      </button>
    ))}
  </div>
);

export default ViewToggle;
