import { useState } from "react";
import { addItem } from "../lib/firestore";
import type { CmfItem } from "../lib/types";

export default function AddPage() {
  const [data, setData] = useState<Omit<CmfItem, "id">>({
    무게: "",
    종류: "",
    업체명: "",
    No: "",
    comp: "",
    width: "",
    mount: "",
    cost: "",
    color: "",
    조직: "",
    전화번호: "",
    장소: "",
    아카이빙: "",
  });
  const [file, setFile] = useState<File | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof data, v: any) => setData({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold">CMF 추가하기</div>

      <div className="bg-white shadow-card rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FIELDS.map(f => (
            <label key={f.k} className="block">
              <div className="text-xs text-muted mb-1">{f.label}</div>
              <input className="w-full border rounded-lg px-3 py-2" value={(data as any)[f.k] ?? ""} onChange={(e)=>set(f.k as any, e.target.value)} />
            </label>
          ))}
          <label className="block">
            <div className="text-xs text-muted mb-1">스와치</div>
            <input className="w-full" type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0])} />
            <div className="text-xs text-muted mt-1">* 업로드하면 Firebase Storage에 저장됩니다.</div>
          </label>
        </div>

        <div className="mt-6">
          <button
            className="bg-accent text-white rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
            disabled={saving}
            onClick={async ()=>{
              setSaving(true);
              try{
                await addItem(data, file);
                alert("저장되었습니다.");
                setData({
                  무게: "", 종류: "", 업체명: "", No: "", comp: "", width: "", mount: "", cost: "",
                  color: "", 조직: "", 전화번호: "", 장소: "", 아카이빙: ""
                });
                setFile(undefined);
              } finally { setSaving(false); }
            }}
          >
            확인(저장)
          </button>
        </div>
      </div>
    </div>
  );
}

const FIELDS = [
  { k: "무게", label: "무게" },
  { k: "종류", label: "종류" },
  { k: "업체명", label: "업체명" },
  { k: "No", label: "No." },
  { k: "comp", label: "comp" },
  { k: "width", label: "width" },
  { k: "mount", label: "mount" },
  { k: "cost", label: "cost" },
  { k: "color", label: "color" },
  { k: "조직", label: "조직" },
  { k: "전화번호", label: "전화번호" },
  { k: "장소", label: "장소" },
  { k: "아카이빙", label: "아카이빙" },
] as const;
