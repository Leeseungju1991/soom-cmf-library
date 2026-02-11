import { useEffect, useState } from "react";
import { listTrash, restoreFromTrash } from "../lib/firestore";
import type { CmfItem } from "../lib/types";

export default function TrashPage() {
  const [items, setItems] = useState<CmfItem[]>([]);

  useEffect(() => {
    (async ()=> setItems(await listTrash()))();
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">휴지통</div>

      <div className="bg-white shadow-card rounded-xl p-5 overflow-auto">
        <div className="font-semibold mb-3">삭제된 항목 ({items.length})</div>
        <table className="min-w-[900px] w-full text-sm">
          <thead className="text-xs text-muted border-b">
            <tr>
              <th className="py-2 text-left">No.</th>
              <th className="py-2 text-left">업체명</th>
              <th className="py-2 text-left">종류</th>
              <th className="py-2 text-left">color</th>
              <th className="py-2 text-left">삭제일</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{it.No ?? ""}</td>
                <td className="py-2">{it.업체명 ?? ""}</td>
                <td className="py-2">{it.종류 ?? ""}</td>
                <td className="py-2">{it.color ?? ""}</td>
                <td className="py-2">{it.deletedAt ? new Date(it.deletedAt).toLocaleString("ko-KR") : "-"}</td>
                <td className="py-2 text-right">
                  <button
                    className="text-accent font-semibold"
                    onClick={async ()=>{
                      await restoreFromTrash(it.id);
                      setItems(items.filter(x=>x.id!==it.id));
                    }}
                  >
                    복구
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr><td className="py-6 text-center text-muted" colSpan={6}>휴지통이 비어 있습니다.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
