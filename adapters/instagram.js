// Detect Instagram page
function isInstagram() {
  return /(^|\.)instagram\.com$/.test(location.hostname);
}

// Extract top N visible comments
async function extractIGComments(maxN = 30) {
  const nodes = Array.from(document.querySelectorAll(
    'ul > li span, .C4VMK span' // comment text nodes
  )).slice(0, maxN * 2);

  const items = nodes.map(n => {
    if (!n) return null;
    const text = n.innerText?.trim() || "";
    return { text, likes: 0 }; // likes optional
  }).filter(Boolean);

  return items.slice(0, maxN);
}

// Expose globally
window.IGAdapter = { isInstagram, extractIGComments };
