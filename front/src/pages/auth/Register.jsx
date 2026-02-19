import { Link, useNavigate } from "react-router";

import { signIn } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import "./Auth.css";

const registerSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export function Register() {
  if (localStorage.getItem("username")) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card-sm">
          <h1 className="auth-title">DÉJÀ CONNECTÉ</h1>
          <p className="auth-subtitle">Vous êtes connecté en tant que {localStorage.getItem("username")}</p>
          <Link className="auth-primary-button auth-link-btn" to="/">
            RETOUR ACCUEIL
          </Link>
        </div>
      </div>
    );
  }

  let navigate = useNavigate();

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
      navigate("/auth/login");
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
          INSCRIPTION
        </h1>
        <p className="auth-subtitle">NOUVEAU PROFIL MARS.A.I</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" id="id" {...register("id")} />

          <label htmlFor="username" className="auth-label">
            ALIAS CITOYEN
          </label>
          <input
            id="username"
            className="auth-input"
            type="text"
            placeholder="John Doe"
            {...register("username")}
            required
          />

          <label htmlFor="password" className="auth-label">
            CLÉ D’ACCÈS
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
            {registerMutation.isPending ? "INSCRIPTION..." : "GÉNÉRER IDENTITÉ"}
          </button>
        </form>

        <p className="auth-footer-text">
          Déjà enregistré ?
          <Link to="/auth/login"> Ouvrir session</Link>
        </p>

        <Link className="auth-secondary-link" to="/">
          ← RETOUR ACCUEIL
        </Link>
      </section>
    </div>
  );
}
