/**
 * Adds Puppeteer IDE panel in devtools window.
 */
function addIDEPanel() {
  chrome.devtools.panels.create(
    'Puppeteer IDE',
    'devtools/idePanel/pptr.png',
    'devtools/idePanel/idePanel.html',
    () => {}
  );
}

addIDEPanel();
