var should = require('should'),
  BPromise = require('bluebird'),
  sinon = require('sinon'),
  sinonBluebird = require('../');

describe('Sinon-Bluebird', function () {

  ///// Test Methods
  var obj = {
    success: function success() {
      return BPromise.resolve('Success');
    },
    reject: function reject() {
      return BPromise.reject('Error');
    },
    syncronous: function syncronous() {
      return 'Some string';
    }
  };

  describe('Resolve stubs', function () {
    before(function () {
      //stub example 1
      this.stub = sinon.stub(obj, 'success');
      this.stub.resolves('Stubbed Success');

      //stub example 2
      this.stub2 = sinon.stub(obj, 'reject').resolves('Stubbed Success 2');

      //stub example 3 (return array that can be spread)
      sinon.stub(obj, 'syncronous').resolves(['Stubbed Success', 3]);
    });

    it('should resolve \'success\' method of obj with \'Stubbed Success\' message',
      function () {
        return obj.success()
          .then(function (msg) {
            msg.should.equal('Stubbed Success');
            return true;
          });
      });

    it('should resolve \'reject\' method of obj with \'Stubbed Success 2\' message',
      function () {
        return obj.reject()
          .then(function (msg) {
            msg.should.equal('Stubbed Success 2');
            return true;
          });
      });

    it('should resolve \'syncronous\' method of obj with multiple values: \'Stubbed Success\'' +
      ' and \'3\'',
      function () {
        return obj.syncronous()
          .spread(function (msg, count) {
            msg.should.equal('Stubbed Success');
            count.should.equal(3);
            return true;
          });
      });

    after(function () {
      //restore all the functions individually
      obj.success.restore();
      obj.reject.restore();
      obj.syncronous.restore();
    });
  });

  describe('Reject stubs', function () {
    before(function () {
      //create a sinon sandbox to show how to easily restore funcs
      this.sandbox = sinon.sandbox.create();

      //stub examples
      this.sandbox.stub(obj, 'success').rejects(new Error('Stubbed Failure'));
      this.sandbox.stub(obj, 'reject').rejects('Stubbed Failure 2');
      this.sandbox.stub(obj, 'syncronous').rejects('Stubbed Failure 3');
    });

    it('should reject \'success\' method of obj with Error\'Stubbed Failure\' message',
      function () {
        return obj.success()
          .catch(function (msg) {
            msg.should.be.Error;
            msg.message.should.equal('Stubbed Failure');
            return BPromise.resolve(true);
          });
      });

    it('should reject \'reject\' method of obj with Error \'Stubbed Failure 2\' message',
      function () {
        return obj.reject()
          .catch(function (msg) {
            msg.should.be.Error;
            msg.message.should.equal('Stubbed Failure 2');
            return BPromise.resolve(true);
          });
      });

    it('should reject \'syncronous\' method of obj with Error \'Stubbed Failure 3\' message',
      function () {
        return obj.syncronous()
          .catch(function (msg) {
            msg.should.be.Error;
            msg.message.should.equal('Stubbed Failure 3');
            return BPromise.resolve(true);
          });
      });

    after(function () {
      //restore all the functions
      this.sandbox.restore();
    });
  });
});
