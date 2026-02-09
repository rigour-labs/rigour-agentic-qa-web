"use client";

import { motion } from "framer-motion";
import { AlertCircle, Bell, Lock, Palette } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-2">
            Configure your Rigour QA workspace
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-slate-700"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rigour-blue/10 rounded-lg">
              <Bell className="w-6 h-6 text-rigour-blue" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <p className="text-sm text-slate-400 mt-1">
                Receive notifications for execution results and issues
              </p>
              <div className="space-y-3 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-300">
                    Notify on test failures
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-300">
                    Notify on edge cases found
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-300">
                    Digest notifications daily
                  </span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card border-slate-700"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rigour-green/10 rounded-lg">
              <Lock className="w-6 h-6 text-rigour-green" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Security</h3>
              <p className="text-sm text-slate-400 mt-1">
                Manage your API keys and authentication
              </p>
              <div className="space-y-3 mt-4">
                <button className="btn-secondary w-full text-left">
                  Generate API Key
                </button>
                <button className="btn-secondary w-full text-left">
                  Change Password
                </button>
                <button className="btn-secondary w-full text-left">
                  Two-Factor Authentication
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card border-slate-700"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Palette className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Appearance</h3>
              <p className="text-sm text-slate-400 mt-1">
                Customize how Rigour looks for you
              </p>
              <div className="space-y-3 mt-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">
                    Theme
                  </label>
                  <select className="input">
                    <option>Dark (Default)</option>
                    <option>Light</option>
                    <option>Auto</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card border-slate-700"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-slate-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">About</h3>
              <div className="space-y-2 mt-3 text-sm text-slate-400">
                <p>Rigour QA Web v0.1.0</p>
                <p>Built by Rigour Labs</p>
                <a
                  href="#"
                  className="text-rigour-blue hover:underline block"
                >
                  Visit Documentation
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
