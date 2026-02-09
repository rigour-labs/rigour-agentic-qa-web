"use client";

import { ExecutionResult } from "@/types";
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResultCard({ result }: { result: ExecutionResult }) {
  const [expanded, setExpanded] = useState(false);

  const statusIcon =
    result.status === "pass" ? (
      <CheckCircle className="w-6 h-6 text-rigour-green" />
    ) : result.status === "fail" ? (
      <XCircle className="w-6 h-6 text-red-500" />
    ) : (
      <Clock className="w-6 h-6 text-amber-500 animate-spin" />
    );

  const statusBg =
    result.status === "pass"
      ? "bg-rigour-green/10"
      : result.status === "fail"
        ? "bg-red-500/10"
        : "bg-amber-500/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card border-slate-700"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`${statusBg} p-3 rounded-lg`}>{statusIcon}</div>
          <div className="text-left flex-1">
            <h3 className="font-semibold text-white">{result.sceneName}</h3>
            <p className="text-sm text-slate-400">ID: {result.id.slice(0, 8)}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-slate-300">
              {result.duration ? `${result.duration}ms` : "Running..."}
            </div>
            <div className="text-xs text-slate-500">
              {new Date(result.startedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-800 mt-4 pt-4 space-y-4"
          >
            {/* Assertions */}
            {result.assertionResults && result.assertionResults.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">
                  Assertions ({result.assertionResults.length})
                </h4>
                <div className="space-y-1">
                  {result.assertionResults.map((assertion, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {assertion.status === "pass" ? (
                        <CheckCircle className="w-4 h-4 text-rigour-green" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-slate-400">
                        {assertion.type}
                        {assertion.reasoning && ` - ${assertion.reasoning}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Edge Cases */}
            {result.edgeCasesExplored && result.edgeCasesExplored.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">
                  Edge Cases Explored
                </h4>
                <div className="space-y-2">
                  {result.edgeCasesExplored.map((ec, idx) => (
                    <div
                      key={idx}
                      className="text-sm p-2 bg-slate-800/50 rounded border border-slate-700"
                    >
                      <div className="font-medium text-amber-400">
                        {ec.type}
                      </div>
                      <div className="text-slate-400 text-xs mt-1">
                        {ec.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Judge Reasoning */}
            {result.semanticJudgeReasoning && (
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">
                  Judge Reasoning
                </h4>
                <p className="text-sm text-slate-400 italic">
                  {result.semanticJudgeReasoning}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
