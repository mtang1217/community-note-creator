// adapters/reddit.js

function isReddit() {
  return /(^|\.)reddit\.com$/.test(location.hostname);
}

function extractRedditComments(maxN = 30) {
  // We return a Promise because we need to wait for comments to appear.
  return new Promise((resolve) => {
    
    // The selector YOU CONFIRMED is correct for a single comment.
    const commentSelector = 'shreddit-comment';

    // The function that performs the actual scraping once elements exist.
    const scrape = () => {
      const nodes = Array.from(document.querySelectorAll(commentSelector)).slice(0, maxN);
      if (nodes.length === 0) return [];

      return nodes.map(n => {
        // Inside a shreddit-comment, the text is in an element with slot="comment"
        const textEl = n.querySelector('[slot="comment"]');
        return { text: textEl?.innerText?.trim() || "", likes: 0 };
      }).filter(c => c.text); // Filter out any empty comments
    };

    // First, let's try scraping immediately in case the page loaded fast.
    let initialComments = scrape();
    if (initialComments.length > 0) {
      console.log(`[CN] Reddit: Found ${initialComments.length} comments immediately.`);
      return resolve(initialComments);
    }

    // If no comments were found, we start observing the page for changes.
    console.log("[CN] Reddit: Comments not found immediately. Observing the page for them to be added...");
    const observer = new MutationObserver(() => {
      const comments = scrape();
      // If we find comments, we've succeeded.
      if (comments.length > 0) {
        console.log(`[CN] Reddit: Detected ${comments.length} comments added to the page.`);
        observer.disconnect(); // IMPORTANT: Stop observing to save performance.
        resolve(comments);
      }
    });

    // Start observing the entire document for new elements being added.
    observer.observe(document.body, { childList: true, subtree: true });

    // As a safety net, stop observing after 7 seconds to prevent it from running forever.
    setTimeout(() => {
      observer.disconnect();
      const finalComments = scrape(); // One last try
      if (finalComments.length === 0) {
        console.log("[CN] Reddit: Timed out waiting for comments.");
      }
      resolve(finalComments); // Resolve with whatever was found.
    }, 7000); 
  });
}

window.RedditAdapter = { isReddit, extractRedditComments };