const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

function updateCounts() {
    const text = noteText.value;
    const length = text.length;
    
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    charCount.textContent = `${length} / 200 characters`;
    wordCount.textContent = `${words} words`;

    charCount.className = "";

    if (length > 200) {
        charCount.classList.add("over");
    } else if (length > 180) {
        charCount.classList.add("warning");
    }
}

function handleInput() {
    updateCounts();
    localStorage.setItem("note-draft", noteText.value);
}

function clearEditor() {
    noteText.value = "";
    localStorage.removeItem("note-draft");
    updateCounts();
    noteText.focus();
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    
    themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

function init() {
    const savedDraft = localStorage.getItem("note-draft");
    if (savedDraft !== null) {
        noteText.value = savedDraft;
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }

    updateCounts();
}

noteText.addEventListener("input", handleInput);

clearBtn.addEventListener("click", clearEditor);

noteText.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        clearEditor();
    }
});

themeToggle.addEventListener("click", toggleTheme);

init();