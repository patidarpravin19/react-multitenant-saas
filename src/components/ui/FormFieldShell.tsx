import type { PropsWithChildren } from "react";

interface FormFieldShellProps extends PropsWithChildren {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export function FormFieldShell({
  id,
  label,
  description,
  error,
  required,
  children,
}: FormFieldShellProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-800 dark:text-slate-200"
      >
        {label}
        {required ? (
          <span className="ml-1 text-red-600" aria-hidden>
            *
          </span>
        ) : null}
      </label>

      {children}

      {description ? (
        <p
          id={descriptionId}
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          {description}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm font-medium text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
