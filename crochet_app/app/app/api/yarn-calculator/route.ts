
import { NextResponse } from "next/server";
import { YarnCalculator } from "../../../lib/yarn-calculator";

export async function POST(request: Request) {
  try {
    const { itemType, size, yarnWeight, customDimensions } = await request.json();
    
    const calculator = new YarnCalculator();
    const result = calculator.calculateYarnNeeds(itemType, size, yarnWeight, customDimensions);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Yarn calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate yarn requirements" },
      { status: 500 }
    );
  }
}
