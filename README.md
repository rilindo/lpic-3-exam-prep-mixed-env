# LPIC-3 Mixed Environments Exam Prep

[![CI](https://github.com/rilindo/lpic-3-exam-prep-mixed-env/actions/workflows/ci.yml/badge.svg)](https://github.com/rilindo/lpic-3-exam-prep-mixed-env/actions/workflows/ci.yml)

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

Open the production app at `http://localhost:8080`.

Start the development container with the helper:

```bash
./scripts/run-dev.sh
```

Open the development app at `http://localhost:5173`.

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

## Run On OpenShift (Builder Image)

This repo includes an OpenShift Builder Image workflow using Source-to-Image (S2I) with Red Hat UBI Node.js 22.

Added files:

- `.s2i/environment` sets `NPM_RUN=build` so the builder runs `npm run build`
- `scripts/serve-dist.mjs` serves the `dist/` folder on port `8080` with SPA fallback
- `openshift/builder-image-app.yaml` defines `ImageStream`, `BuildConfig`, `DeploymentConfig`, `Service`, and `Route`

Prerequisites:

- `oc` CLI installed and logged in
- Permission to create resources in your target OpenShift project

Deploy in a project:

```bash
oc new-project lpic3-prep
oc apply -f openshift/builder-image-app.yaml
oc start-build lpic3-web --follow
oc rollout status dc/lpic3-web
```

Get the public URL:

```bash
oc get route lpic3-web -o jsonpath='{.spec.host}{"\n"}'
```

Optional: point the build to your own fork/branch:

```bash
oc patch bc/lpic3-web --type merge -p '{"spec":{"source":{"git":{"uri":"https://github.com/<you>/lpic-3-exam-prep-mixed-env.git","ref":"<branch>"}}}}'
oc start-build lpic3-web --follow
```

Notes:

- The provided manifest includes a sample GitHub webhook trigger secret (`change-me`). Update it before exposing webhooks in real environments.
- You can re-run builds at any time with `oc start-build lpic3-web --follow`.

## GitHub Merge Protection

This repo is set up to gate merges into `main` with the `verify` check from `.github/workflows/ci.yml`.

That workflow already runs:

- `npm run lint`
- `npm test`
- `npm run build`
- `npm audit --audit-level=high`

To require this before merge, configure branch protection or a ruleset for `main` in GitHub and mark `verify` as a required status check.

Dependabot is configured in `.github/dependabot.yml` to open weekly update pull requests for `npm` dependencies and GitHub Actions.

## Project Structure

- `src/components/` UI for home, quiz, progress, and results screens
- `src/data/questions/` objective-level LPIC-3 question bank
- `src/hooks/` quiz state handling
- `src/utils/` shuffling and scoring helpers
- `tests/` utility, hook, and component tests
- `.github/workflows/ci.yml` CI pipeline

## Notes

- The question bank is sourced from official LPIC objective coverage and references official Samba and FreeIPA documentation, Microsoft AD DS documentation, Linux man pages (man7.org, manpages.debian.org), Mankier, and Microsoft Learn.
- When adding or revising question references, prefer stable vendor or upstream documentation over wiki pages when an equivalent source exists.
- Prefer current Samba manpages or release/history documentation for Samba-specific topics, and prefer Microsoft Learn or AD DS product documentation for Windows and Active Directory administration topics.
- If no official vendor page is available, acceptable durable fallbacks include man7.org, manpages.debian.org, and Mankier.
- After question-bank edits, run `npm run check:urls` to catch broken references before committing.
- The app is fully static and can be hosted on GitHub Pages, S3, GCS, or any static web host.
