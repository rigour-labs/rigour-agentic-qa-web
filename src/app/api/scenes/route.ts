import { NextRequest, NextResponse } from "next/server";
import { scenesStore, generateId } from "@/lib/store";
import type { Scene } from "@/types";

export async function GET() {
  const scenes = Array.from(scenesStore.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return NextResponse.json(scenes);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const scene: Scene = {
      id: generateId(),
      title: body.title.trim(),
      description: body.description || "",
      actor: body.actor || "api_client",
      steps: body.steps || [],
      assertions: body.assertions || [],
      edgeCases: body.edgeCases || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    scenesStore.set(scene.id, scene);

    return NextResponse.json(scene, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
