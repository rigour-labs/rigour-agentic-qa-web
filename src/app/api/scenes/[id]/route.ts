import { NextRequest, NextResponse } from "next/server";
import { scenesStore } from "@/lib/store";
import type { Scene } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const scene = scenesStore.get(id);

  if (!scene) {
    return NextResponse.json({ error: "Scene not found" }, { status: 404 });
  }

  return NextResponse.json(scene);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const scene = scenesStore.get(id);

  if (!scene) {
    return NextResponse.json({ error: "Scene not found" }, { status: 404 });
  }

  try {
    const body = await request.json();

    const updated: Scene = {
      ...scene,
      ...body,
      id: scene.id,
      createdAt: scene.createdAt,
      updatedAt: new Date().toISOString(),
    };

    scenesStore.set(id, updated);
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

  if (!scenesStore.has(id)) {
    return NextResponse.json({ error: "Scene not found" }, { status: 404 });
  }

  scenesStore.delete(id);
  return NextResponse.json({ success: true });
}
