/* GA init without inline scripts; safe for CSP */
(function () {
  if (typeof window === "undefined") return;
  if (!window.dataLayer) window.dataLayer = [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
  try {
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
    });
  } catch (_) {}
  // Standard snippet sets a timestamp; harmless before library loads
  try {
    window.gtag("js", new Date());
  } catch (_) {}
})();
