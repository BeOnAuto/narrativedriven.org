#!/bin/bash
set -e
cd packages/narrative

CURRENT=$(node -p "require('./package.json').version")
PUBLISHED=$(npm view @onauto/narrative version 2>/dev/null || echo "none")

if [ "$CURRENT" != "$PUBLISHED" ]; then
  echo "Publishing @onauto/narrative@$CURRENT (npm has $PUBLISHED)"
  # Write a clean .npmrc with just the registry, no auth token
  echo "registry=https://registry.npmjs.org/" > /tmp/clean-npmrc
  # Run npm publish in a clean env that strips NODE_AUTH_TOKEN
  # but preserves PATH, HOME, and OIDC vars
  env -u NODE_AUTH_TOKEN -u NPM_CONFIG_USERCONFIG \
    NPM_CONFIG_USERCONFIG=/tmp/clean-npmrc \
    npm publish --provenance --access public
else
  echo "Version $CURRENT already published, skipping"
fi
