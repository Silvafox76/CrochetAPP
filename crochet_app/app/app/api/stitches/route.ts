
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    const where: any = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (difficulty && difficulty !== "all") {
      where.difficulty = difficulty;
    }

    const stitches = await prisma.stitchLibrary.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(stitches);

  } catch (error) {
    console.error("Stitches API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stitches" },
      { status: 500 }
    );
  }
}
