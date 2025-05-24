import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import FormData from "form-data";
import fetch from "node-fetch";

export async function POST(req) {
  try {
    const { filename } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileStream = fs.createReadStream(filePath);

    const form = new FormData();
    form.append("file", fileStream, filename);

    const fastapiResponse = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: form,
      headers: form.getHeaders()
    });

    if (!fastapiResponse.ok) {
      const errText = await fastapiResponse.text();
      return NextResponse.json({ error: "FastAPI Error", detail: errText }, { status: 500 });
    }

    const result = await fastapiResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}