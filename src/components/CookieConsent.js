"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const CONSENT_COOKIE = "jcp_consent";

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, days = 180) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Expires=${expires}; Path=/; SameSite=Lax${secure}`;
}

function parseConsentCookie() {
  try {
    const raw = getCookie(CONSENT_COOKIE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CookieConsent({ GA_MEASUREMENT_ID }) {
  const [open, setOpen] = useState(() => {
    const saved = parseConsentCookie();
    return !saved;
  });
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(() => {
    const saved = parseConsentCookie();
    return saved ? !!saved.analytics : false;
  });
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPath = useMemo(() => {
    const q = searchParams ? searchParams.toString() : "";
    return q ? `${pathname}?${q}` : pathname;
  }, [pathname, searchParams]);

  function updateGtagConsent(allowAnalytics) {
    if (typeof window === "undefined" || !window.gtag) return;
    window.gtag("consent", "update", {
      analytics_storage: allowAnalytics ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    if (allowAnalytics && GA_MEASUREMENT_ID) {
      window.gtag("config", GA_MEASUREMENT_ID, { page_path: currentPath });
    }
  }

  function persistAndApply(allowAnalytics) {
    const payload = { analytics: !!allowAnalytics, ts: Date.now() };
    setCookie(CONSENT_COOKIE, JSON.stringify(payload));
    setAnalytics(!!allowAnalytics);
    updateGtagConsent(!!allowAnalytics);
  }

  function onAcceptAll() {
    persistAndApply(true);
    setOpen(false);
  }

  function onRejectAll() {
    persistAndApply(false);
    setOpen(false);
  }

  function onSavePrefs() {
    persistAndApply(analytics);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div
        className="mx-auto max-w-3xl rounded-md border border-foreground/10 bg-background/95 backdrop-blur shadow-lg p-4 tracking-normal"
        style={{ letterSpacing: "normal" }}
      >
        <div className="flex flex-col gap-3">
          <div className="text-sm text-foreground/90">
            We use essential cookies to make this site work. With your consent,
            we also use analytics cookies to understand usage and improve our
            services.
          </div>
          {showPrefs && (
            <div className="rounded bg-foreground/5 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Analytics cookies</div>
                  <div className="text-foreground/70">
                    Helps us measure and improve the site.
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                  <span className="text-sm">Enabled</span>
                </label>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              className="px-3 py-2 text-sm border rounded hover:bg-foreground/5"
              onClick={() => setShowPrefs((v) => !v)}
            >
              {showPrefs ? "Back" : "Preferences"}
            </button>
            {showPrefs ? (
              <button
                className="px-3 py-2 text-sm rounded bg-foreground text-background hover:opacity-90"
                onClick={onSavePrefs}
              >
                Save preferences
              </button>
            ) : (
              <>
                <button
                  className="px-3 py-2 text-sm border rounded hover:bg-foreground/5"
                  onClick={onRejectAll}
                >
                  Reject all
                </button>
                <button
                  className="px-3 py-2 text-sm rounded bg-foreground text-background hover:opacity-90"
                  onClick={onAcceptAll}
                >
                  Accept all
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
