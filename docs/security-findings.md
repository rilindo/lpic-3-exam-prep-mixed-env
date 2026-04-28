# Security Findings

Reviewed: 2026-04-27  
Scope: All source files, container configuration, and CI pipeline.

---

## FINDING-01 — Missing HTTP security headers (HIGH) ✅ Fixed

**File:** `Containerfile` / `nginx.conf`

**Description:**  
The Nginx configuration had no HTTP security headers, leaving the app open to clickjacking, MIME-type sniffing, and cross-origin data leakage.

**Fix applied:**  
Extracted Nginx config to `nginx.conf` and added the following headers:

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | `default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';` |

**Note on CSP `style-src 'unsafe-inline'`:**  
This is required because Tailwind CSS v4 may inject styles at runtime in some configurations. Once the production build is confirmed to use only external stylesheets, `'unsafe-inline'` can be removed for a stricter policy.

---

## FINDING-02 — Unvalidated URL scheme in anchor `href` (MEDIUM) ✅ Fixed

**Files:** `src/components/QuestionCard.tsx`, `src/components/ResultsScreen.tsx`

**Description:**  
The `reference` field from each question JSON file was rendered directly as an anchor `href` with no validation. A `javascript:` or `data:` URL in any question bank entry would execute code when a user clicks the reference link.

```tsx
// Before — unsafe
<a href={question.reference} ...>
```

**Fix applied:**  
Added `src/utils/url.ts` with a `sanitizeUrl` function that allows only `http:` and `https:` scheme URLs, returning `'#'` for anything else. Applied to both components.

```tsx
// After — safe
<a href={sanitizeUrl(question.reference)} ...>
```

---

## FINDING-03 — Dev container runs as root (LOW) ✅ Fixed

**File:** `Containerfile.dev`

**Description:**  
The development container ran all processes as the root user, violating least-privilege principles. If the container process were compromised, an attacker would have root access inside the container.

**Fix applied:**  
Added `--chown=node:node` to `COPY` instructions and `USER node` before the `CMD` directive. The `node` user is built into the `node:22-alpine` base image.

---

## FINDING-04 — Production container Nginx master runs as root (LOW) ⚠️ Open

**File:** `Containerfile`

**Description:**  
The `nginx:1.27-alpine` image starts the Nginx master process as root in order to bind to ports and read configuration, then worker processes run as the `nginx` user. Fully non-root Nginx requires replacing the base image or using a custom Nginx build with `CAP_NET_BIND_SERVICE` removed.

**Recommendation:**  
For a higher-security deployment, replace `nginx:1.27-alpine` with `nginxinc/nginx-unprivileged` (official rootless Nginx image) and update the port from `8080` to match the unprivileged image default (`8080` is already non-privileged, so this change is minimal).

---

## FINDING-05 — `Math.random()` used for question shuffling (LOW) ⚠️ Informational

**File:** `src/utils/shuffle.ts`

**Description:**  
`Math.random()` is not a cryptographically secure pseudo-random number generator (CSPRNG). In this context it is used only to shuffle exam questions, not for any security-critical operation (no tokens, sessions, or secrets depend on it). The risk is negligible.

**Recommendation:**  
No action required for this use case. If the shuffling were ever used in a context where predictability has security implications (e.g., anti-cheat), switch to `crypto.getRandomValues()`.
