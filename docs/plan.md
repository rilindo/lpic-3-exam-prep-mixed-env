# Project Plan: LPIC-3 Mixed Environments Exam Prep

## Goal

Build a static, self-hostable quiz application for studying the LPIC-3 Exam 300 (Mixed Environments) certification. The app must be usable offline, require no backend, and source all question content exclusively from official LPIC objectives and vendor documentation — no exam dumps.

## Exam Coverage

LPIC-3 Exam 300 v3.0 objectives. Questions are weighted proportionally to the official topic weights published by LPI. The question bank targets 120 questions across 20 objectives (approximately 2 questions per weight point).

Topics covered:
- **301** Samba Basics (301.1–301.4)
- **302** Samba Share Configuration (302.1–302.5)
- **303** Samba User and Group Management (303.1–303.4)
- **304** Samba Domain Integration (304.1–304.3)
- **305** Linux Identity Management and File Sharing (305.1–305.4)

## Application Modes

### Practice Mode
- Questions are served one at a time.
- After each submission, the correct answer, explanation, and official reference links are shown immediately.
- Score is tracked throughout.

### Exam Mode
- Questions are served one at a time without immediate feedback.
- References and explanations are hidden until the results screen.
- Simulates a real exam environment.

## Question Counts

Users choose a question count at the start: 5 to 100 in steps of 5. The question bank is sampled proportionally to objective weights so every session reflects the exam balance.

## Question Types

- Multiple choice (single correct answer)
- Fill-in-the-blank (case-insensitive, trimmed exact match)

## Content Sources

All questions are sourced from:
- LPI LPIC-3 300 v3.0 official objectives
- Samba project documentation (https://www.samba.org/samba/docs/)
- FreeIPA documentation (https://www.freeipa.org/page/Documentation)
- NFS/SSSD/Kerberos man pages and upstream docs

## Technology Stack

| Concern | Choice |
|---|---|
| UI framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Testing | Vitest + Testing Library + jsdom |
| Linting | ESLint 10 + typescript-eslint + eslint-plugin-security |
| CI | GitHub Actions |
| Containers | Podman (production Nginx on 8080, dev Vite on 5173) |
| Compose | podman-compose / `podman compose` |

## Architecture

Single-page application with no router. State machine in `useQuiz` drives three screens:

```
HomeScreen (idle) → QuizScreen (active) → ResultsScreen (complete)
```

Data flow:
- `src/data/index.ts` imports all 20 JSON question files and performs weighted proportional sampling.
- `useQuiz.ts` manages question progression, answer recording, and mode-aware feedback.
- Components are stateless and receive everything via props.

## Repository Layout

```
src/
  components/   UI screens and shared widgets
  data/         Question bank aggregator and 20 objective JSON files
  hooks/        useQuiz state machine
  types/        Shared TypeScript domain types
  utils/        Shuffle and scoring helpers
tests/          Vitest unit and component tests
.github/
  workflows/    CI pipeline (lint, audit, test, build)
  dependabot.yml  Weekly npm and GitHub Actions updates
scripts/        Podman helper scripts
Containerfile   Production multi-stage build (Node → Nginx)
Containerfile.dev  Development container (Vite dev server)
compose.yaml    Podman Compose service definitions
```

## CI Pipeline

Every push and every pull request to `main` runs:

1. `npm ci`
2. `npm run lint`
3. `npm audit --audit-level=high`
4. `npm test`
5. `npm run build`

The `verify` job is the required status check for merging to `main`.

## Merge Protection

Branch protection on `main` requires the `verify` check to pass. Dependabot opens weekly PRs for `npm` and GitHub Actions dependency updates.

## Static Hosting

The production build is fully static (`dist/`). It can be served from:
- GitHub Pages
- Amazon S3 / CloudFront
- Google Cloud Storage
- Any static web host
- The included Nginx container
