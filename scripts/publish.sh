#!/bin/bash
set -e
echo "=== Debug: npm config ==="
npm config get registry
echo "=== Debug: .npmrc content ==="
cat "$NPM_CONFIG_USERCONFIG" 2>/dev/null || echo "No NPM_CONFIG_USERCONFIG"
cat ~/.npmrc 2>/dev/null || echo "No ~/.npmrc"
echo "=== Debug: npm whoami ==="
npm whoami 2>&1 || echo "Not logged in"
echo "=== Publishing ==="
cd packages/narrative
npm publish --provenance --access public
