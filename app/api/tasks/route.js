import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}

export async function POST(req) {
  const data = await req.json();
  const task = await prisma.task.create({ data });
  return NextResponse.json(task, { status: 201 });
}