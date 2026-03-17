import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { tr } = useLanguage();
  const location = useLocation();
  const [activeDashboardSection, setActiveDashboardSection] = useState("users");

  useEffect(() => {
    if (location.pathname !== "/admin") {
      return undefined;
    }

    const sectionIds = ["users", "videos", "jury-members", "supports", "future-sections"];

    const setFromHash = () => {
      const hashId = window.location.hash.replace("#", "");
      if (sectionIds.includes(hashId)) {
        setActiveDashboardSection(hashId);
      }
    };

    setFromHash();

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveDashboardSection(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-24% 0px -52% 0px",
        threshold: [0.1, 0.2, 0.35, 0.5],
      },
    );

    sectionIds.forEach((id) => {
      const target = document.getElementById(id);
      if (target) {
        observer.observe(target);
      }
    });

    window.addEventListener("hashchange", setFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", setFromHash);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/admin" || !location.hash) {
      return;
    }

    const targetId = location.hash.replace("#", "");
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.pathname, location.hash]);

  const getSectionClass = (sectionId, muted = false) => {
    const isActive = location.pathname === "/admin" && activeDashboardSection === sectionId;
    return `admin-nav-item${muted ? " admin-nav-item-muted" : ""}${isActive ? " active" : ""}`;
  };

  return (
    <div className="admin-layout-page">
      <Navbar />

      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <p className="admin-brand-label">{tr("Administration", "Administration")}</p>
            <h1>{tr("Atelier Dashboard", "Workshop Dashboard")}</h1>
          </div>

          <nav className="admin-nav" aria-label={tr("Navigation administration", "Administration navigation")}>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `admin-nav-item${isActive && !location.hash ? " active" : ""}`
              }
            >
              {tr("Vue d'ensemble", "Overview")}
            </NavLink>

            <NavLink
              to="/admin/gallery"
              className={({ isActive }) => `admin-nav-item${isActive ? " active" : ""}`}
            >
              {tr("Gallery Admin", "Admin Gallery")}
            </NavLink>

            <Link to="/admin#users" className={getSectionClass("users")}>
              {tr("Utilisateurs", "Users")}
            </Link>

            <Link to="/admin#videos" className={getSectionClass("videos")}>
              {tr("Vidéos", "Videos")}
            </Link>

            <Link to="/admin#jury-members" className={getSectionClass("jury-members")}>
              {tr("Membres du jury", "Jury members")}
            </Link>

            <Link to="/admin#supports" className={getSectionClass("supports")}>
              {tr("Soutiens", "Supporters")}
            </Link>

            <Link to="/admin#future-sections" className={getSectionClass("future-sections", true)}>
              {tr("Sections à venir", "Coming sections")}
            </Link>
          </nav>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
