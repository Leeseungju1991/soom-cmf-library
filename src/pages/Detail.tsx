import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swatch from "../components/Swatch";
import { getItem, updateItem } from "../lib/firestore";
import type { CmfItem, CmfStatus } from "../lib/types";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<CmfItem | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async ()=>{
      if (!id) return;
      const d = await getItem(id);
      setItem(d);
    })();
  }, [id]);

  if (!item) return <div className="text-muted">로딩 중…</div>;

  const set = (k: keyof CmfItem, v: any) => setItem({ ...item, [k]: v });

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="text-2xl font-semibold">상세보기</div>
        <button className="ml-auto text-sm text-muted" onClick={()=>navigate(-1)}>뒤로</button>
      </div>

      <div className="bg-white shadow-card rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-xs text-muted mb-2">스와치</div>
          <Swatch url={item.swatchUrl} />
          <div className="text-xs text-muted mt-2">* 스와치 업로드/교체는 “CMF 추가하기”에서 가능합니다(간단 버전).</div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="상태" value={item.status ?? ""} onChange={(v)=>set("status", v as CmfStatus)} asSelect options={["사용중","검토중","단종","보류"]} />
          <Field label="최근 사용 프로젝트" value={item.recentProject ?? ""} onChange={(v)=>set("recentProject", v)} />
          <Field label="내부 활용도 평가" value={item.usageScore ?? ""} onChange={(v)=>set("usageScore", v)} />
          <Field label="샘플 위치 (실물 보관 위치)" value={item.sampleLocation ?? ""} onChange={(v)=>set("sampleLocation", v)} />
        </div>
      </div>

      <div className="bg-white shadow-card rounded-xl p-5">
        <div className="font-semibold mb-3">기본 정보</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Info k="무게" v={item.무게} />
          <Info k="종류" v={item.종류} />
          <Info k="업체명" v={item.업체명} />
          <Info k="No." v={item.No} />
          <Info k="comp" v={item.comp} />
          <Info k="width" v={item.width} />
          <Info k="mount" v={item.mount} />
          <Info k="cost" v={item.cost} />
          <Info k="color" v={item.color} />
          <Info k="조직" v={item.조직} />
          <Info k="전화번호" v={item.전화번호} />
          <Info k="장소" v={item.장소} />
          <Info k="아카이빙" v={item.아카이빙} />
        </div>

        <div className="mt-6">
          <button
            className="bg-accent text-white rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
            disabled={saving}
            onClick={async ()=>{
              if (!id) return;
              setSaving(true);
              try {
                await updateItem(id, {
                  status: item.status,
                  recentProject: item.recentProject,
                  usageScore: item.usageScore,
                  sampleLocation: item.sampleLocation,
                });
                alert("저장되었습니다.");
              } finally { setSaving(false); }
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

function Field(props: { label: string; value: string; onChange: (v:string)=>void; asSelect?: boolean; options?: string[] }) {
  return (
    <label className="block">
      <div className="text-xs text-muted mb-1">{props.label}</div>
      {props.asSelect ? (
        <select className="w-full border rounded-lg px-3 py-2" value={props.value} onChange={(e)=>props.onChange(e.target.value)}>
          <option value="">선택</option>
          {props.options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input className="w-full border rounded-lg px-3 py-2" value={props.value} onChange={(e)=>props.onChange(e.target.value)} />
      )}
    </label>
  );
}

function Info({k, v}:{k:string; v?:string}) {
  return (
    <div className="border rounded-lg p-3">
      <div className="text-xs text-muted">{k}</div>
      <div className="mt-1">{v ?? "-"}</div>
    </div>
  );
}
