/*global $, window, goinstant, jQuery */
'use strict';

function connect(options) {
  var connectUrl = 'https://goinstant.net/goinstant-services/docs';
  var connection = new goinstant.Connection(connectUrl, options);

  connection.connect(function(err, connection) {
    if (err) {
      throw err;
    }

    var currentRoom = connection.room('rich-text-editor');

    currentRoom.join(function(err) {
      if (err) {
        throw err;
      }

      var userColors = new goinstant.widgets.UserColors({ room: currentRoom });
      userColors.choose(function(err){
        if (err) {
          throw err;
        }
      });

      var userList = new goinstant.widgets.UserList({
        position: 'right',
        collapsed: true,
        room: currentRoom
      });
      userList.initialize(function(err) {
        if (err)  {
          throw err;
        }
      });


      // Create a new instance of the Rich Text Editor widget
      var editor = new goinstant.widgets.RichTextEditor({
        room: currentRoom,
        containerId: 'editor'
      });

      // Initialize the Rich Text Editor widget
      editor.initialize(function(err) {
        if (err) {
          throw err;
        }
        // Now it should render on the page
      });
    });
  });
}

$(window).ready(function() {
  // window.options comes from an inline script tag in each iframe.
  connect(window.options);
});
