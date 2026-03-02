import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSidebarFilterOptions } from "./firestore";

export type FilterKey = "무게" | "업체명" | "No" | "comp" | "width" | "mount" | "cost" | "color";

export type FilterSelections = Record<FilterKey, string[]>;

export type SidebarFilterOptions = Record<FilterKey, string[]>;

type SidebarFilterState = {
  // Which fields are enabled (chips under "필터하기")
  fieldKeys: FilterKey[];
  setFieldKeys: React.Dispatch<React.SetStateAction<FilterKey[]>>;

  // Value selections per field (checkboxes)
  valueSelections: FilterSelections;
  setValueSelections: React.Dispatch<React.SetStateAction<FilterSelections>>;

  // Options shown in 2nd-level lists (provided by Search page based on results/meta)
  options: SidebarFilterOptions;
  setOptions: React.Dispatch<React.SetStateAction<SidebarFilterOptions>>;

  // DB 기반 옵션 로딩 상태
  loadingOptions: boolean;
  refreshOptions: () => Promise<void>;

  // Bump when user hits "적용" so pages can react
  applyVersion: number;
  apply: () => void;

  // Clear all
  clearAll: () => void;
};

const Ctx = createContext<SidebarFilterState | null>(null);

const EMPTY_SELECTIONS: FilterSelections = {
  무게: [],
  업체명: [],
  No: [],
  comp: [],
  width: [],
  mount: [],
  cost: [],
  color: [],
};

const EMPTY_OPTIONS: SidebarFilterOptions = {
  무게: [],
  업체명: [],
  No: [],
  comp: [],
  width: [],
  mount: [],
  cost: [],
  color: [],
};

export function SidebarFilterProvider({ children }: { children: React.ReactNode }) {
  const [fieldKeys, setFieldKeys] = useState<FilterKey[]>([]);
  const [valueSelections, setValueSelections] = useState<FilterSelections>(EMPTY_SELECTIONS);
  const [options, setOptions] = useState<SidebarFilterOptions>(EMPTY_OPTIONS);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [applyVersion, setApplyVersion] = useState(0);

  async function refreshOptions() {
    setLoadingOptions(true);
    try {
      const opt = await getSidebarFilterOptions();
      setOptions(opt);
    } finally {
      setLoadingOptions(false);
    }
  }

  // ✅ 앱 시작 시 1회: DB에 저장된 옵션(또는 fallback distinct)을 먼저 로드
  useEffect(() => {
    refreshOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<SidebarFilterState>(
    () => ({
      fieldKeys,
      setFieldKeys,
      valueSelections,
      setValueSelections,
      options,
      setOptions,
      loadingOptions,
      refreshOptions,
      applyVersion,
      apply: () => setApplyVersion((v) => v + 1),
      clearAll: () => {
        setFieldKeys([]);
        setValueSelections(EMPTY_SELECTIONS);
        setApplyVersion((v) => v + 1);
      },
    }),
    [fieldKeys, valueSelections, options, loadingOptions, applyVersion]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSidebarFilters() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSidebarFilters must be used within SidebarFilterProvider");
  return ctx;
}
