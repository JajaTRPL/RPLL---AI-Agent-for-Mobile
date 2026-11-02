const STORAGE_KEY = "notes-app:notes";

export function createStore(storage = window.localStorage) {
  function read() {
    try {
      const notes = JSON.parse(storage.getItem(STORAGE_KEY));
      return Array.isArray(notes) ? notes : [];
    } catch {
      return [];
    }
  }

  function write(notes) {
    storage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  function list() {
    return read().sort((a, b) => b.updatedAt - a.updatedAt);
  }

  function save(note) {
    const notes = read();
    const saved = {
      id: note.id || crypto.randomUUID(),
      title: note.title ?? "",
      body: note.body ?? "",
      updatedAt: Date.now(),
    };
    const index = notes.findIndex((item) => item.id === saved.id);
    if (index === -1) {
      notes.push(saved);
    } else {
      notes[index] = saved;
    }
    write(notes);
    return saved;
  }

  function remove(id) {
    write(read().filter((note) => note.id !== id));
  }

  function search(text) {
    const query = String(text ?? "").trim().toLowerCase();
    if (!query) return list();
    return list().filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.body.toLowerCase().includes(query),
    );
  }

  return { list, save, remove, search };
}
