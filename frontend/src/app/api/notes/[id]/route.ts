import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/mongodb";
import Note from "@/models/Note";

type NotePayload = {
  title?: string;
  content?: string;
};

function validatePayload(payload: NotePayload) {
  const title = payload.title?.trim() || "";
  const content = payload.content?.trim() || "";

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

function invalidIdResponse() {
  return NextResponse.json(
    { success: false, error: "Invalid note id" },
    { status: 400 }
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return invalidIdResponse();
  }

  try {
    await dbConnect();
    const note = await Note.findById(params.id).lean();

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: note }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return invalidIdResponse();
  }

  try {
    const payload = (await req.json()) as NotePayload;
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    await dbConnect();
    const note = await Note.findByIdAndUpdate(
      params.id,
      {
        title: payload.title?.trim(),
        content: payload.content?.trim(),
      },
      { new: true }
    );

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: note }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return invalidIdResponse();
  }

  try {
    await dbConnect();
    const deletedNote = await Note.findByIdAndDelete(params.id);

    if (!deletedNote) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Note deleted" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
