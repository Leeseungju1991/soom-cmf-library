import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swatch from "../components/Swatch";
import { searchItems, softDelete } from "../lib/firestore";
import type { CmfItem } from "../lib/types";

export default function SearchPage() {
  const [color, setColor] = useState("");
  const [kind, setKind] = useState("");
  const [width, setWidth] = useState("");
  const [items, setItems] = useState<CmfItem[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedIds = useMemo(() => Object.keys(selected).filter(k => selected[k]), [selected]);

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">검색/필터</div>

      <div className="bg-white shadow-card rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <div className="text-xs text-muted mb-1">color</div>
            <input className="w-full border rounded-lg px-3 py-2" value={color} onChange={(e)=>setColor(e.target.value)} placeholder="예: BK" />
          </div>
          <div>
            <div className="text-xs text-muted mb-1">종류</div>
            <input className="w-full border rounded-lg px-3 py-2" value={kind} onChange={(e)=>setKind(e.target.value)} placeholder="예: WOOL" />
          </div>
          <div>
            <div className="text-xs text-muted mb-1">width</div>
            <input className="w-full border rounded-lg px-3 py-2" value={width} onChange={(e)=>setWidth(e.target.value)} placeholder="예: 150cm" />
          </div>
          <div className="flex items-end">
            <button
              className="w-full bg-accent text-white rounded-lg py-2 font-semibold disabled:opacity-50"
              disabled={loading}
              onClick={async ()=>{
                setLoading(true);
                try {
                  const res = await searchItems({ color: color.trim() || undefined, 종류: kind.trim() || undefined, width: width.trim() || undefined });
                  setItems(res);
                  setSelected({});
                } finally {
                  setLoading(false);
                }
              }}
            >
              검색
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className="px-3 py-2 rounded-lg border text-sm disabled:opacity-50"
            disabled={selectedIds.length < 2 || selectedIds.length > 4}
            onClick={() => navigate(`/compare?ids=${selectedIds.join(",")}`)}
          >
            비교 (2~4개)
          </button>
          <div className="text-xs text-muted self-center">선택됨: {selectedIds.length}</div>
        </div>
      </div>

      <div className="bg-white shadow-card rounded-xl p-5 overflow-auto">
        <div className="font-semibold mb-3">검색 결과 ({items.length})</div>

        <table className="min-w-[1200px] w-full text-sm">
          <thead className="text-xs text-muted border-b">
            <tr>
              <th className="py-2 text-left">선택</th>
              <th className="py-2 text-left">스와치</th>
              <th className="py-2 text-left">무게</th>
              <th className="py-2 text-left">종류</th>
              <th className="py-2 text-left">업체명</th>
              <th className="py-2 text-left">No.</th>
              <th className="py-2 text-left">comp</th>
              <th className="py-2 text-left">width</th>
              <th className="py-2 text-left">mount</th>
              <th className="py-2 text-left">cost</th>
              <th className="py-2 text-left">color</th>
              <th className="py-2 text-left">조직</th>
              <th className="py-2 text-left">전화번호</th>
              <th className="py-2 text-left">장소</th>
              <th className="py-2 text-left">아카이빙</th>
              <th className="py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-b hover:bg-gray-50">
                <td className="py-2">
                  <input
                    type="checkbox"
                    checked={!!selected[it.id]}
                    onChange={(e)=>{
                      const next = { ...selected, [it.id]: e.target.checked };
                      // 4개 초과 선택 방지
                      const ids = Object.keys(next).filter(k=>next[k]);
                      if (ids.length > 4) return;
                      setSelected(next);
                    }}
                  />
                </td>
                <td className="py-2"><Swatch url={it.swatchUrl} /></td>
                <td className="py-2">{it.무게 ?? ""}</td>
                <td className="py-2">{it.종류 ?? ""}</td>
                <td className="py-2">{it.업체명 ?? ""}</td>
                <td className="py-2">{it.No ?? ""}</td>
                <td className="py-2">{it.comp ?? ""}</td>
                <td className="py-2">{it.width ?? ""}</td>
                <td className="py-2">{it.mount ?? ""}</td>
                <td className="py-2">{it.cost ?? ""}</td>
                <td className="py-2">{it.color ?? ""}</td>
                <td className="py-2">{it.조직 ?? ""}</td>
                <td className="py-2">{it.전화번호 ?? ""}</td>
                <td className="py-2">{it.장소 ?? ""}</td>
                <td className="py-2">{it.아카이빙 ?? ""}</td>
                <td className="py-2 text-right space-x-2">
                  <button className="text-accent font-semibold" onClick={()=>navigate(`/detail/${it.id}`)}>상세</button>
                  <button className="text-sm text-muted hover:text-black" onClick={async ()=>{ if(confirm("삭제 후 휴지통으로 이동합니다. 계속할까요?")){ await softDelete(it.id); setItems(items.filter(x=>x.id!==it.id)); }}}>삭제</button>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr><td className="py-6 text-center text-muted" colSpan={16}>검색 조건을 입력하고 검색 버튼을 눌러주세요.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
