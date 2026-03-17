import { useEffect, useState } from "react";
import { getPublicGalleryStatus } from "../api/videos.js";

export const PUBLIC_GALLERY_STATUS_STORAGE_KEY = "publicGalleryOpenStatus";
export const PUBLIC_GALLERY_STATUS_EVENT = "public-gallery-status-changed";

function toNullableBoolean(value) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return null;
}

function readStoredPublicGalleryStatus() {
  if (typeof window === "undefined") {
    return null;
  }

  return toNullableBoolean(localStorage.getItem(PUBLIC_GALLERY_STATUS_STORAGE_KEY));
}

function writeStoredPublicGalleryStatus(isOpen) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(PUBLIC_GALLERY_STATUS_STORAGE_KEY, String(Boolean(isOpen)));
}

export function notifyPublicGalleryStatusChanged(isOpen) {
  writeStoredPublicGalleryStatus(isOpen);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(PUBLIC_GALLERY_STATUS_EVENT, {
        detail: { isOpen: Boolean(isOpen) },
      }),
    );
  }
}

export function usePhase3Closure() {
  const initialStoredStatus = readStoredPublicGalleryStatus();
  const [isCheckingPhaseStatus, setIsCheckingPhaseStatus] = useState(true);
  const [isPhase3Closed, setIsPhase3Closed] = useState(Boolean(initialStoredStatus));

  useEffect(() => {
    let isMounted = true;

    const fetchPhaseStatus = async () => {
      try {
        const response = await getPublicGalleryStatus();
        if (!isMounted) {
          return;
        }

        // Business rule: when public gallery is open, submissions/registration phase is closed.
        const nextValue = Boolean(response.data?.isOpen);
        setIsPhase3Closed(nextValue);
        writeStoredPublicGalleryStatus(nextValue);
      } catch {
        if (isMounted) {
          const storedStatus = readStoredPublicGalleryStatus();
          setIsPhase3Closed(Boolean(storedStatus));
        }
      } finally {
        if (isMounted) {
          setIsCheckingPhaseStatus(false);
        }
      }
    };

    const handleStorage = (event) => {
      if (event.key === PUBLIC_GALLERY_STATUS_STORAGE_KEY) {
        setIsPhase3Closed(event.newValue === "true");
        setIsCheckingPhaseStatus(false);
      }
    };

    const handleCustomStatusChange = (event) => {
      const nextValue = Boolean(event?.detail?.isOpen);
      setIsPhase3Closed(nextValue);
      setIsCheckingPhaseStatus(false);
    };

    fetchPhaseStatus();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(PUBLIC_GALLERY_STATUS_EVENT, handleCustomStatusChange);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(PUBLIC_GALLERY_STATUS_EVENT, handleCustomStatusChange);
    };
  }, []);

  return { isCheckingPhaseStatus, isPhase3Closed };
}
