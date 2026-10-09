import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const PageHeader = ({ title, description, breadcrumbs, actions }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      {breadcrumbs && (
        <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1 text-xs text-muted">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={12} />}
              {crumb.to ? (
                <Link to={crumb.to} className="transition-colors hover:text-text">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="truncate text-text">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="truncate text-2xl font-semibold tracking-tight text-text">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
