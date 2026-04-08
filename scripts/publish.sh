#!/bin/bash
set -e
cd packages/narrative

CURRENT=$(node -p "require('./package.json').version")
PUBLISHED=$(npm view @onauto/narrative version 2>/dev/null || echo "none")

if [ "$CURRENT" != "$PUBLISHED" ]; then
  echo "Publishing @onauto/narrative@$CURRENT (npm has $PUBLISHED)"
  echo "=== Debug: OIDC env vars ==="
  echo "ACTIONS_ID_TOKEN_REQUEST_URL: ${ACTIONS_ID_TOKEN_REQUEST_URL:-(not set)}"
  echo "ACTIONS_ID_TOKEN_REQUEST_TOKEN: ${ACTIONS_ID_TOKEN_REQUEST_TOKEN:+(set)}"
  echo "NODE_AUTH_TOKEN in parent: ${NODE_AUTH_TOKEN:+(set)}"
  echo "=== Debug: npm version ==="
  npm --version
  echo "=== Running env -u publish ==="
  echo "registry=https://registry.npmjs.org/" > /tmp/clean-npmrc
  env -u NODE_AUTH_TOKEN -u NPM_CONFIG_USERCONFIG \
    NPM_CONFIG_USERCONFIG=/tmp/clean-npmrc \
    npm publish --provenance --access public 2>&1 || {
    echo "=== First attempt failed, trying with --registry flag ==="
    env -u NODE_AUTH_TOKEN -u NPM_CONFIG_USERCONFIG -u NPM_CONFIG__authToken \
      npm publish --provenance --access public --registry=https://registry.npmjs.org 2>&1
  }
else
  echo "Version $CURRENT already published, skipping"
fi
