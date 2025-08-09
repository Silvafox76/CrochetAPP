
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { PatternGenerator } from "../../../../lib/pattern-generator";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const inputs = await request.json();
    const generator = new PatternGenerator();
    
    const result = generator.generatePattern(inputs);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Pattern generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate pattern" },
      { status: 500 }
    );
  }
}
