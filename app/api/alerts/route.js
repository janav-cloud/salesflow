import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const alerts = await prisma.alert.findMany();
  return NextResponse.json(alerts);
}

export async function POST(req) {
  const data = await req.json();
  const alert = await prisma.alert.create({ data });
  return NextResponse.json(alert, { status: 201 });
}