#!/bin/sh
set -eu

podman stop lpic-3-mixed-env-prep >/dev/null 2>&1 || true
podman stop lpic-3-mixed-env-prep-dev >/dev/null 2>&1 || true
podman stop lpic-3-mixed-env-prep-test >/dev/null 2>&1 || true
podman stop lpic-3-mixed-env-prep-dev-test >/dev/null 2>&1 || true

echo "Stopped known LPIC-3 Podman containers"