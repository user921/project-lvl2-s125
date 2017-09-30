install:
	npm install

start:
	npm run babel-node -- src/bin/gendiff.js

build:
	rm -rf dist
	npm run build

publish:
	rm -rf dist
	npm publish

lint:
	npm run eslint ./src/

test:
	npm test

watch:
	npm run watch