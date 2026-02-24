import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import Home from "./pages/public/Home.jsx";
import Gallery from "./pages/public/Gallery.jsx";
import Jury from "./pages/public/Jury.jsx";
import Participation from "./pages/public/Participation.jsx";
import VideoSubmission from "./pages/public/VideoSubmission.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import { Login } from "./pages/auth/Login.jsx";
import { Register } from "./pages/auth/Register.jsx";
import { RoleGuard } from "./middlewares/RoleGuard.jsx";

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
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/jury" element={<Jury />} />
            <Route path="/participation" element={<Participation />} />
            <Route path="/submit-video" element={<VideoSubmission />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Route>

          {/* Routes privées */}
          <Route
            path="admin"
            element={
              <RoleGuard allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </RoleGuard>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
