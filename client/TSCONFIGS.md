# TSConfig Layout (client)

This client uses a three-file TypeScript config to separate concerns and improve IDE/tooling behavior.

## Overview
- `tsconfig.json` — base shared options and project references.
- `tsconfig.app.json` — browser app config used by Vite to build and type-check app code.
- `tsconfig.node.json` — Node-only config for tooling (e.g., `vite.config.ts`, scripts).

## File responsibilities

### tsconfig.json (base)
- Defines shared compiler options:
  - Path aliases (`@/*`, `@app/*`, etc.).
  - Strict mode, `skipLibCheck`, `esModuleInterop`.
- Contains project references to `tsconfig.app.json` and `tsconfig.node.json`.
- No `include`/`exclude` to avoid double-compiling; leaf configs control their own includes.

### tsconfig.app.json (browser)
- Extends the base config.
- Targets the browser:
  - `target: ES2020`, `module: ESNext`, `moduleResolution: bundler`, `jsx: react-jsx`.
  - `lib: [ES2020, DOM, DOM.Iterable]` for DOM typings.
- Includes: `src`, `vite-env.d.ts`.
- Used by Vite for dev/build and by the editor for app source files.

### tsconfig.node.json (Node)
- Extends the base config.
- Targets Node tooling:
  - `target: ES2020`, `module: ESNext`, `moduleResolution: node`.
  - `types: ["node"]`, `lib: [ES2020]` (no DOM libs).
- Includes: `vite.config.ts` (and any other Node-only scripts if added).
- Keeps Node typings out of browser code to prevent type conflicts.

## Tips
- Add or change path aliases only in `tsconfig.json` (base).
- If you add more Node scripts, include them under `tsconfig.node.json`.
- Keep DOM-specific types out of Node configs and vice versa.

