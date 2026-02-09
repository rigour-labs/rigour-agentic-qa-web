"use client";

import { useScenes, useExecutions } from "@/lib/api";
import StatsGrid from "@/components/dashboard/StatsGrid";
import SceneCard from "@/components/scene/SceneCard";
import ResultCard from "@/components/execution/ResultCard";
import { Plus, Play, BarChart3 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: scenes, isLoading: scenesLoading } = useScenes();
  const { data: executions, isLoading: executionsLoading } = useExecutions();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Overview of your test scenes and recent executions
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/scene-builder" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Scene
          </Link>
          <button className="btn-secondary flex items-center gap-2">
            <Play className="w-5 h-5" />
            Run All
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <StatsGrid />
      </motion.div>

      {/* Recent Executions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Recent Executions</h2>
          <Link href="/executions" className="text-rigour-blue hover:underline text-sm">
            View All
          </Link>
        </div>

        {executionsLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-slate-800/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : executions && executions.length > 0 ? (
          <div className="space-y-3">
            {executions.slice(0, 5).map((execution) => (
              <ResultCard key={execution.id} result={execution} />
            ))}
          </div>
        ) : (
          <div className="card border-slate-700 text-center py-8">
            <p className="text-slate-400">No executions yet</p>
          </div>
        )}
      </motion.div>

      {/* Recent Scenes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Recent Scenes</h2>
          <Link href="/scene-builder" className="text-rigour-blue hover:underline text-sm">
            View All
          </Link>
        </div>

        {scenesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-slate-800/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : scenes && scenes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenes.slice(0, 4).map((scene) => (
              <SceneCard key={scene.id} scene={scene} />
            ))}
          </div>
        ) : (
          <div className="card border-slate-700 text-center py-8">
            <p className="text-slate-400 mb-4">No scenes created yet</p>
            <Link href="/scene-builder" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Scene
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
