import "./Home.css";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { getPublicGalleryStatus } from "../../api/videos";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

function Home() {
  const { tr } = useLanguage();
  const [galleryStatus, setGalleryStatus] = useState({
    isOpen: false,
    totalPublicVideos: 0,
  });

  useEffect(() => {
    const fetchGalleryStatus = async () => {
      try {
        const response = await getPublicGalleryStatus();
        setGalleryStatus(response.data || {});
      } catch {
        setGalleryStatus({ isOpen: false, totalPublicVideos: 0 });
      }
    };

    fetchGalleryStatus();
  }, []);

  return (
    <div className="home-page min-h-screen bg-gray-950 text-white">
      <section className="home-hero relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/src/assets/fond2.mp4" type="video/mp4" />
        </video>
        <div className="home-hero-overlay absolute inset-0 z-[5]"></div>

        <div className="relative z-10 text-center max-w-5xl px-4 md:px-8">
          <div className="home-hero-badge mb-7 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] md:text-xs uppercase tracking-[0.32em] text-white/90">
            <span>✦</span>
            <span>{tr("Le protocole temporel 2026", "Temporal protocol 2026")}</span>
          </div>

          <h1 className="text-[72px] leading-[0.9] md:text-[132px] font-black uppercase tracking-[-0.04em] mb-5">
            <span className="text-white">MARS</span>
            <span className="home-hero-title-ai">AI</span>
          </h1>

          <p className="text-2xl md:text-[42px] leading-[1.05] font-extrabold uppercase tracking-tight mb-2">
            {tr("IMAGINEZ DES", "IMAGINE")} <span className="home-hero-title-futurs">{tr("FUTURS", "FUTURES")}</span> {tr("SOUHAITABLES", "WORTH LIVING")}
          </p>
          <p className="text-lg md:text-[31px] text-white/65 mb-2">
            {tr("Le festival de courts-métrages de 60 secondes réalisés par IA.", "The festival of 60-second short films created with AI.")}
          </p>
          <p className="text-lg md:text-[31px] italic text-white/80 mb-12">
            {tr("2 jours d'immersion au cœur de Marseille.", "2 days of immersion in Marseille.")}
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            {galleryStatus.isOpen ? (
              <Link className="home-hero-btn home-hero-btn-primary" to="/gallery">
                {tr("VOIR LES FILMS", "SEE FILMS")} <span aria-hidden="true">→</span>
              </Link>
            ) : null}
            <Link className="home-hero-btn home-hero-btn-secondary" to="/jury">
              {tr("MEMBRES DU JURY", "JURY MEMBERS")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-pillars-section px-4">
        <div className="home-pillars-grid max-w-6xl mx-auto">
          {[
            {
              title: "1 MINUTE",
              desc: "FORMAT ULTRA-COURT POUR UN IMPACT MAXIMUM.",
              colorClass: "home-pillar-violet",
            },
            {
              title: "GRATUITÉ",
              desc: "CONFÉRENCES ET WORKSHOPS ACCESSIBLES.",
              colorClass: "home-pillar-green",
            },
            {
              title: "POUR TOUS",
              desc: "PROFESSIONNELS, ÉTUDIANTS ET CURIEUX.",
              colorClass: "home-pillar-pink",
            },
            {
              title: "EXPERTISE",
              desc: "LEADERS MONDIAUX DE L'IA GÉNÉRATIVE.",
              colorClass: "home-pillar-blue",
            },
          ].map((pillar, idx) => (
            <article key={idx} className={`home-pillar-card ${pillar.colorClass}`}>
              <h3 className="home-pillar-title">{tr(pillar.title, idx === 0 ? "1 MINUTE" : idx === 1 ? "FREE" : idx === 2 ? "FOR EVERYONE" : "EXPERTISE")}</h3>
              <p className="home-pillar-desc">{tr(pillar.desc, idx === 0 ? "ULTRA-SHORT FORMAT FOR MAXIMUM IMPACT." : idx === 1 ? "FREE CONFERENCES AND WORKSHOPS." : idx === 2 ? "PROFESSIONALS, STUDENTS, AND CURIOUS MINDS." : "GLOBAL LEADERS IN GENERATIVE AI.")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-films-section px-4">
        <div className="home-films-wrap max-w-6xl mx-auto">
          <div className="home-films-header">
            <div>
              <p className="home-films-kicker">{tr("— LE PROJET MARS.AI", "— THE MARS.AI PROJECT")}</p>
              <h2 className="home-films-title">
                {tr("FILMS EN", "FILMS IN")}
                <br />
                {tr("COMPÉTITION", "COMPETITION")}
              </h2>
            </div>

            <div className="home-films-header-right">
              <p className="home-films-subtitle">
                {tr("Découvrez une sélection d'œuvres pionnières explorant les nouvelles frontières de l'imaginaire assisté par l'IA.", "Discover a selection of pioneering works exploring the new frontiers of AI-assisted imagination.")}
              </p>
              <button className="home-films-cta">
                {tr("VOIR LA SÉLECTION", "SEE THE SELECTION")} <span className="home-films-cta-icon">→</span>
              </button>
            </div>
          </div>

          <div className="home-films-grid">
            {[
              {
                title: "PROTOCOL ALPHA",
                author: "DIR. STARK",
                visualClass: "home-film-visual-1",
              },
              {
                title: "NEURAL DREAM",
                author: "DIR. VANCE",
                visualClass: "home-film-visual-2",
              },
              {
                title: "CYBER MARSEILLE",
                author: "DIR. LUPIN",
                visualClass: "home-film-visual-3",
              },
            ].map((film, idx) => (
              <article key={idx} className="home-film-card">
                <div className={`home-film-visual ${film.visualClass}`}></div>
                <div className="home-film-info">
                  <h3 className="home-film-title">{film.title}</h3>
                  <p className="home-film-author">{film.author}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-objectives-section px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="home-objectives-title">
            {tr("OBJECTIFS DU", "FESTIVAL")} <span>{tr("FESTIVAL", "OBJECTIVES")}</span>
          </h2>

          <div className="home-objectives-grid">
            {[
              {
                icon: "◎",
                iconClass: "home-objective-icon-green",
                titleTop: "L'HUMAIN",
                titleBottom: "AU CENTRE",
                desc: "METTRE L'HUMAIN AU CŒUR DE LA CRÉATION POUR NE PAS PERDRE L'ÉMOTION.",
              },
              {
                icon: "⚡",
                iconClass: "home-objective-icon-cyan",
                titleTop: "CHALLENGE",
                titleBottom: "CRÉATIF",
                desc: "CHALLENGER LA CRÉATIVITÉ GRÂCE À UN FORMAT ULTRA-COURT DE 60S.",
              },
              {
                icon: "🚀",
                iconClass: "home-objective-icon-purple",
                titleTop: "FUTURS",
                titleBottom: "SOUHAITABLES",
                desc: "EXPLORER LES FUTURS DÉSIRABLES VIA LES TECHNOLOGIES ÉMERGENTES.",
              },
            ].map((item, idx) => (
              <article key={idx} className="home-objective-card">
                <div className={`home-objective-icon ${item.iconClass}`}>{item.icon}</div>
                <h3 className="home-objective-card-title">
                  {tr(item.titleTop, idx === 0 ? "HUMAN" : idx === 1 ? "CREATIVE" : "DESIRABLE")}
                  <br />
                  {tr(item.titleBottom, idx === 0 ? "CENTERED" : idx === 1 ? "CHALLENGE" : "FUTURES")}
                </h3>
                <p className="home-objective-card-desc">{tr(item.desc, idx === 0 ? "PUT PEOPLE AT THE HEART OF CREATION TO PRESERVE EMOTION." : idx === 1 ? "PUSH CREATIVITY THROUGH AN ULTRA-SHORT 60-SECOND FORMAT." : "EXPLORE DESIRABLE FUTURES THROUGH EMERGING TECHNOLOGIES.")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-protocol-section px-4">
        <div className="max-w-6xl mx-auto">
          <p className="home-protocol-kicker">{tr("IMMERSION TOTALE", "TOTAL IMMERSION")}</p>
          <h2 className="home-protocol-title">
            {tr("LE PROTOCOLE", "THE TEMPORAL")}
            <br />
            {tr("TEMPOREL", "PROTOCOL")}
          </h2>

          <div className="home-protocol-grid">
            {[
              { label: "2 MOIS", desc: "DE PRÉPARATION", colorClass: "home-protocol-violet" },
              { label: "50 FILMS", desc: "EN SÉLECTION", colorClass: "home-protocol-green" },
              { label: "WEB 3.0", desc: "EXPÉRIENCE", colorClass: "home-protocol-pink" },
              { label: "J4", desc: "MARSEILLE", colorClass: "home-protocol-cyan" },
            ].map((item, idx) => (
              <article key={idx} className={`home-protocol-card ${item.colorClass}`}>
                <h3 className="home-protocol-card-label">{item.label}</h3>
                <p className="home-protocol-card-desc">{tr(item.desc, idx === 0 ? "PREPARATION" : idx === 1 ? "IN SELECTION" : idx === 2 ? "EXPERIENCE" : "MARSEILLE")}</p>
              </article>
            ))}
          </div>

          <button className="home-protocol-btn">{tr("REJOINDRE L&apos;AVENTURE", "JOIN THE ADVENTURE")}</button>
        </div>
      </section>

      <section className="home-conferences-section px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="home-conferences-title">
            {tr("DEUX JOURNÉES DE", "TWO DAYS OF")}
            <br />
            <span>{tr("CONFÉRENCES GRATUITES", "FREE CONFERENCES")}</span>
          </h2>

          <ol className="home-conferences-list">
            <li>{tr("1. Débats engagés sur l'éthique et le futur", "1. Engaged debates on ethics and the future")}</li>
            <li>{tr("2. Confrontations d'idées entre artistes et tech", "2. Exchanges of ideas between artists and tech")}</li>
            <li>{tr("3. Interrogations stimulantes sur la création", "3. Stimulating questions about creation")}</li>
          </ol>

          <button className="home-conferences-agenda">🗓 {tr("AGENDA COMPLET", "FULL AGENDA")}</button>

          <div className="home-conferences-grid">
            <article className="home-conference-card home-conference-card-light">
              <div className="home-conference-icon home-conference-icon-purple">▷</div>
              <h3 className="home-conference-title">{tr("PROJECTIONS", "SCREENINGS")}</h3>
              <p className="home-conference-desc">{tr("Diffusion sur écran géant en présence des réalisateurs.", "Large-screen screenings in the presence of directors.")}</p>
            </article>

            <article className="home-conference-card home-conference-card-dark">
              <div className="home-conference-icon home-conference-icon-pink">◌</div>
              <h3 className="home-conference-title">{tr("WORKSHOPS", "WORKSHOPS")}</h3>
              <p className="home-conference-desc">{tr("Sessions pratiques pour maîtriser les outils IA.", "Hands-on sessions to master AI tools.")}</p>
            </article>

            <article className="home-conference-card home-conference-card-dark home-conference-card-violet">
              <div className="home-conference-icon home-conference-icon-green">⟡</div>
              <h3 className="home-conference-title">{tr("AWARDS", "AWARDS")}</h3>
              <p className="home-conference-desc">{tr("Cérémonie de clôture récompensant l&apos;audace.", "Closing ceremony rewarding boldness.")}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-night-section px-4">
        <div className="home-night-wrap max-w-7xl mx-auto">
          <div className="home-night-content">
            <span className="home-night-badge">{tr("SOIRÉE DE CLÔTURE", "CLOSING NIGHT")}</span>
            <h2 className="home-night-title">
              MARS.A.I
              <br />
              <span>NIGHT</span>
            </h2>
            <p className="home-night-text">
              {tr("Fête Électro mêlant IA et futurs souhaitables.", "Electro party blending AI and desirable futures.")}
              <br />
              {tr("Une expérience immersive sonore et visuelle.", "An immersive sound and visual experience.")}
            </p>
          </div>

          <aside className="home-night-booking">
            <div className="home-night-clock">◷</div>
            <p className="home-night-date">{tr("13 JUIN", "JUNE 13")}</p>
            <p className="home-night-meta">{tr("DÈS 19H00 • MARSEILLE", "FROM 7:00 PM • MARSEILLE")}</p>
            <button className="home-night-btn">{tr("RÉSERVER", "BOOK")}</button>
          </aside>
        </div>
      </section>

      <section className="home-platform-section px-4">
        <div className="max-w-6xl mx-auto">
          <div className="home-platform-head">
            <span className="home-platform-badge">◉ {tr("LE LIEU", "THE VENUE")}</span>
            <h2 className="home-platform-title">
              <span className="home-platform-title-white">LA</span>
              <span className="home-platform-title-outline">PLATEFORME</span>
            </h2>
          </div>

          <div className="home-platform-meta">
            <p className="home-platform-meta-tag">{tr("MARSEILLE HUB CRÉATIF", "MARSEILLE CREATIVE HUB")}</p>
            <p className="home-platform-meta-address">
              12 Rue d&apos;Uzès, 13002
              <br />
              Marseille
            </p>
            <p className="home-platform-meta-transit">{tr("ACCÈS TRAM T2/T3 ARRÊT ARENC LE SILO", "TRAM T2/T3 ACCESS STOP ARENC LE SILO")}</p>
          </div>

          <div className="home-platform-cards">
            <article className="home-platform-card home-platform-card-light">
              <h3>SALLE DES SUCRES</h3>
              <p>
                {tr("Futur sanctuaire des conférences et de la remise des prix de Mars.A.I. Un espace majestueux alliant patrimoine et technologie.", "Future sanctuary for conferences and the Mars.A.I awards ceremony. A majestic space combining heritage and technology.")}
              </p>
            </article>
            <article className="home-platform-card home-platform-card-dark">
              <h3>SALLE PLAZA</h3>
              <p>
                {tr("L&apos;épicentre du festival : accueil, animations, workshops et restauration. Le point de rencontre de tous les participants.", "The epicenter of the festival: welcome area, activities, workshops and catering. The meeting point for all participants.")}
              </p>
            </article>
          </div>

          <div className="home-platform-map-wrap">
            <iframe
              title="Carte de Marseille - Le lieu du festival"
              src="https://www.google.com/maps?q=12+Rue+d%27Uz%C3%A8s,+13002+Marseille&z=13&output=embed"
              className="home-platform-map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <span className="home-platform-map-caption">{tr("LOCALISATION DE L'ÉVÉNEMENT", "EVENT LOCATION")}</span>
          </div>
        </div>
      </section>

      <section className="home-stats-section px-4">
        <div className="home-stats-wrap max-w-6xl mx-auto">
          <div className="home-stats-intro">
            <h2 className="home-stats-title">
              {tr("CHIFFRES", "PROJECTED")}
              <br />
              <span>{tr("PROJETÉS", "FIGURES")}</span>
            </h2>
            <p className="home-stats-subtitle">{tr("ÉCHELLE MONDIALE, IMPACT LOCAL.", "GLOBAL SCALE, LOCAL IMPACT.")}</p>
          </div>

          <div className="home-stats-grid">
            <article className="home-stats-card">
              <p className="home-stats-value">+120</p>
              <p className="home-stats-label">{tr("PAYS REPRÉSENTÉS", "COUNTRIES REPRESENTED")}</p>
            </article>
            <article className="home-stats-card">
              <p className="home-stats-value">+600</p>
              <p className="home-stats-label">{tr("FILMS SOUMIS", "FILMS SUBMITTED")}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-supports-section px-4">
        <div className="max-w-6xl mx-auto">
          <p className="home-supports-kicker">{tr("NOS SOUTIENS", "OUR SUPPORTERS")}</p>
          <h2 className="home-supports-title">
            {tr("ILS SOUTIENNENT", "THEY SUPPORT")} <span>{tr("LE FUTUR", "THE FUTURE")}</span>
          </h2>

          <div className="home-supports-grid">
            {Array.from({ length: 12 }).map((_, idx) => (
              <article key={idx} className="home-support-card">
                <div className="home-support-placeholder" aria-label="Image manquante">
                  <span className="home-support-placeholder-icon">🖼️</span>
                  <span className="home-support-placeholder-text">{tr("IMAGE MANQUANTE", "MISSING IMAGE")}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
