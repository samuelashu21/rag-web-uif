import mongoose, { Model, Schema } from "mongoose";

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
      maxlength: [120, "Title must be at most 120 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [1, "Content must not be empty"],
      maxlength: [2000, "Content must be at most 2000 characters"],
    },
  },
  { timestamps: true }
);

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", noteSchema);

export default Note;
