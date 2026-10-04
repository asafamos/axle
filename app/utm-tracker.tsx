"use client";

import { useEffect } from "react";

const STORAGE_KEY = "axle:utm";

export function UtmTracker() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      // Owner opt-out: visit any page once with ?notrack=1 (and ?notrack=0 to
      // undo). Stored per browser, so your own testing stops being counted as
      // "visitors". Nothing identifying is stored — just this flag.
      // Isolated in its own try: storage can be blocked (privacy modes), and
      // that must never disable tracking for everyone else's visit.
      try {
        const optOut = params.get("notrack");
        if (optOut === "1") window.localStorage.setItem("axle:notrack", "1");
        if (optOut === "0") window.localStorage.removeItem("axle:notrack");
        if (window.localStorage.getItem("axle:notrack") === "1") return;
      } catch {
        /* storage unavailable — track normally */
      }

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
        path: window.location.pathname,
        // Raw campaign tag (utm_source), kept separately from `source` because
        // the server collapses unknown `source` values into "unknown" — which
        // makes every tagged outreach link indistinguishable.
        utm: trackedSrc || undefined,
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
