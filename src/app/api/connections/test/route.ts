import { NextRequest, NextResponse } from "next/server";
import { Connection } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<Connection>;

    if (!body.baseUrl) {
      return NextResponse.json(
        { error: "Base URL is required", success: false },
        { status: 400 }
      );
    }

    // Simulate testing the connection
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), body.timeout || 30000);

      const response = await fetch(body.baseUrl, {
        method: "HEAD",
        signal: controller.signal,
        headers: body.headers || {},
      });

      clearTimeout(timeoutId);

      return NextResponse.json({
        success: response.ok,
        statusCode: response.status,
        message: response.ok
          ? "Connection successful"
          : `HTTP ${response.status}`,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error ? error.message : "Connection failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to test connection", success: false },
      { status: 400 }
    );
  }
}
