"use client";

import { useState } from "react";
import { useConnections, createConnection, updateConnection, deleteConnection, testConnection } from "@/lib/api";
import { Connection } from "@/types";
import { Plus, X, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Connections() {
  const { data: connections, isLoading, mutate } = useConnections();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Connection>>({
    name: "",
    baseUrl: "",
    authType: "none",
    environment: "dev",
  });

  const handleInputChange = (field: keyof Connection, value: string | number) => {
    if (field === "timeout") {
      setFormData((prev) => ({ ...prev, [field]: typeof value === "string" ? parseInt(value, 10) : value }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.baseUrl) {
      toast.error("Name and Base URL are required");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateConnection(editingId, formData);
        toast.success("Connection updated");
      } else {
        await createConnection(
          formData as Omit<Connection, "id" | "createdAt" | "updatedAt">
        );
        toast.success("Connection created");
      }
      setFormData({
        name: "",
        baseUrl: "",
        authType: "none",
        environment: "dev",
      });
      setShowForm(false);
      setEditingId(null);
      mutate();
    } catch (error) {
      toast.error("Failed to save connection");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this connection?")) return;
    try {
      await deleteConnection(id);
      toast.success("Connection deleted");
      mutate();
    } catch (error) {
      toast.error("Failed to delete connection");
    }
  };

  const handleTest = async (connection: Connection) => {
    setTestingId(connection.id);
    try {
      const result = await testConnection(connection);
      if (result.success) {
        toast.success("Connection successful");
      } else {
        toast.error(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      toast.error("Failed to test connection");
    } finally {
      setTestingId(null);
    }
  };

  const handleEdit = (connection: Connection) => {
    setFormData(connection);
    setEditingId(connection.id);
    setShowForm(true);
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
          <h1 className="text-3xl font-bold text-white">Connections</h1>
          <p className="text-slate-400 mt-2">
            Configure connections to your target systems
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: "",
              baseUrl: "",
              authType: "none",
              environment: "dev",
            });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Connection
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">
                {editingId ? "Edit" : "New"} Connection
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Production API"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Base URL
                  </label>
                  <input
                    type="url"
                    className="input"
                    value={formData.baseUrl || ""}
                    onChange={(e) => handleInputChange("baseUrl", e.target.value)}
                    placeholder="https://api.example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Environment
                  </label>
                  <select
                    className="input"
                    value={formData.environment || "dev"}
                    onChange={(e) =>
                      handleInputChange("environment", e.target.value)
                    }
                  >
                    <option value="dev">Development</option>
                    <option value="staging">Staging</option>
                    <option value="prod">Production</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Auth Type
                  </label>
                  <select
                    className="input"
                    value={formData.authType || "none"}
                    onChange={(e) =>
                      handleInputChange("authType", e.target.value)
                    }
                  >
                    <option value="none">None</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="basic">Basic Auth</option>
                    <option value="api_key">API Key</option>
                    <option value="oauth">OAuth</option>
                  </select>
                </div>

                {formData.authType !== "none" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Token / Key
                    </label>
                    <input
                      type="password"
                      className="input"
                      value={formData.authToken || ""}
                      onChange={(e) =>
                        handleInputChange("authToken", e.target.value)
                      }
                      placeholder="•••••••••"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Timeout (ms)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={formData.timeout || 30000}
                    onChange={(e) =>
                      handleInputChange(
                        "timeout",
                        e.target.value ? parseInt(e.target.value, 10) : 30000
                      )
                    }
                    placeholder="30000"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex-1"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Connections List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={showForm ? "lg:col-span-2" : "lg:col-span-3"}
        >
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-slate-800/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : connections && connections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((connection) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card border-slate-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white">
                        {connection.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {connection.baseUrl}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(connection)}
                        className="btn-ghost p-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(connection.id)}
                        className="btn-danger p-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Environment</span>
                      <span className="capitalize font-medium text-slate-300">
                        {connection.environment}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Auth</span>
                      <span className="capitalize font-medium text-slate-300">
                        {connection.authType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Timeout</span>
                      <span className="font-medium text-slate-300">
                        {connection.timeout || 30000}ms
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTest(connection)}
                    disabled={testingId === connection.id}
                    className="btn-secondary w-full mt-4 flex items-center justify-center gap-2"
                  >
                    {testingId === connection.id ? (
                      <>
                        <span className="animate-spin">⟳</span>
                        Testing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Test Connection
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card border-slate-700 text-center py-8">
              <p className="text-slate-400">No connections yet</p>
              <p className="text-sm text-slate-500 mt-2">
                Create a connection to get started
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
