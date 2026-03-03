import { NavLink } from "react-router";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout-page">
      <Navbar />

      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <p className="admin-brand-label">Administration</p>
            <h1>Atelier Dashboard</h1>
          </div>

          <nav className="admin-nav" aria-label="Navigation administration">
            <NavLink to="/admin" end className="admin-nav-item">
              Vue d&apos;ensemble
            </NavLink>

            <NavLink to="/admin/gallery" className="admin-nav-item">
              Gallery Admin
            </NavLink>

            <a href="/admin#users" className="admin-nav-item">
              Utilisateurs
            </a>

            <a href="/admin#videos" className="admin-nav-item">
              Vidéos
            </a>

            <a
              href="/admin#future-sections"
              className="admin-nav-item admin-nav-item-muted"
            >
              Sections à venir
            </a>
          </nav>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
