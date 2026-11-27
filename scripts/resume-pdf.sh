#!/usr/bin/env bash
# Regenerates public/resume.pdf from the /resume page (same content as the site).
# Usage: npm run resume:pdf   (needs a production build; set CHROME to override the browser path)
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-}"
if [[ -z "$CHROME" ]]; then
  for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
           "$HOME/Desktop/Google Chrome.app/Contents/MacOS/Google Chrome" \
           "$HOME/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    [[ -x "$c" ]] && CHROME="$c" && break
  done
fi
[[ -x "$CHROME" ]] || { echo "Chrome not found — set CHROME=/path/to/chrome"; exit 1; }

PORT=3457
npx next start -p "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT

for _ in $(seq 1 30); do
  curl -sf "http://localhost:$PORT/resume" >/dev/null && break
  sleep 1
done

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=4000 \
  --print-to-pdf="public/resume.pdf" "http://localhost:$PORT/resume" 2>/dev/null

echo "Wrote public/resume.pdf"
