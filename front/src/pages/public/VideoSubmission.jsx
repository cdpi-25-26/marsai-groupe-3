import { useState } from "react";
import { Link } from "react-router";
import { resolveYoutubeLink, submitVideo, uploadVideoFile } from "../../api/videos";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useAuthSession } from "../../utils/authSession.js";
import { usePhase3Closure } from "../../utils/usePhase3Closure.js";
import PhaseClosedNotice from "../../components/PhaseClosedNotice.jsx";
import "./VideoSubmission.css";

const FormInput = ({ label, required, wrapperClassName = "", tr, ...props }) => (
  <div className={wrapperClassName}>
    <label className="label">
      {label} {required && tr("*", "*")}
    </label>
    <input className="input" required={required} {...props} />
  </div>
);

const FormTextarea = ({ label, required, value, maxLength, tr, ...props }) => (
  <div>
    <label className="label">
      {label} {required && tr("*", "*")}
    </label>
    <textarea className="textarea" required={required} value={value} maxLength={maxLength} {...props} />
    {maxLength && <div className="counter">{value.length} / {maxLength}</div>}
  </div>
);

const TeamMemberForm = ({ member, index, onChange, tr }) => (
  <div className="member">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="label">{tr("CIVILITÉ", "TITLE")} *</label>
        <select className="select" required value={member.civility} onChange={(e) => onChange(index, "civility", e.target.value)}>
          <option value="">--</option>
          <option value="Mr">{tr("M.", "Mr")}</option>
          <option value="Mme">Mme</option>
          <option value="Mx">Mx</option>
        </select>
      </div>
      <FormInput tr={tr} label={tr("PRÉNOM", "FIRST NAME")} required type="text" value={member.firstName} onChange={(e) => onChange(index, "firstName", e.target.value)} placeholder={tr("Ex: Jean", "E.g.: John")} />
      <FormInput tr={tr} label={tr("NOM", "LAST NAME")} required type="text" value={member.lastName} onChange={(e) => onChange(index, "lastName", e.target.value)} placeholder="Dupont" />
      <FormInput tr={tr} label={tr("PROFESSION", "PROFESSION")} required type="text" value={member.profession} onChange={(e) => onChange(index, "profession", e.target.value)} placeholder={tr("Réalisateur", "Director")} />
    </div>
    <div className="mt-4">
      <FormInput tr={tr} label="EMAIL" required type="email" value={member.email} onChange={(e) => onChange(index, "email", e.target.value)} placeholder="email@example.com" />
    </div>
  </div>
);

const FIXED_YOUTUBE_LINK = "https://www.youtube.com/watch?v=zBjJUV-lzHo";

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

