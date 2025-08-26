// util.js

window.sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

window.debounce = function(fn, wait = 400) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

// SPA route change detector
window.onUrlChange = function(cb) {
  let last = location.href;
  const obs = new MutationObserver(() => {
    if (location.href !== last) { last = location.href; cb(); }
  });
  obs.observe(document, { subtree: true, childList: true });
  window.addEventListener('popstate', cb);
};

// Panel helpers
window.createPanel = function() {
  let panel = document.querySelector('.cn-panel');
  if (panel) return panel;
  panel = document.createElement('div');
  panel.className = 'cn-panel';
  panel.innerHTML = `
    <div class="cn-header">
      <span class="cn-title">Community Summary</span>
      <span class="cn-badge" id="cn-badge">idle</span>
      <div class="cn-actions">
        <button class="cn-btn" id="cn-refresh">Refresh</button>
        <button class="cn-btn" id="cn-hide">Hide</button>
      </div>
    </div>
    <div class="cn-body">
      <div class="cn-summary" id="cn-summary">Open a reel/video/post to see the summary.</div>
      <div class="cn-small" id="cn-meta"></div>
      <div id="cn-top-comments"></div>
    </div>`;
  document.documentElement.appendChild(panel);
  panel.querySelector('#cn-hide').onclick = () => panel.classList.add('cn-hidden');
  panel.querySelector('#cn-refresh').onclick = () => document.dispatchEvent(new CustomEvent('CN_REFRESH'));
  return panel;
};

window.setPanelState = function(stateText) {
  const el = document.getElementById('cn-badge');
  if (el) el.textContent = stateText;
};

window.waitForElement = async function(selector, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (el) return el;
    await window.sleep(200);
  }
  return null;
};

window.onUrlChange = function(cb) {
  // ... (This function stays the same for now) ...
};

// Panel helpers
window.createPanel = function(onRefreshCallback) { // THE CHANGE: It now accepts a function
  let panel = document.querySelector('.cn-panel');
  if (panel) return panel;
  panel = document.createElement('div');
  panel.className = 'cn-panel';
  panel.innerHTML = `
    <div class="cn-header">
      <span class="cn-title">Community Summary</span>
      <span class="cn-badge" id="cn-badge">idle</span>
      <div class="cn-actions">
        <button class="cn-btn" id="cn-refresh">Refresh</button>
        <button class="cn-btn" id="cn-hide">Hide</button>
      </div>
    </div>
    <div class="cn-body">
      <div class="cn-summary" id="cn-summary">Open a reel/video/post to see the summary.</div>
    </div>`;
  document.documentElement.appendChild(panel);
  panel.querySelector('#cn-hide').onclick = () => panel.classList.add('cn-hidden');
  
  // THE FIX: The button's onclick is now directly assigned the function we pass in.
  // We also check if the callback was provided to be safe.
  if (onRefreshCallback) {
    panel.querySelector('#cn-refresh').onclick = onRefreshCallback;
  }
  
  return panel;
};

window.setPanelState = function(stateText) {
  const el = document.getElementById('cn-badge');
  if (el) el.textContent = stateText;
};