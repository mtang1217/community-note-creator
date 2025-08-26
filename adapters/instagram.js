// adapters/instagram.js

function extractIGComments(maxN = 30) {
  return new Promise((resolve) => {
    // --- STRATEGY 1: PARSE JSON DATA (Flexible Search Method) ---
    console.log("[CN] Instagram: Searching for comments in page JSON data...");

    // Find all the script tags that contain JSON data.
    const scriptTags = document.querySelectorAll('script[type="application/json"]');

    // A recursive function to find the comments array ('edges') inside a complex object.
    // This is more robust than a fixed path.
    function findEdges(obj) {
      if (!obj || typeof obj !== 'object') return null;
      
      // The condition to identify the correct 'edges' array:
      // - It must be an array named 'edges'.
      // - The first item in it should have a 'node' with '__typename' of 'XDTCommentDict'.
      if (Array.isArray(obj.edges) && obj.edges[0]?.node?.__typename === 'XDTCommentDict') {
        return obj.edges;
      }
      
      // If not found, recursively search in all of the object's properties.
      for (const key in obj) {
        const result = findEdges(obj[key]);
        if (result) return result; // Return the first match we find.
      }
      
      return null;
    }

    // Loop through all found script tags.
    for (const tag of scriptTags) {
      try {
        const data = JSON.parse(tag.textContent);
        const edges = findEdges(data);

        // If we found the comments array and it's not empty...
        if (edges && edges.length > 0) {
          console.log("[CN] Instagram: Successfully found and parsed comments from JSON.");
          
          const comments = edges.map(edge => {
            // Ensure the node and text exist before creating the object.
            if (!edge?.node?.text) return null;
            return {
              text: edge.node.text,
              likes: edge.node.comment_like_count || 0
            };
          }).filter(Boolean).slice(0, maxN); // Clean up any nulls and limit the count.
          
          // If we successfully extracted comments, resolve the promise and stop.
          if (comments.length > 0) {
            return resolve(comments);
          }
        }
      } catch (e) {
        // It's normal for some script tags not to be valid JSON, so we just ignore them.
      }
    }
    
    // --- FALLBACK ---
    // This part will only run if the JSON search above fails completely.
    console.log("[CN] Instagram: Could not find comments in JSON. The page structure may have changed or there are no comments.");
    resolve([]); // Resolve with an empty array.
  });
}

// Keep the other functions as they are
function isInstagram() {
  return /(^|\.)instagram\.com$/.test(location.hostname);
}

window.IGAdapter = { isInstagram, extractIGComments };