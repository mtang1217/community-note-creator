// content.js - UPDATED VERSION

(function () {
  try {
    // The updateSummary function itself is perfect. No changes needed here.
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
        if (el) el.textContent = "Error summarizing comments.";
      } finally {
        window.setPanelState && window.setPanelState("idle");
      }
    }

    // THE FIX: We pass the 'updateSummary' function directly into createPanel.
    const panel = window.createPanel(updateSummary);

    // This handles SPA navigation using your existing util function.
    window.onUrlChange && window.onUrlChange(updateSummary);
    
    // This listener is now redundant and can be removed.
    // document.removeEventListener("CN_REFRESH", updateSummary); 

    // Initial load logic remains the same.
    if (document.readyState === "complete") {
      updateSummary();
    } else {
      window.addEventListener("load", updateSummary);
    }

  } catch (e) {
    console.error("[CN] content bootstrap failed:", e);
  }
})();