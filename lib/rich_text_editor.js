/*jshint browser:true*/
/*global module, require*/
'use strict';

/**
 * @fileoverview
 * The GoInstant Rich Text Editor widget provides a drop-in,
 * collaborative rich text editing solution.
 */

/** Module dependencies */
var _ = require('lodash');
var classes = require('classes');
var UserCache = require('usercache');
var Quill = require('../vendor/quill');

/** Templates */
var toolbarTemplates = {
  'font'       : require('../templates/font.html'),
  'size'       : require('../templates/size.html'),
  'color'      : require('../templates/color.html'),
  'background' : require('../templates/background.html'),
  'bold'       : require('../templates/bold.html'),
  'italic'     : require('../templates/italic.html'),
  'underline'  : require('../templates/underline.html'),
  'strike'     : require('../templates/strike.html'),
  'align'      : require('../templates/align.html'),
  'image'      : require('../templates/image.html'),
  'link'       : require('../templates/link.html'),
}

/**
 * @const
 */
var DEFAULT_USER_COLOR = "#aaaaaa";
var DEFAULT_CURSOR_TIMEOUT = 3000;

/**
 * @constructor
 */
function RichTextEditor(opts) {
  if (!opts || !_.isPlainObject(opts)) {
    throw new Error('Invalid options passed to quill widget.');
  }

  if (!opts.room || !_.isObject(opts.room)) {
    throw new Error('Invalid room included in options passed to quill widget.');
  }

  if (!opts.containerId || !_.isString(opts.containerId)) {
    throw new Error('Invalid container included in options passed to quill widget.');
  }

  if (opts.cursorTimeout && !_.isNumber(opts.cursorTimeout)) {
    throw new Error('Invalid cursorTimeout included in options passed to quill widget.');
  }


  this._container = document.getElementById(opts.containerId);

  if (!this._container) {
    throw new Error('Given widget container does not exist.');
  }

  this._formats = opts.formats || ['font', 'size', 'color', 'background', 'bold', 'italic', 'underline', 'strike', 'link'];

  classes(this._container).add('gi-rich-text-editor');

  this._room = opts.room;
  this._containerId = opts.containerId;
  this._cursorTimeout = opts.cursorTimeout || DEFAULT_CURSOR_TIMEOUT;

  this._userCache = new UserCache(this._room);
  this._cursorChannel = this._room.channel('cursors');
  this._quill = this._initEditor();

  // Disable the editor from local input until GoInstant is online
  this._quill.editor.disable();

  _.bindAll(this, [
    '_onCursorChannel',
    '_moveCursor',
    '_removeCursor',
    '_setCursor'
  ]);
}

/**
 * Initializes the RichTextEditor widget
 * @public
 * @param {function} cb The function to call with an error or when
 *                      initialization is complete.
 */
RichTextEditor.prototype.initialize = function(cb) {
  var self = this;

  this._userCache.initialize(function(err) {
    if (err) {
      return cb(err);
    }

    var user = self._userCache.getLocalUser();
    self._quill.addModule('authorship', {
      authorId: user.id,
      color: user.avatarColor || DEFAULT_USER_COLOR
    });

    self._initSync(self._room);
    self._initSyncCursor(self._room, self._userCache);
    cb(null);
  });
};

/**
 * Destroys the RichTextEditor widget
 * @public
 * @param {function} cb The function to call with an error or when
 *                      the destroy is complete.
 */
RichTextEditor.prototype.destroy = function(cb) {
  this._cursorChannel.off('message', this._onCursorChannel);
  this._userCache.off('leave', this._removeCursor);
  this._userCache.off('change', this._setCursor);

  this._quill.editor.disable();
  this._container.innerHTML = '';

  this._userCache.destroy(function() {
    if (_.isFunction(cb)) {
      cb();
    }
  });
};


RichTextEditor.prototype._initEditor = function() {
  var toolbarContainer = document.createElement('div');
  var editorContainer = document.createElement('div');

  toolbarContainer.innerHTML = _.map(this._formats, function(format) {
    return toolbarTemplates[format] || '';
  }).join('');

  this._container.appendChild(toolbarContainer);
  this._container.appendChild(editorContainer);

  var quill = new Quill(editorContainer, {
    modules: {
      'toolbar': { container: toolbarContainer },
<<<<<<< HEAD
<<<<<<< HEAD
      'multi-cursor': { timeout: 10000 },
      'link-tooltip': true,
      'image-tooltip': true
=======
=======
>>>>>>> master
      'multi-cursor': { timeout: this._cursorTimeout },
      'link-tooltip': true
>>>>>>> master
    },
    theme: 'snow'
  });

  return quill;
};

RichTextEditor.prototype._initSync = function() {
  var self = this;

  var ot = this._room.ot('quill-ot', function(err, delta, context) {
    self._quill.setContents(delta);
    self._quill.editor.enable();
  });

  this._quill.on('text-change', function(delta, source) {
    if (source == 'user') {
      ot.update(delta);
    }
  });

  ot.on('update', function(delta, context) {
    self._quill.updateContents(delta);
  });
};

RichTextEditor.prototype._initSyncCursor = function(user) {
  var self = this;

  this._cursorChannel.on('message', this._onCursorChannel);

  this._userCache.on('leave', this._removeCursor);
  this._userCache.on('change', this._setCursor);

  this._quill.on('selection-change', function(range) {
    if (range) {
      self._cursorChannel.message({
        index: range.end
      });
    }
  });
};

RichTextEditor.prototype._onCursorChannel = function(message, context) {
  this._moveCursor(this._userCache.getUser(context.userId), message.index);
};

RichTextEditor.prototype._moveCursor = function(user, index) {
  var cursorManager = this._quill.getModule('multi-cursor');
  var cursorColor = user.avatarColor || DEFAULT_USER_COLOR;

  if (cursorManager.cursors[user.id]) {
    cursorManager.removeCursor(user.id);
  }

  cursorManager.setCursor(user.id, index, user.displayName, cursorColor);
};

RichTextEditor.prototype._removeCursor = function(user) {
  var cursorManager = this._quill.getModule('multi-cursor');
  cursorManager.removeCursor(user.id);
};

RichTextEditor.prototype._setCursor = function(user, index) {
  var cursorManager = this._quill.getModule('multi-cursor');
  var cursorColor = user.avatarColor || DEFAULT_USER_COLOR;

  if (cursorManager.cursors[user.id]) {
    var cursorIndex = cursorManager.cursors[user.id].index;
    cursorManager.removeCursor(user.id);
    cursorManager.setCursor(user.id, cursorIndex, user.displayName, cursorColor);
  }
};

/* Export the module */
module.exports = RichTextEditor;
