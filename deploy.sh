#!/bin/bash

set -o errexit -o nounset

if [ "$AUTO_DEPLOY" != "true" ] || [ "$TRAVIS_BRANCH" != "master" ] || [ "$TRAVIS_PULL_REQUEST" == "true" ]
then
  echo "No deploy for this build!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

cd build

sed -i "s/localhost:8080/snsa.github.io\/NEXT/g" index.html

git init
git config user.name "SNSA Bot"
git config user.email "heroandtn3@gmail.com"

git remote add upstream "https://$GH_TOKEN@github.com/SNSA/NEXT.git"
git fetch upstream
git reset upstream/gh-pages

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
