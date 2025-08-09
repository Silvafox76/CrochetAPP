
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { rowNumber, completed, notes } = await request.json();
    const projectId = params.id;

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: (session.user as any).id
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Update or create progress
    const progress = await prisma.projectProgress.upsert({
      where: {
        projectId_rowNumber: {
          projectId,
          rowNumber
        }
      },
      update: {
        completed,
        notes
      },
      create: {
        projectId,
        rowNumber,
        completed,
        notes
      }
    });

    // Update project current row if completed
    if (completed && rowNumber > project.currentRow) {
      await prisma.project.update({
        where: { id: projectId },
        data: { currentRow: rowNumber }
      });
    }

    return NextResponse.json(progress);

  } catch (error) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
