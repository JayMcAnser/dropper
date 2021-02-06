#!/bin/sh
#
# updating import to the latest version

git stash
git pull
cd site/src/vendors
git pull
cd ../..
npm run build
rm -rf ../dist
mv dist ../dist
cd ..
pm2 restart DropServer

