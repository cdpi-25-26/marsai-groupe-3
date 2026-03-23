import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.resolve(__dirname, "..", "data", "jury-members.json");

const DEFAULT_JURY_MEMBERS = [
  {
    id: 1,
    name: "Julie Masson",
    role: "Realisatrice IA",
    roleEn: "AI Director",
    description: "Description jury a completer.",
    descriptionEn: "Jury description to be completed.",
    image: "/src/assets/person.svg",
  },
  {
    id: 2,
    name: "Marc Aubin",
    role: "Directeur Artistique",
    roleEn: "Art Director",
    description: "Description jury a completer.",
    descriptionEn: "Jury description to be completed.",
    image: "/src/assets/person.svg",
  },
  {
    id: 3,
    name: "Aiko Sato",
    role: "Experte innovation",
    roleEn: "Innovation Expert",
    description: "Description jury a completer.",
    descriptionEn: "Jury description to be completed.",
    image: "/src/assets/person.svg",
  },
  {
    id: 4,
    name: "Lina Robert",
    role: "Scenariste",
    roleEn: "Screenwriter",
    description: "Description jury a completer.",
    descriptionEn: "Jury description to be completed.",
    image: "/src/assets/person.svg",
  },
];

function toSafeString(value, maxLength, fallback = "") {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) {
    return fallback;
  }
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function normalizeMember(member, index) {
  const id = Number(member?.id);
  const safeId = Number.isInteger(id) && id > 0 ? id : index + 1;

  return {
    id: safeId,
    name: toSafeString(member?.name, 100, `Membre ${safeId}`),
    role: toSafeString(member?.role, 120, "Membre du jury"),
    roleEn: toSafeString(member?.roleEn, 120, "Jury member"),
    description: toSafeString(member?.description, 800, "Description jury a completer."),
    descriptionEn: toSafeString(member?.descriptionEn, 800, "Jury description to be completed."),
    image: toSafeString(member?.image, 255, "/src/assets/person.svg"),
  };
}

function ensureStorageFile() {
  const directory = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(DEFAULT_JURY_MEMBERS, null, 2));
  }
}

function readMembers() {
  try {
    ensureStorageFile();
    const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_JURY_MEMBERS;
    }

    return parsed.map((member, index) => normalizeMember(member, index));
  } catch {
    return DEFAULT_JURY_MEMBERS;
  }
}

function writeMembers(members) {
  ensureStorageFile();
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(members, null, 2));
}

function getJuryMembers(req, res) {
  return res.json(readMembers());
}

function updateJuryMembers(req, res) {
  const payload = req.body?.members;

  if (!Array.isArray(payload)) {
    return res.status(400).json({
      error: "Format invalide. Attendu: { members: [...] }",
    });
  }

  if (payload.length === 0) {
    return res.status(400).json({
      error: "La liste des membres ne peut pas etre vide",
    });
  }

  const normalizedMembers = payload.map((member, index) => normalizeMember(member, index));
  writeMembers(normalizedMembers);

  return res.json({
    message: "Membres du jury mis a jour",
    members: normalizedMembers,
  });
}

export default {
  getJuryMembers,
  updateJuryMembers,
};
