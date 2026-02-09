"use client";

import { useExecutions } from "@/lib/api";
import ResultCard from "@/components/execution/ResultCard";
import ExecutionTimeline from "@/components/execution/ExecutionTimeline";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Filter, X } from "lucide-react";
import { motion } from "framer-motion";

function ExecutionsContent() {
  const searchParams = useSearchParams();
  const executionId = searchParams.get("id");
  const { data: executions, isLoading } = useExecutions();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedExecution, setSelectedExecution] = useState<string | null>(
    executionId
  );

  const filteredExecutions = executions?.filter((e) => {
    if (statusFilter === "all") return true;
    return e.status === statusFilter;
  });

  const currentExecution = executions?.find((e) => e.id === selectedExecution);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Executions</h1>
          <p className="text-slate-400 mt-2">
            Monitor and analyze your test execution results
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Execution List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="card border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </h2>
            </div>

            <div className="space-y-2 mb-6">
              {["all", "pass", "fail", "running", "error"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all capitalize ${
                    statusFilter === status
                      ? "bg-rigour-blue/20 text-rigour-blue font-semibold"
                      : "hover:bg-slate-800/50 text-slate-300"
                  }`}
                >
                  {status === "all" ? "All Status" : status}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-slate-800/50 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredExecutions && filteredExecutions.length > 0 ? (
                filteredExecutions.map((execution) => (
                  <button
                    key={execution.id}
                    onClick={() => setSelectedExecution(execution.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedExecution === execution.id
                        ? "bg-rigour-blue/20 border border-rigour-blue"
                        : "hover:bg-slate-800/50 border border-slate-800"
                    }`}
                  >
                    <div className="text-sm font-medium text-slate-300">
                      {execution.sceneName}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(execution.startedAt).toLocaleTimeString()}
                    </div>
                    <div
                      className={`text-xs mt-2 inline-block px-2 py-1 rounded capitalize ${
                        execution.status === "pass"
                          ? "bg-rigour-green/20 text-rigour-green"
                          : execution.status === "fail"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-amber-500/20 text-amber-500"
                      }`}
                    >
                      {execution.status}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-slate-400 text-center py-8">
                  No executions found
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Execution Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          {currentExecution ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {currentExecution.sceneName}
                </h2>
                <button
                  onClick={() => setSelectedExecution(null)}
                  className="btn-ghost"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ExecutionTimeline result={currentExecution} />
              <ResultCard result={currentExecution} />

              {/* Self-Healing Actions */}
              {currentExecution.selfHealingActions &&
                currentExecution.selfHealingActions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card border-slate-700"
                  >
                    <h3 className="font-semibold text-white mb-4">
                      Self-Healing Actions
                    </h3>
                    <div className="space-y-3">
                      {currentExecution.selfHealingActions.map((action, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                        >
                          <div className="text-sm font-medium text-slate-300">
                            {action.type}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {action.description}
                          </div>
                          {action.applied && (
                            <div className="text-xs text-rigour-green mt-2">
                              Applied successfully
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
            </div>
          ) : (
            <div className="card border-slate-700 text-center py-16">
              <p className="text-slate-400">
                Select an execution to view details
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function Executions() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ExecutionsContent />
    </Suspense>
  );
}
