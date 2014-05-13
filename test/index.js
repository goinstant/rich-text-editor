/*jshint browser:true, node:false*/
/*global require, sinon*/

describe('Rich Text Editor', function() {
  "use strict";

  var RichTextEditor = require('rich-text-editor');
  var _ = require('lodash');

  var assert = window.assert;
  var sinon = window.sinon;

  var testEditor;
  var containerId = 'editor';

  function createFakeKey(name) {
    return {
      name: name,
      get: sinon.stub().yields(),
      set: sinon.stub(),
      key: createFakeKey,
      remove: sinon.stub().yields(),
      on: sinon.stub(),
      off: sinon.stub()
    };
  }

  function createFakeOT(name) {
    return {
      on: sinon.stub(),
      update: sinon.stub()
    };
  }

  function createFakeChannel(name) {
    return {
      on: sinon.stub(),
      off: sinon.stub(),
      message: sinon.stub()
    };
  }

  function getFakeUser() {
    return {
      id: 'user'
    }
  }

  var fakeRoom = {
    channel: createFakeChannel,
    key: createFakeKey,
    ot: createFakeOT,
    self: _.partial(createFakeKey, 'self'),
    on: sinon.stub(),
    off: sinon.stub(),
    users: createFakeKey('users')
  };

  it('require rich text editor', function() {
    assert(_.isFunction(RichTextEditor));
  });

  it('constructor', function() {
    testEditor = new RichTextEditor({
      room: fakeRoom,
      containerId: containerId
    });

    assert.isTrue(testEditor instanceof RichTextEditor);
  });

  it('initialize', function(done) {
    testEditor._userCache.getLocalUser = getFakeUser;
    testEditor.initialize(function(err) {
      assert.isTrue(!err);
      var container = document.getElementById(containerId);
      assert.isTrue(container.childNodes.length > 0);
      done();
    })
  });

  it('destroy', function(done) {
    testEditor.destroy(function(err) {
      assert.isTrue(!err);
      var container = document.getElementById(containerId);
      assert.isTrue(container.childNodes.length == 0);
      done();
    });
  });
});
