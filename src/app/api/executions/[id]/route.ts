import { NextRequest, NextResponse } from "next/server";
import { executionsStore } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const execution = executionsStore.get(id);

  if (!execution) {
    return NextResponse.json(
      { error: "Execution not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(execution);
}
