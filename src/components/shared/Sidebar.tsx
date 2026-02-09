"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Cpu,
  Play,
  Plug,
  Settings,
  TestTube,
} from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scene-builder", label: "Scene Builder", icon: TestTube },
    { href: "/executions", label: "Executions", icon: Play },
    { href: "/connections", label: "Connections", icon: Plug },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-rigour-navy text-white border-r border-slate-800 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rigour-blue rounded-lg flex items-center justify-center">
            <TestTube className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Rigour</h1>
            <p className="text-xs text-slate-400">QA</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={clsx(
                "nav-link text-slate-100",
                isActive
                  ? "bg-rigour-blue/20 text-rigour-blue font-semibold"
                  : "hover:bg-slate-700/50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
        <p>v0.1.0</p>
        <p className="mt-2">Built by Rigour Labs</p>
      </div>
    </aside>
  );
}
