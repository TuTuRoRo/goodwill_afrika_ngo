#!/bin/sh
# Serve the Goodwill Afrika site at http://localhost:${PORT:-8000}
cd "$(dirname "$0")" && exec python3 -m http.server "${PORT:-8000}" --bind 127.0.0.1
