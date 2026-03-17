import { useSyncExternalStore } from "react";

const AUTH_SESSION_EVENT = "auth-session-changed";

const emptySession = {
  username: null,
  role: null,
  token: null,
  tempAdminAccess: false,
};

let cachedSession = emptySession;

export function getAuthSessionSnapshot() {
  if (typeof window === "undefined") {
    return emptySession;
  }

  const nextSession = {
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
    token: localStorage.getItem("token"),
    tempAdminAccess: localStorage.getItem("tempAdminAccess") === "true",
  };

  const isUnchanged =
    cachedSession.username === nextSession.username &&
    cachedSession.role === nextSession.role &&
    cachedSession.token === nextSession.token &&
    cachedSession.tempAdminAccess === nextSession.tempAdminAccess;

  if (isUnchanged) {
    return cachedSession;
  }

  cachedSession = nextSession;
  return cachedSession;
}

export function notifyAuthSessionChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
  }
}

export function setAuthSession({ username, role, token, tempAdminAccess } = {}) {
  if (typeof window === "undefined") {
    return;
  }

  if (username !== undefined) {
    if (username === null) {
      localStorage.removeItem("username");
    } else {
      localStorage.setItem("username", username);
    }
  }

  if (role !== undefined) {
    if (role === null) {
      localStorage.removeItem("role");
    } else {
      localStorage.setItem("role", role);
    }
  }

  if (token !== undefined) {
    if (token === null) {
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", token);
    }
  }

  if (tempAdminAccess !== undefined) {
    if (tempAdminAccess === null) {
      localStorage.removeItem("tempAdminAccess");
    } else {
      localStorage.setItem("tempAdminAccess", String(tempAdminAccess));
    }
  }

  notifyAuthSessionChanged();
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  localStorage.removeItem("tempAdminAccess");
  notifyAuthSessionChanged();
}

function subscribeAuthSession(listener) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => listener();
  window.addEventListener("storage", handleChange);
  window.addEventListener(AUTH_SESSION_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(AUTH_SESSION_EVENT, handleChange);
  };
}

export function useAuthSession() {
  return useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionSnapshot,
    () => emptySession,
  );
}
