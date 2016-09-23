require('should')
var describe = require('mocha').describe
var it = require('mocha').it
var before = require('mocha').before
var after = require('mocha').after
var BPromise = require('bluebird')
var sinon = require('sinon')
require('../')

// Disable warnings as these are test cases
BPromise.config({
  warnings: false
})

// Squelch any possibly unhandeled promises logs
BPromise.onPossiblyUnhandledRejection(function (e, promise) {})

describe('Sinon-Bluebird', function () {
  describe('Stubs', function () {
    // Test Methods
    var obj = {
      success: function success () {
        return BPromise.resolve('Success')
      },
      reject: function reject () {
        return BPromise.reject('Error')
      },
      synchronous: function synchronous () {
        return 'Some string'
      }
    }

    describe('Resolve stubs', function () {
      before(function () {
        // stub example 1
        this.stub = sinon.stub(obj, 'success')
        this.stub.resolves('Stubbed Success')

        // stub example 2
        this.stub2 = sinon.stub(obj, 'reject').resolves('Stubbed Success 2')

        // stub example 3 (return array that can be spread)
        sinon.stub(obj, 'synchronous').resolves(['Stubbed Success', 3])
      })

      it("should resolve 'success' method of obj with 'Stubbed Success' message",
        function () {
          return obj.success()
            .then(function (msg) {
              msg.should.equal('Stubbed Success')
              return true
            })
        })

      it("should resolve 'reject' method of obj with 'Stubbed Success 2' message",
        function () {
          return obj.reject()
            .then(function (msg) {
              msg.should.equal('Stubbed Success 2')
              return true
            })
        })

      it("should resolve 'synchronous' method of obj with multiple values: 'Stubbed Success'" +
      " and '3'",
        function () {
          return obj.synchronous()
            .spread(function (msg, count) {
              msg.should.equal('Stubbed Success')
              count.should.equal(3)
              return true
            })
        })

      after(function () {
        // restore all the functions individually
        obj.success.restore()
        obj.reject.restore()
        obj.synchronous.restore()
      })
    })

    describe('Reject stubs', function () {
      before(function () {
        // create a sinon sandbox to show how to easily restore funcs
        this.sandbox = sinon.sandbox.create()

        // stub examples
        this.sandbox.stub(obj, 'success').rejects(new Error('Stubbed Failure'))
        this.sandbox.stub(obj, 'reject').rejects('Stubbed Failure 2')
        this.sandbox.stub(obj, 'synchronous').rejects(new Error('Stubbed Failure 3'))
      })

      it("should reject 'success' method of obj with Error'Stubbed Failure' message",
        function () {
          return obj.success()
            .catch(function (msg) {
              msg.should.be.Error
              msg.message.should.equal('Stubbed Failure')
              return BPromise.resolve(true)
            })
        })

      it("should reject 'reject' method of obj with Error 'Stubbed Failure 2' message",
        function () {
          return obj.reject()
            .catch(function (msg) {
              msg.should.equal('Stubbed Failure 2')
              return BPromise.resolve(true)
            })
        })

      it("should reject 'synchronous' method of obj with Error 'Stubbed Failure 3' message",
        function () {
          return obj.synchronous()
            .catch(function (msg) {
              msg.should.be.Error
              msg.message.should.equal('Stubbed Failure 3')
              return BPromise.resolve(true)
            })
        })

      after(function () {
        // restore all the functions
        this.sandbox.restore()
      })
    })
  })

  describe('Spies', function () {
    var testMethods = {
      successfulPromiseMethod: function (val, prom) {
        return BPromise.resolve('Hello World!')
      },
      failedPromiseMethod: function (prom) {
        return BPromise.reject('Good Bye World!')
      },
      pendingPromiseMethod: function (prom) {
        return new BPromise(function (resolve, reject) {
          return
        })
      }
    }

    describe('returnedPromise', function () {
      before(function () {
        this.sandbox = sinon.sandbox.create()
        this.spy = this.sandbox.spy(testMethods, 'successfulPromiseMethod')
        this.spy2 = this.sandbox.spy(testMethods, 'failedPromiseMethod')
        this.spy3 = this.sandbox.spy(testMethods, 'pendingPromiseMethod')
        // execute the method
        // Success
        testMethods.successfulPromiseMethod()
        // Failure
        testMethods.failedPromiseMethod()
        // Pending
        testMethods.pendingPromiseMethod()
      })

      after(function () {
        this.sandbox.restore()
      })

      it('should compare value to unwrapped promise value', function () {
        this.spy.returnedPromise('Hello World!').should.be.true
        this.spy2.returnedPromise('Good Bye World!').should.be.true
      })

      it('should throw if promise is still pending', function () {
        this.spy3.returnedPromise.bind(this.spy3, 'Some Val')
          .should.throw('Promise not resolved yet')
      })
    })

    describe('calledWithPromise', function () {
      before(function () {
        this.sandbox = sinon.sandbox.create()
        this.spy = this.sandbox.spy(testMethods, 'successfulPromiseMethod')
        this.spy2 = this.sandbox.spy(testMethods, 'failedPromiseMethod')
        this.spy3 = this.sandbox.spy(testMethods, 'pendingPromiseMethod')
        // execute the method
        // Success
        testMethods.successfulPromiseMethod('reg val', BPromise.resolve('Calling Promise'))
        // Failure
        testMethods.failedPromiseMethod(BPromise.reject('Calling Bad Promise'))
        // Pending
        testMethods.pendingPromiseMethod(new BPromise(function (rs, rj) {}))
      })

      after(function () {
        this.sandbox.restore()
      })

      it('should compare value to unwrapped promise value', function () {
        this.spy.calledWithPromise('reg val', 'Calling Promise').should.be.true
        this.spy2.calledWithPromise('Calling Bad Promise').should.be.true
      })

      it('should throw if promise is still pending', function () {
        this.spy3.calledWithPromise.bind(this.spy3, 'Some Val')
          .should.throw('Promise not resolved yet')
      })
    })

    describe('calledWithMatchPromise', function () {
      before(function () {
        this.sandbox = sinon.sandbox.create()
        this.spy = this.sandbox.spy(testMethods, 'successfulPromiseMethod')
        this.spy2 = this.sandbox.spy(testMethods, 'failedPromiseMethod')
        this.spy3 = this.sandbox.spy(testMethods, 'pendingPromiseMethod')
        // execute the method
        // Success
        testMethods.successfulPromiseMethod([], BPromise.resolve('Calling Promise'))
        // Failure
        testMethods.failedPromiseMethod(BPromise.reject({
          name: 'Calling Bad Promise'
        }))
        // Pending
        testMethods.pendingPromiseMethod(new BPromise(function (rs, rj) {}))
      })

      after(function () {
        this.sandbox.restore()
      })

      it('should compare value type to unwrapped promise value type', function () {
        this.spy.calledWithMatchPromise(Array, String).should.be.true
        this.spy2.calledWithMatchPromise(Object).should.be.true
      })

      it('should throw if promise is still pending', function () {
        this.spy3.calledWithMatchPromise.bind(this.spy3, Object)
          .should.throw('Promise not resolved yet')
      })
    })

    describe('calledWithExactlyPromise', function () {
      before(function () {
        this.sandbox = sinon.sandbox.create()
        this.spy = this.sandbox.spy(testMethods, 'successfulPromiseMethod')
        this.spy2 = this.sandbox.spy(testMethods, 'failedPromiseMethod')
        this.spy3 = this.sandbox.spy(testMethods, 'pendingPromiseMethod')
        // execute the method
        // Success
        testMethods.successfulPromiseMethod(['hello', 'world'], BPromise.resolve('Calling Promise'))
        // Failure
        testMethods.failedPromiseMethod(BPromise.reject({
          name: 'Calling Bad Promise'
        }))
        // Pending
        testMethods.pendingPromiseMethod(new BPromise(function (rs, rj) {}))
      })

      after(function () {
        this.sandbox.restore()
      })

      it('should compare value type to unwrapped promise value type', function () {
        this.spy.calledWithExactlyPromise(['hello', 'world'], 'Calling Promise').should.be.true
        this.spy2.calledWithExactlyPromise({
          name: 'Calling Bad Promise'
        }).should.be.true
      })

      it('should throw if promise is still pending', function () {
        this.spy3.calledWithExactlyPromise.bind(this.spy3, 'Some Val')
          .should.throw('Promise not resolved yet')
      })
    })
  })
})
