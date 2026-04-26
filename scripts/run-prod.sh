#!/bin/sh
set -eu

IMAGE_NAME="lpic-3-mixed-env-prep"
CONTAINER_NAME="lpic-3-mixed-env-prep"

podman machine start >/dev/null 2>&1 || true
podman build -t "$IMAGE_NAME" -f Containerfile .
podman stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
podman run --rm -d --name "$CONTAINER_NAME" -p 8080:8080 "$IMAGE_NAME"

echo "Production app available at http://localhost:8080"