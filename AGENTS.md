# AGENTS.md

## Project Goal

This is a reading list app. Users can create a list of books to read and reorder it manually to match their current mood.

## Tech Direction

This is intended to be a mobile-first web app and PWA.

- React 19
- TypeScript
- Tailwind CSS
- Next.js
- pnpm

## Default Assumptions

- Prefer the simplest implementation that satisfies the requirement.
- Keep changes focused and minimal.
- Reuse existing patterns instead of introducing new ones.
- Avoid adding dependencies unless they clearly reduce complexity or are required.
- Ask before making destructive or large architectural changes.

## Repo Conventions

- Use ASCII unless the repo already uses Unicode.
- Prefer TypeScript for application code.
- Keep shared logic out of UI components when practical.
- Favor small, composable modules over large files.
- Prefer feature-first folders under `features/` for feature-owned UI, state, and data.
- Keep `app/` thin and route-focused; avoid putting feature logic there.
- Use PascalCase for component names and component file names.
- Keep shared UI primitives directly under `components/` using PascalCase file names.
- Use camelCase for non-component files, folders, and functions.
- Use snake_case only for constants, such as `DEFAULT_VALUES`.

## Commands

Add the exact project commands here once the app is scaffolded.

- install:
- dev:
- test:
- lint:
- build:
- typecheck:

## Decision Rules

When there are multiple valid options:

- favor the option that keeps the codebase easy to extend
- preserve the intended stack
- prefer maintainability over cleverness

## Notes

This file is intentionally lightweight for a greenfield project. Expand it as the app gains real structure, commands, and constraints.

<!-- hippo:start -->

## Project Memory (Hippo)

At the start of every task, run:

```bash
hippo context --auto --budget 1500
```

Read the output before writing any code.

On errors or unexpected behaviour:

```bash
hippo remember "<description of what went wrong>" --error
```

On task completion:

```bash
hippo outcome --good
```

<!-- hippo:end -->
