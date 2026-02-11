import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swatch from "../components/Swatch";
import { getItem } from "../lib/firestore";
import type { CmfItem } from "../lib/types";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ComparePage() {
  const q = useQuery();
  const navigate = useNavigate();
  const ids = (q.get("ids") ?? "").split(",").filter(Boolean).slice(0,4);
  const [items, setItems] = useState<CmfItem[]>([]);

  useEffect(() => {
    (async ()=>{
      const res: CmfItem[] = [];
      for (const id of ids) {
        const it = await getItem(id);
        if (it) res.push(it);
      }
      setItems(res);
    })();
  }, [q.toString()]);

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="text-2xl font-semibold">비교</div>
        <button className="ml-auto text-sm text-muted" onClick={()=>navigate(-1)}>뒤로</button>
      </div>

      <div className="bg-white shadow-card rounded-xl p-5 overflow-auto">
        <div className="font-semibold mb-3">선택 항목 ({items.length})</div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {items.map(it => (
            <div key={it.id} className="border rounded-xl p-4">
              <div className="text-xs text-muted">컬러</div>
              <div className="mt-2"><Swatch url={it.swatchUrl} /></div>
              <div className="mt-3 text-sm font-semibold">{it.No ?? it.id}</div>
              <div className="text-xs text-muted">{it.업체명 ?? ""}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <CompareRow label="cost" items={items.map(i=>i.cost)} />
          <CompareRow label="width" items={items.map(i=>i.width)} />
          <CompareRow label="mount" items={items.map(i=>i.mount)} />
        </div>
      </div>
    </div>
  );
}

function CompareRow({label, items}:{label:string; items:(string|undefined)[]}) {
  return (
    <div className="border rounded-xl p-4">
      <div className="text-sm font-semibold">{label} 비교</div>
      <div className="mt-2 space-y-2 text-sm">
        {items.map((v, idx)=>(
          <div key={idx} className="flex">
            <div className="w-8 text-muted">#{idx+1}</div>
            <div>{v ?? "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
