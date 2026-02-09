"use client";

import { useState, useEffect } from "react";
import { Scene, Step, Assertion } from "@/types";
import { motion } from "framer-motion";
import { Plus, X, Trash2 } from "lucide-react";

interface SceneEditorProps {
  scene?: Scene;
  onSave: (scene: Partial<Scene>) => void;
  isLoading?: boolean;
}

export default function SceneEditor({
  scene,
  onSave,
  isLoading = false,
}: SceneEditorProps) {
  const [formData, setFormData] = useState<Partial<Scene>>(
    scene || {
      title: "",
      description: "",
      actor: "",
      steps: [],
      assertions: [],
      edgeCases: [],
    }
  );

  const [yaml, setYaml] = useState(
    scene ? JSON.stringify(scene, null, 2) : "# Define your scene in YAML format"
  );

  const [newStep, setNewStep] = useState<Partial<Step>>({
    description: "",
    method: "GET",
    url: "",
  });

  const [newAssertion, setNewAssertion] = useState<Partial<Assertion>>({
    type: "response_code",
    expected: 200,
  });

  const handleInputChange = (
    field: keyof Scene,
    value: unknown
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleYamlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setYaml(e.target.value);
  };

  const handleAddStep = () => {
    if (!newStep.description?.trim()) {
      alert("Step description is required");
      return;
    }
    const step: Step = {
      id: `step_${Date.now()}`,
      description: newStep.description,
      method: newStep.method || "GET",
      url: newStep.url || "",
      body: newStep.body,
      headers: newStep.headers,
      delay: newStep.delay,
    };
    setFormData((prev) => ({
      ...prev,
      steps: [...(prev.steps || []), step],
    }));
    setNewStep({
      description: "",
      method: "GET",
      url: "",
    });
  };

  const handleDeleteStep = (stepId: string) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps?.filter((s) => s.id !== stepId) || [],
    }));
  };

  const handleAddAssertion = () => {
    const assertion: Assertion = {
      id: `assert_${Date.now()}`,
      type: (newAssertion.type as any) || "response_code",
      expected: newAssertion.expected,
      target: newAssertion.target,
      operator: newAssertion.operator,
    };
    setFormData((prev) => ({
      ...prev,
      assertions: [...(prev.assertions || []), assertion],
    }));
    setNewAssertion({
      type: "response_code",
      expected: 200,
    });
  };

  const handleDeleteAssertion = (assertionId: string) => {
    setFormData((prev) => ({
      ...prev,
      assertions: prev.assertions?.filter((a) => a.id !== assertionId) || [],
    }));
  };

  const handleSave = () => {
    if (!formData.title?.trim()) {
      alert("Scene title is required");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-slate-700"
      >
        <h3 className="font-semibold text-white mb-4">Scene Details</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Scene Title
            </label>
            <input
              type="text"
              className="input"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Login Flow Test"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              className="input min-h-24"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what this scene tests..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Actor
            </label>
            <input
              type="text"
              className="input"
              value={formData.actor || ""}
              onChange={(e) => handleInputChange("actor", e.target.value)}
              placeholder="e.g., QA Engineer, API Client"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? "Saving..." : "Save Scene"}
            </button>
            <button
              onClick={() => {
                try {
                  const parsed = JSON.parse(yaml);
                  setFormData(parsed);
                } catch {
                  alert("Invalid YAML/JSON format");
                }
              }}
              className="btn-secondary"
            >
              Load from YAML
            </button>
          </div>
        </div>
      </motion.div>

      {/* Steps Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card border-slate-700"
      >
        <h3 className="font-semibold text-white mb-4">Test Steps</h3>

        <div className="space-y-3 mb-6">
          {formData.steps && formData.steps.length > 0 ? (
            formData.steps.map((step) => (
              <div
                key={step.id}
                className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex items-start justify-between"
              >
                <div className="flex-1 text-sm">
                  <div className="font-medium text-slate-200">{step.description}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {step.method} {step.url}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteStep(step.id)}
                  className="btn-danger p-1 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-400 text-center py-4">No steps added yet</div>
          )}
        </div>

        <div className="border-t border-slate-700 pt-4 space-y-3">
          <h4 className="text-sm font-medium text-slate-300">Add Step</h4>
          <input
            type="text"
            className="input text-sm"
            placeholder="Step description (e.g., GET /users)"
            value={newStep.description || ""}
            onChange={(e) => setNewStep((p) => ({ ...p, description: e.target.value }))}
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              className="input text-sm"
              value={newStep.method || "GET"}
              onChange={(e) => setNewStep((p) => ({ ...p, method: e.target.value }))}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              className="input text-sm col-span-2"
              placeholder="URL path (e.g., /users)"
              value={newStep.url || ""}
              onChange={(e) => setNewStep((p) => ({ ...p, url: e.target.value }))}
            />
          </div>
          <button
            onClick={handleAddStep}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>
      </motion.div>

      {/* Assertions Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card border-slate-700"
      >
        <h3 className="font-semibold text-white mb-4">Assertions</h3>

        <div className="space-y-3 mb-6">
          {formData.assertions && formData.assertions.length > 0 ? (
            formData.assertions.map((assertion) => (
              <div
                key={assertion.id}
                className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex items-start justify-between"
              >
                <div className="flex-1 text-sm">
                  <div className="font-medium text-slate-200">{assertion.type}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Expected: {JSON.stringify(assertion.expected)}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAssertion(assertion.id)}
                  className="btn-danger p-1 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-400 text-center py-4">No assertions added yet</div>
          )}
        </div>

        <div className="border-t border-slate-700 pt-4 space-y-3">
          <h4 className="text-sm font-medium text-slate-300">Add Assertion</h4>
          <select
            className="input text-sm"
            value={newAssertion.type || "response_code"}
            onChange={(e) =>
              setNewAssertion((p) => ({
                ...p,
                type: e.target.value as any,
              }))
            }
          >
            <option value="response_code">Response Code</option>
            <option value="body_contains">Body Contains</option>
            <option value="header_exists">Header Exists</option>
            <option value="json_path">JSON Path</option>
          </select>
          <input
            type="text"
            className="input text-sm"
            placeholder="Expected value"
            value={String(newAssertion.expected || "")}
            onChange={(e) =>
              setNewAssertion((p) => ({
                ...p,
                expected: isNaN(Number(e.target.value))
                  ? e.target.value
                  : Number(e.target.value),
              }))
            }
          />
          <button
            onClick={handleAddAssertion}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Assertion
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card border-slate-700"
      >
        <h3 className="font-semibold text-white mb-4">YAML Editor</h3>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <textarea
            className="w-full h-96 bg-slate-900 text-slate-300 font-mono text-sm focus:outline-none resize-none"
            value={yaml}
            onChange={handleYamlChange}
            spellCheck="false"
          />
        </div>
        <div className="mt-3 text-xs text-slate-500">
          You can edit the YAML above and click "Load from YAML" to update the
          form
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card border-slate-700 bg-slate-900/50"
      >
        <h3 className="font-semibold text-white mb-4">Preview</h3>
        <pre className="bg-slate-950 p-4 rounded text-slate-300 text-xs overflow-auto max-h-64">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </motion.div>
    </div>
  );
}
