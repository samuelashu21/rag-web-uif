"use client";

import { FormEvent, useEffect, useState } from "react";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

const EMPTY_FORM = { title: "", content: "" };

export default function CrudNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function fetchNotes() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notes");
      const result: ApiResponse<Note[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to load notes");
      }

      setNotes(result.data || []);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "Failed to load notes"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function validateForm() {
    const title = form.title.trim();
    const content = form.content.trim();

    if (!title) {
      return "Title is required";
    }
    if (title.length > 120) {
      return "Title must be at most 120 characters";
    }
    if (!content) {
      return "Content is required";
    }
    if (content.length > 2000) {
      return "Content must be at most 2000 characters";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const isEditing = Boolean(editingId);
    const url = isEditing ? `/api/notes/${editingId}` : "/api/notes";
    const method = isEditing ? "PUT" : "POST";

    setSaving(true);
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result: ApiResponse<Note> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Failed to ${isEditing ? "update" : "create"} note`);
      }

      setSuccess(isEditing ? "Note updated" : "Note created");
      resetForm();
      await fetchNotes();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : `Failed to ${isEditing ? "update" : "create"} note`
      );
    } finally {
      setSaving(false);
    }
  }

  function startEdit(note: Note) {
    setEditingId(note._id);
    setForm({ title: note.title, content: note.content });
    setError(null);
    setSuccess(null);
  }

  async function handleDelete(id: string) {
    const isConfirmed = window.confirm("Delete this note?");
    if (!isConfirmed) {
      return;
    }

    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      const result: ApiResponse<null> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete note");
      }

      setSuccess("Note deleted");
      if (editingId === id) {
        resetForm();
      }
      await fetchNotes();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Failed to delete note"
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Next.js + MongoDB CRUD</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create, read, update, and delete notes from MongoDB.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border bg-white p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            {editingId ? "Edit Note" : "Create Note"}
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
              maxLength={120}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              className="min-h-32 w-full rounded-lg border px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
              maxLength={2000}
              required
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
            >
              {saving ? "Saving..." : editingId ? "Update Note" : "Create Note"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </form>

        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Notes</h2>
          {loading ? (
            <p className="text-sm text-gray-600">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-gray-600">No notes yet. Create your first note.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note._id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900">{note.title}</h3>
                      <p className="whitespace-pre-wrap text-sm text-gray-700">{note.content}</p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        className="rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(note._id)}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
