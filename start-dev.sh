#!/usr/bin/env bash
set -euo pipefail

CLEANED_UP=0

cleanup() {
  if [[ "$CLEANED_UP" -eq 1 ]]; then
    return
  fi

  CLEANED_UP=1
  echo
  echo "Stopping Orbit Eats dev servers..."
  kill "$API_PID" "$WEB_PID" 2>/dev/null || true
  wait "$API_PID" "$WEB_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

npm run server &
API_PID=$!

npm run dev:client &
WEB_PID=$!

echo "Orbit Eats API PID: $API_PID"
echo "Orbit Eats frontend PID: $WEB_PID"
echo "Press Ctrl+C to stop both."

while kill -0 "$API_PID" 2>/dev/null && kill -0 "$WEB_PID" 2>/dev/null; do
  sleep 1
done
