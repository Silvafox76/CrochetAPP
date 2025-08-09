
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get("itemType");
    const skillLevel = searchParams.get("skillLevel");
    const search = searchParams.get("search");

    const where: any = {
      isPublic: true
    };

    if (itemType && itemType !== "all") {
      where.itemType = itemType;
    }

    if (skillLevel && skillLevel !== "all") {
      where.skillLevel = skillLevel;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const patterns = await prisma.pattern.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            firstName: true,
            lastName: true
          }
        },
        instructions: {
          orderBy: {
            rowNumber: 'asc'
          }
        },
        materials: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(patterns);

  } catch (error) {
    console.error("Patterns API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patterns" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const pattern = await prisma.pattern.create({
      data: {
        ...data,
        authorId: (session.user as any).id,
        instructions: {
          create: data.instructions || []
        },
        materials: {
          create: data.materials || []
        }
      },
      include: {
        author: {
          select: {
            name: true,
            firstName: true,
            lastName: true
          }
        },
        instructions: {
          orderBy: {
            rowNumber: 'asc'
          }
        },
        materials: true
      }
    });

    return NextResponse.json(pattern);

  } catch (error) {
    console.error("Create pattern error:", error);
    return NextResponse.json(
      { error: "Failed to create pattern" },
      { status: 500 }
    );
  }
}
