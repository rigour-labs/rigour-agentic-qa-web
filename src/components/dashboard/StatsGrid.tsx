"use client";

import { useDashboardStats } from "@/lib/api";
import { TestTube, Activity, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsGrid() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading || !stats) {
    return <div className="h-32 bg-slate-800/50 rounded-lg animate-pulse" />;
  }

  const cards = [
    {
      title: "Total Scenes",
      value: stats.totalScenes,
      icon: TestTube,
      color: "bg-rigour-blue",
    },
    {
      title: "Pass Rate",
      value: `${Math.round(stats.passRate * 100)}%`,
      icon: Activity,
      color: "bg-rigour-green",
    },
    {
      title: "Edge Cases Found",
      value: stats.edgeCasesFound,
      icon: Target,
      color: "bg-amber-500",
    },
    {
      title: "Self-Healed",
      value: stats.selfHealedCount,
      icon: Zap,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
