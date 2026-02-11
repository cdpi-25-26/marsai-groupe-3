import { useState } from "react";
import { submitVideo } from "../../api/videos";
import "./VideoSubmission.css";

const FormInput = ({ label, required, wrapperClassName = "", ...props }) => (
  <div className={wrapperClassName}>
    <label className="label">
      {label} {required && "*"}
    </label>
    <input className="input" required={required} {...props} />
  </div>
);

const FormTextarea = ({ label, required, value, maxLength, ...props }) => (
  <div>
    <label className="label">
      {label} {required && "*"}
    </label>
    <textarea className="textarea" required={required} value={value} maxLength={maxLength} {...props} />
    {maxLength && <div className="counter">{value.length} / {maxLength}</div>}
  </div>
);

const TeamMemberForm = ({ member, index, onChange }) => (
  <div className="member">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="label">CIVILITÉ *</label>
        <select className="select" required value={member.civility} onChange={(e) => onChange(index, "civility", e.target.value)}>
          <option value="">--</option>
          <option value="Mr">M.</option>
          <option value="Mme">Mme</option>
          <option value="Mx">Mx</option>
        </select>
      </div>
      <FormInput label="PRÉNOM" required type="text" value={member.firstName} onChange={(e) => onChange(index, "firstName", e.target.value)} placeholder="Ex: Jean" />
      <FormInput label="NOM" required type="text" value={member.lastName} onChange={(e) => onChange(index, "lastName", e.target.value)} placeholder="Dupont" />
      <FormInput label="PROFESSION" required type="text" value={member.profession} onChange={(e) => onChange(index, "profession", e.target.value)} placeholder="Réalisateur" />
    </div>
    <div className="mt-4">
      <FormInput label="EMAIL" required type="email" value={member.email} onChange={(e) => onChange(index, "email", e.target.value)} placeholder="email@example.com" />
    </div>
  </div>
);

