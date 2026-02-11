import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/search", label: "검색/필터" },
  { to: "/add", label: "CMF 추가하기" },
  { to: "/trash", label: "휴지통" },
];

export default function Layout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-sidebar text-white p-6 hidden md:block">
        <div className="font-bold text-lg mb-8">숨코리아 CMF Library</div>
        <nav className="space-y-1">
          {nav.map(i => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({isActive}) =>
                "block px-3 py-2 rounded-md text-sm " +
                (isActive ? "bg-white/10" : "hover:bg-white/5")
              }
            >
              {i.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="mt-10 text-sm text-white/80 hover:text-white"
          onClick={() => { logout(); navigate("/"); }}
        >
          로그아웃
        </button>
      </aside>

      <main className="flex-1">
        <header className="h-16 bg-white shadow-sm flex items-center px-6">
          <div className="font-semibold">숨코리아 CMF Library</div>
          <div className="ml-auto text-sm text-muted">관리자(soom)</div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
