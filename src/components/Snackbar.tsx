import { useEffect } from "react";

export default function Snackbar(props: {
  open: boolean;
  message: string;
  onClose: () => void;
  durationMs?: number;
}) {
  const { open, message, onClose, durationMs = 2200 } = props;

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      onClose();
    }, durationMs);
    return () => window.clearTimeout(t);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return (
    <div className="fixed left-0 right-0 bottom-4 z-[9999] px-4">
      <div
        className="mx-auto max-w-md rounded-2xl bg-slate-900/90 text-white px-4 py-3 shadow-lg backdrop-blur flex items-center justify-between gap-3"
        role="status"
        aria-live="polite"
      >
        <div className="text-sm leading-snug break-words">{message}</div>
        <button
          type="button"
          className="text-xs opacity-80 hover:opacity-100 whitespace-nowrap"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
