import React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white ${props.className || ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white appearance-none cursor-pointer ${props.className || ""}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
      />
    </div>
  );
}

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }
) {
  const { variant = "primary", className = "", ...rest } = props;
  const styles = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  }[variant];
  return (
    <button
      {...rest}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${styles} ${className}`}
    />
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-lg shadow-sm border p-4">{children}</div>;
}

export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full text-sm border-collapse">{children}</table>;
}

export function Th(
  props: React.ThHTMLAttributes<HTMLTableCellElement>
) {
  const { className = "", children, ...rest } = props;
  return (
    <th {...rest} className={`text-left px-3 py-2 bg-gray-50 border ${className}`}>{children}</th>
  );
}

export function Td(
  props: React.TdHTMLAttributes<HTMLTableCellElement>
) {
  const { className = "", children, ...rest } = props;
  return (
    <td {...rest} className={`px-3 py-2 border ${className}`}>{children}</td>
  );
}

export function Alert({ type = "error", children }: { type?: "error" | "success" | "info"; children: React.ReactNode }) {
  const colors = {
    error: "bg-red-50 text-red-800 border-red-200",
    success: "bg-green-50 text-green-800 border-green-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  }[type];
  return <div className={`border rounded-md px-3 py-2 text-sm ${colors}`}>{children}</div>;
}

export function Badge({ children, color = "gray" }: { children: React.ReactNode; color?: "gray" | "green" | "yellow" | "red" | "blue" }) {
  const map: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[color]}`}>{children}</span>;
}

export function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" aria-label="loading" />
  );
}

export function EmptyState({ title = "Nothing here", subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="text-center py-10 text-sm text-gray-600">
      <div className="text-base font-medium text-gray-800 mb-1">{title}</div>
      {subtitle && <div>{subtitle}</div>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, onConfirm, confirmText = "Confirm", confirmVariant = "danger", confirmLoading = false }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  confirmVariant?: "primary" | "secondary" | "danger";
  confirmLoading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-grey bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          <div className="text-sm text-gray-600 mb-6">{children}</div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose} disabled={confirmLoading} className={confirmLoading ? "cursor-not-allowed opacity-70" : ""}>
              Cancel
            </Button>
            {onConfirm && (
              <Button
                variant={confirmVariant}
                onClick={onConfirm}
                disabled={confirmLoading}
                className={confirmLoading ? "opacity-80" : ""}
              >
                {confirmLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {confirmText === "Archive" ? "Archiving..." : "Working..."}
                    </span>
                  </span>
                ) : (
                  confirmText
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


