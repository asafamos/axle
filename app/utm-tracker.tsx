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

      // Capture the EXTERNAL referrer host (where the visitor actually came
      // from) — the signal UTM tags miss, since most real traffic (organic
      // Google, a plain Reddit/Facebook link) carries no utm_source. Own-domain
      // referrers are internal navigation and excluded.
      const OWN = new Set([
        "axlescan.com",
        "axle-iota.vercel.app",
        "localhost",
      ]);
      let ref: string | undefined;
      try {
        if (document.referrer) {
          const rh = new URL(document.referrer).hostname.replace(/^www\./, "");
          if (rh && !OWN.has(rh)) ref = rh.slice(0, 100);
        }
      } catch {
        /* referrer unparseable — skip */
      }

      const payload = {
        source: trackedSrc || undefined,
        event: "page_view",
        ref,
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
