#!/bin/sh
#
# updating import to the latest version

git stash
git pull
cd site
npm run build
rm -rf ../dist
mv dist ../dist
cd ..
pm2 restart DropServer

