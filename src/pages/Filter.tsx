import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import fixedSwatch from "../assets/fixed-swatch.png";
import Snackbar from "../components/Snackbar";
import { getFilterMeta, searchItems, softDelete } from "../lib/firestore";
import { useSidebarFilters, type FilterKey } from "../lib/filterContext";
import type { CmfItem } from "../lib/types";

type Open = "무게" | "comp" | "color" | null;

const FIXED_COLORS = [
  "BE","BK","BL","BN","BRG","BV","CAM","CH","DB","Denim","DY","GD","GN","GY","IV","KH","LB","LG","LM","MT","NV","Neon","OLV","OR","ORG","PCH","PK","PU","PUR","RD","SB","SLV","VI","VT","WH","W-G","YE","YG","YL","YW","WN","BG"
];

// (사이드바 체크박스 옵션은 DB에서 미리 로드됨: filterContext)

function applySidebarFilters<T extends Record<string, any>>(
  rows: T[],
  fieldKeys: FilterKey[],
  valueSelections: Record<FilterKey, string[]>
) {
  // fieldKeys is enabled fields; only apply those with non-empty selections.
  const activeKeys = fieldKeys.filter((k) => (valueSelections[k] ?? []).length > 0);
  if (activeKeys.length === 0) return rows;

  return rows.filter((r) =>
    activeKeys.every((k) => {
      const sel = valueSelections[k] ?? [];
      const v = (r as any)[k];
      const s = (v ?? "").toString().trim();
      return sel.includes(s);
    })
  );
}


