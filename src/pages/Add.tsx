import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import fixedSwatch from "../assets/fixed-swatch.png";
import Snackbar from "../components/Snackbar";
import { addItem, updateItem } from "../lib/firestore"; // ✅ addItem 필요
import { uploadOutfitPhoto } from "../lib/storage";
import type { OutfitPhoto } from "../lib/types";

type SectionKey = "detailInfo" | "outfitPhotos";

type DetailInfo = {
  사용여부: "" | "사용중" | "미사용";
  사용중프로젝트: "" | "THE GEM" | "IDEALIAN" | "NEORm" | "ICONIA";
  캐릭터: "" | "남아" | "여아";
};

type FormState = {
  무게: string;
  업체명: string;
  No: string;
  comp: string;
  width: string;
  mount: string;
  cost: string;
  color: string;
  전화번호: string;
  장소: string;
  조직: string;
  아카이빙: string;

  상세정보: DetailInfo;
  제작된의상사진: OutfitPhoto[]; // 저장된(서버) 사진 목록 (저장 후 채워짐)
};

const EMPTY_DETAIL: DetailInfo = { 사용여부: "", 사용중프로젝트: "", 캐릭터: "" };

export default function AddPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    무게: "",
    업체명: "",
    No: "",
    comp: "",
    width: "",
    mount: "",
    cost: "",
    color: "",
    전화번호: "",
    장소: "",
    조직: "",
    아카이빙: "",
    상세정보: { ...EMPTY_DETAIL },
    제작된의상사진: [],
  });

  // ✅ 누른 순서대로 섹션 스택
  const [sections, setSections] = useState<SectionKey[]>([]);

  // ✅ 의상사진: 선택(로컬) → 저장 시 업로드+DB반영
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [saving, setSaving] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  // pending preview URL 정리
  useEffect(() => {
    return () => {
      pendingPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ✅ 섹션 추가(이미 열려있으면 맨 아래로 이동)
  function addSection(key: SectionKey) {
    setSections((prev) => {
      const next = prev.filter((x) => x !== key);
      return [...next, key];
    });
  }

  function removeSection(key: SectionKey) {
    setSections((prev) => prev.filter((x) => x !== key));

    if (key === "detailInfo") {
      setForm((prev) => ({ ...prev, 상세정보: { ...EMPTY_DETAIL } }));
    }

    if (key === "outfitPhotos") {
      pendingPreviews.forEach((u) => URL.revokeObjectURL(u));
      setPendingFiles([]);
      setPendingPreviews([]);
    }
  }

  function onPickFiles(files: FileList) {
    const list = Array.from(files);
    if (list.length === 0) return;

    const previews = list.map((f) => URL.createObjectURL(f));
    setPendingFiles((prev) => [...prev, ...list]);
    setPendingPreviews((prev) => [...prev, ...previews]);

    // ✅ 사진을 선택했으면 섹션 펼치기
    addSection("outfitPhotos");
  }

  function removePending(idx: number) {
    setPendingFiles((prev) => {
      const next = prev.slice();
      next.splice(idx, 1);
      return next;
    });
    setPendingPreviews((prev) => {
      const next = prev.slice();
      const removed = next[idx];
      if (removed) URL.revokeObjectURL(removed);
      next.splice(idx, 1);
      return next;
    });
  }

  // 저장된 사진 목록에서 제거(저장 후 의미)
  function removeSavedPhoto(idx: number) {
    const next = (form.제작된의상사진 ?? []).slice();
    next.splice(idx, 1);
    setField("제작된의상사진", next);
  }

  // ✅ 저장: 서버 저장 + (있으면) 사진 업로드 후 outfitPhotos 반영
  async function onSaveAll() {
    if (saving) return;
    setSaving(true);

    try {
      // 1) 문서 생성
      const createdId = await addItem({
        무게: form.무게,
        업체명: form.업체명,
        No: form.No,
        comp: form.comp,
        width: form.width,
        mount: form.mount,
        cost: form.cost,
        color: form.color,
        전화번호: form.전화번호,
        장소: form.장소,
        조직: form.조직,
        아카이빙: form.아카이빙,
        detailInfo: form.상세정보,
        outfitPhotos: [],
      } as any);

      if (!createdId) throw new Error("저장 실패: 생성된 ID를 받을 수 없습니다. addItem 반환값 확인 필요");

      // 2) 사진 업로드 + 업데이트
      let savedPhotos: OutfitPhoto[] = [];
      if (pendingFiles.length > 0) {
        const uploaded = await Promise.all(
          pendingFiles.map((file) => uploadOutfitPhoto({ itemId: createdId, file }))
        );
        savedPhotos = uploaded;
        await updateItem(createdId, { outfitPhotos: savedPhotos } as any);
      }

      setSnackMsg("저장되었습니다.");
      setSnackOpen(true);

      // 3) 상세로 이동
      navigate(`/detail/${createdId}`);
    } catch (e: any) {
      setSnackMsg(e?.message || "저장 중 오류가 발생했습니다.");
      setSnackOpen(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ✅ 상단 기본 정보 박스 */}
      <div className="glass-card p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* 좌측 */}
          <div className="w-full">
            <div className="rounded-2xl overflow-hidden bg-white/40">
              <div className="aspect-[4/5] w-full">
                <img src={fixedSwatch} alt="swatch" className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                className="action-pill action-pill-outline w-1/2"
                onClick={() => addSection("detailInfo")}
              >
                + 상세정보 추가
              </button>

              <button
                type="button"
                className="action-pill action-pill-outline w-1/2"
                onClick={() => addSection("outfitPhotos")}
              >
                + 의상 사진 추가
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) onPickFiles(e.target.files);
                e.currentTarget.value = "";
              }}
            />
          </div>

          {/* 우측 */}
          <div>
            <div className="text-lg font-semibold mb-4">기본 정보</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="무게" value={form.무게} onChange={(v) => setField("무게", v)} />
              <Field label="업체명" value={form.업체명} onChange={(v) => setField("업체명", v)} />
              <Field label="No." value={form.No} onChange={(v) => setField("No", v)} />

              <Field label="comp" value={form.comp} onChange={(v) => setField("comp", v)} />
              <Field label="width" value={form.width} onChange={(v) => setField("width", v)} />
              <Field label="mount" value={form.mount} onChange={(v) => setField("mount", v)} />

              <Field label="cost" value={form.cost} onChange={(v) => setField("cost", v)} />
              <Field label="color" value={form.color} onChange={(v) => setField("color", v)} />
              <Field label="조직" value={form.조직} onChange={(v) => setField("조직", v)} />

              <Field label="전화번호" value={form.전화번호} onChange={(v) => setField("전화번호", v)} />
              <Field label="장소" value={form.장소} onChange={(v) => setField("장소", v)} />
              <Field label="아카이빙" value={form.아카이빙} onChange={(v) => setField("아카이빙", v)} />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 추가 섹션들: 누르면 아래로 생기고 저장/취소도 같이 밀림 */}
      {sections.map((key) => {
        if (key === "detailInfo") {
          return (
            <div key="detailInfo" className="glass-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold">상세정보</div>
                <button type="button" className="btn-outline text-sm" onClick={() => removeSection("detailInfo")}>
                  삭제
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block">
                  <div className="text-xs text-muted mb-1">사용 여부</div>
                  <select
                    className="select"
                    value={form.상세정보.사용여부}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        상세정보: { ...prev.상세정보, 사용여부: e.target.value as any },
                      }))
                    }
                  >
                    <option value="">선택</option>
                    <option value="사용중">사용중</option>
                    <option value="미사용">미사용</option>
                  </select>
                </label>

                <label className="block">
                  <div className="text-xs text-muted mb-1">사용중 프로젝트</div>
                  <select
                    className="select"
                    value={form.상세정보.사용중프로젝트}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        상세정보: { ...prev.상세정보, 사용중프로젝트: e.target.value as any },
                      }))
                    }
                  >
                    <option value="">선택</option>
                    <option value="THE GEM">THE GEM</option>
                    <option value="IDEALIAN">IDEALIAN</option>
                    <option value="NEORm">NEORm</option>
                    <option value="ICONIA">ICONIA</option>
                  </select>
                </label>

                <label className="block">
                  <div className="text-xs text-muted mb-1">남자/여자 캐릭터</div>
                  <select
                    className="select"
                    value={form.상세정보.캐릭터}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        상세정보: { ...prev.상세정보, 캐릭터: e.target.value as any },
                      }))
                    }
                  >
                    <option value="">선택</option>
                    <option value="남아">남아</option>
                    <option value="여아">여아</option>
                  </select>
                </label>
              </div>
            </div>
          );
        }

        // outfitPhotos
        return (
          <div key="outfitPhotos" className="glass-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">제작된 의상 사진</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="
                    px-4 py-2
                    rounded-2xl
                    text-white
                    font-medium
                    bg-gradient-to-r
                    from-purple-600
                    to-violet-700
                    hover:from-purple-700
                    hover:to-violet-800
                    shadow-md
                    transition
                    duration-200
                  "
                >
                  사진 추가
                </button>

                <button type="button" className="btn-outline text-sm" onClick={() => removeSection("outfitPhotos")}>
                  삭제
                </button>
              </div>
            </div>

            {/* 저장된 사진(저장 후 의미) */}
            {(form.제작된의상사진?.length ?? 0) > 0 && (
              <>
                <div className="text-xs text-muted mb-2">저장된 사진</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
                  {form.제작된의상사진.map((p, idx) => (
                    <div key={(p.url ?? "") + idx} className="glass-card overflow-hidden">
                      <div className="aspect-square bg-white/40">
                        <img src={(p as any).url} alt="saved" className="h-full w-full object-cover" />
                      </div>
                      <div className="p-2 flex items-center justify-between gap-2">
                        <div className="text-xs text-slate-600 truncate">{(p as any).name || "photo"}</div>
                        <button
                          type="button"
                          className="text-xs px-2 py-1 rounded-xl bg-white/70 border border-white/70"
                          onClick={() => removeSavedPhoto(idx)}
                        >
                          제거
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 저장 전(선택한 사진) */}
            {pendingFiles.length === 0 ? (
              <div className="text-sm text-muted">추가된 사진이 없습니다.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {pendingPreviews.map((url, idx) => (
                  <div key={url} className="glass-card overflow-hidden">
                    <div className="aspect-square bg-white/40">
                      <img src={url} alt="pending" className="h-full w-full object-cover" />
                    </div>
                    <div className="p-2 flex items-center justify-between gap-2">
                      <div className="text-xs text-slate-600 truncate">{pendingFiles[idx]?.name || "photo"}</div>
                      <button
                        type="button"
                        className="text-xs px-2 py-1 rounded-xl bg-white/70 border border-white/70"
                        onClick={() => removePending(idx)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 text-xs text-muted">
              * 사진은 <b>저장</b>을 눌러야 반영됩니다.
            </div>
          </div>
        );
      })}

      {/* ✅ (중요) 저장/취소는 맨 아래 별도 박스: 섹션이 추가되면 같이 아래로 밀림 */}
      <div className="flex justify-end">
        <div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onSaveAll}
              disabled={saving}
              className="
                px-5 py-2.5
                rounded-2xl
                text-white
                font-medium
                bg-gradient-to-r
                from-purple-400
                to-violet-500
                hover:from-purple-500
                hover:to-violet-600
                transition
                duration-200
                disabled:opacity-50
              "
            >
              저장
            </button>

<button
  type="button"
  onClick={() => navigate(-1)}
  className="
    px-5 py-2.5
    rounded-2xl
    border
    bg-white
    hover:bg-slate-50
    transition
    duration-200
  "
>
  취소
</button>
          </div>
        </div>
      </div>

      <Snackbar open={snackOpen} message={snackMsg} onClose={() => setSnackOpen(false)} />
    </div>
  );
}

function Field(props: { label: string; value: string; onChange: (v: string) => void }) {
  const { label, value, onChange } = props;
  return (
    <label className="block">
      <div className="text-xs text-muted mb-1">{label}</div>
      <input className="select" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}