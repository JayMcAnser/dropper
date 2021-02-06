#!/bin/sh
# updating import to the latest staging version
# the testing more

echo ">>> retrieving new version"
git stash
git pull
npm update

echo ">>> updating api"
cd api
npm update --force
cd ..

echo ">>> building site"
cd site
npm update --force
npm run build

rm -rf ../dist
mv dist ../dist
cd ..

echo ">>> restart pm2"
pm2 restart DropServer
