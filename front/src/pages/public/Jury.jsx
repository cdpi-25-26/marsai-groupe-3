import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Jury.css";

const CAROUSEL_DELAY_MS = 5000;
const CAROUSEL_TICK_MS = 50;

const juryMembers = [
  {
    id: 1,
    name: "Julie Masson",
    role: "Réalisatrice IA",
    roleEn: "AI Director",
    description: "Description jury à compléter.",
    descriptionEn: "Jury description to be completed.",
    image: "/src/assets/person.svg",
  },
  {
    id: 2,
    name: "Marc Aubin",
    role: "Directeur Artistique",
    roleEn: "Art Director",
    description: "Description jury à compléter.",
    descriptionEn: "Jury description to be completed.",
    image: "/src/assets/person.svg",
  },
  {
    id: 3,
    name: "Aiko Sato",
    role: "Experte innovation",
    roleEn: "Innovation Expert",
    description: "Description jury à compléter.",
    descriptionEn: "Jury description to be completed.",
    image: "/src/assets/person.svg",
  },
  {
    id: 4,
    name: "Lina Robert",
    role: "Scénariste",
    roleEn: "Screenwriter",
    description: "Description jury à compléter.",
    descriptionEn: "Jury description to be completed.",
    image: "/src/assets/person.svg",
  },
];

const charterItems = [
  {
    id: 1,
    title: "ORIGINALITÉ IA",
    titleEn: "AI ORIGINALITY",
    description: "La pertinence et l'audace de l'usage des outils génératifs.",
    descriptionEn: "The relevance and boldness in the use of generative tools.",
  },
  {
    id: 2,
    title: "ESTHÉTIQUE VISUELLE",
    titleEn: "VISUAL AESTHETICS",
    description: "La cohérence et la beauté du rendu global.",
    descriptionEn: "The coherence and beauty of the overall result.",
  },
  {
    id: 3,
    title: "QUALITÉ NARRATIVE",
    titleEn: "NARRATIVE QUALITY",
    description: "La force de l'histoire racontée en seulement 60 secondes.",
    descriptionEn: "The strength of the story told in just 60 seconds.",
  },
  {
    id: 4,
    title: "ÉMOTION & IMPACT",
    titleEn: "EMOTION & IMPACT",
    description: "La capacité du film à toucher le spectateur.",
    descriptionEn: "The film's ability to move the audience.",
  },
];

