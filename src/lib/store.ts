/**
 * Shared in-memory stores for all API routes.
 * Single source of truth — every route imports from here.
 *
 * Uses globalThis to survive Next.js dev-mode HMR reloads.
 * In production, replace these Maps with a database (Prisma/Drizzle).
 */
import type { Scene, ExecutionResult, Connection } from "@/types";

// Attach stores to globalThis so they survive module re-imports during HMR
const g = globalThis as unknown as {
  __rqScenes?: Map<string, Scene>;
  __rqExecutions?: Map<string, ExecutionResult>;
  __rqConnections?: Map<string, Connection>;
  __rqSeeded?: boolean;
};

export const scenesStore: Map<string, Scene> =
  g.__rqScenes ?? (g.__rqScenes = new Map());

export const executionsStore: Map<string, ExecutionResult> =
  g.__rqExecutions ?? (g.__rqExecutions = new Map());

export const connectionsStore: Map<string, Connection> =
  g.__rqConnections ?? (g.__rqConnections = new Map());

export function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

// ── Seed data (only once, survives HMR) ─────────────────────────
if (!g.__rqSeeded) {
  g.__rqSeeded = true;

  const SEED_CONNECTION: Connection = {
    id: "seed_conn_1",
    name: "JSONPlaceholder (Demo)",
    baseUrl: "https://jsonplaceholder.typicode.com",
    authType: "none",
    headers: {},
    timeout: 10000,
    environment: "dev",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const SEED_SCENE: Scene = {
    id: "seed_scene_1",
    title: "Get All Users",
    description:
      "Fetch the list of users from JSONPlaceholder and verify the response",
    actor: "api_client",
    steps: [
      {
        id: "step_1",
        description: "GET /users",
        method: "GET",
        url: "/users",
      },
    ],
    assertions: [
      {
        id: "assert_1",
        type: "response_code",
        expected: 200,
      },
      {
        id: "assert_2",
        type: "body_contains",
        target: "response_body",
        expected: "Leanne Graham",
      },
    ],
    edgeCases: [
      {
        type: "boundary",
        description: "Request with invalid query params",
        probability: "medium",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  connectionsStore.set(SEED_CONNECTION.id, SEED_CONNECTION);
  scenesStore.set(SEED_SCENE.id, SEED_SCENE);
}
