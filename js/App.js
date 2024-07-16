import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

export default class App {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handlers());

        this._refreshNotes();
    }

    _refreshNotes() {
        const notes = NotesAPI.getAllNotes();

        this._setNotes(notes);

        if (notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    }

    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
    }

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
        this.view.updateNotePreviewVisibility(true);
    }

    _handlers() {
        return {
            onNoteSelect: (noteId) => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },
            onNoteAdd: () => {
                const title = prompt("Enter a title for your note:");

                if (title) {
                    const newNote = {
                        title: title,
                        body: "" // Default placeholder text
                    };

                    NotesAPI.saveNote(newNote);
                    this._refreshNotes();
                }
            },
            onNoteEdit: (title, body) => {
                if (body.length > 60) {
                    alert("Note body is too long. It will be truncated to 30 characters.");
                }

                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title: title,
                    body: body.length > 30 ? body.substring(0, 60) : body // Truncate body to keep it short
                });

                this._refreshNotes();
            },
            onNoteDelete: (noteId) => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            }
        };
    }
}


