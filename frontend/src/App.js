import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get(API_URL);
      setTodos(data);
    } catch (e) {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    const title = newTitle.trim();
    if (!title) return;
    try {
      setError('');
      const { data } = await axios.post(API_URL, { title });
      setTodos((prev) => [data, ...prev]);
      setNewTitle('');
    } catch (e) {
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (todo) => {
    try {
      setError('');
      const { data } = await axios.put(`${API_URL}/${todo.id}`, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    } catch (e) {
      setError('Failed to toggle todo');
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const saveEdit = async (id) => {
    const title = editingTitle.trim();
    if (!title) return cancelEditing();
    try {
      setError('');
      const { data } = await axios.put(`${API_URL}/${id}`, { title });
      setTodos((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      cancelEditing();
    } catch (e) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    // gentle confirmation
    if (!window.confirm('Delete this to-do?')) return;
    try {
      setError('');
      await axios.delete(`${API_URL}/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError('Failed to delete todo');
    }
  };

  const onEnter = (e, action) => {
    if (e.key === 'Enter') action();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title} aria-label="To-Do List">To-Do List</h1>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="Add a new todo..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => onEnter(e, addTodo)}
          aria-label="New to-do title"
        />
        <button
          style={{
            ...styles.addButton,
            opacity: newTitle.trim() ? 1 : 0.6,
            pointerEvents: newTitle.trim() ? 'auto' : 'none',
          }}
          aria-label="Add to-do"
          onClick={addTodo}
        >
          Add
        </button>
      </div>

      {loading && <p aria-live="polite">Loading your to-dos…</p>}
      {error && <p style={{ color: 'crimson' }} role="alert">{error}</p>}

      {!loading && todos.length > 0 && (
        <p style={{ color: '#555', marginTop: 0 }} aria-live="polite">
          {todos.filter(t => !t.completed).length} pending, {todos.filter(t => t.completed).length} completed
        </p>
      )}

      <ul style={styles.list}>
        {!loading && todos.length === 0 && (
          <li style={{ color: '#666' }}>No to-dos yet. Add your first one above ✨</li>
        )}
        {todos.map((todo) => (
          <li key={todo.id} style={styles.listItem}>
            <div style={styles.left}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                aria-label={todo.completed ? `Mark "${todo.title}" as not completed` : `Mark "${todo.title}" as completed`}
              />
              {editingId === todo.id ? (
                <input
                  style={styles.editInput}
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(todo.id);
                    if (e.key === 'Escape') cancelEditing();
                  }}
                  autoFocus
                  aria-label={`Edit title for ${todo.title}`}
                />
              ) : (
                <span
                  style={{
                    ...styles.titleText,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#888' : '#222',
                  }}
                  onDoubleClick={() => startEditing(todo)}
                  title="Double-click to edit"
                >
                  {todo.title}
                </span>
              )}
            </div>

            <div style={styles.right}>
              {editingId === todo.id ? (
                <>
                  <button style={styles.saveButton} onClick={() => saveEdit(todo.id)} aria-label="Save edits">Save</button>
                  <button style={styles.cancelButton} onClick={cancelEditing} aria-label="Cancel editing">Cancel</button>
                </>
              ) : (
                <>
                  <button style={styles.editButton} onClick={() => startEditing(todo)} aria-label={`Edit ${todo.title}`}>Edit</button>
                  <button style={styles.deleteButton} onClick={() => deleteTodo(todo.id)} aria-label={`Delete ${todo.title}`}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 640,
    margin: '40px auto',
    padding: 24,
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
  },
  title: { margin: '0 0 16px' },
  inputRow: { display: 'flex', gap: 8, marginBottom: 16 },
  input: { flex: 1, padding: '10px 12px', fontSize: 16 },
  addButton: { padding: '10px 16px', fontSize: 16, cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
  },
  left: { display: 'flex', alignItems: 'center', gap: 10, flex: 1 },
  right: { display: 'flex', alignItems: 'center', gap: 8 },
  titleText: { fontSize: 16, cursor: 'default' },
  editButton: { padding: '6px 10px' },
  deleteButton: { padding: '6px 10px', color: 'white', background: '#ef4444', border: 'none', borderRadius: 6, cursor: 'pointer' },
  saveButton: { padding: '6px 10px', color: 'white', background: '#10b981', border: 'none', borderRadius: 6, cursor: 'pointer' },
  cancelButton: { padding: '6px 10px', background: '#e5e7eb', border: 'none', borderRadius: 6, cursor: 'pointer' },
  editInput: { flex: 1, padding: '8px 10px', fontSize: 16 },
};

export default App;

