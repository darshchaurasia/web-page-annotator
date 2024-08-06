(() => {
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;
  
    let highlights = [];
    let notes = [];
  
    function createFloatingIcon() {
      const floatingIcon = document.createElement('div');
      floatingIcon.id = 'floatingIcon';
      floatingIcon.innerHTML = '&#9733;';  // Star icon or any icon you prefer
      floatingIcon.style.position = 'fixed';
      floatingIcon.style.left = '10px';
      floatingIcon.style.top = '50%';
      floatingIcon.style.transform = 'translateY(-50%)';
      floatingIcon.style.padding = '10px';
      floatingIcon.style.cursor = 'pointer';
      floatingIcon.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      floatingIcon.style.backdropFilter = 'blur(10px)';
      floatingIcon.style.borderRadius = '50%';
      floatingIcon.style.zIndex = '10000';
      floatingIcon.style.fontSize = '24px';
      floatingIcon.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      floatingIcon.addEventListener('click', toggleMenu);
      document.body.appendChild(floatingIcon);
    }
  
    function createMenu() {
      const menu = document.createElement('div');
      menu.id = 'annotationMenu';
      menu.style.position = 'fixed';
      menu.style.left = '50px';
      menu.style.top = '50%';
      menu.style.transform = 'translateY(-50%)';
      menu.style.width = '300px';
      menu.style.height = 'auto';
      menu.style.maxHeight = '80vh';
      menu.style.padding = '20px';
      menu.style.boxSizing = 'border-box';
      menu.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      menu.style.backdropFilter = 'blur(10px)';
      menu.style.borderRadius = '10px';
      menu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      menu.style.zIndex = '9999';
      menu.style.display = 'none';
      menu.style.overflowY = 'auto';
      menu.innerHTML = `
        <h3>Annotator</h3>
        <button id="highlightBtn">Highlight Text</button>
        <button id="addNoteBtn">Add Note</button>
        <button id="clearHighlightsBtn">Clear Highlights</button>
        <h4>Notes</h4>
        <div id="notesList"></div>
      `;
      document.body.appendChild(menu);
  
      document.getElementById('highlightBtn').addEventListener('click', highlightText);
      document.getElementById('addNoteBtn').addEventListener('click', addNote);
      document.getElementById('clearHighlightsBtn').addEventListener('click', clearHighlights);
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
        for (let i = 0; i < selection.rangeCount; i++) {
          let range = selection.getRangeAt(i);
          if (range && !selection.isCollapsed) {
            let span = document.createElement('span');
            span.className = 'highlighted';
            span.style.backgroundColor = 'yellow';
  
            try {
              range.surroundContents(span);
              highlights.push(getXPath(span));
            } catch (e) {
              alert('Cannot highlight partially selected elements. Please select only text.');
            }
          }
        }
        saveHighlightsToLocal();
      }
    }
  
    function addNote() {
      let note = prompt('Enter your note (max 5):');
      if (note && notes.length < 5) {
        notes.push({ note: note, position: window.scrollY });
        updateNotesList();
        saveNotesToLocal();
      }
    }
  
    function deleteNote(index) {
      notes.splice(index, 1);
      updateNotesList();
      saveNotesToLocal();
    }
  
    function clearHighlights() {
      highlights = [];
      document.querySelectorAll('.highlighted').forEach(el => el.replaceWith(el.textContent));
      saveHighlightsToLocal();
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
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&#10060;'; // Cross mark icon
        deleteBtn.className = 'delete-note-btn';
        deleteBtn.addEventListener('click', () => deleteNote(index));
        noteDiv.appendChild(deleteBtn);
        notesList.appendChild(noteDiv);
      });
    }
  
    function saveHighlightsToLocal() {
      localStorage.setItem('highlights', JSON.stringify(highlights));
    }
  
    function saveNotesToLocal() {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  
    function loadHighlightsFromLocal() {
      const storedHighlights = JSON.parse(localStorage.getItem('highlights') || '[]');
      storedHighlights.forEach(path => {
        let element = getElementByXPath(path);
        if (element) {
          element.style.backgroundColor = 'yellow';
          element.classList.add('highlighted');
        }
      });
      highlights = storedHighlights;
    }
  
    function loadNotesFromLocal() {
      const storedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
      notes = storedNotes;
      updateNotesList();
    }
  
    window.addEventListener('load', () => {
      createFloatingIcon();
      createMenu();
      loadHighlightsFromLocal();
      loadNotesFromLocal();
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
          updateNotesList();
        }
      });
    });
  })();
  