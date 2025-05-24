import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const interactions = await prisma.interaction.findMany();
  return NextResponse.json(interactions);
}

export async function POST(req) {
  const data = await req.json();
  const interaction = await prisma.interaction.create({ data });
  return NextResponse.json(interaction, { status: 201 });
}