#!/bin/sh
#
# updating import to the latest version

git stash

echo ">>> pull repo"
git pull

echo ">>> pull submodule api"
cd api/vendors
git pull
cd ../..
echo ">>> pull submodule site"
cd site/src/vendors
git pull
cd ../..

echo ">>> build site"
npm run build

echo ">>> move site to production"

rm -rf ../dist
mv dist ../dist
cd ..

echo ">>> restart server"
pm2 restart DropServer

