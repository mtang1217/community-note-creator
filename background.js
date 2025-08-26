// background.js - NEW VERSION

// This function holds all the logic to inject our scripts.
function injectScripts(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: [
      "config.js",
      "util.js",
      "summarizer.js",
      "adapters/youtube.js",
      "adapters/reddit.js",
      "adapters/instagram.js",
      "content.js" 
    ]
  }).then(() => {
    // After scripts are injected, inject the CSS
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ["overlay.css"]
    });
    console.log("[Background] All scripts and CSS injected successfully.");
  }).catch(err => console.error("[Background] Script injection failed: ", err));
}

// Listen for when a user clicks on a new page within a tab (SPA navigation)
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  // We check if the URL is one we care about
  if (details.url && (details.url.includes("youtube.com/watch") || details.url.includes("reddit.com/r/") || details.url.includes("instagram.com/p/"))) {
    console.log(`[Background] SPA navigation detected to: ${details.url}. Injecting scripts.`);
    injectScripts(details.tabId);
  }
});

// Also listen for when a tab is updated (e.g., a full page reload)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Wait for the page to be completely loaded before injecting
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes("youtube.com/watch") || tab.url.includes("reddit.com/r/") || tab.url.includes("instagram.com/p/")) {
      console.log(`[Background] Full page load detected for: ${tab.url}. Injecting scripts.`);
      injectScripts(tabId);
    }
  }
});