export default function VideoSubmission() {
  const { tr } = useLanguage();
  const { token } = useAuthSession();
  const { isCheckingPhaseStatus, isPhase3Closed } = usePhase3Closure();
  const isAuthenticated = Boolean(token);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResolvingYoutube, setIsResolvingYoutube] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [youtubeMeta, setYoutubeMeta] = useState(null);

  const [formData, setFormData] = useState({
    title: "", titleEnglish: "", duration: "", language: "",
    synopsisOriginal: "", synopsisEnglish: "",
    classification: "", techStack: "", methodology: "",
    youtubeLink: "", hasSubtitles: false, subtitlesFile: null, thumbnail: "",
    videoFile: null,
    mediaGallery: ["", "", ""],
    team: [{ civility: "", firstName: "", lastName: "", profession: "", email: "" }],
    certifiedOwnership: false,
  });

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const updateTeamMember = (index, field, value) => {
    const newTeam = [...formData.team];
    newTeam[index][field] = value;
    updateField("team", newTeam);
  };

  const addTeamMember = () => {
    updateField("team", [...formData.team, { civility: "", firstName: "", lastName: "", profession: "", email: "" }]);
  };

  const updateMedia = (index, value) => {
    const newMedia = [...formData.mediaGallery];
    newMedia[index] = value;
    updateField("mediaGallery", newMedia);
  };

  const handleAutofillForm = () => {
    const themesFr = ["Horizons Numériques", "Les Sables du Futur", "Mémoire Synthétique", "La Dernière Interface", "Échos Quantiques"];
    const themesEn = ["Digital Horizons", "Sands of Tomorrow", "Synthetic Memory", "The Last Interface", "Quantum Echoes"];
    const languages = ["Français", "English", "Español", "Deutsch", "العربية"];
    const jobsFr = ["Réalisateur", "Scénariste", "Compositeur", "Monteur", "Directeur photo"];
    const jobsEn = ["Director", "Screenwriter", "Composer", "Editor", "Director of Photography"];
    const firstNames = ["Alex", "Maya", "Nora", "Idriss", "Lina", "Sam"];
    const lastNames = ["Martin", "Diallo", "Garcia", "Nguyen", "Khan", "Rossi"];

    const projectTitleFr = pickRandom(themesFr);
    const projectTitleEn = pickRandom(themesEn);
    const language = pickRandom(languages);
    const firstName = pickRandom(firstNames);
    const lastName = pickRandom(lastNames);

    setYoutubeMeta(null);
    setError(null);

    setFormData((prev) => ({
      ...prev,
      title: `${projectTitleFr} ${Math.floor(Math.random() * 90) + 10}`,
      titleEnglish: `${projectTitleEn} ${Math.floor(Math.random() * 90) + 10}`,
      duration: "60",
      language,
      synopsisOriginal: "Un créateur tente de préserver une émotion humaine dans un monde dominé par les intelligences artificielles.",
      synopsisEnglish: "A creator tries to preserve human emotion in a world driven by artificial intelligence.",
      classification: Math.random() > 0.5 ? "generation_integrale" : "production_hybride",
      techStack: "Midjourney, Runway, ElevenLabs, DaVinci Resolve",
      methodology: "Écriture humaine, génération visuelle assistée par IA, puis montage et sound design supervisés par une équipe artistique.",
      youtubeLink: FIXED_YOUTUBE_LINK,
      hasSubtitles: Math.random() > 0.5,
      subtitlesFile: null,
      thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
      videoFile: null,
      mediaGallery: [
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
      ],
      team: [
        {
          civility: Math.random() > 0.5 ? "Mr" : "Mme",
          firstName,
          lastName,
          profession: pickRandom(tr("Réalisateur", "Director") === "Réalisateur" ? jobsFr : jobsEn),
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        },
      ],
      certifiedOwnership: true,
    }));
  };

  const handleResolveYoutube = async () => {
    if (!formData.youtubeLink) {
      setYoutubeMeta(null);
      return;
    }

    setIsResolvingYoutube(true);
    setError(null);

    try {
      const response = await resolveYoutubeLink(formData.youtubeLink);
      const metadata = response.data;

      setYoutubeMeta(metadata);
      updateField("youtubeLink", metadata.canonicalUrl || formData.youtubeLink);

      if (!formData.thumbnail && metadata.thumbnail) {
        updateField("thumbnail", metadata.thumbnail);
      }

      if (!formData.duration && metadata.durationSeconds) {
        updateField("duration", String(metadata.durationSeconds));
      }
    } catch (err) {
      setYoutubeMeta(null);
      setError(err.response?.data?.error || tr("Lien YouTube invalide", "Invalid YouTube link"));
    } finally {
      setIsResolvingYoutube(false);
    }
  };

  if (isCheckingPhaseStatus) {
    return null;
  }

  if (isPhase3Closed) {
    return <PhaseClosedNotice />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError(tr("Vous devez être connecté pour soumettre une vidéo.", "You must be logged in to submit a video."));
      return;
    }

    if (!formData.youtubeLink && !formData.videoFile) {
      setError(tr("Ajoutez soit un lien YouTube, soit un fichier vidéo.", "Add either a YouTube link or a video file."));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let uploadedVideoUrl = "";
      let resolvedYoutubeUrl = formData.youtubeLink;

      if (formData.youtubeLink) {
        const ytResponse = await resolveYoutubeLink(formData.youtubeLink);
        const metadata = ytResponse.data;
        setYoutubeMeta(metadata);
        resolvedYoutubeUrl = metadata.canonicalUrl || formData.youtubeLink;

        if (!formData.thumbnail && metadata.thumbnail) {
          updateField("thumbnail", metadata.thumbnail);
        }
      }

      if (formData.videoFile) {
        const uploadResponse = await uploadVideoFile(formData.videoFile);
        uploadedVideoUrl = uploadResponse.data?.fileUrl || "";
      }

      const submissionData = {
        ...formData,
        youtubeLink: resolvedYoutubeUrl,
        duration: parseInt(formData.duration),
        mediaGallery: formData.mediaGallery.filter((url) => url.trim() !== ""),
        videoFileUrl: uploadedVideoUrl,
      };

      delete submissionData.videoFile;

      await submitVideo(submissionData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || tr("Erreur lors de la soumission", "Error while submitting"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="success">
        <div className="card">
          <div className="emoji">🎉</div>
          <h2 className="title">{tr("Soumission réussie !", "Submission successful!")}</h2>
          <p className="text">
            {tr("Votre film a été soumis avec succès. Notre équipe va l'examiner prochainement.", "Your film has been submitted successfully. Our team will review it shortly.")}
          </p>
          <button onClick={() => (window.location.href = "/")} className="btn">
            {tr("Retour à l'accueil", "Back to home")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="wrapper">
        {!isAuthenticated && (
          <div className="error">
            {tr("Vous devez être connecté pour envoyer une vidéo.", "You must be logged in to send a video.")} <Link to="/auth/login">{tr("Se connecter", "Log in")}</Link>
          </div>
        )}

        <header className="header">
          <div className="badge-p2">{tr("✨ APPEL À PROJETS 2026 ✨", "✨ CALL FOR PROJECTS 2026 ✨")}</div>
          <h1 className="title">
            {tr("DÉPOSER UN", "SUBMIT A")} <span className="highlight">{tr("FILM", "FILM")}</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-end">
            <button type="button" onClick={handleAutofillForm} className="add-btn">
              {tr("REMPLIR AUTOMATIQUEMENT LE FORMULAIRE", "AUTO-FILL FORM")}
            </button>
          </div>

          <div className="info">
            <div className="icon-p2">☑️</div>
            <p className="text">
              {tr("TRANSMETTEZ LES ÉLÉMENTS TECHNIQUES, L'USAGE DE L'IA ET LA COMPOSITION DE VOTRE ÉQUIPE. TOUS LES CHAMPS MARQUÉS D'UNE ÉTOILE (*) SONT OBLIGATOIRES.", "PROVIDE THE TECHNICAL DETAILS, AI USAGE, AND YOUR TEAM COMPOSITION. ALL FIELDS MARKED WITH AN ASTERISK (*) ARE REQUIRED.")}
            </p>
          </div>

          <section className="section">
            <div className="section-header">
              <span className="icon">🎞️</span>
              <h2 className="section-title">{tr("01. IDENTITÉ DU FILM", "01. FILM IDENTITY")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput tr={tr} label={tr("TITRE DU COURT MÉTRAGE", "SHORT FILM TITLE")} required type="text" value={formData.title} onChange={(e) => updateField("title", e.target.value)} placeholder={tr("NOM DE VOTRE OEUVRE", "TITLE OF YOUR WORK")} />
              <FormInput tr={tr} label={tr("TRADUCTION ANGLAISE", "ENGLISH TITLE")} required type="text" value={formData.titleEnglish} onChange={(e) => updateField("titleEnglish", e.target.value)} placeholder={tr("NOM DE VOTRE OEUVRE", "TITLE OF YOUR WORK")} />
              <FormInput tr={tr} label={tr("DURÉE EXACTE (EN SECONDES)", "EXACT DURATION (IN SECONDS)")} required type="number" value={formData.duration} onChange={(e) => updateField("duration", e.target.value)} placeholder={tr("Ex: 60 SEC", "E.g.: 60 SEC")} />
              <FormInput tr={tr} label={tr("LANGUE PARLÉE / PRINCIPALE DU FILM", "MAIN SPOKEN LANGUAGE OF THE FILM")} required type="text" value={formData.language} onChange={(e) => updateField("language", e.target.value)} placeholder={tr("LANGUE", "LANGUAGE")} />
            </div>
            <div className="mt-6">
              <FormTextarea tr={tr} label={tr("SYNOPSIS LANGUE ORIGINALE ( MAX 300 CARACTÈRES)", "SYNOPSIS IN ORIGINAL LANGUAGE (MAX 300 CHARACTERS)")} required value={formData.synopsisOriginal} onChange={(e) => updateField("synopsisOriginal", e.target.value)} placeholder={tr("RÉSUMEZ L'INTENTION DE VOTRE FILM ET L’HISTOIRE QU’IL RACONTE EN QUELQUES LIGNES.", "Summarize your film’s intent and the story it tells in a few lines.")} maxLength={300} rows={4} />
            </div>
            <div className="mt-6">
              <FormTextarea tr={tr} label={tr("SYNOPSIS ANGLAIS (MAX 300 CARACTÈRES)", "ENGLISH SYNOPSIS (MAX 300 CHARACTERS)")} required value={formData.synopsisEnglish} onChange={(e) => updateField("synopsisEnglish", e.target.value)} placeholder={tr("RÉSUMEZ L'INTENTION DE VOTRE FILM ET L’HISTOIRE QU’IL RACONTE EN QUELQUES LIGNES.", "Summarize your film’s intent and the story it tells in a few lines.")} maxLength={300} rows={4} />
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="icon">🎞️</span>
              <h2 className="section-title">{tr("02. DÉCLARATION USAGE DE L'IA", "02. AI USAGE STATEMENT")}</h2>
            </div>
            <div className="mb-6">
              <p className="text mb-4 flex items-start gap-2">
                <span className="icon-p2">ℹ️</span>
                <span className="text-mars">{tr("MARS.A.I EXIGE UNE TRANSPARENCE TOTALE SUR L'UTILISATION DE L'INTELLIGENCE ARTIFICIELLE. SÉLECTIONNEZ TOUS LES OUTILS GÉNÉRATIFS SOLLICITÉS DANS VOTRE PROCESSUS CRÉATIF.", "MARS.A.I REQUIRES FULL TRANSPARENCY ON THE USE OF ARTIFICIAL INTELLIGENCE. SELECT ALL GENERATIVE TOOLS USED IN YOUR CREATIVE PROCESS.")}</span>
              </p>
              <label className="label">{tr("CLASSIFICATION DE L'ŒUVRE - CHOIX EXCLUSIF ENTRE :", "WORK CLASSIFICATION - EXCLUSIVE CHOICE BETWEEN:")} *</label>
              <div className="space-y-3 mt-3">
                <label className="radio">
                  <input type="radio" name="classification" value="generation_integrale" required checked={formData.classification === "generation_integrale"} onChange={(e) => updateField("classification", e.target.value)} />
                  <span className="radio-label">{tr("GÉNÉRATION INTÉGRALE (100% IA)", "FULL GENERATION (100% AI)")}</span>
                </label>
                <label className="radio">
                  <input type="radio" name="classification" value="production_hybride" required checked={formData.classification === "production_hybride"} onChange={(e) => updateField("classification", e.target.value)} />
                  <span className="radio-label">{tr("PRODUCTION HYBRIDE (PRISES DE VUES RÉELLES + APPORTS IA)", "HYBRID PRODUCTION (LIVE-ACTION SHOTS + AI INPUTS)")}</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextarea tr={tr} label={tr("STACK TECHNOLOGIQUE", "TECH STACK")} required value={formData.techStack} onChange={(e) => updateField("techStack", e.target.value)} placeholder={tr("LISTEZ LES OUTILS UTILISÉS (EX: MIDJOURNEY POUR LES VISUELS, ELEVENLABS POUR LES VOIX, RUNWAY POUR L'ANIMATION...)", "List the tools used (e.g., Midjourney for visuals, ElevenLabs for voices, Runway for animation...)")} maxLength={500} rows={6} />
              <FormTextarea tr={tr} label={tr("MÉTHODOLOGIE CRÉATIVE", "CREATIVE METHODOLOGY")} required value={formData.methodology} onChange={(e) => updateField("methodology", e.target.value)} placeholder={tr("DÉCRIVEZ L'INTERACTION ENTRE L'HUMAIN ET LA MACHINE DANS CE PROCESSUS.", "Describe the interaction between human and machine in this process.")} maxLength={500} rows={6} />
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="icon">🎞️</span>
              <h2 className="section-title">{tr("03. LIVRABLES & ACCESSIBILITÉ", "03. DELIVERABLES & ACCESSIBILITY")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormInput tr={tr} className="input-ytb" label={tr("LIEN YOUTUBE (OPTIONNEL SI FICHIER VIDÉO)", "YOUTUBE LINK (OPTIONAL IF VIDEO FILE)")} required={false} type="url" value={formData.youtubeLink} onChange={(e) => updateField("youtubeLink", e.target.value)} placeholder="https://youtube.com/..." />
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleResolveYoutube}
                    disabled={!formData.youtubeLink || isResolvingYoutube}
                    className="add-btn"
                  >
                    {isResolvingYoutube
                      ? tr("VÉRIFICATION DU LIEN...", "CHECKING LINK...")
                      : tr("VÉRIFIER LE LIEN YOUTUBE", "CHECK YOUTUBE LINK")}
                  </button>
                  {youtubeMeta && (
                    <p className="text mt-2">
                      {tr("Vidéo détectée", "Detected video")} : {youtubeMeta.title || tr("Titre indisponible", "Title unavailable")}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="label">{tr("FICHIER VIDÉO (OPTIONNEL SI YOUTUBE)", "VIDEO FILE (OPTIONAL IF YOUTUBE)")}</label>
                <label className="file-label">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => updateField("videoFile", e.target.files?.[0] || null)}
                    className="file-hidden"
                  />
                  <span className="file-btn">
                    <span className="icon">🎬</span>
                    {tr("CHOISIR UN FICHIER VIDÉO", "CHOOSE A VIDEO FILE")}
                  </span>
                  {formData.videoFile && (
                    <span className="file-name">{formData.videoFile.name}</span>
                  )}
                </label>
              </div>
              <div>
                <label className="label">{tr("SOUS-TITRES (.SRT)", "SUBTITLES (.SRT)")}</label>
                <label htmlFor="hasSubtitles" className="checkbox-wrapper">
                  <input
                    id="hasSubtitles"
                    type="checkbox"
                    checked={formData.hasSubtitles}
                    onChange={(e) => updateField("hasSubtitles", e.target.checked)}
                    className="checkbox"
                  />
                  <span className="checkbox-label">{tr("VOIX OU TEXTES NÉCESSITANT DES SOUS-TITRES", "VOICES OR TEXTS REQUIRING SUBTITLES")}</span>
                </label>
                <label className="file-label">
                  <input
                    type="file"
                    accept=".srt"
                    onChange={(e) => updateField("subtitlesFile", e.target.files[0])}
                    className="file-hidden"
                  />
                  <span className="file-btn">
                    <span className="icon">📁</span>
                    {tr("CHOISIR UN FICHIER .SRT", "CHOOSE A .SRT FILE")}
                  </span>
                  {formData.subtitlesFile && (
                    <span className="file-name">{formData.subtitlesFile.name}</span>
                  )}
                </label>
              </div>
            </div>
            <div className="mt-6">
              <label className="label">{tr("VIGNETTE OFFICIELLE (16:9)", "OFFICIAL THUMBNAIL (16:9)")} *</label>
              <div className="upload">
                <div className="icon">🖼️</div>
                <div className="upload-title">{tr("HAUTE RÉSOLUTION", "HIGH RESOLUTION")}</div>
                <div className="upload-subtitle">{tr("PNG ou JPG - Max 15Mo", "PNG or JPG - Max 15MB")}</div>
                <input type="url" value={formData.thumbnail} onChange={(e) => updateField("thumbnail", e.target.value)} placeholder={tr("URL de la vignette", "Thumbnail URL")} className="input mt-4" />
              </div>
            </div>
            <div className="mt-6">
              <label className="label">{tr("GALERIE MÉDIAS (STILLS - MAX 3)", "MEDIA GALLERY (STILLS - MAX 3)")}</label>
              <div className="gallery">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="item">
                    <div className="content">
                      <div className="icon">🖼️</div>
                      <input type="url" value={formData.mediaGallery[index]} onChange={(e) => updateMedia(index, e.target.value)} placeholder={`${tr("Image", "Image")} ${index + 1}`} className="input" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="icon">🎞️</span>
              <h2 className="section-title">{tr("04. COMPOSITION DE L'ÉQUIPE", "04. TEAM COMPOSITION")}</h2>
            </div>
            {formData.team.map((member, index) => (
              <TeamMemberForm key={index} member={member} index={index} onChange={updateTeamMember} tr={tr} />
            ))}
            <button type="button" onClick={addTeamMember} className="add-btn">
              + {tr("AJOUTER COLLABORATEUR", "ADD COLLABORATOR")}
            </button>
          </section>

          <div className="cert">
            <div className="cert-header">
              <span className="icon">📜</span>
              <div>
                <h2 className="title">{tr("CERTIFICAT DE PROPRIÉTÉ", "OWNERSHIP CERTIFICATE")}</h2>
                <p className="text">
                  {tr("EN SOUMETTANT CE DOSSIER, VOUS CERTIFIEZ SUR L'HONNEUR ÊTRE L'AUTEUR ORIGINAL DE L'ŒUVRE ET DÉTENIR L'INTÉGRALITÉ DES DROITS.", "BY SUBMITTING THIS FILE, YOU CERTIFY ON YOUR HONOR THAT YOU ARE THE ORIGINAL AUTHOR OF THE WORK AND HOLD ALL RIGHTS.")}
                </p>
              </div>
            </div>
            <label htmlFor="certifiedOwnership" className="cert-wrapper">
              <input id="certifiedOwnership" type="checkbox" required checked={formData.certifiedOwnership} onChange={(e) => updateField("certifiedOwnership", e.target.checked)} className="checkbox" />
              <span className="label">{tr("J'accepte et certifie ces conditions", "I accept and certify these conditions")} *</span>
            </label>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="submit-wrapper">
            <button
              type="submit"
              disabled={isSubmitting || !formData.certifiedOwnership || !isAuthenticated}
              className="submit-btn"
            >
              {isSubmitting ? tr("ENVOI EN COURS...", "SENDING...") : tr("FINALISER MA SOUMISSION →", "FINALIZE MY SUBMISSION →")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
