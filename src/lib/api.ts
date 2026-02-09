import useSWR from "swr";
import { Scene, ExecutionResult, Connection, DashboardStats } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

// Scenes
export function useScenes() {
  return useSWR<Scene[]>(`${API_BASE}/scenes`, fetcher);
}

export async function createScene(scene: Omit<Scene, "id" | "createdAt" | "updatedAt">) {
  const res = await fetch(`${API_BASE}/scenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scene),
  });
  if (!res.ok) throw new Error(`Failed to create scene: ${res.status}`);
  return res.json();
}

export async function updateScene(id: string, scene: Partial<Scene>) {
  const res = await fetch(`${API_BASE}/scenes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scene),
  });
  if (!res.ok) throw new Error(`Failed to update scene: ${res.status}`);
  return res.json();
}

export async function deleteScene(id: string) {
  const res = await fetch(`${API_BASE}/scenes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete scene: ${res.status}`);
}

// Executions
export function useExecutions(sceneId?: string) {
  const query = sceneId ? `?sceneId=${sceneId}` : "";
  return useSWR<ExecutionResult[]>(`${API_BASE}/executions${query}`, fetcher, {
    refreshInterval: 2000, // Poll every 2s to pick up running → pass/fail transitions
  });
}

export async function runScene(sceneId: string, connectionId?: string) {
  const res = await fetch(`${API_BASE}/executions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sceneId, connectionId }),
  });
  if (!res.ok) throw new Error(`Failed to run scene: ${res.status}`);
  return res.json();
}

export function useExecution(executionId: string) {
  return useSWR<ExecutionResult>(`${API_BASE}/executions/${executionId}`, fetcher, {
    refreshInterval: 1000,
  });
}

// Connections
export function useConnections() {
  return useSWR<Connection[]>(`${API_BASE}/connections`, fetcher);
}

export async function createConnection(connection: Omit<Connection, "id" | "createdAt" | "updatedAt">) {
  const res = await fetch(`${API_BASE}/connections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(connection),
  });
  if (!res.ok) throw new Error(`Failed to create connection: ${res.status}`);
  return res.json();
}

export async function updateConnection(id: string, connection: Partial<Connection>) {
  const res = await fetch(`${API_BASE}/connections/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(connection),
  });
  if (!res.ok) throw new Error(`Failed to update connection: ${res.status}`);
  return res.json();
}

export async function deleteConnection(id: string) {
  const res = await fetch(`${API_BASE}/connections/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete connection: ${res.status}`);
}

export async function testConnection(connection: Partial<Connection>) {
  const res = await fetch(`${API_BASE}/connections/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(connection),
  });
  if (!res.ok) throw new Error(`Connection test failed: ${res.status}`);
  return res.json();
}

// Dashboard
export function useDashboardStats() {
  return useSWR<DashboardStats>(`${API_BASE}/dashboard/stats`, fetcher, {
    refreshInterval: 5000,
  });
}

// Health
export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  return res.ok;
}
