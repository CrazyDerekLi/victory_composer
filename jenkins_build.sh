#!/usr/bin/env bash
# build for jenkins
# author lsc


echo "npm begin"
cd ./victory_zonghe/yitihua/
echo "LoggingCurveCom"
npm link gulp
npm link gulp-zip
npm run test
npm publish

