#!/bin/sh
# updating import to the latest staging version
# the testing more

echo "retrieving new version"
git stash
git pull
npm update
echo "building site"
cd site
npm update
npm run build
echo "updating api"

cd ../api
npm update
cd ..

echo "restart pm2"
pm2 restart curator
