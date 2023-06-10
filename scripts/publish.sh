#!/bin/sh

set -e

pnpm i
pnpm update:version

pnpm build

cd dist/p-helper
npm publish
cd -

#cd internal/eslint-config
#npm publish
#cd -

#cd internal/metadata
#pnpm build
#npm publish
#cd -

echo "✅ Publish completed"
