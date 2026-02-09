import { NextRequest, NextResponse } from "next/server";
import { connectionsStore } from "@/lib/store";
import type { Connection } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const connection = connectionsStore.get(id);

  if (!connection) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }

  return NextResponse.json(connection);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const connection = connectionsStore.get(id);

  if (!connection) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }

  try {
    const body = await request.json();

    const updated: Connection = {
      ...connection,
      ...body,
      id: connection.id,
      createdAt: connection.createdAt,
      updatedAt: new Date().toISOString(),
    };

    connectionsStore.set(id, updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!connectionsStore.has(id)) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }

  connectionsStore.delete(id);
  return NextResponse.json({ success: true });
}
