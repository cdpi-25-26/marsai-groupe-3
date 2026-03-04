import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function PublicLayout() {
  const { tr } = useLanguage();
  return (
    <div>
      <div className="navbar-backdrop" aria-hidden="true"></div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>{tr("Pied de page", "Footer")}</footer>
    </div>
  );
}
