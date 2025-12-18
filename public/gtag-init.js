/* GA init without inline scripts; safe for CSP */
(function () {
  if (typeof window === "undefined") return;
  if (!window.dataLayer) window.dataLayer = [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
  // Standard snippet sets a timestamp; harmless before library loads
  try {
    window.gtag("js", new Date());
  } catch (_) {}
})();
