import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/auth";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="bg-white shadow-card rounded-2xl p-8 w-full max-w-md">
        <div className="text-xl font-bold">숨코리아 CMF Library</div>
        <div className="text-sm text-muted mt-2">관리자 로그인</div>

        <div className="mt-6 space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="아이디"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="비밀번호"
            type="password"
            value={pw}
            onChange={(e)=>setPw(e.target.value)}
          />
          {err ? <div className="text-sm text-red-600">{err}</div> : null}
          <button
            className="w-full bg-accent text-white rounded-lg py-2 font-semibold"
            onClick={()=>{
              const ok = login(id.trim(), pw);
              if (!ok) { setErr("아이디/비밀번호가 올바르지 않습니다."); return; }
              navigate("/dashboard");
            }}
          >
            로그인
          </button>
          <div className="text-xs text-muted">* 아이디: soom / 비밀번호: soom</div>
        </div>
      </div>
    </div>
  );
}
