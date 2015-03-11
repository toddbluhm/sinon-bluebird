
[![Circle CI](https://img.shields.io/circleci/project/L7labs/sinon-bluebird.svg)](https://circleci.com/gh/L7labs/sinon-bluebird)
[![NPM version](https://img.shields.io/npm/v/sinon-bluebird.svg)](https://www.npmjs.com/package/sinon-bluebird)
[![PeerDependencies](https://img.shields.io/david/peer/L7Labs/sinon-bluebird.svg)](https://github.com/L7labs/sinon-bluebird/blob/master/package.json)
[![Downloads](http://img.shields.io/npm/dm/sinon-bluebird.svg?style=flat)](https://www.npmjs.com/package/sinon-bluebird)

A plugin that adds [bluebird](https://github.com/petkaantonov/bluebird) promise helper methods to [Sinon](https://github.com/cjohansen/Sinon.JS).

## Installation

Run `npm install sinon-bluebird`

or `git clone` then `npm install`

Optionally run unit tests: `npm test`

### Dependencies

**This package requires that both `sinon` and `bluebird` already be installed.**

This package has peerDependencies of the following:

- `sinon 1.x`
- `bluebird 2.x`

*If you need a lower version, create an issue and it can be adjusted as necessary. Please, if you do need a lower version, test it first and then make the request.*

## Usage

```js
// Require in the libs
var sinon = require('sinon'),
  sinonBluebird = require('sinon-bluebird');

// Create an example function
var obj = {
  foo: function foo() {
    return 'bar';
  }
};

// Stub a function that returns a resolved bluebird BPromise
sinon.stub(obj, 'foo').resolves('hello world!');

// Execute the stub function
obj.foo().then(function(val) {
  // val === 'hello world!'
});

// Restore the original method
obj.foo.restore();

// Stub a method that returns a rejected bluebird BPromise
// Note: For shorthand, just pass in a string and it will be
// internally wrapped in an Error object
sinon.stub(obj, 'foo').rejects('AHHHHHH!!!!');

// Execute the stub function
obj.foo().catch(function(e) {
  // e === new Error('AHHHHHH!!!!')
});

// Restore back to the original function
obj.foo.restore();

// Original method back to normal
obj.foo(); // === 'bar'

```

## API

### Stubs

**.resolves(value)**

Returns a resolved bluebird promise with the given value

**.rejects(value)**

Returns a rejected bluebird promise with the given value.

*Note: If the given value is a String, that string will be wrapped in an Error object and will be on the message property.*

## Inspiration

Thanks to  [sinon-as-promised](https://github.com/bendrucker/sinon-as-promised) for inspiration.

If you're wondering what the main differences are:

- `sinon-as-promised` allows other promise libraries to be used instead of bluebird (`sinon-bluebird` is designed and optimized for use only with bluebird)
- `sinon-as-promised` only supports `.then`, `.catch`, and `.finally` methods off of the stub (no special bluebird methods like: `.map`, `.bind`, `.spread`, etc...)

## License

**MIT**

Copyright &copy; 2015 Level Seven

Authored by [Todd Bluhm](https://github.com/toddbluhm)
