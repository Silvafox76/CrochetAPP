
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: (session.user as any).id
      },
      include: {
        pattern: {
          select: {
            id: true,
            title: true,
            itemType: true,
            imageUrl: true
          }
        },
        progress: {
          orderBy: {
            rowNumber: 'asc'
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(projects);

  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
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
    
    const project = await prisma.project.create({
      data: {
        ...data,
        userId: (session.user as any).id,
        startedAt: new Date()
      },
      include: {
        pattern: {
          select: {
            id: true,
            title: true,
            itemType: true,
            imageUrl: true
          }
        },
        progress: true
      }
    });

    return NextResponse.json(project);

  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
