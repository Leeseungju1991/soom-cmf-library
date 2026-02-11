import { useState } from "react";

export default function Swatch({ url }: { url?: string }) {
  const [open, setOpen] = useState(false);
  if (!url) return <div className="w-10 h-10 rounded-md bg-gray-200" title="no swatch" />;
  return (
    <>
      <button onClick={() => setOpen(true)} className="w-10 h-10 rounded-md overflow-hidden border">
        <img src={url} alt="swatch" className="w-full h-full object-cover" />
      </button>

      {open ? (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl max-w-3xl w-full p-4" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center">
              <div className="font-semibold">스와치 확대보기</div>
              <button className="ml-auto text-sm text-muted" onClick={()=>setOpen(false)}>닫기</button>
            </div>
            <div className="mt-4">
              <img src={url} alt="swatch large" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
