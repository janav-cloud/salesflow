import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const { id } = params;
  await prisma.deal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}