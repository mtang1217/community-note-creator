// adapters/youtube.js

function isYouTube() {
  return /(^|\.)youtube\.com$/.test(location.hostname);
}

function extractYTComments(maxN = 30) {
  // This function is now a Promise that resolves when comments are found.
  return new Promise(async (resolve) => {
    // 1. First, wait for the main comments container to exist.
    const commentsContainer = await window.waitForElement('#comments');
    if (!commentsContainer) {
      console.log("[CN] YouTube: Comments container (#comments) not found.");
      return resolve([]); // Resolve with empty array if no container
    }

    // 2. Define the function that scrapes the comments from the DOM.
    const scrape = () => {
      const nodes = Array.from(document.querySelectorAll('ytd-comment-thread-renderer #content-text')).slice(0, maxN);
      if (nodes.length > 0) {
        const items = nodes.map(n => {
          if (!n) return null;
          const text = n.innerText?.trim() || "";
          const container = n.closest('ytd-comment-thread-renderer');
          const likeEl = container?.querySelector('#vote-count-middle');
          const likes = likeEl ? parseInt(likeEl.innerText.replace(/[^\d]/g, '')) || 0 : 0;
          return { text, likes };
        }).filter(Boolean);
        return items;
      }
      return [];
    };

    // 3. Check if comments are already there.
    let initialComments = scrape();
    if (initialComments.length > 0) {
      return resolve(initialComments);
    }

    // 4. If not, set up an observer to watch for them being added.
    console.log("[CN] YouTube: Comments not loaded yet. Observing for changes...");
    const observer = new MutationObserver((mutations, obs) => {
      let comments = scrape();
      if (comments.length > 0) {
        console.log(`[CN] YouTube: Detected ${comments.length} comments dynamically.`);
        obs.disconnect(); // Stop observing to save resources
        resolve(comments);
      }
    });

    // 5. Start observing the comments container for child elements being added.
    observer.observe(commentsContainer, {
      childList: true,
      subtree: true,
    });
    
    // 6. Add a timeout to prevent observing forever if nothing happens.
    setTimeout(() => {
        observer.disconnect();
        let comments = scrape(); // One final check
        resolve(comments); // Resolve with whatever we have (even if empty)
    }, 10000); // 10-second timeout
  });
}

function detectCurrentYTContext() {
  // ... (this function can remain the same)
  const url = location.href;
  const titleEl = document.querySelector('h1.title, h1.ytd-watch-metadata') || document.querySelector('#title h1');
  const title = titleEl?.innerText?.trim() || '';
  const commentsRoot = document.querySelector('#comments, ytd-comments, #comments-inner');
  const isShort = url.includes('shorts');
  return { active: !!title, url, isShort, title, commentsRoot };
}

window.YTAdapter = { isYouTube, detectCurrentYTContext, extractYTComments };