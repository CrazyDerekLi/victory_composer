#!/usr/bin/env bash
# build for jenkins
# author lsc


echo "npm begin"
cd ./victory_zonghe/yitihua/
echo "WebJsComposer"
npm link gulp
npm link gulp-zip
npm run test
npm publish


echo "npm begin"
cd ../../victory_shuju/drag_layout/
echo "DragLayout"
npm link gulp
npm link gulp-zip
npm run test
npm publish

