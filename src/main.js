import "./style.css";
import { createStore } from "./storage.js";

const store = createStore();

const listView = document.querySelector("#list-view");
const editorView = document.querySelector("#editor-view");
const noteList = document.querySelector("#note-list");
const emptyMessage = document.querySelector("#empty-message");
const editorHeading = document.querySelector("#editor-heading");
const editorForm = document.querySelector("#editor-form");
const titleInput = document.querySelector("#note-title");
const bodyInput = document.querySelector("#note-body");
const addButton = document.querySelector("#add-button");
const cancelButton = document.querySelector("#cancel-button");
const deleteButton = document.querySelector("#delete-button");

let editingId = null;

function renderList() {
  const notes = store.list();
  noteList.replaceChildren(...notes.map(renderNoteItem));
  emptyMessage.hidden = notes.length > 0;
}

function renderNoteItem(note) {
  const item = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "note-item";
  button.addEventListener("click", () => openEditor(note));

  const title = document.createElement("span");
  title.className = "note-title";
  title.textContent = note.title || "(Tanpa judul)";

  const preview = document.createElement("span");
  preview.className = "note-preview";
  preview.textContent = note.body;

  button.append(title, preview);
  item.append(button);
  return item;
}

function openEditor(note = null) {
  editingId = note ? note.id : null;
  editorHeading.textContent = note ? "Ubah catatan" : "Catatan baru";
  titleInput.value = note ? note.title : "";
  bodyInput.value = note ? note.body : "";
  deleteButton.hidden = !note;
  listView.hidden = true;
  editorView.hidden = false;
  titleInput.focus();
}

function closeEditor() {
  editingId = null;
  editorView.hidden = true;
  listView.hidden = false;
  renderList();
  addButton.focus();
}

addButton.addEventListener("click", () => openEditor());
cancelButton.addEventListener("click", closeEditor);

editorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (title || body) {
    store.save({ id: editingId, title, body });
  }
  closeEditor();
});

deleteButton.addEventListener("click", () => {
  if (editingId) {
    store.remove(editingId);
  }
  closeEditor();
});

renderList();
