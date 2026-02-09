import { NextRequest, NextResponse } from "next/server";
import { connectionsStore, generateId } from "@/lib/store";
import type { Connection } from "@/types";

export async function GET() {
  const connections = Array.from(connectionsStore.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return NextResponse.json(connections);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!body.baseUrl?.trim()) {
      return NextResponse.json({ error: "Base URL is required" }, { status: 400 });
    }

    const connection: Connection = {
      id: generateId(),
      name: body.name.trim(),
      baseUrl: body.baseUrl.trim().replace(/\/+$/, ""),
      authType: body.authType || "none",
      authToken: body.authToken,
      headers: body.headers || {},
      timeout: body.timeout || 10000,
      environment: body.environment || "dev",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    connectionsStore.set(connection.id, connection);

    return NextResponse.json(connection, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
