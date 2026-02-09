# Contributing to Rigour QA Web

Thank you for your interest in contributing to Rigour QA Web! This document provides guidance for developers who want to improve the visual test scene builder and execution dashboard.

## Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## Development Setup

### Prerequisites

- Node.js 18 or later
- pnpm 8 or later (recommended) or npm/yarn

### Installation

```bash
git clone https://github.com/rigour-labs/rigour-qa-web.git
cd rigour-qa-web
pnpm install
```

### Running the Development Server

```bash
pnpm dev
```

The application will start at `http://localhost:3000`. The development server includes hot module reloading for rapid iteration.

### Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_DEBUG=true
```

Ensure the backend Rigour QA API is running before starting the web UI.

## Code Style

### Formatting

We use **Prettier** for consistent code formatting.

```bash
# Format all files
pnpm format

# Check formatting without modifying
pnpm format:check
```

### Linting

We use **ESLint** to maintain code quality.

```bash
# Run linting
pnpm lint

# Fix linting issues automatically
pnpm lint:fix
```

### Type Checking

We use **TypeScript** for strong static typing.

```bash
# Type check the entire project
pnpm type-check
```

All code must pass type checking before being committed.

## Testing

### Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Writing Tests

- Place test files in `__tests__` directories or with `.test.ts`/`.test.tsx` extensions
- Use descriptive test names that explain what is being tested
- Mock external dependencies (API calls, timers, etc.)
- Test user interactions and edge cases
- Aim for meaningful coverage of core functionality

Example test:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { SceneBuilder } from '@/components/scene/SceneBuilder';

describe('SceneBuilder', () => {
  it('should create a scene with natural language input', () => {
    render(<SceneBuilder />);

    const input = screen.getByPlaceholderText('Describe your test...');
    fireEvent.change(input, { target: { value: 'Test login flow' } });
    fireEvent.click(screen.getByText('Create Scene'));

    expect(screen.getByText('Scene created successfully')).toBeInTheDocument();
  });
});
```

## Component Guidelines

### Structure

- Use functional components with React hooks
- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Place component styles in co-located files or Tailwind classes

### Naming Conventions

- Component files: PascalCase (e.g., `SceneBuilder.tsx`)
- Hook files: camelCase with `use` prefix (e.g., `useSceneData.ts`)
- Types/interfaces: PascalCase (e.g., `SceneConfig`)
- CSS classes: kebab-case (e.g., `scene-builder-container`)

### TypeScript Best Practices

```typescript
// Always define prop types
interface SceneBuilderProps {
  sceneId: string;
  onSave?: (scene: Scene) => Promise<void>;
  isLoading?: boolean;
}

export function SceneBuilder({
  sceneId,
  onSave,
  isLoading = false,
}: SceneBuilderProps) {
  // Component implementation
}
```

### Styling

- Use Tailwind CSS classes for styling
- Follow the existing color scheme (navy, blue, green)
- Use Framer Motion for animations and transitions
- Ensure responsive design (mobile-first approach)

Example:

```tsx
<div className="flex items-center justify-between rounded-lg border border-blue-200 bg-navy-50 p-4">
  <h3 className="text-lg font-semibold text-navy-900">Scene Details</h3>
  <motion.button
    whileHover={{ scale: 1.05 }}
    className="btn-primary"
  >
    Save
  </motion.button>
</div>
```

## Git Workflow

### Branch Naming

- Feature: `feature/description` (e.g., `feature/scene-versioning`)
- Bug fix: `fix/description` (e.g., `fix/execution-polling`)
- Documentation: `docs/description` (e.g., `docs/api-routes`)

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, linting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or updates
- `chore`: Build, dependencies, or tooling changes

Examples:
```
feat(scene-builder): add YAML editor support
fix(execution): resolve polling timeout issue
docs(readme): update quick start instructions
```

### Pull Request Process

1. Fork the repository and create a feature branch
2. Make your changes, ensuring all tests pass
3. Run `pnpm format`, `pnpm lint:fix`, and `pnpm type-check`
4. Commit with clear, descriptive messages
5. Push to your fork and open a pull request
6. Provide a clear description of the changes and any related issues
7. Ensure CI checks pass
8. Address review feedback

## API Integration

### Using the API Client

The project includes an SWR-based API client in `src/lib/api.ts`:

```typescript
import { useScenes, useExecutions } from '@/lib/api';

function MyComponent() {
  const { data: scenes, isLoading, error } = useScenes();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading scenes</div>;

  return (
    <ul>
      {scenes?.map(scene => (
        <li key={scene.id}>{scene.name}</li>
      ))}
    </ul>
  );
}
```

### Backend API Contract

When making API changes, ensure:

- Maintain backward compatibility when possible
- Document API changes in the README
- Update TypeScript types in `src/types/index.ts`
- Test with the actual backend API

## Performance

### Best Practices

- Minimize bundle size by lazy-loading components and code
- Use React.memo for expensive components
- Optimize images and assets
- Implement proper data fetching with SWR caching
- Profile performance with React DevTools Profiler

### Monitoring

Check bundle size impact:

```bash
pnpm build
pnpm analyze  # if available
```

## Documentation

- Update README.md for user-facing changes
- Add comments for complex logic
- Document component props and behaviors
- Keep API documentation in sync with changes

## Reporting Issues

Use GitHub Issues to report bugs or suggest features. Include:

- Clear, descriptive title
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Environment details (browser, OS, Node version)
- Screenshots or error logs if applicable

## Questions or Need Help?

- Check existing documentation and issues
- Open a discussion on GitHub
- Reach out to the maintainers

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to make Rigour QA Web better!
