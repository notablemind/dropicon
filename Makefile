
build: components index.js dropicon.css
	@component build --dev -o test/example/ -n index

index.js: index.jsx
	@jsx index.jsx > index.js

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

blanket:
	@mocha -R html-cov --require blanket > coverage.html

test:
	@mocha -R spec

test/example/react.js:
	@curl -L -o test/example/react.js http://fb.me/react-0.5.1.js

test-only:
	@mocha -R spec

lint:
	@jshint --verbose *.js *.json

example: test/example/react.js build
	@xdg-open test/example/index.html

gh-pages: test/example/react.js build
	rm -rf web
	cp -r test/example web
	git co gh-pages
	mv web/* ./
	rm -rf web

.PHONY: clean test lint test-only example gh-pages
