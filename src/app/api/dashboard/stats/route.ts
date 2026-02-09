import { NextResponse } from "next/server";
import { scenesStore, executionsStore } from "@/lib/store";
import type { DashboardStats } from "@/types";

export async function GET() {
  const scenes = Array.from(scenesStore.values());
  const executions = Array.from(executionsStore.values());

  const completedExecutions = executions.filter(
    (e) => e.status === "pass" || e.status === "fail"
  );

  const passedExecutions = executions.filter((e) => e.status === "pass");

  const passRate =
    completedExecutions.length > 0
      ? passedExecutions.length / completedExecutions.length
      : 0;

  const totalEdgeCases = executions.reduce(
    (sum, e) => sum + (e.edgeCasesExplored?.length || 0),
    0
  );

  const totalSelfHealed = executions.reduce(
    (sum, e) => sum + (e.selfHealingActions?.length || 0),
    0
  );

  const durations = completedExecutions
    .filter((e) => e.duration != null)
    .map((e) => e.duration!);

  const averageExecutionTime =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

  const stats: DashboardStats = {
    totalScenes: scenes.length,
    totalExecutions: executions.length,
    passRate: Math.round(passRate * 100) / 100,
    edgeCasesFound: totalEdgeCases,
    selfHealedCount: totalSelfHealed,
    averageExecutionTime,
  };

  return NextResponse.json(stats);
}
