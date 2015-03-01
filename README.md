Sinon-bluebird
===

A plugin that adds bluebird promise helper methods to [Sinon](https://github.com/cjohansen/Sinon.JS).

Installation
---
Install sinon-bluebird through npm package manager for node.

`npm install sinon-bluebird`

Usage
----
Some example usage:

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

API
---

API documentation for reference.

## Stubs

### .resolves(value)
Returns a resolved bluebird promise with given value

### .rejects(value)
Returns a rejected bluebird promise with the given value

Contributors / Inspiration
---
Thanks to  [sinon-as-promised](https://github.com/bendrucker/sinon-as-promised) for inspiration.

If your wondering what the main differences are:
- `sinon-as-promised` allows other promise libraries to be used instead of bluebird
- `sinon-as-promised` only supports `.then`, `.catch`, and `.finally` methods off of the stub (no special bluebird methods like: `.map`, `.bind`, `.spread`, etc...)
