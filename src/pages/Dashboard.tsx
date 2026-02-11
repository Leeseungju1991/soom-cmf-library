import { useEffect, useState } from "react";
import Card from "../components/Card";
import { getLastUpdated, getTopSearches, getTotalCount, listLogs } from "../lib/firestore";

function fmtDate(ts?: number) {
  if (!ts) return "-";
  const d = new Date(ts);
  return d.toLocaleString("ko-KR");
}

export default function DashboardPage() {
  const [count, setCount] = useState<number | null>(null);
  const [last, setLast] = useState<number | undefined>(undefined);
  const [top, setTop] = useState<Array<{id:string; label:string; count:number}>>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setCount(await getTotalCount());
      setLast(await getLastUpdated());
      setTop(await getTopSearches());
      setLogs(await listLogs());
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Dashboard</div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="총 DB 개수" value={count ?? "…"} sub="cmfItems 컬렉션 기준" />
        <Card title="마지막 수정/업데이트" value={fmtDate(last)} />
        <Card title="자주 검색되는 항목 Top 5" value={top.length} sub="아래 리스트 참고" />
        <Card title="로그 기록" value={logs.length} sub="최근 50건" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-card rounded-xl p-5">
          <div className="font-semibold">자주 검색되는 항목 Top 5</div>
          <div className="mt-4 space-y-2">
            {top.length === 0 ? <div className="text-sm text-muted">데이터 없음</div> : null}
            {top.map((t, i) => (
              <div key={t.id} className="flex items-center text-sm">
                <div className="w-6 text-muted">{i+1}</div>
                <div className="flex-1">{t.label}</div>
                <div className="text-muted">{t.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-card rounded-xl p-5">
          <div className="font-semibold">수정 이력(로그)</div>
          <div className="mt-4 space-y-2 max-h-72 overflow-auto">
            {logs.length === 0 ? <div className="text-sm text-muted">데이터 없음</div> : null}
            {logs.map(l => (
              <div key={l.id} className="text-sm border-b py-2">
                <div className="font-medium">{l.action}</div>
                <div className="text-xs text-muted">{fmtDate(l.at)}</div>
                <div className="text-xs text-muted">{JSON.stringify(l.payload)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
