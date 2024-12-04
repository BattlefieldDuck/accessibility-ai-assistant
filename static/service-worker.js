chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((request) => {
    if (request.text) {
        chrome.runtime.sendMessage({ text: request.text });
    }
});
