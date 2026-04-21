export const NOTE_TITLE_MAX_LENGTH = 120;
export const NOTE_CONTENT_MAX_LENGTH = 2000;

export type NotePayload = {
  title?: string;
  content?: string;
};

export function validateAndNormalizeNoteInput(payload: NotePayload) {
  const title = payload.title?.trim() || "";
  const content = payload.content?.trim() || "";

  if (!title) {
    return { error: "Title is required", title, content };
  }

  if (title.length > NOTE_TITLE_MAX_LENGTH) {
    return {
      error: `Title must be at most ${NOTE_TITLE_MAX_LENGTH} characters`,
      title,
      content,
    };
  }

  if (!content) {
    return { error: "Content is required", title, content };
  }

  if (content.length > NOTE_CONTENT_MAX_LENGTH) {
    return {
      error: `Content must be at most ${NOTE_CONTENT_MAX_LENGTH} characters`,
      title,
      content,
    };
  }

  return { error: null, title, content };
}
