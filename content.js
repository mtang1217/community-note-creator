// content.js
(function () {
  try {
    const panel = window.createPanel && window.createPanel();
    let currentUrl = location.href;

    async function updateSummary() {
      window.setPanelState && window.setPanelState("loading...");
      try {
        let comments = [];

        if (window.YTAdapter?.isYouTube?.()) {
          comments = await window.YTAdapter.extractYTComments();
        } else if (window.RedditAdapter?.isReddit?.()) {
          comments = await window.RedditAdapter.extractRedditComments();
        } else if (window.IGAdapter?.isInstagram?.()) {
          comments = await window.IGAdapter.extractIGComments();
        }

        let result = window.summarizeComments
          ? window.summarizeComments(comments, 5)
          : "No comments to summarize.";

        // handle both sync and async summarizers
        if (result && typeof result.then === "function") result = await result;

        const el = document.getElementById("cn-summary");
        if (el) el.textContent = result || "No comments to summarize.";
      } catch (err) {
        console.error("[CN] updateSummary error:", err);
        const el = document.getElementById("cn-summary");
        if (el) el.textContent = "No comments to summarize.";
      } finally {
        window.setPanelState && window.setPanelState("idle");
      }
    }

    // react to SPA nav
    window.onUrlChange && window.onUrlChange(async () => {
      if (location.href !== currentUrl) {
        currentUrl = location.href;
        const el = document.getElementById("cn-summary");
        if (el) el.textContent = "Loading comments...";
        await updateSummary();
      }
    });

    // manual refresh
    document.addEventListener("CN_REFRESH", updateSummary);

    // initial
    if (document.readyState === "complete") {
      updateSummary();
    } else {
      window.addEventListener("load", updateSummary);
    }
  } catch (e) {
    console.error("[CN] content bootstrap failed:", e);
  }
})();
