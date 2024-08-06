let highlights = [];
let notes = [];

function createFloatingIcon() {
  const floatingIcon = document.createElement('div');
  floatingIcon.id = 'floatingIcon';
  floatingIcon.innerHTML = '&#9733;';  // Star icon or any icon you prefer
  floatingIcon.style.position = 'fixed';
  floatingIcon.style.left = '0';
  floatingIcon.style.top = '50%';
  floatingIcon.style.transform = 'translateY(-50%)';
  floatingIcon.style.padding = '10px';
  floatingIcon.style.cursor = 'pointer';
  floatingIcon.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  floatingIcon.style.backdropFilter = 'blur(10px)';
  floatingIcon.style.borderRadius = '10px';
  floatingIcon.style.zIndex = '10000';
  floatingIcon.style.fontSize = '24px';
  floatingIcon.addEventListener('click', toggleMenu);
  document.body.appendChild(floatingIcon);
}

function createMenu() {
  const menu = document.createElement('div');
  menu.id = 'annotationMenu';
  menu.style.position = 'fixed';
  menu.style.left = '0';
  menu.style.top = '0';
  menu.style.width = '250px';
  menu.style.height = '100%';
  menu.style.padding = '20px';
  menu.style.boxSizing = 'border-box';
  menu.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
  menu.style.backdropFilter = 'blur(10px)';
  menu.style.borderRight = '1px solid rgba(255, 255, 255, 0.3)';
  menu.style.zIndex = '9999';
  menu.style.display = 'none';
  menu.innerHTML = `
    <h3>Annotator</h3>
    <button id="highlightBtn">Highlight Text</button>
    <button id="addNoteBtn">Add Note</button>
    <button id="saveBtn">Save</button>
    <button id="clearBtn">Clear</button>
    <div id="notesList"></div>
  `;
  document.body.appendChild(menu);

  document.getElementById('highlightBtn').addEventListener('click', highlightText);
  document.getElementById('addNoteBtn').addEventListener('click', addNote);
  document.getElementById('saveBtn').addEventListener('click', saveHighlightsAndNotes);
  document.getElementById('clearBtn').addEventListener('click', clearHighlightsAndNotes);
}

function toggleMenu() {
  const menu = document.getElementById('annotationMenu');
  if (menu.style.display === 'none' || menu.style.display === '') {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
}

function highlightText() {
  let selection = window.getSelection();
  if (selection.rangeCount > 0) {
    let range = selection.getRangeAt(0);
    if (range && !selection.isCollapsed) {
      let span = document.createElement('span');
      span.className = 'highlighted';
      span.style.backgroundColor = 'yellow';
      range.surroundContents(span);

      highlights.push(getXPath(span));
    }
  }
}

function addNote() {
  let note = prompt('Enter your note (max 5):');
  if (note && notes.length < 5) {
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
    updateNotesList();
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
  updateNotesList();
}

function getXPath(element) {
  if (element.id !== '') {
    return 'id("' + element.id + '")';
  }
  if (element === document.body) {
    return element.tagName;
  }

  let ix = 0;
  let siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    let sibling = siblings[i];
    if (sibling === element) {
      return getXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++;
    }
  }
}

function getElementByXPath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function updateNotesList() {
  const notesList = document.getElementById('notesList');
  notesList.innerHTML = '';
  notes.forEach((noteObj, index) => {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-item';
    noteDiv.textContent = `${index + 1}. ${noteObj.note}`;
    notesList.appendChild(noteDiv);
  });
}

window.addEventListener('load', () => {
  createFloatingIcon();
  createMenu();
  chrome.storage.local.get(['highlights', 'notes'], (result) => {
    if (result.highlights) {
      highlights = result.highlights;
      highlights.forEach(path => {
        let element = getElementByXPath(path);
        if (element) {
          element.style.backgroundColor = 'yellow';
          element.classList.add('highlighted');
        }
      });
    }
    if (result.notes) {
      notes = result.notes;
      notes.forEach(note => {
        let noteElement = document.createElement('div');
        noteElement.textContent = note.note;
        noteElement.style.position = 'absolute';
        noteElement.style.top = `${note.position}px`;
        noteElement.style.left = '10px';
        noteElement.style.backgroundColor = 'lightyellow';
        noteElement.style.color = 'black';  // Ensure text color is black
        noteElement.style.padding = '5px';
        noteElement.style.border = '1px solid black';
        noteElement.className = 'note';
        document.body.appendChild(noteElement);
      });
      updateNotesList();
    }
  });
});
