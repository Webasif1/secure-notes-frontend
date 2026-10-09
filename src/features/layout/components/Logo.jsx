import { NotebookPen } from "lucide-react";

const Logo = ({ collapsed = false, className = "" }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/30">
      <NotebookPen size={16} />
    </span>
    {!collapsed && <span className="text-[15px] font-semibold tracking-tight text-text">SecureNotes</span>}
  </div>
);

export default Logo;
