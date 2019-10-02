# console-app-js
An API for writing web-based console apps in Javascript.
This makes it easy to create apps with text-based user interfaces, which run in the browser.


## Demos

- [Text-based adventure game](https://werp.site/adventure/)
- [Simple library management system](https://werp.site/library-system/)
- [fffff REPL](https://kaya3.github.io/fffff/repl.html)

## Basic Usage
Add the following code to your page, within the `<head>` tag:

```html
<script src="https://kaya3.github.io/console-app-js/consoleapp.min.js"></script>
```

Then (once your page loads), you can create a `ConsoleApp` object:

```javascript
var app = new ConsoleApp({
    onCommand: function(text) {
        app.println("The parrot says: " + text);
        app.println("Say something else.");
    }
});

app.println("Say something to the parrot.");
```


## More Options

You can pass more options when creating a `ConsoleApp`.
These options/callbacks control the behaviour of the app:
- `onCommand(text)` is called when the user types a command and presses enter.
- `onConsoleMode()` is called when entering "console mode" (see below).
- `onEditMode()` is called when entering "edit mode" (see below).
- `onError(exception)` is called when another callback throws an exception. By default, the exception is printed as a string.
- `editable` is a boolean; set it to `true` to allow "edit mode" (see below).
- `editorText` is the default text to show in the editor (see below).

These options control how the app looks visually.
- `prompt` is a string prompting the user for input, e.g. `"> "` or `"user@host$ "`.
- `backgroundColor` controls the background colour, e.g. `"black"` or `"#300030"`.
- `textStyle` controls the text style, e.g. `"color: green; font-weight: bold;"`.
- `inputTextStyle` controls the text style for text the user enters.
- `errorTextStyle` controls the text style for error messages.
- `fontSize` controls the font size of all text, e.g. `16`.


## Methods

A `ConsoleApp` has the following methods for the app's output:
- `app.println(text)` prints a line of text.
- `app.println(text, style)` prints a line of text, applying a style to it (given as a CSS string).
- `app.print(text)` prints text, without a newline. Note that the next input prompt will *always* appear on a new line.
- `app.print(text, style)` prints text, applying a style to it (given as a CSS string).
- `app.clear()` clears the console of all previously-printed text.
- `app.setPrompt(prompt)` changes the prompt.

The following methods are for the app's user input:
- `app.disable()` disables user input; call this if you do not want the user to be able to enter another command.
- `app.enable()` re-enables user input after `disable()` has been called.
- `app.selection()` returns the currently-selected text, if any.

The following methods relate to "edit mode" (see below).
- `app.consoleMode()` enters console mode.
- `app.editMode()` enters edit mode.
- `app.editorText()` returns the current editor text.
- `app.editorText(text)` changes the current editor text.


## Edit Mode

If you create your app with the option `editable: true`, then there are two modes: "console mode" and "edit mode".
In console mode, the user sees a prompt, can type commands, and these commands are handled by the `onCommand` callback.
In edit mode, the user sees a text editor, and can edit its contents.
The user may press `Ctrl-E` to enter edit mode, and `Ctrl-R` to return to console mode.

The following example shows how a simple app might use edit mode:

```javascript
var app = ConsoleApp({
    prompt: 'Enter a word: ',
    onCommand: function(word) {
        if(word) {
            var text = app.editorText();
            var count = text.split(word).length - 1;
            out.println("That word appears " + count + " time(s).");
        }
    },
    editorText: 'This is the text you will search in by default.',
});

app.println("This app will count how many times a word occurs in a text.");
app.println("To edit the text, press Ctrl-E. Press Ctrl-R when you have finished editing.");
```
