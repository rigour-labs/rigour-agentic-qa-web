# Quick Start Guide

## Installation & Setup

```bash
# Clone and install
cd /sessions/great-ecstatic-meitner/mnt/rigour-labs/rigour-qa-web
npm install

# Copy environment
cp .env.example .env.local

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

## Key Files & Entry Points

### Dashboard (`src/app/page.tsx`)
Main overview with stats and recent activity.

```typescript
// Key components used:
- StatsGrid: 4 metrics (total scenes, pass rate, edge cases, healed)
- SceneCard: Grid of recent scenes
- ResultCard: Recent executions
```

### Scene Builder (`src/app/scene-builder/page.tsx`)
Where users create and edit test scenarios.

```typescript
// Two modes:
1. Natural Language: User describes test scenario
   - Input: "Test that login fails after 5 wrong attempts"
   - Output: Parsed Scene object

2. Structured: Form + YAML editor
   - Edit: title, description, actor, steps, assertions
   - YAML editor for advanced users
```

### Execution Dashboard (`src/app/executions/page.tsx`)
Live monitoring of test execution results.

```typescript
// Key components:
- ExecutionTimeline: 5-phase flow (Plan→Execute→Explore→Judge→Heal)
- ResultCard: Pass/fail status, duration, assertions
- Edge cases and self-healing actions displayed inline
```

### Connection Manager (`src/app/connections/page.tsx`)
Configure target systems (dev, staging, prod).

```typescript
// Features:
- Auth types: None, Bearer, Basic, API Key, OAuth
- Environments: dev, staging, prod
- Test Connection button with real HTTP validation
- Inline edit/delete
```

## Component Usage Examples

### Using the API Client

```typescript
import { useScenes, createScene, runScene } from "@/lib/api";

// Fetch scenes with auto-refresh
const { data: scenes, isLoading, mutate } = useScenes();

// Create new scene
const newScene = await createScene({
  title: "Login Test",
  description: "Test login flow",
  actor: "QA Engineer",
  steps: [],
  assertions: [],
});

// Run scene and get execution result
const execution = await runScene(sceneId);
```

### Creating Custom Components

```typescript
"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";

export default function MyComponent() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="card border-slate-700">
        <h3 className="text-white font-semibold">My Component</h3>
        <button
          onClick={() => toast.success("Done!")}
          className="btn-primary mt-4"
        >
          Action
        </button>
      </div>
    </motion.div>
  );
}
```

### Working with Types

```typescript
import { Scene, ExecutionResult, Connection } from "@/types";

const scene: Scene = {
  id: "scene-1",
  title: "Login Test",
  description: "Test login flow",
  actor: "QA Engineer",
  steps: [
    {
      id: "step-1",
      description: "Send login request",
      method: "POST",
      url: "/api/login",
      body: { email: "user@example.com", password: "pass" }
    }
  ],
  assertions: [],
  edgeCases: [],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
};
```

## Styling with Tailwind v4

### Pre-defined Component Classes

```html
<!-- Buttons -->
<button class="btn-primary">Primary</button>
<button class="btn-secondary">Secondary</button>
<button class="btn-ghost">Ghost</button>
<button class="btn-danger">Danger</button>
<button class="btn-success">Success</button>

<!-- Cards -->
<div class="card">Card content</div>

<!-- Forms -->
<input class="input" placeholder="Input text" />

<!-- Badges -->
<span class="badge-success">Success</span>
<span class="badge-danger">Failed</span>
<span class="badge-warning">Warning</span>
<span class="badge-info">Info</span>

<!-- Navigation -->
<a href="/" class="nav-link active">Dashboard</a>
<a href="/scenes" class="nav-link">Scenes</a>
```

### Color Variables

```css
--color-rigour-navy: #1b2a4a;   /* Primary brand */
--color-rigour-blue: #3b82f6;   /* Accent/interactive */
--color-rigour-green: #16a34a;  /* Success */
```

## API Routes Reference

### Scenes
```
GET    /api/scenes              → List all scenes
POST   /api/scenes              → Create scene
GET    /api/scenes/:id          → Get scene by ID
PATCH  /api/scenes/:id          → Update scene
DELETE /api/scenes/:id          → Delete scene
```

### Executions
```
GET    /api/executions          → List executions (filter by ?sceneId=xxx)
POST   /api/executions          → Run scene (body: { sceneId, connectionId? })
GET    /api/executions/:id      → Get execution details
```

### Connections
```
GET    /api/connections         → List connections
POST   /api/connections         → Create connection
GET    /api/connections/:id     → Get connection
PATCH  /api/connections/:id     → Update connection
DELETE /api/connections/:id     → Delete connection
POST   /api/connections/test    → Test connection (body: Connection)
```

### Other
```
GET    /api/health              → Health check
GET    /api/dashboard/stats     → Dashboard statistics
```

## Common Tasks

### Add a New Page

1. Create `src/app/newpage/page.tsx`
2. Mark with `"use client"` for interactivity
3. Use existing components and styling
4. Add route to sidebar in `src/components/shared/Sidebar.tsx`

```typescript
// src/app/newpage/page.tsx
"use client";

import { motion } from "framer-motion";

export default function NewPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-white">Page Title</h1>
      {/* Content */}
    </div>
  );
}
```

### Add a New Component

1. Create file in `src/components/[category]/ComponentName.tsx`
2. Make it `"use client"` if it needs interactivity
3. Use TypeScript and Tailwind classes
4. Import and use in pages

```typescript
// src/components/mycomponent/MyCard.tsx
"use client";

import { motion } from "framer-motion";

interface MyCardProps {
  title: string;
  description: string;
}

export default function MyCard({ title, description }: MyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card border-slate-700"
    >
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-slate-400 mt-2">{description}</p>
    </motion.div>
  );
}
```

### Connect to Real Backend

Update `src/lib/api.ts` to point to your SDK backend:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// API calls now point to your backend instead of in-memory stores
```

Set in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://your-backend-url/api
```

## Debugging

### Check Console

```bash
npm run dev
# Look for TypeScript errors in terminal
# Check browser console (F12) for runtime errors
```

### Lint

```bash
npm run lint
# Checks TypeScript and Next.js rules
```

### Build

```bash
npm run build
# Catches build-time errors before deployment
npm start
# Test production build locally
```

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The app will be live at https://your-project.vercel.app

## Environment Variables

Create `.env.local` in project root:

```env
# Required
NEXT_PUBLIC_API_URL=http://your-api-server/api

# Optional
NEXT_PUBLIC_DEBUG=false
```

Never commit `.env.local` - it's in `.gitignore`

## Troubleshooting

### "Cannot find module '@/components'"
- Check `tsconfig.json` has paths alias configured correctly
- Restart dev server: `npm run dev`

### Styles not loading
- Check `src/app/globals.css` is imported in layout
- Clear Next.js cache: `rm -rf .next && npm run dev`

### API routes not working
- Ensure routes are in `src/app/api/` directory
- Use correct HTTP methods (GET, POST, PATCH, DELETE)
- Check console for error messages

### Type errors
- Run `npm run lint` to see all TypeScript errors
- Check imports are correct (e.g., `import { Scene } from "@/types"`)

## Support

For issues or questions:
1. Check README.md for full documentation
2. Review BUILD_SUMMARY.md for architecture overview
3. Check component comments and type definitions
4. Inspect browser DevTools (F12) for runtime errors
