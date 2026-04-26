#!/bin/sh
set -eu

IMAGE_NAME="lpic-3-mixed-env-prep-dev"
CONTAINER_NAME="lpic-3-mixed-env-prep-dev"

podman machine start >/dev/null 2>&1 || true
podman build -t "$IMAGE_NAME" -f Containerfile.dev .
podman stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
podman run --rm -d --name "$CONTAINER_NAME" -p 5173:5173 "$IMAGE_NAME"

echo "Development app available at http://localhost:5173"