export default function Jury() {
  const { tr } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeMember = useMemo(() => juryMembers[activeIndex], [activeIndex]);

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? juryMembers.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === juryMembers.length - 1 ? 0 : current + 1));
  };

  const selectMember = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    setProgress(0);

    if (isCarouselHovered) {
      return undefined;
    }

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min((elapsed / CAROUSEL_DELAY_MS) * 100, 100);

      setProgress(nextProgress);

      if (elapsed >= CAROUSEL_DELAY_MS) {
        setActiveIndex((current) => (current === juryMembers.length - 1 ? 0 : current + 1));
      }
    }, CAROUSEL_TICK_MS);

    return () => window.clearInterval(interval);
  }, [activeIndex, isCarouselHovered]);

  return (
    <div className="jury-page">
      <section className="jury-president-section">
        <p className="jury-kicker">
          <span className="jury-kicker-icon" aria-hidden="true" />
          {tr("Les membres du jury", "Jury members")}
        </p>

        <div className="jury-president-card">
          <div className="jury-president-visual">
            <img src="/src/assets/pres-jury.png" alt={tr("Président du jury", "Jury president")} className="jury-president-image" />
            <div className="jury-president-image-overlay" aria-hidden="true" />

            <div className="jury-president-image-caption">
              <p className="jury-president-label">{tr("Président du jury", "Jury president")}</p>
              <h2>Julien Valros</h2>
            </div>
          </div>

          <div className="jury-president-content">
            <h1 className="jury-president-title">
              {tr("Un jury", "A jury")}
              <br />
              {tr("d'exception", "of excellence")}
              <br />
              <span>{tr("pour le futur", "for the future")}</span>
            </h1>

            <div className="jury-president-quote">
              <div className="jury-president-quote-head">
                <p className="jury-president-quote-mark" aria-hidden="true">❞</p>
                <p className="jury-president-intro">
                  {tr(
                    "Réalisateur marseillais multiprimé, Julien Valros apporte son regard sans concession sur la narration et l'émotion cinématographique.",
                    "An award-winning filmmaker from Marseille, Julien Valros brings his uncompromising perspective on storytelling and cinematic emotion."
                  )}
                </p>
              </div>
              <p className="jury-president-quote-text">
                {tr(
                  '"Nous ne jugeons pas seulement des films, mais des visions d\'avenirs souhaitables créées avec des outils qui nous dépassent encore. C\'est le début d\'une nouvelle ère."',
                  '"We are not judging films alone, but visions of desirable futures created with tools that still surpass us. This is the beginning of a new era."'
                )}
              </p>
              <button type="button" className="jury-president-cta">{tr("Voir sa filmographie", "See filmography")}</button>
            </div>
          </div>
        </div>
      </section>

      <section className="jury-carousel-section">
        <div className="jury-section-head">
          <h2>
            {tr("Les membres", "The members")}
            <br />
            <span>{tr("du jury", "of the jury")}</span>
          </h2>
          <p>{tr("Experts IA, cinéastes et visionnaires réunis pour délibérer sur la sélection officielle.", "AI experts, filmmakers and visionaries gathered to deliberate on the official selection.")}</p>
        </div>

        <div
          className="jury-carousel-shell"
          onMouseEnter={() => {
            setIsCarouselHovered(true);
            setProgress(0);
          }}
          onMouseLeave={() => setIsCarouselHovered(false)}
        >
          <div className="jury-carousel-panel">
            <button type="button" className="jury-carousel-arrow" onClick={showPrevious} aria-label={tr("Membre précédent", "Previous member")}>
              <span>←</span>
              <small>{tr("Précédent", "Previous")}</small>
            </button>

            <article className="jury-carousel-card" key={activeMember.id}>
              <div className="jury-member-visual">
                <img src={activeMember.image} alt={activeMember.name} className="jury-member-image" />
                <div className="jury-member-glow" aria-hidden="true" />
                <p className="jury-member-index" aria-hidden="true">
                  {String(activeIndex + 1).padStart(2, "0")}
                </p>
              </div>

              <div className="jury-member-info">
                <div className="jury-member-meta">
                  <p className="jury-member-role">{tr(activeMember.role, activeMember.roleEn)}</p>
                  <p className="jury-member-count">
                    {tr("Membre", "Member")} {activeIndex + 1}/{juryMembers.length}
                  </p>
                </div>
                <h3>{activeMember.name}</h3>
                <p className="jury-member-description">{tr(activeMember.description, activeMember.descriptionEn)}</p>
              </div>
            </article>

            <button type="button" className="jury-carousel-arrow" onClick={showNext} aria-label={tr("Membre suivant", "Next member")}>
              <span>→</span>
              <small>{tr("Suivant", "Next")}</small>
            </button>
          </div>

          <div className="jury-carousel-progress" aria-hidden="true">
            <span className="jury-carousel-progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <div className="jury-carousel-dots" role="tablist" aria-label={tr("Sélection des membres du jury", "Jury member selection")}>
            {juryMembers.map((member, index) => (
              <button
                key={member.id}
                type="button"
                className={`jury-dot ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => selectMember(index)}
                aria-label={`${tr("Afficher", "Show")} ${member.name}`}
                aria-selected={index === activeIndex}
                role="tab"
              />
            ))}
          </div>

          <div className="jury-member-strip" role="listbox" aria-label={tr("Navigation rapide du jury", "Quick jury navigation")}>
            {juryMembers.map((member, index) => (
              <button
                key={member.id}
                type="button"
                className={`jury-strip-item ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => selectMember(index)}
                aria-label={`${tr("Afficher", "Show")} ${member.name}`}
              >
                <img src={member.image} alt="" aria-hidden="true" />
                <span>{member.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="jury-charter-section">
        <h2>
          {tr("La charte", "The charter")}
          <br />
          <span>{tr("de notation", "for scoring")}</span>
        </h2>

        <div className="jury-charter-list">
          {charterItems.map((item) => (
            <article key={item.id} className="jury-charter-item">
              <div className="jury-charter-id">{item.id}</div>
              <div>
                <h3>{tr(item.title, item.titleEn)}</h3>
                <p>{tr(item.description, item.descriptionEn)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
