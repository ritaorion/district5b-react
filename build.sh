#!/bin/bash

cd /home/master/applications/afpxvzvday/public_html/
npm install
npm run build
cp -rf dist/* .
rm -rf dist
echo "Build completed and files deployed to public_html"