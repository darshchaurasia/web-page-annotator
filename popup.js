document.getElementById('highlightBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: highlightText
      });
    });
  });
  
  document.getElementById('addNoteBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: addNote
      });
    });
  });
  
  document.getElementById('saveBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: saveHighlightsAndNotes
      });
    });
  });
  
  document.getElementById('clearBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: clearHighlightsAndNotes
      });
    });
  });
  
  function highlightText() {
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
      let range = selection.getRangeAt(0);
      if (range && !selection.isCollapsed) {
        let span = document.createElement('span');
        span.className = 'highlighted';
        span.style.backgroundColor = 'yellow';
        range.surroundContents(span);
      }
    }
  }
  
  function addNote() {
    let note = prompt('Enter your note:');
    if (note) {
      let noteElement = document.createElement('div');
      noteElement.textContent = note;
      noteElement.style.position = 'absolute';
      noteElement.style.top = `${window.scrollY + 10}px`;
      noteElement.style.left = '10px';
      noteElement.style.backgroundColor = 'lightyellow';
      noteElement.style.color = 'black';  // Ensure text color is black
      noteElement.style.padding = '5px';
      noteElement.style.border = '1px solid black';
      noteElement.className = 'note';
      document.body.appendChild(noteElement);
  
      notes.push({ note: note, position: window.scrollY });
    }
  }
  
  function saveHighlightsAndNotes() {
    chrome.storage.local.set({ highlights: highlights, notes: notes }, () => {
      alert('Highlights and notes saved!');
    });
  }
  
  function clearHighlightsAndNotes() {
    highlights = [];
    notes = [];
    document.querySelectorAll('.highlighted').forEach(el => el.style.backgroundColor = '');
    document.querySelectorAll('.note').forEach(el => el.remove());
    chrome.storage.local.clear(() => {
      alert('All highlights and notes cleared!');
    });
  }
  