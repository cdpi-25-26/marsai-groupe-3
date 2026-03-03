import "./Home.css";
import { Link } from "react-router";

function Home() {
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
            <span>Le protocole temporel 2026</span>
          </div>

          <h1 className="text-[72px] leading-[0.9] md:text-[132px] font-black uppercase tracking-[-0.04em] mb-5">
            <span className="text-white">MARS</span>
            <span className="home-hero-title-ai">AI</span>
          </h1>

          <p className="text-2xl md:text-[42px] leading-[1.05] font-extrabold uppercase tracking-tight mb-2">
            IMAGINEZ DES <span className="home-hero-title-futurs">FUTURS</span> SOUHAITABLES
          </p>
          <p className="text-lg md:text-[31px] text-white/65 mb-2">
            Le festival de courts-métrages de 60 secondes réalisés par IA.
          </p>
          <p className="text-lg md:text-[31px] italic text-white/80 mb-12">
            2 jours d'immersion au cœur de Marseille.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link className="home-hero-btn home-hero-btn-primary" to="/gallery">
              VOIR LES FILMS <span aria-hidden="true">→</span>
            </Link>
            <button className="home-hero-btn home-hero-btn-secondary">
              MON ESPACE AI <span aria-hidden="true">›</span>
            </button>
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
              <h3 className="home-pillar-title">{pillar.title}</h3>
              <p className="home-pillar-desc">{pillar.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-films-section px-4">
        <div className="home-films-wrap max-w-6xl mx-auto">
          <div className="home-films-header">
            <div>
              <p className="home-films-kicker">— LE PROJET MARS.AI</p>
              <h2 className="home-films-title">
                FILMS EN
                <br />
                COMPÉTITION
              </h2>
            </div>

            <div className="home-films-header-right">
              <p className="home-films-subtitle">
                Découvrez une sélection d'œuvres pionnières explorant les nouvelles frontières de l'imaginaire assisté par l'IA.
              </p>
              <button className="home-films-cta">
                VOIR LA SÉLECTION <span className="home-films-cta-icon">→</span>
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
            OBJECTIFS DU <span>FESTIVAL</span>
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
                  {item.titleTop}
                  <br />
                  {item.titleBottom}
                </h3>
                <p className="home-objective-card-desc">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-protocol-section px-4">
        <div className="max-w-6xl mx-auto">
          <p className="home-protocol-kicker">IMMERSION TOTALE</p>
          <h2 className="home-protocol-title">
            LE PROTOCOLE
            <br />
            TEMPOREL
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
                <p className="home-protocol-card-desc">{item.desc}</p>
              </article>
            ))}
          </div>

          <button className="home-protocol-btn">REJOINDRE L&apos;AVENTURE</button>
        </div>
      </section>

      <section className="home-conferences-section px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="home-conferences-title">
            DEUX JOURNÉES DE
            <br />
            <span>CONFÉRENCES GRATUITES</span>
          </h2>

          <ol className="home-conferences-list">
            <li>1. Débats engagés sur l&apos;éthique et le future</li>
            <li>2. Confrontations d&apos;idées entre artistes et tech</li>
            <li>3. Interrogations stimulantes sur la création</li>
          </ol>

          <button className="home-conferences-agenda">🗓 AGENDA COMPLET</button>

          <div className="home-conferences-grid">
            <article className="home-conference-card home-conference-card-light">
              <div className="home-conference-icon home-conference-icon-purple">▷</div>
              <h3 className="home-conference-title">PROJECTIONS</h3>
              <p className="home-conference-desc">Diffusion sur écran géant en présence des réalisateurs.</p>
            </article>

            <article className="home-conference-card home-conference-card-dark">
              <div className="home-conference-icon home-conference-icon-pink">◌</div>
              <h3 className="home-conference-title">WORKSHOPS</h3>
              <p className="home-conference-desc">Sessions pratiques pour maîtriser les outils IA.</p>
            </article>

            <article className="home-conference-card home-conference-card-dark home-conference-card-violet">
              <div className="home-conference-icon home-conference-icon-green">⟡</div>
              <h3 className="home-conference-title">AWARDS</h3>
              <p className="home-conference-desc">Cérémonie de clôture récompensant l&apos;audace.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-night-section px-4">
        <div className="home-night-wrap max-w-7xl mx-auto">
          <div className="home-night-content">
            <span className="home-night-badge">SOIRÉE DE CLÔTURE</span>
            <h2 className="home-night-title">
              MARS.A.I
              <br />
              <span>NIGHT</span>
            </h2>
            <p className="home-night-text">
              Fête Électro mêlant IA et futurs souhaitables.
              <br />
              Une expérience immersive sonore et visuelle.
            </p>
          </div>

          <aside className="home-night-booking">
            <div className="home-night-clock">◷</div>
            <p className="home-night-date">13 JUIN</p>
            <p className="home-night-meta">DÈS 19H00 • MARSEILLE</p>
            <button className="home-night-btn">RÉSERVER</button>
          </aside>
        </div>
      </section>

      <section className="home-platform-section px-4">
        <div className="max-w-6xl mx-auto">
          <div className="home-platform-head">
            <span className="home-platform-badge">◉ LE LIEU</span>
            <h2 className="home-platform-title">
              <span className="home-platform-title-white">LA</span>
              <span className="home-platform-title-outline">PLATEFORME</span>
            </h2>
          </div>

          <div className="home-platform-meta">
            <p className="home-platform-meta-tag">MARSEILLE HUB CRÉATIF</p>
            <p className="home-platform-meta-address">
              12 Rue d&apos;Uzès, 13002
              <br />
              Marseille
            </p>
            <p className="home-platform-meta-transit">ACCÈS TRAM T2/T3 ARRÊT ARENC LE SILO</p>
          </div>

          <div className="home-platform-cards">
            <article className="home-platform-card home-platform-card-light">
              <h3>SALLE DES SUCRES</h3>
              <p>
                Futur sanctuaire des conférences et de la remise des prix de Mars.A.I. Un espace majestueux alliant patrimoine et technologie.
              </p>
            </article>
            <article className="home-platform-card home-platform-card-dark">
              <h3>SALLE PLAZA</h3>
              <p>
                L&apos;épicentre du festival : accueil, animations, workshops et restauration. Le point de rencontre de tous les participants.
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
            <span className="home-platform-map-caption">LOCALISATION DE L'ÉVÉNEMENT</span>
          </div>
        </div>
      </section>

      <section className="home-stats-section px-4">
        <div className="home-stats-wrap max-w-6xl mx-auto">
          <div className="home-stats-intro">
            <h2 className="home-stats-title">
              CHIFFRES
              <br />
              <span>PROJETÉS</span>
            </h2>
            <p className="home-stats-subtitle">ÉCHELLE MONDIALE, IMPACT LOCAL.</p>
          </div>

          <div className="home-stats-grid">
            <article className="home-stats-card">
              <p className="home-stats-value">+120</p>
              <p className="home-stats-label">PAYS REPRÉSENTÉS</p>
            </article>
            <article className="home-stats-card">
              <p className="home-stats-value">+600</p>
              <p className="home-stats-label">FILMS SOUMIS</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home-supports-section px-4">
        <div className="max-w-6xl mx-auto">
          <p className="home-supports-kicker">NOS SOUTIENS</p>
          <h2 className="home-supports-title">
            ILS SOUTIENNENT <span>LE FUTUR</span>
          </h2>

          <div className="home-supports-grid">
            {Array.from({ length: 12 }).map((_, idx) => (
              <article key={idx} className="home-support-card">
                <div className="home-support-placeholder" aria-label="Image manquante">
                  <span className="home-support-placeholder-icon">🖼️</span>
                  <span className="home-support-placeholder-text">IMAGE MANQUANTE</span>
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
