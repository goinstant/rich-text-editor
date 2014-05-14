# Rich Text Editor

[Github Link](html/rich_text_editor_github.html "include")

The Rich Text Editor widget provides a real-time rich text editor (RTE) for
collaborative text editing inside a room of your application. It's based, in
part, off [Quill](http://quilljs.com), an open source, extensible rich text
editor (built by GoInstant team members).

The Rich Text Editor widget synchronizes content using GoInstant's [OT
  API](https://developers.goinstant.com/v1/javascript_api/ot/index.html) and
  displays the cursors of remote collaborators.

You specify a container to render the widget in, and we take care of the rest.

[Rich Text Editor](html/rich_text_editor_demo_iframe.html "include")

## Table of Contents

1. [Code Example](#code-example)
1. [HTML](#html)
1. [Constructor](#constructor)
1. [RichTextEditor#initialize](#richtexteditor#initialize)
1. [RichTextEditor#destroy](#richtexteditor#destroy)
1. [Supported Browsers](#supported-browsers)
1. [Related Information](#related-information)

## Code Example

### 1. Include our CDN assets:

#### Note on Versioning

Specific version of widgets can be found on our [CDN](https://cdn.goinstant.net/).

```html
<script type="text/javascript" src="https://cdn.goinstant.net/v1/platform.min.js"></script>
<script type="text/javascript" src="https://cdn.goinstant.net/widgets/rich-text-editor/latest/rich-text-editor.min.js"></script>
<!-- CSS is optional -->
<link rel="stylesheet" href="https://cdn.goinstant.net/widgets/rich-text-editor/latest/rich-text-editor.css" />
```

```js
// Connect URL
var url = 'https://goinstant.net/YOURACCOUNT/YOURAPP';

// Connect to GoInstant
goinstant.connect(url, function(err, platformObj, roomObj) {
  if (err) {
    throw err;
  }

  // Create a new instance of the Rich Text Editor widget
  var editorWidget = new goinstant.widgets.RichTextEditor({
    room: roomObj,
    containerId: "editor-widget"
  });

  // Initialize the Rich Text Editor widget
  editorWidget.initialize(function(err) {
    if (err) {
      throw err;
    }
    // Now the editor will render in your container and be sync across all
    // other clients in the room
  });
});
```

## HTML

### Rich Text Editor Widget

The widget is rendered to the `div` that you specify.

```html
<div id="editor-widget"></div>
```

## Constructor

Creates the RichTextEditor instance with customizable options.

### Methods

- ###### **new RichTextEditor(optionsObject)**

### Parameters

| optionsObject |
|:---|
| Type: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| An object with the following properties: |
| - `room` is the [Room](https://developers.goinstant.com/v1/rooms/index.html).|
| - `containerId` is the id of the DOM element that the widget will render in.|
| - `cursorTimeout` [**default: 3000**] is the [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) of milliseconds that remote cursors remain visible upon inactivity.|

### Example

```js
var options = {
  room: exampleRoom,
  containerId: "#editor-widget"
};

var editorWidget = new RichTextEditor(options);
```

## RichTextEditor#initialize

Subscribes the Rich Text Editor Widget instance to updates from the server.

### Methods

- ###### **editorWidget.initialize(callback(errorObject))**

### Parameters

| callback(errorObject) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A callback function that is returned once the editor widget has completed being initalized. |
| - `errorObject` - will be null, unless an error has occurred. |

### Example

```js
editorWidget.initialize(function(err) {
  // ready
});
```

## RichTextEditor#destroy

Destroys the Rich Text Editor Widget instance to updates from the server.

### Methods

- ###### **RichTextEditor.destroy(callback(errorObject))**

### Parameters

| callback(errorObject) |
|:---|
| Type: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| A callback function that is returned once the editor widget has completed being destroyed. |
| - `errorObject` - will be null, unless an error has occurred. |

### Example

```js
editorWidget.destroy(function(err) {
  // done
});
```

## Supported Browsers

The Rich Text Editor Widget is supported on the latest versions of Chrome, Firefox and Safari and Internet Explorer 9+.

## Related Information

### How do I set and retrieve document contents?

See the [OT guide](https://developers.goinstant.com/v1/javascript_api/ot/index.html).
