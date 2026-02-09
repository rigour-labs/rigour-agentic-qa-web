# Rigour QA Web

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Visual test scene builder & execution dashboard** for the Rigour QA platform. Build intelligent agent-driven test scenarios, configure connections to target systems, and monitor execution with real-time dashboards and detailed result analysis.

![Dashboard](./docs/screenshots/dashboard.png)

## Features

- **Visual Scene Builder** — Create test scenes with natural language prompts or structured editor, powered by agentic decision-making
- **Execution Dashboard** — Real-time test execution monitoring with live polling, timeline views, and step-by-step inspection
- **Connection Manager** — Configure and test API connections with support for multiple auth methods (Bearer, Basic, API Key, OAuth)
- **Results Analysis** — Detailed execution results with assertion breakdown, edge case discovery, and self-healing insights
- **Dashboard Overview** — Quick metrics, recent executions, and actionable quick-start buttons

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) + [React 19](https://react.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Data Fetching**: [SWR](https://swr.vercel.app)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor)
- **Tables**: [TanStack Table](https://tanstack.com/table/latest)
- **Icons**: [Lucide React](https://lucide.dev)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski)

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

```bash
git clone https://github.com/rigour-labs/rigour-qa-web.git
cd rigour-qa-web
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes (scenes, executions, connections, health)
│   ├── scene-builder/          # Scene builder page
│   ├── executions/             # Execution dashboard page
│   ├── connections/            # Connection manager page
│   ├── settings/               # Settings and configuration page
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Dashboard home page
│   └── globals.css             # Global styles
├── components/
│   ├── scene/                  # Scene builder components
│   ├── execution/              # Execution monitoring components
│   ├── dashboard/              # Dashboard widget components
│   ├── connection/             # Connection manager components
│   └── shared/                 # Shared UI components
├── lib/
│   ├── api.ts                  # SWR-based API client
│   └── utils.ts                # Utility functions
└── types/
    └── index.ts                # TypeScript type definitions
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/scenes` | List all test scenes |
| `POST` | `/api/scenes` | Create new scene |
| `GET` | `/api/scenes/:id` | Get scene details |
| `PATCH` | `/api/scenes/:id` | Update scene |
| `DELETE` | `/api/scenes/:id` | Delete scene |
| `GET` | `/api/executions` | List executions (filterable by sceneId) |
| `POST` | `/api/executions` | Trigger execution |
| `GET` | `/api/executions/:id` | Get execution details and results |
| `GET` | `/api/connections` | List configured connections |
| `POST` | `/api/connections` | Create connection |
| `PATCH` | `/api/connections/:id` | Update connection |
| `DELETE` | `/api/connections/:id` | Delete connection |
| `POST` | `/api/connections/test` | Test connection validity |
| `GET` | `/api/dashboard/stats` | Get dashboard overview statistics |
| `GET` | `/api/health` | Health check endpoint |

## Key Components

### Scene Builder

Create test scenes in two modes:

**Natural Language Mode**: Describe your test scenario in plain English, and the system parses it into a structured scene definition.
- Example: "Test that login fails after 5 wrong attempts"

**Structured Mode**: Edit scenes using form fields and Monaco editor for YAML configuration.
- Configure actors, steps, assertions, and edge case hints

### Execution Dashboard

Monitor real-time test execution with:

- **Timeline View**: Visual progression through Plan → Execute → Explore → Judge → Heal phases
- **Step Details**: Inspect requests, responses, and performance metrics
- **Results**: Clear pass/fail status with duration and agentic reasoning
- **Edge Cases**: Discover and explore edge cases found during execution
- **Self-Healing**: Review applied fixes and recovery actions

### Connection Manager

Configure and validate connections to target systems:

- Support for multiple environments (dev, staging, production)
- Auth types: None, Bearer, Basic, API Key, OAuth
- Test connection validation
- Custom headers and timeout configuration

### Dashboard

Central overview with:

- Key metrics: Total scenes, pass rate, edge cases discovered, tests self-healed
- Recent executions list with status filtering
- Quick action buttons: New Scene, Run All, View Reports

## Environment Variables

Create a `.env.local` file in the project root:

```env
# API endpoint for backend services
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Enable debug logging in console
NEXT_PUBLIC_DEBUG=false
```

## Development

### Code Style

This project uses:

- **Prettier** for code formatting
- **ESLint** for code linting
- **TypeScript** for type safety

```bash
pnpm lint          # Run ESLint
pnpm format        # Format with Prettier
pnpm type-check    # Type check with TypeScript
```

### Testing

Run tests with:

```bash
pnpm test
pnpm test:watch
```

### Component Guidelines

- Use functional components with React hooks
- Leverage TypeScript for strong typing
- Keep components focused and composable
- Use Tailwind CSS classes for styling
- Apply Framer Motion for interactions and animations

## Integration with rigour-qa SDK

This web UI communicates with the [rigour-qa SDK](https://github.com/rigour-labs/rigour-qa) via HTTP API. The SDK provides:

- Agentic test execution and decision-making
- Scene parsing and validation
- Connection testing and management
- Result analysis with edge case discovery

Ensure the backend API is running before launching the web UI.

## License

[MIT](LICENSE) © 2026 Rigour Labs. All rights reserved.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

For issues, questions, or feature requests, please open an issue on [GitHub](https://github.com/rigour-labs/rigour-qa-web/issues).
