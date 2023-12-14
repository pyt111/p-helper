#!/bin/sh

set -e
pwd
ls
pnpm i --frozen-lockfile
pnpm update:version

pnpm build

cd dist/p-helper
npm publish
cnpm sync p-helper
cd -

#cd internal/eslint-config
#npm publish
#cd -

#cd internal/metadata
#pnpm build
#npm publish
#cd -

echo "✅ Publish completed"
