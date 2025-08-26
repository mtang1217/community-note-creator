// adapters/instagram.js - CORRECTED

function extractIGComments(maxN = 30) {
  return new Promise((resolve) => {
    console.log("[CN] Instagram: Searching for comments in page JSON data...");

    // Find all the script tags that contain JSON data.
    const scriptTags = document.querySelectorAll('script[type="application/json"]');

    function findEdges(obj) {
      if (!obj || typeof obj !== 'object') return null;
      if (Array.isArray(obj.edges) && obj.edges[0]?.node?.__typename === 'XDTCommentDict') {
        return obj.edges;
      }
      for (const key in obj) {
        const result = findEdges(obj[key]);
        if (result) return result;
      }
      return null;
    }

    // --- THE FIX IS HERE ---
    // We convert the NodeList to an array and reverse it. This makes us check the 
    // script tags that were added most recently (for the current page) FIRST.
    const reversedScriptTags = Array.from(scriptTags).reverse();

    // Loop through the REVERSED list of script tags.
    for (const tag of reversedScriptTags) {
      try {
        const data = JSON.parse(tag.textContent);
        const edges = findEdges(data);

        if (edges && edges.length > 0) {
          console.log("[CN] Instagram: Successfully found and parsed comments from the LATEST JSON block.");
          
          const comments = edges.map(edge => {
            if (!edge?.node?.text) return null;
            return {
              text: edge.node.text,
              likes: edge.node.comment_like_count || 0
            };
          }).filter(Boolean).slice(0, maxN);
          
          if (comments.length > 0) {
            return resolve(comments); // We found the correct data, so we stop.
          }
        }
      } catch (e) {
        // Ignore parsing errors.
      }
    }
    
    console.log("[CN] Instagram: Could not find comments in JSON. The page structure may have changed.");
    resolve([]);
  });
}

// Keep the rest of your file the same
function isInstagram() {
  return /(^|\.)instagram\.com$/.test(location.hostname);
}

window.IGAdapter = { isInstagram, extractIGComments };