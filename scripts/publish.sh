#!/bin/bash
set -e
cd packages/narrative

CURRENT=$(node -p "require('./package.json').version")
PUBLISHED=$(npm view @onauto/narrative version 2>/dev/null || echo "none")

if [ "$CURRENT" != "$PUBLISHED" ]; then
  echo "Publishing @onauto/narrative@$CURRENT (npm has $PUBLISHED)"
  npm publish --provenance --access public
else
  echo "Version $CURRENT already published, skipping"
fi
