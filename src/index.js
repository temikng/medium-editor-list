var MediumEditor = require('medium-editor');


var DisableContextMenuExtension = MediumEditor.Extension.extend({
    name: 'list-extension'
});

var editor = new MediumEditor(document.getElementById('editor'), {});