export default function FilterPage() {
  const [meta, setMeta] = useState<{ weights: string[]; comps: string[] } | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(false);

  const [무게, set무게] = useState("");
  const [comp, setComp] = useState("");
  const [color, setColor] = useState("");

  const [open, setOpen] = useState<Open>(null);

  const [rawItems, setRawItems] = useState<CmfItem[]>([]);
  const [items, setItems] = useState<CmfItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  // ✅ 그리드로 바꾸면서 1페이지 카드 수 증가
  const PAGE_SIZE = 12;
  const navigate = useNavigate();

  const { fieldKeys, valueSelections, applyVersion } = useSidebarFilters();
  const didMountRef = useRef(false);

  useEffect(() => {
    (async () => {
      setLoadingMeta(true);
      try {
        const m = await getFilterMeta();
        setMeta(m);
      } finally {
        setLoadingMeta(false);
      }
    })();
  }, []);


  // ✅ 사이드바에서 "적용"을 누르면(=applyVersion 변경) 현재 검색 결과를 재필터링
  useEffect(() => {
    // 첫 렌더에서는 실행하지 않음 (적용 버튼 눌렀을 때만 동작)
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    // 1) 이미 검색 결과가 있으면: 그 결과를 재필터링
    if (rawItems.length > 0) {
      const filtered = applySidebarFilters(rawItems, fieldKeys, valueSelections);
      setItems(filtered);
      setPage(0);
      return;
    }

    // 2) 아직 검색을 안 했는데 필터를 적용했다면:
    //    현재 상단 필터(무게/comp/color) 조건으로 1회 검색을 실행해서 결과를 보여준다.
    (async () => {
      setLoading(true);
      try {
        const res = await searchItems({
          무게: 무게 || undefined,
          comp: comp || undefined,
          color: color || undefined,
        });
        setRawItems(res);
        const filtered = applySidebarFilters(res, fieldKeys, valueSelections);
        setItems(filtered);
        setPage(0);
      } finally {
        setLoading(false);
      }
    })();
  }, [applyVersion, rawItems, fieldKeys, valueSelections, 무게, comp, color]);


  const 무게Options = useMemo(() => meta?.weights ?? [], [meta]);
  const compOptions = useMemo(() => meta?.comps ?? [], [meta]);
  const colorOptions = FIXED_COLORS;

  // 상위 필터 변경 시 하위 필터 초기화
  useEffect(() => {
    setComp("");
    setColor("");
  }, [무게]);
  useEffect(() => {
    setColor("");
  }, [comp]);

  async function doSearch() {
    setLoading(true);
    try {
      const res = await searchItems({
        무게: 무게 || undefined,
        comp: comp || undefined,
        color: color || undefined,
      });
      setRawItems(res);

      const filtered = applySidebarFilters(res, fieldKeys, valueSelections);
      setItems(filtered);
      setPage(0);
      setOpen(null);

      if (res.length === 0) {
        setSnackMsg("검색 결과가 없습니다.");
        setSnackOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = page * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  async function onDelete(id: string) {
    if (!confirm("삭제 후 휴지통으로 이동합니다. 계속할까요?")) return;
    await softDelete(id);
    const nextRaw = rawItems.filter((x) => x.id !== id);
    setRawItems(nextRaw);
    const nextItems = items.filter((x) => x.id !== id);
    setItems(nextItems);
    setPage((p) => {
      const nextTotalPages = Math.max(1, Math.ceil(nextItems.length / PAGE_SIZE));
      return Math.min(p, nextTotalPages - 1);
    });
  }

  return (
    <div className="space-y-6">


      {/* 결과 */}
      <div className="glass-card p-5 sm:p-6 overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="font-semibold">검색 결과 ({total})</div>
          <div className="flex items-center gap-2">
            <button
              className="btn-outline text-sm disabled:opacity-50"
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              이전
            </button>
            <button
              className="btn-outline text-sm disabled:opacity-50"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              다음
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-10 text-center text-muted">필터를 선택하고 검색 버튼을 눌러주세요.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pageItems.map((it) => (
              <ResultCard
                key={it.id}
                it={it}
                onDetail={() => navigate(`/detail/${it.id}`)}
                onDelete={() => onDelete(it.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Snackbar open={snackOpen} message={snackMsg} onClose={() => setSnackOpen(false)} />
    </div>
  );
}

function ResultCard(props: { it: CmfItem; onDetail: () => void; onDelete: () => void }) {
  const { it, onDetail, onDelete } = props;

  return (
    <div className="glass-card overflow-hidden">
      {/* ✅ 이미지 크게 */}
      <button className="w-full" onClick={onDetail} type="button" title="상세보기">
        <div className="aspect-[4/5] w-full bg-white/40">
          <img src={fixedSwatch} alt="item" className="h-full w-full object-cover" />
        </div>
      </button>

      {/* ✅ 업체명 / No. / 무게 */}
      <div className="p-4">
        <div className="text-[11px] text-muted mb-1">{it.무게 ? `[${it.무게}]` : ""}</div>
        <div className="font-semibold text-slate-800 leading-snug truncate">{it.업체명 || "-"}</div>
        <div className="text-sm text-slate-600 leading-snug mt-1">{it.No || "-"}</div>

<div className="mt-4 flex items-center gap-3 justify-between">
  {/* ✅ 상세 먼저 */}
  <button
    type="button"
    onClick={onDetail}
    className="action-pill action-pill-primary w-1/2"
  >
    상세
  </button>

  {/* ✅ 삭제 나중 */}
  <button
    type="button"
    onClick={onDelete}
    className="action-pill action-pill-outline w-1/2"
  >
    삭제
  </button>
</div>
      </div>
    </div>
  );
}

function Dropdown(props: {
  label: string;
  value: string;
  placeholder: string;
  open: boolean;
  onToggle: () => void;
  options: string[];
  onPick: (v: string) => void;
  onClear: () => void;
}) {
  const { label, value, placeholder, open, onToggle, options, onPick, onClear } = props;

  return (
    <div className="relative">
      <div className="text-xs text-muted mb-1">{label}</div>
      <button
        className="w-full select text-left flex items-center justify-between hover:bg-white/90 transition"
        onClick={onToggle}
        type="button"
      >
        <span className={value ? "text-slate-700" : "text-slate-400"}>{value || placeholder}</span>
        <div className="flex items-center gap-2">
          {value && (
            <button
              className="text-xs px-2 py-1 rounded-lg bg-white/60 hover:bg-white/90"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              type="button"
            >
              ✕
            </button>
          )}
          <span className="text-xs text-slate-400">▼</span>
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full glass-card p-1 max-h-56 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted">옵션이 없습니다.</div>
          ) : (
            options.map((o) => (
              <div
                key={o}
                className="px-3 py-2 rounded-xl hover:bg-white/70 cursor-pointer"
                onClick={() => onPick(o)}
              >
                {o}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}