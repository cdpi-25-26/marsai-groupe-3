import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router";

import {
  createUser,
  deleteUser,
  getUserRoles,
  getUsers,
  updateUser,
} from "../../api/users.js";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const registerSchema = z.object({
  id: z.number().optional(),
  username: z.string().email("Merci de renseigner un email valide"),
  password: z.string().optional(),
  role: z.string().min(1, "Role requis"),
});

function Users() {
  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [modeEdit, setModeEdit] = useState(false);
  const [roleDraft, setRoleDraft] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [sortBy, setSortBy] = useState("recent");
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  const defaultRole = useMemo(() => {
    if (availableRoles.length === 0) {
      return "PRODUCER";
    }
    return availableRoles.includes("PRODUCER")
      ? "PRODUCER"
      : availableRoles[0];
  }, [availableRoles]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const list = users.filter((user) => {
      const matchesRole = filterRole === "ALL" || user.role === filterRole;
      if (!matchesRole) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        user.email,
        user.name,
        user.surname,
        `${user.id}`,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });

    return [...list].sort((first, second) => {
      if (sortBy === "email") {
        return (first.email || "").localeCompare(second.email || "");
      }

      if (sortBy === "role") {
        const roleDiff = (first.role || "").localeCompare(second.role || "");
        if (roleDiff !== 0) {
          return roleDiff;
        }
      }

      return (second.id || 0) - (first.id || 0);
    });
  }, [users, searchTerm, filterRole, sortBy]);

  const { register, handleSubmit, setValue, reset } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
    },
  });

  function fetchUsersList() {
    setIsUsersLoading(true);
    setUsersError("");

    getUsers()
      .then((response) => {
        const nextUsers = response.data || [];
        setUsers(nextUsers);

        const nextRoleDraft = {};
        nextUsers.forEach((user) => {
          nextRoleDraft[user.id] = user.role;
        });
        setRoleDraft(nextRoleDraft);
      })
      .catch((error) => {
        const status = error?.response?.status;
        if (status === 401) {
          setUsersError(
            "Accès refusé: connecte-toi avec un compte ADMIN pour afficher les utilisateurs.",
          );
          return;
        }

        setUsersError(
          error?.response?.data?.error ||
            "Impossible de charger les utilisateurs pour le moment.",
        );
      })
      .finally(() => {
        setIsUsersLoading(false);
      });
  }

  useEffect(() => {
    fetchUsersList();
  }, []);

  useEffect(() => {
    getUserRoles().then((response) => {
      const roles = response.data || ["ADMIN", "JURY", "PRODUCER"];
      setAvailableRoles(roles);

      if (roles.length > 0) {
        const preferredRole = roles.includes("PRODUCER") ? "PRODUCER" : roles[0];
        setValue("role", preferredRole);
      }
    }).catch(() => {
      const fallbackRoles = ["ADMIN", "JURY", "PRODUCER"];
      setAvailableRoles(fallbackRoles);
      setValue("role", "PRODUCER");
    });
  }, [setValue]);

  const registerMutation = useMutation({
    mutationFn: async (newUser) => {
      return await createUser(newUser);
    },
    onSuccess: () => {
      alert("Utilisateur créé avec succès");
      fetchUsersList();
      reset({
        id: undefined,
        username: "",
        password: "",
        role: defaultRole,
      });
      setModeEdit(false);
    },
    onError: (error) => {
      const details = error?.response?.data?.details;
      const detailText = Array.isArray(details) && details.length ? `\n- ${details.join("\n- ")}` : "";
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Création utilisateur impossible";

      alert(`${message}${detailText}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await deleteUser(id);
    },
    onSuccess: () => {
      fetchUsersList();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedUser) => {
      return await updateUser(updatedUser.id, updatedUser);
    },
    onSuccess: () => {
      fetchUsersList();
      reset({
        id: undefined,
        username: "",
        password: "",
        role: defaultRole,
      });
      setModeEdit(false);
    },
  });

  function onSubmit(data) {
    if (!data.password || data.password.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    return registerMutation.mutate(data);
  }

  function handleDelete(id) {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      deleteMutation.mutate(id);
    }
  }

  function handleEdit(user) {
    setValue("id", user.id);
    setValue("username", user.email);
    setValue("password", "");
    setValue("role", user.role);
    setModeEdit(true);
  }

  function handleReset() {
    reset({
      id: undefined,
      username: "",
      password: "",
      role: defaultRole,
    });
    setModeEdit(false);
  }

  function onUpdate(updatedUser) {
    updateMutation.mutate(updatedUser);
  }

  function handleRoleChange(userId, role) {
    setRoleDraft((previous) => ({
      ...previous,
      [userId]: role,
    }));
  }

  function applyRoleUpdate(user) {
    const selectedRole = roleDraft[user.id];
    if (!selectedRole || selectedRole === user.role) {
      return;
    }

    updateMutation.mutate({
      id: user.id,
      username: user.email,
      role: selectedRole,
    });
  }

  return (
    <section>
      <div className="users-list-block border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold mb-4">Liste des utilisateurs</h2>

        {usersError && (
          <div className="users-error-box" role="alert">
            <p>{usersError}</p>
            <Link to="/auth/login" className="users-error-link">
              Aller à la connexion
            </Link>
          </div>
        )}

        {isUsersLoading && <p>Chargement des utilisateurs...</p>}

        {!usersError && !isUsersLoading && (
          <div className="users-toolbar">
          <input
            type="text"
            placeholder="Rechercher par email, nom, prénom ou ID"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            value={filterRole}
            onChange={(event) => setFilterRole(event.target.value)}
          >
            <option value="ALL">Tous les rôles</option>
            {availableRoles.map((role) => (
              <option key={`filter-${role}`} value={role}>
                {role}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="recent">Plus récents</option>
            <option value="email">Email A-Z</option>
            <option value="role">Rôle</option>
          </select>
          </div>
        )}

        {!usersError && !isUsersLoading && (
          <p className="users-toolbar-count">
            {filteredUsers.length} utilisateur(s) affiché(s) sur {users.length}
          </p>
        )}

        {!usersError && !isUsersLoading && filteredUsers.length > 0 && (
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.surname || "-"}</td>
                    <td>{user.name || "-"}</td>
                    <td>
                      <div className="users-role-actions">
                        <select
                          value={roleDraft[user.id] || user.role}
                          onChange={(event) => handleRoleChange(user.id, event.target.value)}
                        >
                          {availableRoles.map((role) => (
                            <option key={`${user.id}-${role}`} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => applyRoleUpdate(user)}
                          disabled={(roleDraft[user.id] || user.role) === user.role}
                        >
                          Mettre à jour
                        </button>
                      </div>
                    </td>
                    <td>
                      <button type="button" onClick={() => handleEdit(user)}>
                        Modifier
                      </button>
                      <button type="button" onClick={() => handleDelete(user.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!usersError && !isUsersLoading && filteredUsers.length === 0 && (
          <div>Aucun utilisateur trouvé pour ces filtres.</div>
        )}
      </div>

      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold mb-4">
          {modeEdit ? "Modifier un utilisateur" : "Créer un utilisateur"}
        </h2>
        <form
          className="users-form"
          onSubmit={modeEdit ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}
        >
          <input type="hidden" id="id" {...register("id", { valueAsNumber: true })} />

          <label
            htmlFor="username"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <input
            id="username"
            type="email"
            placeholder="email@domaine.com"
            {...register("username")}
            required
          />

          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder={modeEdit ? "Laisser vide pour ne pas changer" : "Mot de passe"}
            {...register("password")}
            required={!modeEdit}
          />

          <label
            htmlFor="role"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Rôle
          </label>
          <select id="role" {...register("role")} required>
            {availableRoles.map((role) => (
              <option key={`create-${role}`} value={role}>
                {role}
              </option>
            ))}
          </select>

          <div className="users-form-actions">
            {modeEdit && (
              <button type="button" onClick={handleReset}>
                Annuler la modification
              </button>
            )}
            <button type="submit">
              {modeEdit ? "Mettre à jour" : "Créer un utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Users;
