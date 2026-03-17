import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import Home from "./pages/public/Home.jsx";
import Gallery from "./pages/public/Gallery.jsx";
import Jury from "./pages/public/Jury.jsx";
import JuryGallery from "./pages/public/JuryGallery.jsx";
import Participation from "./pages/public/Participation.jsx";
import VideoSubmission from "./pages/public/VideoSubmission.jsx";
import Programme from "./pages/public/Programme.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminGallery from "./pages/admin/AdminGallery.jsx";
import FilmDetail from "./pages/public/FilmDetail.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import { Login } from "./pages/auth/Login.jsx";
import { Register } from "./pages/auth/Register.jsx";
import { RoleGuard } from "./middlewares/RoleGuard.jsx";
import { LanguageProvider } from "./i18n/LanguageContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/programme" element={<Programme />} />
              <Route path="/jury" element={<Jury />} />
              <Route path="/films/:id" element={<FilmDetail />} />
              <Route path="/participation" element={<Participation />} />
              <Route path="/submit-video" element={<VideoSubmission />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
            </Route>

            {/* Routes privées */}
            <Route
              path="admin"
              element={
                <RoleGuard
                  allowedRoles={["ADMIN"]}
                  deniedTitle="Accès refusé"
                  deniedMessage="Cette page est réservée aux administrateurs."
                >
                  <AdminLayout />
                </RoleGuard>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="gallery" element={<AdminGallery />} />
            </Route>

            <Route
              path="juryGallery"
              element={
                <RoleGuard allowedRoles={["JURY", "ADMIN"]}>
                  <PublicLayout />
                </RoleGuard>
              }
            >
              <Route index element={<JuryGallery />} />
            </Route>
          </Routes>
        </QueryClientProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
