#!/bin/sh
set -eu

CONTAINER_NAME="lpic-3-mixed-env-prep"

podman stop "$CONTAINER_NAME" >/dev/null 2>&1 || true

echo "Stopped production container"
