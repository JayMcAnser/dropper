#!/bin/sh
#
# updating import to the latest version

git stash

echo ">>> pull repo"
git pull origin master

echo ">>> pull submodule api"
cd api/vendors
git stash
git pull origin master
cd ..
npm update --force
cd ..


echo ">>> pull submodule site"
cd site/src/vendors
git stash
git pull origin master
cd ..
npm update --force
cd ..

echo ">>> build site"
npm run build

echo ">>> move site to production"

rm -rf ../dist
mv dist ../dist
cd ..

echo ">>> restart server"
pm2 restart DropServer


