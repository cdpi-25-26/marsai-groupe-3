import { Link, useNavigate, useSearchParams } from "react-router";

import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import "./Auth.css";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function Login() {
  const connectedUsername = localStorage.getItem("username");
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");

  let navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("tempAdminAccess");
    window.location.href = "/auth/login";
  }

  if (connectedUsername) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card-sm">
          <h1 className="auth-title">DÉJÀ CONNECTÉ</h1>
          <p className="auth-subtitle">Vous êtes connecté en tant que {connectedUsername}</p>
          <button className="auth-primary-button" type="button" onClick={handleLogout}>
            SE DÉCONNECTER
          </button>
          <Link className="auth-primary-button auth-link-btn" to="/">
            RETOUR ACCUEIL
          </Link>
        </div>
      </div>
    );
  }

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      return await login(data);
    },
    onSuccess: (response, variables, context) => {
      // If you are logged
      localStorage.setItem("username", response.data?.username);
      localStorage.setItem("role", response.data?.role);
      localStorage.setItem("token", response.data?.token);

      const safeNext = next && next.startsWith("/") ? next : null;
      if (safeNext) {
        navigate(safeNext);
        return;
      }

      switch (response.data?.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "JURY":
          navigate("/");
          break;
        default:
          navigate("/");
          break;
      }
    },
    onError: (error, variables, context) => {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Connexion impossible, vérifie que le backend est démarré.";
      alert(message);
    },
  });

  function onSubmit(data) {
    return loginMutation.mutate(data);
  }
  return (
    <div className="auth-page">
      <div className="auth-panel-glow" aria-hidden="true"></div>

      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-icon-wrap" aria-hidden="true">
          ✦
        </div>

        <h1 id="login-title" className="auth-title auth-title-neon">
          CONNEXION
        </h1>
        <p className="auth-subtitle">ESPACE MEMBRE MARS.A.I</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" id="id" {...register("id")} />

          <label htmlFor="username" className="auth-label">
            ADRESSE E-MAIL
          </label>
          <input
            id="username"
            className="auth-input"
            type="text"
            placeholder="email@exemple.com"
            {...register("username")}
            required
          />

          <label htmlFor="password" className="auth-label">
            MOT DE PASSE
          </label>
          <input
            id="password"
            className="auth-input"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            required
          />

          <button className="auth-primary-button" disabled={loginMutation.isPending} type="submit">
            {loginMutation.isPending ? "CONNEXION..." : "ACCÉDER À L’ESPACE"}
          </button>
        </form>

        <p className="auth-footer-text">
          Nouveau sur MARS.A.I ?
          <Link to="/auth/register"> Inscrivez-vous</Link>
        </p>

        <Link className="auth-secondary-link" to="/">
          ← RETOUR ACCUEIL
        </Link>
      </section>
    </div>
  );
}