export default function VideoSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "", titleEnglish: "", duration: "", language: "",
    synopsisOriginal: "", synopsisEnglish: "",
    classification: "", techStack: "", methodology: "",
    youtubeLink: "", hasSubtitles: false, subtitlesFile: null, thumbnail: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const submissionData = {
        ...formData,
        duration: parseInt(formData.duration),
        mediaGallery: formData.mediaGallery.filter((url) => url.trim() !== ""),
      };
      await submitVideo(submissionData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="success">
        <div className="card">
          <div className="emoji">🎉</div>
          <h2 className="title">Soumission réussie !</h2>
          <p className="text">
            Votre film a été soumis avec succès. Notre équipe va l'examiner prochainement.
          </p>
          <button onClick={() => (window.location.href = "/")} className="btn">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="wrapper">
        <header className="header">
          <div className="badge-p2">✨ APPEL À PROJETS 2026 ✨</div>
          <h1 className="title">
            DÉPOSER UN <span className="highlight">FILM</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="info">
            <div className="icon-p2">☑️</div>
            <p className="text">
              TRANSMETTEZ LES ÉLÉMENTS TECHNIQUES, L'USAGE DE L'IA ET LA COMPOSITION DE VOTRE ÉQUIPE. TOUS LES CHAMPS MARQUÉS D'UNE ÉTOILE (*) SONT OBLIGATOIRES.
            </p>
          </div>

          <section className="section">
            <div className="section-header">
              <span className="icon">🎞️</span>
              <h2 className="section-title">01. IDENTITÉ DU FILM</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="TITRE DU COURT MÉTRAGE" required type="text" value={formData.title} onChange={(e) => updateField("title", e.target.value)} placeholder="NOM DE VOTRE OEUVRE" />
              <FormInput label="TRADUCTION ANGLAISE" required type="text" value={formData.titleEnglish} onChange={(e) => updateField("titleEnglish", e.target.value)} placeholder="NOM DE VOTRE OEUVRE" />
              <FormInput label="DURÉE EXACTE (EN SECONDES)" required type="number" value={formData.duration} onChange={(e) => updateField("duration", e.target.value)} placeholder="Ex: 60 SEC" />
              <FormInput label="LANGUE PARLÉE / PRINCIPALE DU FILM" required type="text" value={formData.language} onChange={(e) => updateField("language", e.target.value)} placeholder="LANGUE" />
            </div>
            <div className="mt-6">
              <FormTextarea label="SYNOPSIS LANGUE ORIGINALE ( MAX 300 CARACTÈRES)" required value={formData.synopsisOriginal} onChange={(e) => updateField("synopsisOriginal", e.target.value)} placeholder="RESUMER L'INTENTION DE VOTRE FILM  ET L’HISTOIRE QU’IL RACONTE EN QUELQUES LIGNES ." maxLength={300} rows={4} />
            </div>
            <div className="mt-6">
              <FormTextarea label="SYNOPSIS ANGLAIS (MAX 300 CARACTÈRES)" required value={formData.synopsisEnglish} onChange={(e) => updateField("synopsisEnglish", e.target.value)} placeholder="RESUMER L'INTENTION DE VOTRE FILM  ET L’HISTOIRE QU’IL RACONTE EN QUELQUES LIGNES ." maxLength={300} rows={4} />
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="icon">🎞️</span>
              <h2 className="section-title">02. DÉCLARATION USAGE DE L'IA</h2>
            </div>
            <div className="mb-6">
              <p className="text mb-4 flex items-start gap-2">
                <span className="icon-p2">ℹ️</span>
                <span className="text-mars">MARS.A.I EXIGE UNE TRANSPARENCE TOTALE SUR L'UTILISATION DE L'INTELLIGENCE ARTIFICIELLE. SÉLECTIONNEZ TOUS LES OUTILS GÉNÉRATIFS SOLLICITÉS DANS VOTRE PROCESSUS CRÉATIF.</span>
              </p>
              <label className="label">CLASSIFICATION DE L'ŒUVRE - CHOIX EXCLUSIF ENTRE : *</label>
              <div className="space-y-3 mt-3">
                <label className="radio">
                  <input type="radio" name="classification" value="generation_integrale" required checked={formData.classification === "generation_integrale"} onChange={(e) => updateField("classification", e.target.value)} />
                  <span className="radio-label">GÉNÉRATION INTÉGRALE (100% IA)</span>
                </label>
                <label className="radio">
                  <input type="radio" name="classification" value="production_hybride" required checked={formData.classification === "production_hybride"} onChange={(e) => updateField("classification", e.target.value)} />
                  <span className="radio-label">PRODUCTION HYBRIDE (PRISES DE VUES RÉELLES + APPORTS IA)</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextarea label="STACK TECHNOLOGIQUE" required value={formData.techStack} onChange={(e) => updateField("techStack", e.target.value)} placeholder="LISTEZ LES OUTILS UTILISÉS (EX: MIDJOURNEY POUR LES VISUELS, ELEVENLABS POUR LES VOIX, RUNWAY POUR L'ANIMATION...)" maxLength={500} rows={6} />
              <FormTextarea label="MÉTHODOLOGIE CRÉATIVE" required value={formData.methodology} onChange={(e) => updateField("methodology", e.target.value)} placeholder="DÉCRIVEZ L'INTERACTION ENTRE L'HUMAIN ET LA MACHINE DANS CE PROCESSUS." maxLength={500} rows={6} />
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="icon">🎞️</span>
              <h2 className="section-title">03. LIVRABLES & ACCESSIBILITÉ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput className="input-ytb" label="LIEN YOUTUBE ( PUBLIC / NON RÉPERTORIÉ )" required type="url" value={formData.youtubeLink} onChange={(e) => updateField("youtubeLink", e.target.value)} placeholder="https://youtube.com/..." />
              <div>
                <label className="label">SOUS-TITRES (.SRT)</label>
                <label htmlFor="hasSubtitles" className="checkbox-wrapper">
                  <input
                    id="hasSubtitles"
                    type="checkbox"
                    checked={formData.hasSubtitles}
                    onChange={(e) => updateField("hasSubtitles", e.target.checked)}
                    className="checkbox"
                  />
                  <span className="checkbox-label">VOIX OU TEXTES NÉCESSITANT DES SOUS-TITRES</span>
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
                    CHOISIR UN FICHIER.SRT
                  </span>
                  {formData.subtitlesFile && (
                    <span className="file-name">{formData.subtitlesFile.name}</span>
                  )}
                </label>
              </div>
            </div>
            <div className="mt-6">
              <label className="label">VIGNETTE OFFICIELLE (16:9) *</label>
              <div className="upload">
                <div className="icon">🖼️</div>
                <div className="upload-title">HAUTE RÉSOLUTION</div>
                <div className="upload-subtitle">PNG ou JPG - Max 15Mo</div>
                <input type="url" value={formData.thumbnail} onChange={(e) => updateField("thumbnail", e.target.value)} placeholder="URL de la vignette" className="input mt-4" />
              </div>
            </div>
            <div className="mt-6">
              <label className="label">GALERIE MÉDIAS (STILLS - MAX 3)</label>
              <div className="gallery">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="item">
                    <div className="content">
                      <div className="icon">🖼️</div>
                      <input type="url" value={formData.mediaGallery[index]} onChange={(e) => updateMedia(index, e.target.value)} placeholder={`Image ${index + 1}`} className="input" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <span className="icon">🎞️</span>
              <h2 className="section-title">04. COMPOSITION DE L'ÉQUIPE</h2>
            </div>
            {formData.team.map((member, index) => (
              <TeamMemberForm key={index} member={member} index={index} onChange={updateTeamMember} />
            ))}
            <button type="button" onClick={addTeamMember} className="add-btn">
              + AJOUTER COLLABORATEUR
            </button>
          </section>

          <div className="cert">
            <div className="cert-header">
              <span className="icon">📜</span>
              <div>
                <h2 className="title">CERTIFICAT DE PROPRIÉTÉ</h2>
                <p className="text">
                  EN SOUMETTANT CE DOSSIER, VOUS CERTIFIEZ SUR L'HONNEUR ÊTRE L'AUTEUR ORIGINAL DE L'ŒUVRE ET DÉTENIR L'INTÉGRALITÉ DES DROITS.
                </p>
              </div>
            </div>
            <label htmlFor="certifiedOwnership" className="cert-wrapper">
              <input id="certifiedOwnership" type="checkbox" required checked={formData.certifiedOwnership} onChange={(e) => updateField("certifiedOwnership", e.target.checked)} className="checkbox" />
              <span className="label">J'accepte et certifie ces conditions *</span>
            </label>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="submit-wrapper">
            <button type="submit" disabled={isSubmitting || !formData.certifiedOwnership} className="submit-btn">
              {isSubmitting ? "ENVOI EN COURS..." : "FINALISER MA SOUMISSION →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
