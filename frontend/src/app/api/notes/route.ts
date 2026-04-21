import { NextRequest, NextResponse } from "next/server";
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

export async function GET() {
  try {
    await dbConnect();
    const notes = await Note.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: notes }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const note = await Note.create({
      title: payload.title?.trim(),
      content: payload.content?.trim(),
    });

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create note" },
      { status: 500 }
    );
  }
}
