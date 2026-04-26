# LPIC-3 Mixed Environments Exam Prep

Static React + TypeScript quiz app for LPIC-3 Exam 300 (Mixed Environments) practice.

## Features

- Practice mode with references shown after each submitted answer
- Exam mode with references hidden until results review
- Question counts from 5 to 100 in steps of 5
- Weighted question selection aligned to LPIC-3 300 v3.0 objectives
- Multiple choice and fill-in-the-blank questions
- Review screen with correct and incorrect answers plus official references
- Vitest tests, ESLint checks, and GitHub Actions CI

## Local Development

Requirements:

- Node.js 20+
- npm 10+

Install dependencies:

```bash
npm ci
```

Start the dev server:

```bash
npm run dev
```

Vite will print a local URL, typically `http://localhost:5173`.

## Validation

Run tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Run In A Container

This repo includes a `Containerfile` that builds the static site and serves it from Nginx on port `8080`.

If you want a simple repo-local wrapper around the Podman commands, use the helper scripts in `scripts/`.

Start the production container with the helper:

```bash
./scripts/run-prod.sh
```

Start the development container with the helper:

```bash
./scripts/run-dev.sh
```

Stop either helper-started container:

```bash
./scripts/stop-containers.sh
```

Build the image:

```bash
podman build -t lpic-3-mixed-env-prep -f Containerfile .
```

Run the container:

```bash
podman run --rm -p 8080:8080 lpic-3-mixed-env-prep
```

Open:

```text
http://localhost:8080
```

If you also use Docker in other environments, the same `Containerfile` works there as well.

## Run With Podman Compose

This repo also includes a `compose.yaml` so you can start the production container with one command.

Start the production container:

```bash
podman compose up --build app
```

Open:

```text
http://localhost:8080
```

Stop it:

```bash
podman compose down
```

If `podman compose` is not yet available on your machine, install a compose provider first. On macOS with Homebrew:

```bash
brew install podman-compose
```

## Development Container

The repo includes a `Containerfile.dev` for running the Vite development server inside a container with live source mounts.

Build it directly:

```bash
podman build -t lpic-3-mixed-env-prep-dev -f Containerfile.dev .
```

Run it directly:

```bash
podman run --rm -p 5173:5173 lpic-3-mixed-env-prep-dev
```

Or start the dev workflow with compose:

```bash
podman compose up --build dev
```

Open:

```text
http://localhost:5173
```

## Project Structure

- `src/components/` UI for home, quiz, progress, and results screens
- `src/data/questions/` objective-level LPIC-3 question bank
- `src/hooks/` quiz state handling
- `src/utils/` shuffling and scoring helpers
- `tests/` utility, hook, and component tests
- `.github/workflows/ci.yml` CI pipeline

## Notes

- The question bank is sourced from official LPIC objective coverage and references official Samba and FreeIPA documentation.
- The app is fully static and can be hosted on GitHub Pages, S3, GCS, or any static web host.
