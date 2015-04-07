
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
  sinonBluebird = require('sinon-bluebird'),
  BPromise = require('bluebird');

////// -- Stubs Usage -- //////
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
////// -- End Stubs Usage -- //////

////// -- Spies Usage -- //////

var obj = {
  returnMethod: function (val) {
    return BPromise.resolve(val);
  },
  paramMethod: function (val, prom, val2) {
    return true;
  }
}

// Return methods
var spy = sinon.spy(obj, 'returnMethod');

obj.returnMethod('Hello'); //execute the test function
spy.returnedPromise('Hello'); // === true

obj.returnMethod('World'); //execute the test function a second time
spy.alwaysReturnedPromise('Hello'); // === false

spy.restore();

//Called With methods
spy = sinon.spy(obj, 'paramMethod');

obj.paramMethod(BPromise.resolve('Hello')); //pass in a promise
spy.calledWithPromise('Hello'); // === true
obj.paramMethod.reset(); //reset spy

/* Pass in a promise mixed with regular values
 * Note the rejected promise passed in, any rejected promise will possibly show up in console.log
 * due to how bluebird reports possibly unhandled exceptions (even though in this case we are
 * intentionally passing in a rejected promise)
*/
obj.paramMethod('Hello', BPromise.reject('World'), '!');
spy.calledWithMatch('Hello', 'World', String);  // === true (match allows for comparison by type too!)

obj.paramMethod.restore() //restore the original method back

////// -- End Spies Usage -- //////
```

## API

### Stubs

**.resolves(value)**

Returns a resolved bluebird promise with the given value

**.rejects(value)**

Returns a rejected bluebird promise with the given value.

*Note: If the given value is a String, that string will be wrapped in an Error object and will be on the message property.*

### Spies

#### Return Value Methods

*Promises cannot be in a pending state otherwise an error will be thrown.*

**.returnedPromise(value)**

Identical to sinon `.returned()` except it automatically unwraps the bluebird promise(if a promise is returned) and compares directly to the unwrapped value.

**.alwaysReturnedPromise(value)**

Identical to sinon `.alwaysReturned()` except it automatically unwraps the bluebird promise(if a promise is returned) and compares directly to the unwrapped value.

#### Called With Methods

*The promise (or promises) can be anywhere in the list of arguments passed into the spied on function or none at all.*

*Promises cannot be in a pending state otherwise an error will be thrown.*

**.calledWithPromise(value, ...)**

Identical to sinon `.calledWith()` except it automatically unwraps the bluebird promise(if a promise is passed in) and compares directly to the unwrapped value.

**.calledWithMatchPromise(value, ...)**

Identical to sinon `.calledWithMatch()` except it automatically unwraps the bluebird promise(if a promise is passed in) and compares directly to the unwrapped value.

**.alwaysCalledWithPromise(value, ...)**

Identical to sinon `.alwaysCalledWith()` except it automatically unwraps the bluebird promise(if a promise is passed in) and compares directly to the unwrapped value.

**.alwaysCalledWithMatchPromise(value, ...)**

Identical to sinon `.alwaysCalledWithMatch()` except it automatically unwraps the bluebird promise(if a promise is passed in) and compares directly to the unwrapped value.

**.calledWithExactlyPromise(value, ...)**

Identical to sinon `.calledWithExactly()` except it automatically unwraps the bluebird promise(if a promise is passed in) and compares directly to the unwrapped value.

**.alwaysCalledWithExactlyPromise(value, ...)**

Identical to sinon `.alwaysCalledWithExactly()` except it automatically unwraps the bluebird promise(if a promise is passed in) and compares directly to the unwrapped value.

## Inspiration

Thanks to  [sinon-as-promised](https://github.com/bendrucker/sinon-as-promised) for inspiration.

If you're wondering what the main differences are:

- `sinon-as-promised` allows other promise libraries to be used instead of bluebird (`sinon-bluebird` is designed and optimized for use only with bluebird)
- `sinon-as-promised` only supports `.then`, `.catch`, and `.finally` methods off of the stub (no special bluebird methods like: `.map`, `.bind`, `.spread`, etc...)

## License

**MIT**

Copyright &copy; 2015 Level Seven

Authored by [Todd Bluhm](https://github.com/toddbluhm)
