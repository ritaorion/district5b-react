#!/bin/bash

cd /home/master/applications/afpxvzvday/
npm install
npm run build
mv public_html public_html.bak
mkdir -p public_html
cp -r dist/* public_html/
echo "Build completed and deployed to public_html"