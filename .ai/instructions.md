---
description: "Best practices for building static Next.js (App Router) websites with server-side rendering at build time, client-side interactivity, and modern tooling (aligned with Next.js 16.1.1)."
applyTo: "**/*.tsx, **/*.ts, **/*.jsx, **/*.js, **/*.css"
---

# Next.js Static Site Best Practices for LLMs (2026)

_Last updated: October 2026 (aligned to Next.js 16.1.1)_

Please go here to see the latest version: [https://raw.githubusercontent.com/CHTC/nextjs-template/refs/heads/main/.ai/instructions.md](https://raw.githubusercontent.com/CHTC/nextjs-template/refs/heads/main/.ai/instructions.md)

This document summarizes the latest authoritative best practices for building static Next.js websites. It is intended for use by LLMs and developers to ensure code quality, maintainability, and scalability for pre-built, deployable static sites.

## Overview

Next.js is used as a static website generator for a JAMstack frontend. Dynamic data fetching and interactivity are handled via API routes and client components.

---

## 1. Project Structure & Organization

- **Use the `app/` directory** (App Router) for all new projects. Prefer it over the legacy `pages/` directory.
- **Top-level folders:**
    - `app/` — Routing, layouts, pages, and route handlers
    - `public/` — Static assets (images, fonts, etc.)
    - `lib/` — Shared utilities, API clients, and logic
    - `components/` — Reusable UI components
    - `contexts/` — React context providers
    - `styles/` — Global and modular stylesheets
    - `hooks/` — Custom React hooks
    - `types/` — TypeScript type definitions
- **Colocation:** Place files (components, styles, tests) near where they are used, but avoid deeply nested structures.
- **Route Groups:** Use parentheses (e.g., `(admin)`) to group routes without affecting the URL path.
- **Private Folders:** Prefix with `_` (e.g., `_internal`) to opt out of routing and signal implementation details.
- **Feature Folders:** For large apps, group by feature (e.g., `app/dashboard/`, `app/auth/`).
- **Use `src/`** (optional): Place all source code in `src/` to separate from config files.

## 2. Next.js 16+ App Router Best Practices

### 2.1 Server and Client Components for Static Generation

Since this is a static site, Server Components are primarily used during the build process to render pages. Client Components are used for any interactivity after the static HTML is deployed.

**Best Practices:**

- **Server Components** (default): Use for layout, static content, and build-time data aggregation.
- **Client Components:** Add `'use client'` at the top for interactive features (form handling, event listeners, browser APIs, etc.).
- Always move client-only logic/UI into a dedicated Client Component (with `'use client'` at the top) and import it directly in Server Components.

### 2.2 Page Naming and Organization Conventions

Every page starts as a server component in page.tsx, so that it can interact with server-only APIs. When a page also needs client-side interactivity (e.g., hooks or browser APIs), split that logic into a separate view.tsx client component. This lets us render as much as possible on the server while isolating the parts that require client-side rendering.

**page.tsx** — always a server component. Imports the client part of the page from view.tsx and passes along any server-fetched data as props.
**view.tsx** — the client component for the page. Can use hooks and consumes data passed down from page.tsx.

---

## 3. Component Best Practices

- **Component Types:**
    - **Server Components** (default): For rendering static content and building the site at build time.
    - **Client Components:** Add `'use client'` at the top. Use for interactivity, state, or browser APIs.
- **When to Create a Component:**
    - If a UI pattern is reused more than once.
    - If a section of a page is complex or self-contained.
    - If it improves readability or testability.
- **Component Conventions:**
    - Each reusable component lives in its own PascalCase directory with a barrel `index.ts` handling exports. Sub-components not used outside the parent are allowed in that directory.
    - Page-local components (used on one page) can sit in a `_components` directory next to the page. The leading underscore is Next.js's private-folder convention — it excludes the folder from routing. These can be lightweight flat files; they don't need the full directory+barrel treatment.
    - Single-file component = one `Component.tsx` inside its directory (e.g. `Button/Button.tsx` + `Button/index.ts`). Define the props type inline at the top of `Component.tsx`; don't create a separate types file for one consumer with small types.
    - Composed component (multiple sub-components in one directory): put shared types in a colocated `Component.types.ts` that the parent and all sub-components import from. One source of truth, and it avoids circular imports between parent and children.
    - Colocate types with the component that uses them. Only hoist a type to a shared location when something outside the component's own directory needs it.
    - Always expose public types through the directory's `index.ts` (e.g. `export type { ButtonProps } from './Button'`), so consumers import from `@/components/Button` and never reach into internal files.
    - Keep barrels scoped to the component directory. Avoid large feature- or app-level barrels that re-export everything — they hurt tree-shaking and dev compile times in Next.js.
    - Promote to a shared location only when justified: a feature-level `types.ts` for types shared across a feature, and `src/types/` for app-wide domain models (`User`, `Product`, etc.). Don't bury cross-cutting types inside a single component.
    - Decision rule: inline → `*.types.ts` → feature/shared types, escalating one step only when the number of consumers grows past the current scope.
- **Naming Conventions:**
    - Use `PascalCase` for component files and exports (e.g., `UserCard.tsx`).
    - Use `camelCase` for hooks (e.g., `useUser.ts`).
    - Use `snake_case` or `kebab-case` for static assets (e.g., `logo_dark.svg`).
    - Name context providers as `XyzProvider` (e.g., `ThemeProvider`).
- **File Naming:**
    - Match the component name to the file name.
    - For single-export files, default export the component.
    - For multiple related components, use an `index.ts` barrel file.
- **Component Location:**
    - Place shared components in `components/`.
    - Place route-specific components inside the relevant route folder.
- **Props:**
    - Use TypeScript interfaces for props.
    - Prefer explicit prop types and default values.
- **Testing:**
    - Co-locate tests with components (e.g., `UserCard.test.tsx`).

## 4. Material UI (Components, Icons, and Theming)

- **Material UI (MUI)** is used for components, icons, and theming in this project.
- **Themes:** The CHTC, OSG, and Pelican MUI themes are available in `@chtc/web-components/themes`.
- **Documentation:** For comprehensive Material UI documentation, visit [https://mui.com/](https://mui.com/).

### 4.1. Build Custom Components on MUI

- **MUI components are the base for all custom components.** Compose new components from MUI primitives (e.g., `Box`, `Stack`, `Typography`, `Button`, `Card`) rather than raw HTML elements or other UI libraries.
- **Extend, don't replace:** If an MUI component covers the need, wrap or extend it (forwarding its props) instead of building an equivalent from scratch.
- **Styling:** Style custom components with the `sx` prop and theme values so they stay consistent with the active theme.

### 4.2. Styling with the SX Prop

- **The `sx` prop** is Material UI's recommended approach for styling components. It accepts a JavaScript object with CSS properties and gives you direct access to theme values.
- **Theme Integration:** Since your project integrates with MUI themes, use the `sx` prop to access theme values like colors, spacing, typography, and breakpoints.
- **Documentation:** Learn more about the `sx` prop and system styling at [https://v7.mui.com/material-ui/llms.txt](https://v7.mui.com/material-ui/llms.txt).

**Example:**

```tsx
import { Box, Button } from '@mui/material';

export default function Example() {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        backgroundColor: 'primary.main',
        borderRadius: 1,
      }}
    >
      <Button variant="contained">Click me</Button>
    </Box>
  );
}
```

## 5. Naming Conventions (General)

- **Folders:** `kebab-case` (e.g., `user-profile/`)
- **Files:** `PascalCase` for components, `camelCase` for utilities/hooks, `kebab-case` for static assets
- **Variables/Functions:** `camelCase`
- **Types/Interfaces:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`


## 6. General Best Practices

- **TypeScript:** Use TypeScript for all code. Enable `strict` mode in `tsconfig.json`.
- **ESLint & Prettier:** Enforce code style and linting. Use the official Next.js ESLint config. In Next.js 16, prefer running ESLint via the ESLint CLI (not `next lint`).
- **Environment Variables:** Store secrets in `.env.local`. Never commit secrets to version control.
    - `NEXT_PUBLIC_` variables are **inlined at build time** and available to the browser.
- **Testing:** Use Jest, React Testing Library, or Playwright. Write tests for all critical logic and components.
- **Accessibility:** Use semantic HTML and ARIA attributes. Test with screen readers.
- **Performance:**
    - Use built-in Image and Font optimization.
    - Optimize bundle size; keep non-interactive logic in Server Components during build.
    - Minimize client-side JavaScript for faster page loads.
- **Security:**
    - Sanitize all user input (especially relevant for client-side interactivity).
    - Use HTTPS in production.
    - Set secure HTTP headers.
- **Documentation:**
    - Write clear README and code comments.
    - Document public APIs and components.

## 7. Tooling updates (Next.js 16)

- **Turbopack is the default dev bundler.** Configure via the top-level `turbopack` field in `next.config.*` (do not use the removed `experimental.turbo`).
- **Typed routes are stable** via `typedRoutes` (TypeScript required).

## 8. Avoid Unnecessary Example Files

Do not create example/demo files (like ModalExample.tsx) in the main codebase unless the user specifically requests a live example, Storybook story, or explicit documentation component. Keep the repository clean and production-focused by default.

## 9. Always Use the Latest Documentation and Guides

- For every Next.js related request, begin by searching for the most up-to-date Next.js documentation, guides, and examples.
- Use the following tools to fetch and search documentation if they are available:
    - `resolve_library_id` to resolve the package/library name in the docs.
    - `get_library_docs` for up-to-date documentation.

## 10. useSWR

For client-side data fetching, use the `useSWR` hook from the SWR library. It provides caching, revalidation, and a simple API for fetching data in Client Components.
