# Entangle Docs

Black-and-white documentation app for Entangle, built with Next.js.

## Run locally

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Notes

- The app redirects `/` to `/docs/overview`.
- Content is stored in `src/lib/docs-content.ts`.
- The UI uses a docs-style layout with sidebar, search, table of contents, and next/previous navigation.
