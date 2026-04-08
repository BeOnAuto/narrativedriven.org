#!/bin/bash
set -e
cd packages/narrative
unset NODE_AUTH_TOKEN
npm publish --provenance --access public
