export interface Scene {
  id: string;
  title: string;
  description: string;
  actor: string;
  steps: Step[];
  assertions: Assertion[];
  edgeCases?: EdgeCaseHint[];
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  lastRunStatus?: "pass" | "fail" | "running";
}

export interface Step {
  id: string;
  description: string;
  method?: string;
  url?: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  delay?: number;
}

export interface Assertion {
  id: string;
  type: "response_code" | "body_contains" | "header_exists" | "json_path";
  target?: string;
  expected?: unknown;
  operator?: string;
}

export interface EdgeCaseHint {
  type: string;
  description: string;
  probability: "low" | "medium" | "high";
}

export interface ExecutionResult {
  id: string;
  sceneId: string;
  sceneName: string;
  status: "running" | "pass" | "fail" | "error";
  startedAt: string;
  completedAt?: string;
  duration?: number;
  stepResults: StepResult[];
  assertionResults: AssertionResult[];
  edgeCasesExplored?: EdgeCaseExploration[];
  selfHealingActions?: SelfHealingAction[];
  semanticJudgeReasoning?: string;
}

export interface StepResult {
  stepId: string;
  description: string;
  status: "pass" | "fail";
  duration: number;
  request?: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: unknown;
  };
  response?: {
    statusCode: number;
    headers?: Record<string, string>;
    body?: unknown;
  };
  error?: string;
}

export interface AssertionResult {
  assertionId: string;
  type: string;
  status: "pass" | "fail";
  expected?: unknown;
  actual?: unknown;
  reasoning?: string;
}

export interface EdgeCaseExploration {
  type: string;
  description: string;
  result: "pass" | "fail" | "inconclusive";
  findings?: string;
}

export interface SelfHealingAction {
  type: string;
  description: string;
  applied: boolean;
  details?: string;
}

export interface Connection {
  id: string;
  name: string;
  baseUrl: string;
  authType: "none" | "bearer" | "basic" | "api_key" | "oauth";
  authToken?: string;
  headers?: Record<string, string>;
  timeout?: number;
  environment: "dev" | "staging" | "prod";
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalScenes: number;
  totalExecutions: number;
  passRate: number;
  edgeCasesFound: number;
  selfHealedCount: number;
  averageExecutionTime: number;
}
