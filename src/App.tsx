import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import SearchPage from "./pages/Search";
import FilterPage from "./pages/Filter";
import AddPage from "./pages/Add";
import TrashPage from "./pages/Trash";
import CompareSelectPage from "./pages/Compare";
import CompareViewPage from "./pages/CompareView";
import DetailPage from "./pages/Detail";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="filter" element={<FilterPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="add" element={<AddPage />} />
        <Route path="trash" element={<TrashPage />} />
        <Route path="compare" element={<CompareSelectPage />} />
        <Route path="compare/view" element={<CompareViewPage />} />
        <Route path="detail/:id" element={<DetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
