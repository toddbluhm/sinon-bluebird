var sinon = require('sinon'),
  BPromise = require('bluebird');

// Create resolves function
function resolves(value) {
  return this.returns(BPromise.resolve(value));
}

// Attach resolves function to sinon
sinon.stub.resolves = sinon.behavior.resolves = resolves;

// Create a Bluebird Promise wrapper class to avoid unnecessary
// "possibly unhandled exception" warnings
function RejectBPromise(value) {
  this.value = value;
}

// Go through all Bluebird and Wrap each method on the new RejectBPromise class
Object.keys(BPromise.prototype).map(function (key) {
  RejectBPromise.prototype[key] = function () {
    var prom = new BPromise.reject(this.value);
    return prom[key].apply(prom, arguments);
  };
});

// Create the rejects function
function rejects(value) {
  this.rejectBPromise = true;

  //if its a string, wrap it in an error object
  if (typeof value === "string") {
    value = new Error(value);
  }

  return this.returns(new RejectBPromise(value));
}

// Attach rejects function to sinon
sinon.stub.rejects = sinon.behavior.rejects = rejects;

// Expore Sinon
module.exports = exports = sinon;
