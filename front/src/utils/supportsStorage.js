const SUPPORTS_STORAGE_KEY = "marsai_home_supports";
const MIN_SUPPORTS = 1;
const MAX_SUPPORTS = 12;

function createEmptySupport(index = 0) {
  return {
    id: `support-${Date.now()}-${index}`,
    name: "",
    imageUrl: "",
    websiteUrl: "",
  };
}

function createDefaultSupports() {
  return Array.from({ length: MAX_SUPPORTS }, (_, index) => ({
    ...createEmptySupport(index),
    name: `Support ${index + 1}`,
  }));
}

function normalizeSupport(item, index) {
  if (!item || typeof item !== "object") {
    return createEmptySupport(index);
  }

  return {
    id: typeof item.id === "string" && item.id.trim() ? item.id : createEmptySupport(index).id,
    name: typeof item.name === "string" ? item.name : "",
    imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : "",
    websiteUrl: typeof item.websiteUrl === "string" ? item.websiteUrl : "",
  };
}

function getSupports() {
  if (typeof window === "undefined") {
    return createDefaultSupports();
  }

  const rawValue = window.localStorage.getItem(SUPPORTS_STORAGE_KEY);

  if (!rawValue) {
    return createDefaultSupports();
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return createDefaultSupports();
    }

    return parsed.slice(0, MAX_SUPPORTS).map((item, index) => normalizeSupport(item, index));
  } catch {
    return createDefaultSupports();
  }
}

function saveSupports(nextSupports) {
  if (typeof window === "undefined" || !Array.isArray(nextSupports)) {
    return;
  }

  const normalized = nextSupports
    .slice(0, MAX_SUPPORTS)
    .map((item, index) => normalizeSupport(item, index));

  if (normalized.length < MIN_SUPPORTS) {
    normalized.push(createEmptySupport(normalized.length));
  }

  window.localStorage.setItem(SUPPORTS_STORAGE_KEY, JSON.stringify(normalized));
}

export {
  SUPPORTS_STORAGE_KEY,
  MIN_SUPPORTS,
  MAX_SUPPORTS,
  createEmptySupport,
  getSupports,
  saveSupports,
};
