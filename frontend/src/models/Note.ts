import mongoose, { Model, Schema } from "mongoose";
import {
  NOTE_CONTENT_MAX_LENGTH,
  NOTE_TITLE_MAX_LENGTH,
} from "@/lib/note-validation";

export interface INote {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title must not be empty"],
      maxlength: [
        NOTE_TITLE_MAX_LENGTH,
        `Title must be at most ${NOTE_TITLE_MAX_LENGTH} characters`,
      ],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [1, "Content must not be empty"],
      maxlength: [
        NOTE_CONTENT_MAX_LENGTH,
        `Content must be at most ${NOTE_CONTENT_MAX_LENGTH} characters`,
      ],
    },
  },
  { timestamps: true }
);

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", noteSchema);

export default Note;
