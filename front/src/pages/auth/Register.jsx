import { Link, useNavigate, useSearchParams } from "react-router";

import { signIn } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { clearAuthSession, useAuthSession } from "../../utils/authSession.js";
import { usePhase3Closure } from "../../utils/usePhase3Closure.js";
import PhaseClosedNotice from "../../components/PhaseClosedNotice.jsx";
import "./Auth.css";

const registerSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function Register() {
  const { tr } = useLanguage();
  const { username: connectedUsername } = useAuthSession();
  const { isCheckingPhaseStatus, isPhase3Closed } = usePhase3Closure();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");

  let navigate = useNavigate();

  function handleLogout() {
    clearAuthSession();
    window.location.href = "/auth/login";
  }

  if (isCheckingPhaseStatus) {
    return null;
  }

  if (isPhase3Closed) {
    return <PhaseClosedNotice />;
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

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      return await signIn(data);
    },
    onSuccess: (data, variables, context) => {
      // If you are logged
      //
      alert(data.data?.message);
      const safeNext = next && next.startsWith("/") ? next : "";
      navigate(safeNext ? `/auth/login?next=${encodeURIComponent(safeNext)}` : "/auth/login");
    },
    onError: (error) => {
      const message =
        error.response?.data?.error ||
        error.message ||
        tr("Inscription impossible, vérifie que le backend est démarré.", "Registration failed, check that backend is running.");
      alert(message);
    },
  });

  function onSubmit(data) {
    return registerMutation.mutate(data);
  }
  return (
    <div className="auth-page">
      <div className="auth-panel-glow" aria-hidden="true"></div>

      <section className="auth-card" aria-labelledby="register-title">
        <div className="auth-icon-wrap" aria-hidden="true">
          ⊹
        </div>

        <h1 id="register-title" className="auth-title auth-title-neon">
          {tr("INSCRIPTION", "REGISTER")}
        </h1>
        <p className="auth-subtitle">{tr("NOUVEAU PROFIL MARS.A.I", "NEW MARS.A.I PROFILE")}</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" id="id" {...register("id")} />

          <label htmlFor="username" className="auth-label">
            {tr("Adresse E-mail", "Email Address")}
          </label>
          <input
            id="username"
            className="auth-input"
            type="email"
            placeholder="email@exemple.com"
            {...register("username")}
            required
          />

          <label htmlFor="password" className="auth-label">
            {tr("Mot de passe", "Password")}
          </label>
          <input
            id="password"
            className="auth-input"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            required
          />

          <button className="auth-primary-button" disabled={registerMutation.isPending} type="submit">
            {registerMutation.isPending ? tr("INSCRIPTION...", "REGISTERING...") : tr("GÉNÉRER IDENTITÉ", "CREATE ACCOUNT")}
          </button>
        </form>

        <p className="auth-footer-text">
          {tr("Déjà enregistré ?", "Already registered?")}
          <Link to={next ? `/auth/login?next=${encodeURIComponent(next)}` : "/auth/login"}> {tr("Ouvrir session", "Open session")}</Link>
        </p>

        <Link className="auth-secondary-link" to="/">
          ← {tr("RETOUR ACCUEIL", "BACK HOME")}
        </Link>
      </section>
    </div>
  );
}
