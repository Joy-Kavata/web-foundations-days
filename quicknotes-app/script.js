const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const noteCategory = document.getElementById("note-category");
const searchInput = document.getElementById("search-input");
const notesList = document.getElementById("notes-list");
const noteCount = document.getElementById("note-count");
const errorMessage = document.getElementById("error-message");

let notes = [];

function loadNotes() {
    const storedNotes = localStorage.getItem("quicknotes");
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
    }
}

function saveNotes() {
    localStorage.setItem("quicknotes", JSON.stringify(notes));
}

function updateCountText(filteredCount, totalCount) {
    if (totalCount === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (totalCount === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        if (filteredCount !== totalCount) {
            noteCount.textContent = `Showing ${filteredCount} of ${totalCount} notes.`;
        } else {
            noteCount.textContent = `You have ${totalCount} notes.`;
        }
    }
}

function renderNotes() {
    notesList.innerHTML = "";
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(searchTerm)
    );

    updateCountText(filteredNotes.length, notes.length);

    if (filteredNotes.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = notes.length === 0 ? "No notes added yet." : "No notes match your search.";
        emptyItem.style.color = "#666";
        emptyItem.style.fontStyle = "italic";
        notesList.appendChild(emptyItem);
        return;
    }

    filteredNotes.forEach(note => {
        const li = document.createElement("li");
        li.className = `note-card category-${note.category}`;

        const contentDiv = document.createElement("div");
        contentDiv.className = "note-content";

        const pText = document.createElement("p");
        pText.className = "note-text-body";
        pText.textContent = note.text;

        const metaDiv = document.createElement("div");
        metaDiv.className = "note-meta";

        const catSpan = document.createElement("span");
        catSpan.className = "category-tag";
        catSpan.textContent = note.category;

        const dateSpan = document.createElement("span");
        dateSpan.textContent = note.createdAt;

        metaDiv.appendChild(catSpan);
        metaDiv.appendChild(dateSpan);
        contentDiv.appendChild(pText);
        contentDiv.appendChild(metaDiv);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteNote(note.id));

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = noteInput.value.trim();

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }
    if (text.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    errorMessage.textContent = "";

    const newNote = {
        id: Date.now().toString(),
        text: text,
        category: noteCategory.value,
        createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
    };

    notes.push(newNote);
    saveNotes();
    renderNotes();

    noteInput.value = "";
    noteCategory.value = "personal";
});

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
}

searchInput.addEventListener("input", () => {
    renderNotes();
});

loadNotes();
renderNotes();