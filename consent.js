(() => {
  const KEY = "loopme-consent";
  const bar = document.getElementById("consent");
  const reopen = document.getElementById("consent-reopen");
  if (!bar) return;

  const read = () => {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  };
  const write = (v) => {
    try { localStorage.setItem(KEY, v); } catch (e) { /* intet valg at huske */ }
  };

  const apply = (v) => {
    const state = v === "granted" ? "granted" : "denied";
    if (typeof gtag !== "function") return;
    gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  };

  bar.querySelectorAll("[data-consent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const choice = btn.dataset.consent;
      write(choice);
      apply(choice);
      bar.hidden = true;
      reopen?.focus();
    });
  });

  reopen?.addEventListener("click", () => {
    bar.hidden = false;
    bar.querySelector("[data-consent]")?.focus();
  });

  // Kan valget ikke gemmes, spørger vi hver gang frem for at antage et ja.
  if (!read()) bar.hidden = false;
})();
