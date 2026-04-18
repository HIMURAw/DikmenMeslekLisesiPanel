import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SchoolData from "@/lib/models";

export async function GET() {
  try {
    await dbConnect();
    // One-time clear if requested via query param (internal use)
    // const { searchParams } = new URL(req.url);
    // if (searchParams.get("clear") === "true") await SchoolData.deleteMany({});

    const data = await SchoolData.findOne({});
    if (!data) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // We update the existing document or create a new one if it doesn't exist
    // Using { upsert: true } and empty filter since we only have one doc.
    const updatedData = await SchoolData.findOneAndUpdate(
      {},
      body,
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json(updatedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
