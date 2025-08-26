// Detect Reddit page
function isReddit() {
  return /(^|\.)reddit\.com$/.test(location.hostname);
}

// Extract top N visible comments
async function extractRedditComments(maxN = 30) {
  const nodes = Array.from(document.querySelectorAll(
    'div[data-test-id="comment"], div.Comment'
  )).slice(0, maxN * 2);

  const items = nodes.map(n => {
    if (!n) return null;
    const textEl = n.querySelector('p, span');
    const text = textEl?.innerText?.trim() || "";
    return { text, likes: 0 }; // Reddit upvotes optional
  }).filter(Boolean);

  return items.slice(0, maxN);
}

// Expose globally
window.RedditAdapter = { isReddit, extractRedditComments };
