const sideBar = document.querySelector(".sidebar");
const notesList = document.querySelector(".notes-list");
const addNoteButton = document.querySelector(".add-note-button");

const sortButton = document.querySelector(".sort-button");
const sortDropdownMenu = document.querySelector(".sort-dropdown-menu");
const searchInput = document.querySelector(".search-input-box");
const sortOptions = document.querySelectorAll(".sort-option");

const noteDefaultScreen = document.querySelector(".note-default-screen");
const noteView = document.querySelector(".note-view");
const noteContent = document.querySelector(".note-content");
const noteTitle = document.querySelector(".note-title");

const AIButton = document.querySelector(".ai-button");
const chatBox = document.querySelector(".ai-chat-box");
const chatArea = document.querySelector(".ai-chat-content");
const promptBox = document.querySelector(".prompt-box");
const closeChatButton = document.querySelector(".close-chat-button");
const sendChatButton = document.querySelector(".send-chat-button");

const focusOverlay = document.querySelector(".focus-overlay");

let chatHistory = [];

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let activeNoteIndex = null;

function getAIResponse() {
    if (promptBox.value.trim().length > 0) {
        let prompt = promptBox.value;
        prompt = prompt.replace(/\n/g, "<br>").trim();
        promptBox.value = "";

        let requestHTML = `
        <div class="chat-item request">
            <span class="material-symbols-outlined">account_circle</span>
            <span>${prompt}</span>
        </div>`;

        let responseHTML = `
        <div class="chat-item response">
            <img src="assets/gemini_logo.png" style="width:25px; height:25px">
            <span class="text">
                <div class="loading-dot-animation">
                    <div class="loading-dot" style="--delay: 0.0s"></div>
                    <div class="loading-dot" style="--delay: 0.1s"></div>
                    <div class="loading-dot" style="--delay: 0.2s"></div>
                </div>
            </span>
        </div>`;
        
        chatArea.insertAdjacentHTML("beforeend", requestHTML);
        setTimeout(() => {
            chatArea.insertAdjacentHTML("beforeend", responseHTML);
            const scrollElement = chatArea.lastElementChild;
            scrollElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

            if (chatHistory.length === 0) {
                prompt = noteContent.value + " " + prompt;
            }
            
            const requestObject = {"parts":[{"text": prompt}], "role": "user"};
            chatHistory.push(requestObject);

            const proxyServerUrl = "http://localhost:8000/api/gemini";
            const API_URL = new URL(proxyServerUrl);
            API_URL.searchParams.append('prompt', JSON.stringify(chatHistory));

            const requestOptions = {
                method: "GET"
            };

            const responseText = document.querySelector(".response .text");
            fetch(API_URL, requestOptions).then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status}: ${response.statusText}`);
                }
                return response.json();
            }).then(data => {
                chatHistory.push(data);
                responseText.innerHTML = data.parts[0].text;
                responseText.classList.remove("text");
                scrollElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }).catch((error) => {
                console.error(error.message);
                responseText.innerHTML = ("An error occured while fetching the response. Check the console for more details.");
                responseText.classList.remove("text");
            })
        }, 100)
    }
}

function showNoteView(noteIndex) {
    noteDefaultScreen.classList.remove("show");
    noteView.classList.add("show");

    if (noteIndex !== null) {
        const note = notes[noteIndex];
        noteTitle.value = note.title;
        noteContent.value = note.content;
        activeNoteIndex = noteIndex;
    } else {
        noteTitle.value = "";
        noteContent.value = "";
        activeNoteIndex = null;
        removeActiveNoteItem();
    }
}

function removeActiveNoteItem() {
    const activeNoteItem = document.querySelector(".note-item.active");
    if (activeNoteItem) {
        activeNoteItem.classList.remove("active");
    }
}

function searchNotes() {
    const searchText = searchInput.value.toLowerCase();
    const noteItems = notesList.querySelectorAll(".note-item");
    noteItems.forEach(noteItem => {
      const noteTitle = noteItem.querySelector(".note-item-title").textContent.toLowerCase();
      if (noteTitle.includes(searchText)) {
        noteItem.style.display = "flex";
      } else {
        noteItem.style.display = "none";
      }
    });
}

function sortNotes(sortValue) {
    switch (sortValue) {
        case "alph-asc":
            notes.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case "alph-desc":
            notes.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "date-asc":
            notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            break;
        case "date-desc":
            notes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            break;
    }
    notesList.innerHTML = "";
    notes.forEach(note => addNoteToList(note));
    showNoteView(notes.length - 1);
    notesList.querySelector(".note-item").classList.add("active");
    sortDropdownMenu.classList.remove("show");
}

function showDefaultScreen() {
    noteDefaultScreen.classList.add("show");
    noteView.classList.remove("show");
    noteTitle.value = "";
    noteContent.value = "";
    activeNoteIndex = null;
    removeActiveNoteItem();
}

function saveNote() {
    const now = new Date();
    const title = noteTitle.value.trim() || "Untitled Note";
    const content = noteContent.value.trim();
    if (activeNoteIndex === null) {
        const newNote = {
            id: Date.now(),
            title,
            content,
            timestamp: now.toISOString(),
        };
        notes.push(newNote);
        addNoteToList(newNote);
    } else {
        const note = notes[activeNoteIndex];
        note.title = title;
        note.content = content;
        note.timestamp = now.toISOString();
        updateNoteInList(note);
    }
    
    localStorage.setItem("notes", JSON.stringify(notes));
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Intl.DateTimeFormat('en-IN', options).format(date);
}

function addNoteToList(note) {
    const noteItem = document.createElement("div");
    noteItem.classList.add("note-item");
    noteItem.dataset.id = note.id;
    
    const noteItemText = document.createElement("div");
    noteItemText.classList.add("note-item-header");

    const noteItemTitle = document.createElement("span");
    noteItemTitle.classList.add("note-item-title");
    noteItemTitle.textContent = note.title;

    const noteItemTimestamp = document.createElement("span");
    noteItemTimestamp.classList.add("note-item-timestamp");
    noteItemTimestamp.textContent = formatTimestamp(note.timestamp);

    noteItemText.appendChild(noteItemTitle);
    noteItemText.appendChild(noteItemTimestamp);

    const deleteNoteButton = document.createElement("button");
    deleteNoteButton.classList.add("delete-note-button");
    deleteNoteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';

    deleteNoteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this note?")) {
            const noteIndex = notes.findIndex((n) => n.id === note.id);
            notes.splice(noteIndex, 1);
            localStorage.setItem("notes", JSON.stringify(notes));
            noteItem.remove();
            if (notes.length === 0) {
                showDefaultScreen();
            } else if (activeNoteIndex === noteIndex) {
                showDefaultScreen();
            }
        }
    });

    noteItem.appendChild(noteItemText);
    noteItem.appendChild(deleteNoteButton);

    notesList.insertBefore(noteItem, notesList.firstChild);

    noteItem.addEventListener("click", () => {
        const activeNoteItem = document.querySelector(".note-item.active");
        if (activeNoteItem) {
            activeNoteItem.classList.remove("active");
        }
        noteItem.classList.add("active");
        const noteIndex = notes.findIndex((n) => n.id === note.id);
        showNoteView(noteIndex);
    });
}

function updateNoteInList(note) {
    const noteItem = notesList.querySelector(`.note-item[data-id="${note.id}"]`);
    noteItem.querySelector(".note-item-title").textContent = note.title;
}

function loadNotes() {
    notes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    notesList.innerHTML = "";
    notes.forEach((note) => addNoteToList(note));
    if (notes.length === 0) {
        showDefaultScreen();
    } else {
        showNoteView(notes.length - 1);
        notesList.querySelector(".note-item").classList.add("active");
    }
    searchNotes();
}

AIButton.addEventListener("click", () => {
    chatBox.style.display = "flex";
    focusOverlay.classList.remove("hidden");
})

closeChatButton.addEventListener("click", () => {
    sideBar.style.display = "block";
    noteView.style.display = "flex";
    chatBox.style.display = "none";
    focusOverlay.classList.add("hidden");
    chatArea.innerHTML = "";
    chatHistory = [];
})

sendChatButton.addEventListener("click", () => {
    getAIResponse();
})

promptBox.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); 
        getAIResponse();
    }
});

addNoteButton.addEventListener("click", () => {
    const activeNoteItem = document.querySelector(".note-item.active");
    if (activeNoteItem) {
        activeNoteItem.classList.remove("active");
    }
    if (activeNoteIndex !== null) {
        saveNote();
    }

    showNoteView(null);

    const newNote = {
        id: Date.now(),
        title: "Untitled Note",
        content: "",
        timestamp: new Date().toISOString(),
    };
    notes.push(newNote);
    addNoteToList(newNote);
    const newNoteItem = notesList.firstElementChild;
    newNoteItem.classList.add("active");
    activeNoteIndex = notes.length - 1;
    localStorage.setItem("notes", JSON.stringify(notes));
});

sortButton.addEventListener("click", () => {
    sortDropdownMenu.classList.toggle("show");
});

sortOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
        const selectedOption = event.target.getAttribute("data-value");
        sortNotes(selectedOption);
    });
});

document.addEventListener("click", function(event) {
    if (!sortButton.contains(event.target) && !sortDropdownMenu.contains(event.target)) {
      sortDropdownMenu.classList.remove("show");
    }
});

searchInput.addEventListener("input", searchNotes);
noteTitle.addEventListener("input", saveNote);
noteContent.addEventListener("input", saveNote);

loadNotes();
