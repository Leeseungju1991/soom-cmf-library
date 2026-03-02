import fixedSwatch from "../assets/fixed-swatch.png";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function Swatch() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={fixedSwatch}
        alt="swatch"
        className="w-10 h-10 rounded-xl border border-white/60 object-cover cursor-zoom-in hover:scale-105 transition shadow-card"
        onClick={() => setOpen(true)}
      />
      {open &&
        (typeof document !== "undefined"
          ? createPortal(
              <div
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
                onClick={() => setOpen(false)}
              >
                <div
                  className="glass-card max-w-[90vw] max-h-[90vh] p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* ✅ 닫기(X) 버튼을 오른쪽으로 */}
                  <div className="flex justify-end items-center mb-3">
                    <button
                      className="px-2 py-1 rounded-lg hover:bg-white/70"
                      onClick={() => setOpen(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <img
                    src={fixedSwatch}
                    alt="swatch large"
                    className="max-w-[80vw] max-h-[80vh] object-contain rounded-2xl"
                  />
                </div>
              </div>,
              document.body
            )
          : null)}
    </>
  );
}
