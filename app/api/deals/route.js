import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const deals = await prisma.deal.findMany();
  return NextResponse.json(deals);
}

export async function POST(req) {
  const data = await req.json();
  const deal = await prisma.deal.create({ data });
  return NextResponse.json(deal, { status: 201 });
}