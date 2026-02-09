"use client";

import { ExecutionResult } from "@/types";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface TimelinePhase {
  name: string;
  status: "pending" | "running" | "pass" | "fail";
}

export default function ExecutionTimeline({
  result,
}: {
  result: ExecutionResult;
}) {
  const phases: TimelinePhase[] = [
    {
      name: "Plan",
      status:
        result.stepResults && result.stepResults.length > 0
          ? "pass"
          : result.status === "running"
            ? "running"
            : "pending",
    },
    {
      name: "Execute",
      status:
        result.stepResults && result.stepResults.length > 0
          ? result.stepResults.every((s) => s.status === "pass")
            ? "pass"
            : "fail"
          : result.status === "running"
            ? "running"
            : "pending",
    },
    {
      name: "Explore",
      status:
        result.edgeCasesExplored && result.edgeCasesExplored.length > 0
          ? "pass"
          : "pending",
    },
    {
      name: "Judge",
      status:
        result.assertionResults && result.assertionResults.length > 0
          ? result.assertionResults.every((a) => a.status === "pass")
            ? "pass"
            : "fail"
          : "pending",
    },
    {
      name: "Heal",
      status:
        result.selfHealingActions && result.selfHealingActions.length > 0
          ? "pass"
          : "pending",
    },
  ];

  const getIcon = (status: TimelinePhase["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-6 h-6 text-rigour-green" />;
      case "fail":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "running":
        return <Loader2 className="w-6 h-6 text-rigour-blue animate-spin" />;
      default:
        return <div className="w-6 h-6 border-2 border-slate-600 rounded-full" />;
    }
  };

  return (
    <div className="card border-slate-700">
      <h3 className="font-semibold text-white mb-6">Execution Timeline</h3>

      <div className="flex items-center gap-2">
        {phases.map((phase, idx) => (
          <motion.div
            key={phase.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center flex-1"
          >
            <div className="flex flex-col items-center flex-1">
              <div className="mb-2">{getIcon(phase.status)}</div>
              <div className="text-xs font-medium text-slate-400 text-center">
                {phase.name}
              </div>
            </div>

            {idx < phases.length - 1 && (
              <div className="flex-1">
                <ArrowRight className="w-4 h-4 text-slate-600 mx-1" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Step Details */}
      {result.stepResults && result.stepResults.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-semibold text-slate-300">
            Steps ({result.stepResults.length})
          </h4>
          {result.stepResults.map((step, idx) => (
            <motion.div
              key={step.stepId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg"
            >
              {step.status === "pass" ? (
                <CheckCircle className="w-5 h-5 text-rigour-green flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-sm">
                <div className="text-slate-200">{step.description}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {step.request?.method} {step.request?.url}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {step.duration}ms - Status: {step.response?.statusCode}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
