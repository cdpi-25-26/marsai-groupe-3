import { Link, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";

import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { clearAuthSession, setAuthSession, useAuthSession } from "../../utils/authSession.js";
import { usePhase3Closure } from "../../utils/usePhase3Closure.js";
import "./Auth.css";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function Login() {
  const { tr } = useLanguage();
  const { username: connectedUsername } = useAuthSession();
  const { isCheckingPhaseStatus, isPhase3Closed } = usePhase3Closure();
  const [searchParams] = useSearchParams();
  const [feedback, setFeedback] = useState(null); // { type: "error" | "success", message: string }
  const next = searchParams.get("next");

  let navigate = useNavigate();

  function handleLogout() {
    clearAuthSession();
    window.location.href = "/auth/login";
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
      setAuthSession({
        username: response.data?.username,
        role: response.data?.role,
        token: response.data?.token,
      });

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
      const isNetworkError = !error.response;
      const message =
        (isNetworkError
          ? tr(
            "Connexion impossible: backend inaccessible. Démarre le serveur API puis réessaie.",
            "Connection failed: backend unreachable. Start the API server and try again.",
          )
          : null) ||
        error.response?.data?.error ||
        error.message ||
        tr("Connexion impossible, vérifie que le backend est démarré.", "Login failed, check that backend is running.");
      setFeedback({
        type: "error",
        message,
      });
    },
  });

  if (isCheckingPhaseStatus) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card-sm">
          <h1 className="auth-title">{tr("Chargement", "Loading")}</h1>
          <p className="auth-subtitle">{tr("Verification de l'etat de la phase...", "Checking phase status...")}</p>
        </div>
      </div>
    );
  }

  if (connectedUsername) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card-sm">
          <h1 className="auth-title">{tr("DÉJÀ CONNECTÉ", "ALREADY LOGGED IN")}</h1>
          <p className="auth-subtitle">{tr("Vous êtes connecté en tant que", "You are logged in as")} {connectedUsername}</p>
          <button className="auth-primary-button" type="button" onClick={handleLogout}>
            {tr("SE DÉCONNECTER", "LOG OUT")}
          </button>
          <Link className="auth-primary-button auth-link-btn" to="/">
            {tr("RETOUR ACCUEIL", "BACK HOME")}
          </Link>
        </div>
      </div>
    );
  }

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
          {tr("CONNEXION", "LOGIN")}
        </h1>
        <p className="auth-subtitle">{tr("ESPACE MEMBRE MARS.A.I", "MARS.A.I MEMBER AREA")}</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" id="id" {...register("id")} />

          <label htmlFor="username" className="auth-label">
            {tr("ADRESSE E-MAIL", "EMAIL ADDRESS")}
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
            {tr("MOT DE PASSE", "PASSWORD")}
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
            {loginMutation.isPending ? tr("CONNEXION...", "LOGGING IN...") : tr("ACCÉDER À L’ESPACE", "ACCESS AREA")}
          </button>
        </form>

        {!isCheckingPhaseStatus && !isPhase3Closed && (
          <p className="auth-footer-text">
            {tr("Nouveau sur MARS.A.I ?", "New to MARS.A.I?")}
            <Link to="/auth/register"> {tr("Inscrivez-vous", "Sign up")}</Link>
          </p>
        )}

        <Link className="auth-secondary-link" to="/">
          ← {tr("RETOUR ACCUEIL", "BACK HOME")}
        </Link>
      </section>

      {feedback && (
        <div className={`toast ${feedback.type}`}>
          <span className="toast-dot" aria-hidden="true"></span>
          <span className="toast-text">{feedback.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => setFeedback(null)}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}
