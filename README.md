# Web Page Annotator

Web Page Annotator is a Chrome extension that allows users to highlight text and add notes to any webpage. The highlights and notes are saved locally, providing a convenient way to annotate and revisit important information on web pages.

## Features

Highlight selected text in three different colors: yellow, green, and pink.
Add and manage up to 5 notes.
Auto-save highlights and notes to local storage.
Clear all highlights with a single button click.
Remove selected highlights.
User-friendly floating menu for easy access to all features.

## Installation

Clone the repository or download the source code.
Open Chrome and navigate to chrome://extensions/.
Enable "Developer mode" by toggling the switch in the top right corner.
Click "Load unpacked" and select the folder containing the extension's source code.
The Web Page Annotator extension should now appear in your list of extensions.

## Usage

Click the star icon on the left side of the screen to open the floating menu.
Use the menu to highlight text, add notes, remove selected highlights, or clear all highlights.


## Functions and Their Purposes

createFloatingIcon
Creates a floating star icon on the left side of the screen. Clicking this icon toggles the visibility of the annotation menu.

createMenu
Creates the annotation menu with options to highlight text in different colors, add notes, remove selected highlights, and clear all highlights. The menu also displays a list of added notes.

toggleMenu
Toggles the visibility of the annotation menu.

highlightText
Highlights the selected text in the specified color. It handles exceptions and displays error messages if any issues occur.

addNote
Prompts the user to enter a note (up to 5 notes allowed). The notes are displayed in the annotation menu and saved to local storage.

deleteNote
Deletes a note from the notes list and updates the local storage.

removeSelectedHighlights
Removes the highlights from the selected text. It handles exceptions and displays error messages if any issues occur.

clearAllHighlights
Clears all highlights on the page and updates the local storage.

getXPath
Generates an XPath string for a given element. This is used to uniquely identify highlighted elements.

getElementByXPath
Retrieves an element based on its XPath string.

updateNotesList
Updates the list of notes displayed in the annotation menu.

saveHighlightsToLocal
Saves the list of highlighted elements to local storage.

saveNotesToLocal
Saves the list of notes to local storage.

loadHighlightsFromLocal
Loads the list of highlighted elements from local storage and applies the highlights to the page.

loadNotesFromLocal
Loads the list of notes from local storage and updates the annotation menu.

## Error Handling

The script includes try-catch blocks to handle exceptions and display error messages when issues occur during highlighting and removing highlights.

## License

This project is licensed under the MIT License.
