// content.js - SIMPLIFIED VERSION

// This IIFE (Immediately Invoked Function Expression) runs as soon as the file is injected.
(function () {
  // A check to prevent the script from running multiple times if there's an overlap
  if (window.hasCommunityNoteScriptRun) {
    return;
  }
  window.hasCommunityNoteScriptRun = true;

  console.log("[Content] Script injected and running.");

  try {
    const panel = window.createPanel && window.createPanel();
    
    // The core logic function remains the same.
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

        let result = await window.summarizeComments(comments, 5);
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

    // No more listeners for navigation! Just run the function.
    // We add a small delay to ensure the page's own scripts have finished rendering.
    setTimeout(updateSummary, 500);

  } catch (e) {
    console.error("[CN] content bootstrap failed:", e);
  }
})();