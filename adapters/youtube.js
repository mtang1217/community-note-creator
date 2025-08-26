// Detect YouTube page
function isYouTube() {
  return /(^|\.)youtube\.com$/.test(location.hostname);
}

// Extract top N visible comments
async function extractYTComments(maxN = 30) {
  const nodes = Array.from(document.querySelectorAll(
    '#content #content-text, ytd-comment-thread-renderer #content-text'
  )).slice(0, maxN * 2); // grab extra

  const items = nodes.map(n => {
    if (!n) return null;

    const text = n.innerText?.trim() || "";
    const container = n.closest('ytd-comment-thread-renderer') || n.closest('#comment');
    const likeEl = container?.querySelector('#vote-count-middle, #vote-count');
    const likes = likeEl ? parseInt(likeEl.innerText.replace(/[^\d]/g,'')) || 0 : 0;

    return { text, likes };
  }).filter(Boolean);

  return items.slice(0, maxN);
}

// Detect if video is active
function detectCurrentYTContext() {
  const url = location.href;
  const titleEl = document.querySelector('h1.title, h1.ytd-watch-metadata') || document.querySelector('#title h1');
  const title = titleEl?.innerText?.trim() || '';
  const commentsRoot = document.querySelector('#comments, ytd-comments, #comments-inner');
  const isShort = url.includes('shorts');
  return { active: !!title, url, isShort, title, commentsRoot };
}

// Expose globally
window.YTAdapter = { isYouTube, detectCurrentYTContext, extractYTComments };
