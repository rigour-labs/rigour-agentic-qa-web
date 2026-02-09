"use client";

import { useState, Suspense } from "react";
import { useScenes, createScene, updateScene, runScene } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import SceneEditor from "@/components/scene/SceneEditor";
import SceneCard from "@/components/scene/SceneCard";
import { Scene } from "@/types";
import { Plus, Play, Sparkles, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";

function SceneBuilderContent() {
  const searchParams = useSearchParams();
  const sceneId = searchParams.get("id");
  const { data: scenes, isLoading, mutate } = useScenes();

  const [mode, setMode] = useState<"natural" | "structured">("natural");
  const [naturalInput, setNaturalInput] = useState("");
  const [selectedScene, setSelectedScene] = useState<Scene | undefined>(
    scenes?.find((s) => s.id === sceneId)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleNaturalLanguageSubmit = async () => {
    if (!naturalInput.trim()) {
      toast.error("Please describe your test scene");
      return;
    }

    setIsSaving(true);
    try {
      const newScene = await createScene({
        title: naturalInput.split("\n")[0],
        description: naturalInput,
        actor: "QA Engineer",
        steps: [],
        assertions: [],
        edgeCases: [],
      });

      toast.success("Scene created from natural language");
      setNaturalInput("");
      setSelectedScene(newScene);
      mutate();
    } catch (error) {
      toast.error("Failed to create scene");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveScene = async (sceneData: Partial<Scene>) => {
    setIsSaving(true);
    try {
      if (selectedScene?.id) {
        await updateScene(selectedScene.id, sceneData);
        toast.success("Scene updated");
      } else {
        const newScene = await createScene(
          sceneData as Omit<Scene, "id" | "createdAt" | "updatedAt">
        );
        setSelectedScene(newScene);
        toast.success("Scene created");
      }
      mutate();
    } catch (error) {
      toast.error("Failed to save scene");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunScene = async () => {
    if (!selectedScene) {
      toast.error("Please select or create a scene first");
      return;
    }

    setIsRunning(true);
    try {
      const execution = await runScene(selectedScene.id);
      toast.success("Scene execution started");
      // Redirect to execution details
      window.location.href = `/executions?id=${execution.id}`;
    } catch (error) {
      toast.error("Failed to run scene");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Scene Builder</h1>
          <p className="text-slate-400 mt-2">
            Create and edit test scenes to explore your application
          </p>
        </div>
        {selectedScene && (
          <div className="flex gap-3">
            <button
              onClick={handleRunScene}
              disabled={isRunning}
              className="btn-success flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              {isRunning ? "Running..." : "Run Scene"}
            </button>
            <button
              onClick={() => setMode(mode === "natural" ? "structured" : "natural")}
              className="btn-secondary"
            >
              {mode === "natural" ? "Structured" : "Natural"} Mode
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          {selectedScene ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setSelectedScene(undefined)}
                  className="btn-ghost"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-xl font-semibold text-white">
                  {selectedScene.title}
                </h2>
              </div>
              <SceneEditor
                scene={selectedScene}
                onSave={handleSaveScene}
                isLoading={isSaving}
              />
            </>
          ) : (
            <div className="space-y-6">
              {/* Natural Language Mode */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card border-slate-700"
              >
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rigour-blue" />
                  Natural Language
                </h3>
                <textarea
                  className="input min-h-32"
                  placeholder="Describe your test scene in natural language...&#10;Example: Test that login fails after 5 wrong attempts and shows an error message"
                  value={naturalInput}
                  onChange={(e) => setNaturalInput(e.target.value)}
                />
                <button
                  onClick={handleNaturalLanguageSubmit}
                  disabled={isSaving}
                  className="btn-primary w-full mt-4"
                >
                  {isSaving ? "Creating..." : "Create from Description"}
                </button>
              </motion.div>

              {/* Recent Scenes */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-semibold text-white mb-4">Or Open Existing</h3>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-24 bg-slate-800/50 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : scenes && scenes.length > 0 ? (
                  <div className="space-y-3">
                    {scenes.map((scene) => (
                      <div
                        key={scene.id}
                        onClick={() => setSelectedScene(scene)}
                        className="card border-slate-700 cursor-pointer hover:border-rigour-blue/50 transition-all"
                      >
                        <h4 className="font-semibold text-white hover:text-rigour-blue transition-colors">
                          {scene.title}
                        </h4>
                        <p className="text-sm text-slate-400 mt-1">
                          {scene.steps.length} steps
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card border-slate-700 text-center py-8 text-slate-400">
                    No scenes yet. Create one using natural language above.
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Scene List Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="card border-slate-700 sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">All Scenes</h3>
              <Link href="/scene-builder" className="btn-primary p-2">
                <Plus className="w-4 h-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-slate-800/50 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : scenes && scenes.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {scenes.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedScene?.id === scene.id
                        ? "bg-rigour-blue/20 text-rigour-blue border border-rigour-blue"
                        : "hover:bg-slate-800/50 text-slate-300"
                    }`}
                  >
                    <div className="text-sm font-medium line-clamp-1">
                      {scene.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {scene.steps.length} steps
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">
                No scenes
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SceneBuilder() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <SceneBuilderContent />
    </Suspense>
  );
}
