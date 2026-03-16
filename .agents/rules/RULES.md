---
trigger: always_on
---

# Rules for Chrono - Version 1.0

## Project Summary
- This app registers, plans, and visualizes repetitive activities and records (maintenance, inspections, changes, etc.), predicting the next occurrence based on date, kilometers, or other metrics.
- Typical example: an “oil change” record with date + kilometers; the app constantly shows “last time” and alerts when the required interval has passed.
- User-generated data is stored client-side using IndexedDB in the browser.
- Mobile-first oriented.
- Styles built with Tailwind CSS and Shadcn/UI.
- Form validation uses react-hook-form and Zod.
- Deployment is handled on Vercel.
- Current version: v1.0.

## Structure and Architecture
- Built with Next.js using the App Router; all routing files are placed in the `app` folder.
- Key entities: **activity**, **record**.
- Code organization: If a code block (constants, functions) is used only by a single file or component, define it within that file’s scope or folder. If shared across multiple files, place it in the `constants` folder.
- JSX code starts in `page.tsx` files. As components grow in complexity, combine features, or increase in size/logic, extract them into separate components. Initially create components in a `_components` folder inside the route if used only by that page. If needed by multiple pages or components, move them to the root `components` folder.
- The `components` folder has a `ui` subfolder for simple, generic components (buttons, alerts, forms). Outside `ui`, create files for specific components such as `activity-form` or `record-card`.
- The `constants` folder at the project root organizes constants by entity (e.g., constants only for activity or only for record).
- This structure applies equally to folders like `stores` and `types`.
- In the `hooks` folder, create files per entity (e.g., `use-activity`, `use-record`, `use-mobile`).
- Data flow: TanStack Query for data fetching and Zustand for global state management.
- NEVER mix business logic in UI components.

## Code Standards and Style
- Naming: CamelCase for variables/functions (e.g., `fetchActivityData`), PascalCase for component names (e.g., `ActivityCard`). Kebab-case for file names with extensions (.ts, .tsx, .js, .jsx).
- Format: Always use Prettier (semi: false, singleQuote: true) and ESLint with airbnb-base.
- Tailwind classes: Order mobile-first (sm:, md:), use `cn()` from clsx-merge for conditionals.
- Avoid: Global variables, magic numbers (use constants instead).
- Component example:
  ```tsx
  import { cn } from '@/lib/utils';
  function Button({ className, ...props }) {
    return <button className={cn('bg-blue-500 text-white px-4 py-2', className)} {...props} />;
  }
  ```

## Best Practices and Techniques
- Prioritize React Server Components for performance whenever possible.
- Use custom hooks (e.g., `useActivity`, `useNextDue`) for reusable logic.
- Techniques: Implement lazy loading with Suspense and error boundaries at root levels.
- PREFER Zod for schemas: Define types in `/lib/schemas.ts`.
- NEVER use `useEffect` for data fetching; use server actions or TanStack Query instead.

## Testing and Quality
- Minimum coverage: Aim for 80% unit tests with Vitest and 100% E2E with Playwright (if applicable).
- Always write tests for critical components (forms and next-occurrence logic).
- Linting: Run ESLint before commits using Git hooks (e.g., Husky).
- Code reviews: Use GitHub PRs with checklists; no merges without approval.

## Security and Privacy
- Inputs: Sanitize with Zod to prevent XSS (React escapes automatically).
- Secrets: NEVER hardcode; use `.env` files managed with Dotenv.
- Data storage: Ensure IndexedDB handles sensitive data securely (encrypt if needed for critical info).
- GDPR-like practices: Keep all user data 100% client-side and anonymous where possible.

## Deployment and CI/CD
- Platform: Vercel with GitHub Actions integration.
- Pipeline: Build with Next.js defaults, run tests in PRs, auto-deploy on main branch.
- Rollbacks: Tag releases (e.g., v1.0.1) for easy reversion.
- Monitoring: Integrate tools like Sentry for error tracking in production.

## Error Handling and Logging
- Use try-catch in async functions; throw custom errors (e.g., `new AppError('msg')`).
- Logging: Console in development, structured logging with Pino in production.
- User-facing: Display friendly toasts (e.g., with Sonner).
- NEVER expose stack traces in production.

## Performance Optimizations
- Images and assets: Use `next/image` with lazy loading and optimized sizes.
- Bundling: Analyze with tools like Webpack Bundle Analyzer if bundle size grows.
- Caching: Leverage Next.js revalidation for dynamic pages.
- Metrics: Target fast load times, such as LCP < 2.5s.

## Internationalization and Accessibility
- i18n: Use next-intl for translations (start with es/en defaults).
- a11y: Add aria-labels to all interactive elements; ensure contrast ratio of 4.5:1.
- Testing: Aim for Lighthouse accessibility score >90.
- NEVER use colors alone for information (e.g., red=error); always combine with icons/text.
- Date and metric formatting: Localized to Colombia (es-CO) and metric units (km, hours, etc.).

## Dependencies and Tools
- Core: next@latest (App Router), react@18+, tailwindcss@3+, shadcn/ui, react-hook-form, zod, tanstack/react-query, zustand.
- Updates: Run npm-check-updates monthly.
- Avoid: Deprecated packages; prefer official, well-maintained ones.
- VS Code Extensions: Enable ESLint, Prettier, GitLens, Tailwind CSS IntelliSense.

## Stack-Specific Rules
- React: Use `memo` for pure components to avoid unnecessary re-renders.
- Next.js: Prefer App Router over Pages Router.
- Tailwind: Define custom themes in `tailwind.config.js`; use `@apply` only when necessary.

## Other Global Rules
- Commits: Follow conventional commits (feat:, fix:, chore:).
- Collaboration: Document TODOs with @todo comments in code.
- Updates: Review changelogs of dependencies before upgrading.