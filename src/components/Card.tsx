import React from "react";

export default function Card(props: { title: string; value: React.ReactNode; sub?: React.ReactNode; }) {
  return (
    <div className="bg-card rounded-xl shadow-card p-5">
      <div className="text-sm text-muted">{props.title}</div>
      <div className="mt-2 text-2xl font-semibold">{props.value}</div>
      {props.sub ? <div className="mt-2 text-xs text-muted">{props.sub}</div> : null}
    </div>
  );
}
