"use client";

import { useEffect } from "react";

const STORAGE_KEY = "axle:utm";

export function UtmTracker() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const src = params.get("utm_source") || params.get("source");
      if (src) {
        window.sessionStorage.setItem(STORAGE_KEY, src);
      }
      const trackedSrc = src || window.sessionStorage.getItem(STORAGE_KEY);

      const payload = {
        source: trackedSrc || undefined,
        event: "page_view",
      };
      const body = JSON.stringify(payload);
      if ("sendBeacon" in navigator) {
        navigator.sendBeacon(
          "/api/track",
          new Blob([body], { type: "application/json" })
        );
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* no-op */
    }
  }, []);
  return null;
}

export function getStoredUtmSource(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
