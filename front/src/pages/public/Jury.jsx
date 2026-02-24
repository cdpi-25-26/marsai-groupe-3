import { useEffect, useMemo, useState } from "react";
import "./Jury.css";

const CAROUSEL_DELAY_MS = 5000;
const CAROUSEL_TICK_MS = 50;

const juryMembers = [
  {
    id: 1,
    name: "Julie Masson",
    role: "Réalisatrice IA",
    description: "Description jury à compléter.",
    image: "/src/assets/person.svg",
  },
  {
    id: 2,
    name: "Marc Aubin",
    role: "Directeur Artistique",
    description: "Description jury à compléter.",
    image: "/src/assets/person.svg",
  },
  {
    id: 3,
    name: "Aiko Sato",
    role: "Experte innovation",
    description: "Description jury à compléter.",
    image: "/src/assets/person.svg",
  },
  {
    id: 4,
    name: "Lina Robert",
    role: "Scénariste",
    description: "Description jury à compléter.",
    image: "/src/assets/person.svg",
  },
];

const charterItems = [
  {
    id: 1,
    title: "ORIGINALITÉ IA",
    description: "La pertinence et l'audace de l'usage des outils génératifs.",
  },
  {
    id: 2,
    title: "ESTHÉTIQUE VISUELLE",
    description: "La cohérence et la beauté du rendu global.",
  },
  {
    id: 3,
    title: "QUALITÉ NARRATIVE",
    description: "La force de l'histoire racontée en seulement 60 secondes.",
  },
  {
    id: 4,
    title: "ÉMOTION & IMPACT",
    description: "La capacité du film à toucher le spectateur.",
  },
];

export default function Jury() {
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
          Les membres du jury
        </p>

        <div className="jury-president-card">
          <div className="jury-president-visual">
            <img src="/src/assets/pres-jury.png" alt="Président du jury" className="jury-president-image" />
            <div className="jury-president-image-overlay" aria-hidden="true" />

            <div className="jury-president-image-caption">
              <p className="jury-president-label">Président du jury</p>
              <h2>Julien Valros</h2>
            </div>
          </div>

          <div className="jury-president-content">
            <h1 className="jury-president-title">
              Un jury
              <br />
              d&apos;exception
              <br />
              <span>pour le futur</span>
            </h1>

            <div className="jury-president-quote">
              <div className="jury-president-quote-head">
                <p className="jury-president-quote-mark" aria-hidden="true">❞</p>
                <p className="jury-president-intro">
                  Réalisateur marseillais multiprimé, Julien Valros apporte son regard sans concession sur la narration
                  et l&apos;émotion cinématographique.
                </p>
              </div>
              <p className="jury-president-quote-text">
                "Nous ne jugeons pas seulement des films, mais des visions d&apos;avenirs souhaitables créées avec des
                outils qui nous dépassent encore. C&apos;est le début d&apos;une nouvelle ère."
              </p>
              <button type="button" className="jury-president-cta">Voir sa filmographie</button>
            </div>
          </div>
        </div>
      </section>

      <section className="jury-carousel-section">
        <div className="jury-section-head">
          <h2>
            Les membres
            <br />
            <span>du jury</span>
          </h2>
          <p>Experts IA, cinéastes et visionnaires réunis pour délibérer sur la sélection officielle.</p>
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
            <button type="button" className="jury-carousel-arrow" onClick={showPrevious} aria-label="Membre précédent">
              <span>←</span>
              <small>Précédent</small>
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
                  <p className="jury-member-role">{activeMember.role}</p>
                  <p className="jury-member-count">
                    Membre {activeIndex + 1}/{juryMembers.length}
                  </p>
                </div>
                <h3>{activeMember.name}</h3>
                <p className="jury-member-description">{activeMember.description}</p>
              </div>
            </article>

            <button type="button" className="jury-carousel-arrow" onClick={showNext} aria-label="Membre suivant">
              <span>→</span>
              <small>Suivant</small>
            </button>
          </div>

          <div className="jury-carousel-progress" aria-hidden="true">
            <span className="jury-carousel-progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <div className="jury-carousel-dots" role="tablist" aria-label="Sélection des membres du jury">
            {juryMembers.map((member, index) => (
              <button
                key={member.id}
                type="button"
                className={`jury-dot ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => selectMember(index)}
                aria-label={`Afficher ${member.name}`}
                aria-selected={index === activeIndex}
                role="tab"
              />
            ))}
          </div>

          <div className="jury-member-strip" role="listbox" aria-label="Navigation rapide du jury">
            {juryMembers.map((member, index) => (
              <button
                key={member.id}
                type="button"
                className={`jury-strip-item ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => selectMember(index)}
                aria-label={`Afficher ${member.name}`}
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
          La charte
          <br />
          <span>de notation</span>
        </h2>

        <div className="jury-charter-list">
          {charterItems.map((item) => (
            <article key={item.id} className="jury-charter-item">
              <div className="jury-charter-id">{item.id}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
