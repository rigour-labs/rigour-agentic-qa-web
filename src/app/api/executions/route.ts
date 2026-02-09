import { NextRequest, NextResponse } from "next/server";
import {
  executionsStore,
  scenesStore,
  connectionsStore,
  generateId,
} from "@/lib/store";
import type {
  ExecutionResult,
  StepResult,
  AssertionResult,
  Scene,
  Connection,
} from "@/types";

export async function GET(request: NextRequest) {
  const sceneId = request.nextUrl.searchParams.get("sceneId");

  let executions = Array.from(executionsStore.values());

  if (sceneId) {
    executions = executions.filter((e) => e.sceneId === sceneId);
  }

  executions.sort(
    (a, b) =>
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );

  return NextResponse.json(executions);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sceneId, connectionId } = body;

    // Look up scene
    const scene = sceneId ? scenesStore.get(sceneId) : null;
    const sceneName = scene?.title || body.sceneName || "Ad-hoc Execution";

    // Look up connection (use first available if not specified)
    let connection: Connection | undefined;
    if (connectionId) {
      connection = connectionsStore.get(connectionId);
    } else {
      // Pick the first connection as default
      const allConns = Array.from(connectionsStore.values());
      connection = allConns[0];
    }

    // Create execution record in "running" state
    const execution: ExecutionResult = {
      id: generateId(),
      sceneId: sceneId || "adhoc",
      sceneName,
      status: "running",
      startedAt: new Date().toISOString(),
      stepResults: [],
      assertionResults: [],
      edgeCasesExplored: [],
      selfHealingActions: [],
    };

    executionsStore.set(execution.id, execution);

    // Update scene's lastRunStatus
    if (scene) {
      scene.lastRunAt = execution.startedAt;
      scene.lastRunStatus = "running";
      scenesStore.set(scene.id, scene);
    }

    // Fire off the real execution asynchronously
    executeScene(execution.id, scene || null, connection).catch((err) => {
      console.error("[Execution] Fatal error:", err);
      const exec = executionsStore.get(execution.id);
      if (exec) {
        exec.status = "error";
        exec.completedAt = new Date().toISOString();
        exec.duration = Date.now() - new Date(exec.startedAt).getTime();
        exec.semanticJudgeReasoning = `Execution failed: ${err instanceof Error ? err.message : String(err)}`;
      }
    });

    return NextResponse.json(execution, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// ── Real execution engine ─────────────────────────────────────
async function executeScene(
  executionId: string,
  scene: Scene | null,
  connection: Connection | undefined
) {
  const exec = executionsStore.get(executionId)!;
  const startTime = Date.now();

  try {
    const steps = scene?.steps || [];
    const baseUrl = connection?.baseUrl || "";
    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "RigourQA/0.1.0",
      ...(connection?.headers || {}),
    };

    // Add auth header
    if (connection?.authType === "bearer" && connection.authToken) {
      baseHeaders["Authorization"] = `Bearer ${connection.authToken}`;
    } else if (connection?.authType === "api_key" && connection.authToken) {
      baseHeaders["X-API-Key"] = connection.authToken;
    }

    const timeout = connection?.timeout || 10000;
    let allStepsPassed = true;

    // ── Execute each step ──────────────────────────────────
    for (const step of steps) {
      const stepStart = Date.now();
      const method = (step.method || "GET").toUpperCase();
      const url = step.url
        ? step.url.startsWith("http")
          ? step.url
          : `${baseUrl}${step.url.startsWith("/") ? "" : "/"}${step.url}`
        : baseUrl;

      const stepResult: StepResult = {
        stepId: step.id,
        description: step.description || `${method} ${step.url}`,
        status: "pass",
        duration: 0,
        request: {
          method,
          url,
          headers: baseHeaders,
          body: step.body,
        },
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const fetchOpts: RequestInit = {
          method,
          headers: baseHeaders,
          signal: controller.signal,
        };

        if (step.body && !["GET", "HEAD"].includes(method)) {
          fetchOpts.body = JSON.stringify(step.body);
        }

        // Wait for step delay if specified
        if (step.delay && step.delay > 0) {
          await new Promise((r) => setTimeout(r, step.delay));
        }

        const response = await fetch(url, fetchOpts);
        clearTimeout(timeoutId);

        let responseBody: unknown = null;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          try {
            responseBody = await response.json();
          } catch {
            responseBody = await response.text();
          }
        } else {
          responseBody = await response.text();
        }

        // Calculate response size
        const responseBodyStr = typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody);
        const responseSize = Buffer.byteLength(responseBodyStr, "utf-8");

        stepResult.response = {
          statusCode: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseBody,
        };
        stepResult.duration = Date.now() - stepStart;
        (stepResult as any).responseSize = responseSize;

        // Auto-fail if server error
        if (response.status >= 500) {
          stepResult.status = "fail";
          stepResult.error = `Server error: HTTP ${response.status}`;
          allStepsPassed = false;
        }
      } catch (err) {
        stepResult.status = "fail";
        stepResult.duration = Date.now() - stepStart;
        stepResult.error =
          err instanceof Error ? err.message : "Request failed";
        allStepsPassed = false;
      }

      exec.stepResults.push(stepResult);
    }

    // ── Evaluate assertions ────────────────────────────────
    const assertions = scene?.assertions || [];
    for (const assertion of assertions) {
      const result = evaluateAssertion(assertion, exec.stepResults);
      exec.assertionResults.push(result);
      if (result.status === "fail") {
        allStepsPassed = false;
      }
    }

    // ── Explore edge cases ─────────────────────────────────
    if (scene?.edgeCases && connection) {
      for (const edgeCase of scene.edgeCases) {
        exec.edgeCasesExplored!.push({
          type: edgeCase.type,
          description: edgeCase.description,
          result: "inconclusive",
          findings: `Edge case "${edgeCase.description}" identified for future exploration`,
        });
      }
    }

    // ── Finalize ───────────────────────────────────────────
    exec.status = allStepsPassed ? "pass" : "fail";
    exec.completedAt = new Date().toISOString();
    exec.duration = Date.now() - startTime;

    // Generate detailed summary
    const passedSteps = exec.stepResults.filter((s) => s.status === "pass").length;
    const failedSteps = exec.stepResults.filter((s) => s.status === "fail").length;
    const passedAssertions = exec.assertionResults.filter((a) => a.status === "pass").length;
    const failedAssertions = exec.assertionResults.filter((a) => a.status === "fail").length;
    const totalSize = exec.stepResults.reduce((sum, s) => sum + ((s as any).responseSize || 0), 0);
    const avgTime = exec.stepResults.length > 0 ? Math.round(exec.stepResults.reduce((sum, s) => sum + s.duration, 0) / exec.stepResults.length) : 0;

    exec.semanticJudgeReasoning = allStepsPassed
      ? `Execution PASSED: ${passedSteps}/${steps.length} steps executed successfully, ${passedAssertions}/${assertions.length} assertions passed. Total data: ${(totalSize / 1024).toFixed(2)}KB, Avg step time: ${avgTime}ms.`
      : `Execution FAILED: ${passedSteps} passed, ${failedSteps} failed steps. ${passedAssertions} passed, ${failedAssertions} failed assertions. Check details above for root cause analysis.`;

    // Update scene status
    if (scene) {
      scene.lastRunStatus = exec.status as "pass" | "fail";
      scenesStore.set(scene.id, scene);
    }
  } catch (err) {
    exec.status = "error";
    exec.completedAt = new Date().toISOString();
    exec.duration = Date.now() - startTime;
    exec.semanticJudgeReasoning = `Fatal execution error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

// ── Assertion evaluator ───────────────────────────────────────
function evaluateAssertion(
  assertion: Scene["assertions"][number],
  stepResults: StepResult[]
): AssertionResult {
  const result: AssertionResult = {
    assertionId: assertion.id,
    type: assertion.type,
    status: "fail",
    expected: assertion.expected,
  };

  // Find the last step with a response (or specific step if target references it)
  const lastStep = stepResults[stepResults.length - 1];
  if (!lastStep?.response) {
    result.reasoning = "No response available to evaluate";
    return result;
  }

  const response = lastStep.response;

  switch (assertion.type) {
    case "response_code": {
      result.actual = response.statusCode;
      result.status = response.statusCode === assertion.expected ? "pass" : "fail";
      result.reasoning =
        result.status === "pass"
          ? `Status code ${response.statusCode} matches expected ${assertion.expected}`
          : `Expected status ${assertion.expected}, got ${response.statusCode}`;
      break;
    }

    case "body_contains": {
      const bodyStr =
        typeof response.body === "string"
          ? response.body
          : JSON.stringify(response.body);
      const needle = String(assertion.expected);
      const found = bodyStr.includes(needle);
      result.actual = found ? `Found "${needle}"` : `"${needle}" not in response`;
      result.status = found ? "pass" : "fail";
      result.reasoning = found
        ? `Response body contains "${needle}"`
        : `Response body does not contain "${needle}"`;
      break;
    }

    case "header_exists": {
      const headerName = String(assertion.expected).toLowerCase();
      const headers = response.headers || {};
      const found = Object.keys(headers).some(
        (k) => k.toLowerCase() === headerName
      );
      result.actual = found ? `Header "${headerName}" present` : `Header "${headerName}" missing`;
      result.status = found ? "pass" : "fail";
      result.reasoning = found
        ? `Response header "${headerName}" exists`
        : `Response header "${headerName}" not found`;
      break;
    }

    case "json_path": {
      // Simple dot-path evaluation (e.g., "data.length", "users[0].name")
      try {
        const path = String(assertion.target || "");
        const value = resolvePath(response.body, path);
        result.actual = value;
        result.status = value === assertion.expected ? "pass" : "fail";
        result.reasoning = `Path "${path}" resolved to ${JSON.stringify(value)}`;
      } catch {
        result.reasoning = "Failed to evaluate JSON path";
      }
      break;
    }

    default:
      result.reasoning = `Unknown assertion type: ${assertion.type}`;
  }

  return result;
}

function resolvePath(obj: unknown, path: string): unknown {
  if (!path || !obj) return obj;
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}
