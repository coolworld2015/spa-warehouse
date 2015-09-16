git clone https://github.com/eduard-tkachuk/Warehouse.git

npm install
gulp //default build

gulp build //for dev
gulp release //for release

gulp test // one time
gulp tdd  // all times

npm start // run server.js
npm prune // remove npm from package.json

git branch master
git checkout master
git push origin --delete develop
-------------------------------------------------------------------------------------------------
Requirements:
{Node.js,
Android: Android SDK}

npm i cordova -g
cordova create android_test
cd android_test
cordova platform add android
cordova build android

cd platforms\android\build\outputs\apk

Move apk to Genymotion for running in VM

-------------------------------------------------------------------------------------------------
git config user.name "Eduard Tkachuk"