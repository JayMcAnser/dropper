#!/bin/sh
#
# updating import to the latest version

git stash
git pull
cd site
npm run build
cd ..
pm2 restart curator

