chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }, () => {
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['styles.css']
      });
    });
  });
  