git checkout -b deploy
$rm -rf dist/
npm run compile
mv -i build/src dist/
rm -rf build/
echo "Done. Commit changes"