#!/bin/sh
# updating import to the latest staging version
# the testing more

git stash
git pull
npm update
cd site
npm run build
cd ..
pm2 restart curator
