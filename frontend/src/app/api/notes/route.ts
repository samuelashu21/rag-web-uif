import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { NotePayload, validateAndNormalizeNoteInput } from "@/lib/note-validation";
import Note from "@/models/Note";

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
    const { error, title, content } = validateAndNormalizeNoteInput(payload);

    if (error) {
      return NextResponse.json(
        { success: false, error },
        { status: 400 }
      );
    }

    await dbConnect();
    const note = await Note.create({
      title,
      content,
    });

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create note" },
      { status: 500 }
    );
  }
}
