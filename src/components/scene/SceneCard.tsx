"use client";

import { Scene } from "@/types";
import { Zap, Target, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SceneCard({ scene }: { scene: Scene }) {
  const statusColor =
    scene.lastRunStatus === "pass"
      ? "bg-rigour-green/10 text-rigour-green"
      : scene.lastRunStatus === "fail"
        ? "bg-red-500/10 text-red-500"
        : "bg-slate-700/50 text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="card border-slate-700 cursor-pointer group hover:border-rigour-blue/50 transition-all"
    >
      <Link href={`/scene-builder?id=${scene.id}`}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg group-hover:text-rigour-blue transition-colors">
                {scene.title}
              </h3>
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                {scene.description}
              </p>
            </div>
            {scene.lastRunStatus && (
              <div className={`badge ${statusColor}`}>
                {scene.lastRunStatus}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>{scene.steps.length} steps</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{scene.edgeCases?.length || 0} edge cases</span>
            </div>
            {scene.lastRunAt && (
              <div className="flex items-center gap-1 ml-auto">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">
                  {new Date(scene.lastRunAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
