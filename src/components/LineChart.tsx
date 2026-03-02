import { useId } from "react";

type Point = { label: string; value: number };

export default function LineChart({ title, points }: { title: string; points: Point[] }) {
  const uid = useId().replace(/:/g, "");
  const lineGradId = `lineGrad_${uid}`;
  const areaGradId = `areaGrad_${uid}`;

  const w = 520;
  const h = 200;
  const pad = 30;

  // points가 존재하더라도 값이 전부 0이면 "데이터 없음" 으로 처리
  const hasNonZero = points.some((p) => (p?.value ?? 0) > 0);
  const hasData = points.length > 0 && hasNonZero;

  const max = hasData ? Math.max(...points.map((p) => p.value)) : 1;
  const min = 0;

  const scaleX = (i: number) => {
    if (points.length <= 1) return pad;
    return pad + (i * (w - pad * 2)) / (points.length - 1);
  };

  const scaleY = (v: number) => {
    const t = (v - min) / (max - min);
    return h - pad - t * (h - pad * 2);
  };

  const d =
    !hasData
      ? ""
      : points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(p.value)}`)
          .join(" ");

  // Area under the line
  const areaD =
    !hasData
      ? ""
      : `${d} L ${scaleX(points.length - 1)} ${h - pad} L ${scaleX(0)} ${h - pad} Z`;

  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="font-semibold text-slate-700">{title}</div>
        <div className="text-xs text-slate-500">최근 14일</div>
      </div>

      <svg width="100%" viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id={lineGradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6D5DFE" />
            <stop offset="55%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id={areaGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(109, 93, 254, 0.25)" />
            <stop offset="100%" stopColor="rgba(109, 93, 254, 0)" />
          </linearGradient>
        </defs>

        {/* axes */}
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="rgba(148, 163, 184, 0.55)" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="rgba(148, 163, 184, 0.55)" />

        {hasData ? (
          <>
            {/* area */}
            <path d={areaD} fill={`url(#${areaGradId})`} />

            {/* line */}
            <path d={d} fill="none" stroke={`url(#${lineGradId})`} strokeWidth="3" strokeLinecap="round" />

            {/* points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={scaleX(i)} cy={scaleY(p.value)} r="3" fill="#6D5DFE" />
                {i === 0 || i === points.length - 1 ? (
                  <text
                    x={scaleX(i)}
                    y={h - 10}
                    fontSize="10"
                    textAnchor="middle"
                    fill="rgba(100, 116, 139, 0.95)"
                  >
                    {p.label}
                  </text>
                ) : null}
              </g>
            ))}

            {/* max label */}
            <text x={pad} y={pad - 8} fontSize="10" fill="rgba(100, 116, 139, 0.95)">
              {max}
            </text>
          </>
        ) : (
          <text x={w / 2} y={h / 2} fontSize="12" textAnchor="middle" fill="rgba(148, 163, 184, 0.95)">
            데이터 없음
          </text>
        )}
      </svg>
    </div>
  );
}
