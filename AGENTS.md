# HackPair JavaScript Development Standards

You are an expert Senior JavaScript Developer. Your task is to write high-quality, maintainable, scalable, and consistent JavaScript code that matches the **HackPair** benchmark standards (modeled on the Saivai architecture).

## General Philosophy

- Readability first. Code must be clear, well-structured, and easy to understand.
- Maintain consistency across the entire codebase.
- Prefer reusable, modular, and maintainable solutions.
- Handle errors explicitly and provide meaningful user feedback.
- Follow modern JavaScript and Next.js best practices for performance and scalability.

---

## 1. File & Directory Structure

### Component Structure

- Every component must reside inside its own directory.
- Component directories must use **kebab-case**.
- The component entry file must always be named `index.js` or `index.jsx`.
- Component styles must be named `[component-name].module.css` or `[component-name].module.scss`.

Example:

```
src/app/resources/components/
    user-card/
        index.jsx
        user-card.module.css
```

### Hooks

- Custom hooks must reside inside a dedicated `src/hooks/` directory.
- Hook files must use **kebab-case** and begin with `use-`.

Example:

```
src/hooks/
    use-auth.js
    use-feed.js
    use-connections.js
```

### Helpers

- Utility functions must reside inside a `src/helpers/` directory.
- Helper files must use **kebab-case**.

Example:

```
src/helpers/
    api.js
    auth.js
    site.js
```

---

## 2. Import Organization

Imports must always be grouped using the following order with comment section headers:

```javascript
/** React imports */
import React, { useEffect, useState } from "react";

/** Libraries */
import toast from "react-hot-toast";
import clsx from "clsx";

/** Local imports */
import Button from "@/components/common/button";
import { getConfig } from "@/helpers/api";

/** Styles */
import styles from "./user-card.module.css";
```

Import order:

1. React imports
2. Third-party libraries
3. Local imports
4. Styles

---

## 3. Naming Conventions

### Components

- PascalCase

Examples:

```
UserProfile
DeveloperCard
MatchModal
```

### Functions

- camelCase
- **All functions must be arrow functions.**

✅ Correct

```javascript
const fetchDevelopers = async () => {};
```

❌ Incorrect

```javascript
function fetchDevelopers() {}
```

### Variables

- camelCase

Examples:

```
isLoading
userData
connectionStatus
```

### Files & Directories

- kebab-case

Examples:

```
user-card
api-helpers
connection-request
```

### CSS Classes

- All CSS class names must use **snake_case**.

Example:

```css
.user_card {
}

.profile_header {
}

.avatar_wrapper {
}

.primary_button {
}
```

Usage:

```jsx
<div className={styles.user_card} />
```

### Constants

Global constants must use **UPPER_CASE**.

Examples:

```
API_BASE_URL
DEFAULT_TIMEOUT
MAX_RETRY_COUNT
```

---

## 4. Formatting & Code Style

- Use **4-space indentation** throughout the project.
- Maintain consistent formatting.
- Keep line lengths readable.
- Prefer early returns instead of unnecessary nesting.
- Avoid deeply nested conditional statements.
- Keep functions focused on a single responsibility.
- Avoid duplicated logic.

---

## 5. Documentation & Comments

Every function, hook, helper, and utility **must include JSDoc documentation**.

Example:

```javascript
/**
 * Fetches user profile by identifier.
 *
 * @param {string} userId User unique identifier.
 * @returns {Promise<Object>} User profile data.
 */
const getUserProfile = async (userId) => {};
```

Additionally:

- Add inline comments only for complex or non-obvious logic.
- Do not add unnecessary comments for self-explanatory code.

---

## 6. API & Data Fetching

### Centralized Configuration

Never duplicate fetch configuration.

Always use centralized helper methods (`getConfig`).

Example:

```javascript
const response = await fetch(`${API_BASE_URL}/profile/view`, getConfig("GET"));
```

### Error Handling

Every API request must:

- Include credentials for cookie session tokens (`credentials: "include"`).
- Check `response.ok`.
- Handle session expiration / unauthorized status (HTTP 401).
- Display user-friendly toast notifications with `react-hot-toast`.
- Throw descriptive errors for upstream handling.

Never silently ignore errors.

---

## 7. Component Structure

- Use modern functional components only.
- Destructure props in the function signature.
- Keep JSX clean and readable.
- Extract large rendering blocks into helper functions or child components.
- Prefer composition over deeply nested JSX.
- Avoid large monolithic components.

---

## 8. Styling Standards

- Use CSS Modules exclusively.
- Never use global component styles unless intentionally shared in `globals.css`.
- Access styles only through the imported `styles` object.

Example:

```jsx
<div className={styles.developer_card}>
```

Avoid inline styles unless values are genuinely dynamic.

---

## 9. CSS Architecture

Follow **strict CSS nesting** and custom media queries from `breakpoints.css`.

Organize child selectors under their parent selector:

```css
.developer_card {
    display: flex;
    background-color: var(--color-bg-card);

    .card_header {
        display: flex;

        .avatar {
            border-radius: 50%;
        }
    }

    @media (--mobile) {
        flex-direction: column;
    }
}
```

Guidelines:

- Keep selectors shallow.
- Avoid excessive nesting (maximum 3–4 levels).
- Maintain component-scoped styles.

---

## 10. Next.js Best Practices

### Images

Always use Next.js `Image` component instead of native `<img>` tags.

Image optimization guidelines:

- Always use `next/image`.
- Provide accurate width and height whenever possible.
- Use `fill` only when appropriate.
- Supply meaningful `alt` text.
- Use `priority` only for above-the-fold images.
- Use the `sizes` attribute for responsive images.

---

## Non-Negotiable Rules

- Use 4-space indentation.
- All functions must be arrow functions.
- Components must use PascalCase.
- Variables and functions must use camelCase.
- Files and directories must use kebab-case.
- CSS class names must use snake_case.
- Use strict CSS nesting.
- Use CSS Modules only.
- Always use Next.js Image for images with proper optimization.
- Every function, hook, helper, and utility must include JSDoc documentation.
- Organize imports using the defined section headers.
- Centralize API configuration.
- Always implement explicit error handling.
- Use functional components only.
