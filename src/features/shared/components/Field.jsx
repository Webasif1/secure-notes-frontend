import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const inputClass =
  "w-full rounded-lg border bg-surface px-3 text-sm text-text placeholder:text-muted/70 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

// label + input + error message, all linked for screen readers
export const Field = ({ label, error, hint, as = "input", className = "", children, ...props }) => {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const Tag = as;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text">
          {label}
        </label>
      )}
      {children ? (
        children({ id, describedBy, invalid: Boolean(error) })
      ) : (
        <Tag
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${inputClass} ${as === "textarea" ? "py-2.5" : "h-10"} ${
            error ? "border-danger" : "border-border"
          }`}
          {...props}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export const PasswordField = ({ label = "Password", error, hint, ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <Field label={label} error={error} hint={hint}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <input
            id={id}
            type={show ? "text" : "password"}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={`${inputClass} h-10 pr-10 ${invalid ? "border-danger" : "border-border"}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted transition-colors hover:text-text"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      )}
    </Field>
  );
};

export const selectClass = `${inputClass} h-10 border-border`;
