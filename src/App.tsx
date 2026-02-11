import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import SearchPage from "./pages/Search";
import DetailPage from "./pages/Detail";
import ComparePage from "./pages/Compare";
import AddPage from "./pages/Add";
import TrashPage from "./pages/Trash";
import { isLoggedIn } from "./lib/auth";

function PrivateRoute({ children }: { children: JSX.Element }) {
  return isLoggedIn() ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/trash" element={<TrashPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
