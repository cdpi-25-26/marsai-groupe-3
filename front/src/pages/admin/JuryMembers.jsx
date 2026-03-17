import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getJuryMembers, updateJuryMembers } from "../../api/juryMembers.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const EMPTY_MEMBER = {
  id: 0,
  name: "",
  role: "",
  roleEn: "",
  description: "",
  descriptionEn: "",
  image: "/src/assets/person.svg",
};

function JuryMembers() {
  const { tr } = useLanguage();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  function normalizeLocalMembers(nextMembers) {
    return nextMembers.map((member, index) => ({
      ...EMPTY_MEMBER,
      ...member,
      id: Number(member?.id) || index + 1,
    }));
  }

  function fetchMembers() {
    setIsLoading(true);
    setError("");

    getJuryMembers()
      .then((response) => {
        setMembers(normalizeLocalMembers(response.data || []));
        setIsDirty(false);
      })
      .catch((apiError) => {
        setError(
          apiError?.response?.data?.error ||
            tr("Impossible de charger les membres du jury.", "Unable to load jury members."),
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  const saveMutation = useMutation({
    mutationFn: async () => {
      return await updateJuryMembers(members);
    },
    onSuccess: (response) => {
      setMembers(normalizeLocalMembers(response.data?.members || []));
      setIsDirty(false);
      alert(tr("Membres du jury sauvegardes.", "Jury members saved."));
    },
    onError: (apiError) => {
      alert(
        apiError?.response?.data?.error ||
          tr("Echec de la sauvegarde des membres du jury.", "Failed to save jury members."),
      );
    },
  });

  const canSave = useMemo(() => {
    if (!isDirty || members.length === 0 || saveMutation.isPending) {
      return false;
    }

    return members.every((member) => member.name.trim() && member.role.trim());
  }, [isDirty, members, saveMutation.isPending]);

  function handleMemberChange(index, field, value) {
    setMembers((previous) => {
      const copy = [...previous];
      copy[index] = {
        ...copy[index],
        [field]: value,
      };
      return copy;
    });
    setIsDirty(true);
  }

  function addMember() {
    setMembers((previous) => [
      ...previous,
      {
        ...EMPTY_MEMBER,
        id: previous.length + 1,
      },
    ]);
    setIsDirty(true);
  }

  function removeMember(index) {
    setMembers((previous) => {
      const filtered = previous.filter((_, currentIndex) => currentIndex !== index);
      return filtered.map((member, mappedIndex) => ({
        ...member,
        id: mappedIndex + 1,
      }));
    });
    setIsDirty(true);
  }

  return (
    <div className="jury-admin-panel">
      <div className="jury-admin-actions">
        <button type="button" onClick={addMember}>
          {tr("Ajouter un membre", "Add member")}
        </button>

        <button type="button" onClick={() => fetchMembers()} disabled={isLoading || saveMutation.isPending}>
          {tr("Recharger", "Reload")}
        </button>

        <button type="button" onClick={() => saveMutation.mutate()} disabled={!canSave}>
          {saveMutation.isPending ? tr("Sauvegarde...", "Saving...") : tr("Sauvegarder", "Save")}
        </button>
      </div>

      {error && <p className="jury-admin-error">{error}</p>}
      {isLoading && <p>{tr("Chargement des membres du jury...", "Loading jury members...")}</p>}

      {!isLoading && members.length === 0 && <p>{tr("Aucun membre du jury.", "No jury members yet.")}</p>}

      <div className="jury-admin-list">
        {members.map((member, index) => (
          <article key={`${member.id}-${index}`} className="jury-admin-card">
            <div className="jury-admin-card-head">
              <h4>
                {tr("Membre", "Member")} #{index + 1}
              </h4>
              <button type="button" onClick={() => removeMember(index)}>
                {tr("Supprimer", "Remove")}
              </button>
            </div>

            <label>
              {tr("Nom", "Name")}
              <input
                type="text"
                value={member.name}
                onChange={(event) => handleMemberChange(index, "name", event.target.value)}
                placeholder={tr("Nom du membre", "Member name")}
              />
            </label>

            <label>
              {tr("Role (FR)", "Role (FR)")}
              <input
                type="text"
                value={member.role}
                onChange={(event) => handleMemberChange(index, "role", event.target.value)}
                placeholder={tr("Role en francais", "Role in French")}
              />
            </label>

            <label>
              {tr("Role (EN)", "Role (EN)")}
              <input
                type="text"
                value={member.roleEn}
                onChange={(event) => handleMemberChange(index, "roleEn", event.target.value)}
                placeholder={tr("Role en anglais", "Role in English")}
              />
            </label>

            <label>
              {tr("Description (FR)", "Description (FR)")}
              <textarea
                value={member.description}
                onChange={(event) => handleMemberChange(index, "description", event.target.value)}
                placeholder={tr("Description en francais", "Description in French")}
                rows={3}
              />
            </label>

            <label>
              {tr("Description (EN)", "Description (EN)")}
              <textarea
                value={member.descriptionEn}
                onChange={(event) => handleMemberChange(index, "descriptionEn", event.target.value)}
                placeholder={tr("Description en anglais", "Description in English")}
                rows={3}
              />
            </label>

            <label>
              {tr("Image (URL)", "Image (URL)")}
              <input
                type="text"
                value={member.image}
                onChange={(event) => handleMemberChange(index, "image", event.target.value)}
                placeholder="/src/assets/person.svg"
              />
            </label>
          </article>
        ))}
      </div>
    </div>
  );
}

export default JuryMembers;
