#!/bin/sh

rm -rf dist
cd packages/p-helper
npm version prepatch

cd -
pnpm build

cd dist/p-helper
npm publish
cd -

echo "✅ Publish completed"
