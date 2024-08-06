let highlights = [];
let notes = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'highlight') {
    highlightText();
  } else if (request.action === 'addNote') {
    addNote();
  } else if (request.action === 'save') {
    saveHighlightsAndNotes();
  } else if (request.action === 'clear') {
    clearHighlightsAndNotes();
  }
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

      highlights.push(span.outerHTML);
      selection.removeAllRanges();
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
  document.querySelectorAll('.highlighted').forEach(el => el.replaceWith(el.textContent));
  document.querySelectorAll('.note').forEach(el => el.remove());
  chrome.storage.local.clear(() => {
    alert('All highlights and notes cleared!');
  });
}

window.addEventListener('load', () => {
  chrome.storage.local.get(['highlights', 'notes'], (result) => {
    if (result.highlights) {
      highlights = result.highlights;
      highlights.forEach(html => {
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        document.body.appendChild(tempDiv.firstChild);
      });
    }
    if (result.notes) {
      notes = result.notes;
      notes.forEach(note => {
        let noteElement = document.createElement('div');
        noteElement.textContent = note.note;
        noteElement.style.position = 'absolute';
        noteElement.style.top = `${note.position + 10}px`;
        noteElement.style.left = '10px';
        noteElement.style.backgroundColor = 'lightyellow';
        noteElement.style.color = 'black';  // Ensure text color is black
        noteElement.style.padding = '5px';
        noteElement.style.border = '1px solid black';
        noteElement.className = 'note';
        document.body.appendChild(noteElement);
      });
    }
  });
});
