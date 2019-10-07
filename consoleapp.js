function ConsoleApp(options) {
	var c = this;
	if(!(c instanceof ConsoleApp)) {
		return new ConsoleApp(options);
	}
	
	options = options || {};
	if(!options.backgroundColor) { options.backgroundColor = 'black'; }
	if(!options.textStyle) { options.textStyle = 'color: #d0d0d0;'; }
	if(!options.inputTextStyle) { options.inputTextStyle = 'color: white;'; }
	if(!options.errorTextStyle) { options.errorTextStyle = 'color: #e80000;'; }
	if(!options.fontSize) { options.fontSize = 18; }
	if(options.prompt === undefined) { options.prompt = '> '; }
	
	var headElement = document.getElementsByTagName('head')[0];
	var styleElement = document.createElement('style');
	styleElement.type = 'text/css';
	styleElement.innerHTML = [
		"html, body {",
			"margin: 0; padding: 0;",
			"width: 100%; height: 100%;",
			"display: flex;",
			options.textStyle,
		"}",
		"#main_container, #editor_container { overflow-y: auto; }",
		"#input, #editor, #main_container, #editor_container { flex-grow: 1; }",
		"body, #input, #editor { font-family: 'Consolas', 'Lucida Console', monospace; }",
		"#output, #input_container, #input, #editor {",
			"border: 0; padding: 0; margin: 0; outline: 0;",
			"font-size: " + options.fontSize + "px;",
			"white-space: pre;",
		"}",
		"#input, #editor { " + options.inputTextStyle + " }",
		"#input_container { display: flex; flex-basis: 2em; }",
		"html, body, #input, #editor { background-color: " + options.backgroundColor + "; }",
		"#main_container, #editor { padding: 1em; }",
		"#editor_container { display: flex; }",
		"#editor { resize: none; }",
		".hidden { display: none !important; }"
	].join('\n');
	headElement.appendChild(styleElement);
	
	var bodyElement = document.getElementsByTagName('body')[0];
	var mainContainer = document.createElement('div'); 
	var inputContainer = document.createElement('div');
	var inputElement = document.createElement('input'); 
	var inputLabel = document.createElement('label');
	var outputElement = document.createElement('pre');
	var editorContainer = document.createElement('div');
	var editorElement = document.createElement('textarea');
	mainContainer.id = 'main_container';
	inputContainer.id = 'input_container';
	outputElement.id = 'output';
	bodyElement.appendChild(mainContainer);
	mainContainer.appendChild(outputElement);
	mainContainer.appendChild(inputContainer);
	inputContainer.appendChild(inputLabel);
	inputContainer.appendChild(inputElement);
	inputLabel.htmlFor = inputElement.id = 'input';
	inputElement.spellcheck = false;
	bodyElement.appendChild(editorContainer);
	editorContainer.appendChild(editorElement);
	editorContainer.id = 'editor_container';
	editorElement.id = 'editor';
	editorElement.value = options.editorText || '';
	editorElement.spellcheck = false;
	
	mainContainer.onclick = function() {
		if(!c.selection()) {
			inputElement.focus();
		}
	};
	inputElement.addEventListener('keydown', function(e) {
		if(e.keyCode === 13) {
			try {
				c.print(options.prompt);
				c.println(inputElement.value, options.inputTextStyle);
				c.onCommand(inputElement.value);
			} catch(e) {
				c.onError(e);
			}
			inputElement.value = '';
			mainContainer.scrollTop = mainContainer.scrollHeight;
			e.preventDefault();
			return false;
		}
	});
	document.addEventListener('keydown', function(e) {
		var k = String.fromCharCode(e.which).toLowerCase();
		if((e.ctrlKey || e.metaKey) && (k === 'r' || k === 'e')) {
			if(k === 'r' && c.currentMode === 'edit') {
				c.consoleMode();
			} else if(options.editable && k === 'e' && c.currentMode === 'console') {
				c.editMode();
			}
			e.preventDefault();
			return false;
		}
	});
	
	c.selection = function selection() {
		return window.getSelection
			? window.getSelection().toString()
			: (document.selection && document.selection.type != "Control")
			? document.selection.createRange().text
			: '';
	};
	c.editorText = function editorText(s) {
		if(s !== undefined) {
			editorElement.value = s;
		}
		return editorElement.value;
	};
	c.onCommand = options.onCommand || function onCommand(c) {
		c.onError('No onCommand handler registered.');
	};
	c.onError = options.onError || function onError(e) {
		c.println(e.toString(), options.errorTextStyle);
	};
	c.onConsoleMode = options.onConsoleMode;
	c.onEditMode = options.onEditMode;
	c.consoleMode = function consoleMode() {
		try {
			c.currentMode = 'console';
			editorContainer.className = 'hidden';
			mainContainer.className = '';
			c.enable();
			if(c.onConsoleMode) {
				c.onConsoleMode();
			}
		} catch(e) {
			c.onError(e);
		}
	};
	c.editMode = function editMode() {
		try {
			c.currentMode = 'edit';
			mainContainer.className = 'hidden';
			editorContainer.className = '';
			editorElement.focus();
			if(c.onEditMode) {
				c.onEditMode();
			}
		} catch(e) {
			c.onError(e);
		}
	};
	c.enable = function enable() {
		inputContainer.className = '';
		inputElement.disabled = false;
		inputElement.focus();
	};
	c.disable = function disable() {
		inputContainer.className = 'hidden';
		inputElement.disabled = true;
	};
	c.print = function print(s, style) {
		var elem = document.createElement('span');
		elem.appendChild(document.createTextNode(s));
		if(style) { elem.style = style; }
		outputElement.appendChild(elem);
	};
	c.println = function println(s, style) {
		c.print(s + '\n', style);
	};
	c.clear = function clear() {
		while(outputElement.firstChild) {
			outputElement.removeChild(outputElement.firstChild);
		}
	};
	c.setPrompt = function setPrompt(p, style) {
		while(inputLabel.firstChild) {
			inputLabel.removeChild(inputLabel.firstChild);
		}
		options.prompt = p;
		inputLabel.appendChild(document.createTextNode(p));
		if(style) { inputLabel.style = style; }
	};
	c.consoleMode();
	c.setPrompt(options.prompt);
}
