# MediumEditor List

 It is simple list extension with "Add new paragraph" option     for [MediumEditor](https://github.com/yabwe/medium-editor).

## Install

You can install manually or either by using npm:

```
npm install medium-editor-list
```

## Usage

```html
<!DOCTYPE html>
<html>
    <head>
        <title>MediumEditor List</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="<path_to_medium-editor>/dist/css/medium-editor.min.css" type="text/css" media="screen" charset="utf-8">
        <style>
            body, p, div {
                margin: 0;
                padding: 0;
            }
            #editor{ width: 100%; height: 100vh; }
        </style>
    </head>
    <body>
        <div id="editor"></div>
        <script src="<path_to_medium-editor>/dist/js/medium-editor.js" type="text/javascript"></script>
        <script src="<path_to_medium-editor_list>/build/medium-editor-list.js" type="text/javascript"></script>
        <script>
            var editor = new MediumEditor(document.getElementById('editor'), {
                toolbar: {
                    buttons: ['bold', 'italic', 'underline', 'list-extension']
                },
                extensions: {
                    'list-extension': new MediumEditorList()
                },
                mediumEditorList: {
                    newParagraphTemplate: '<li>...</li>',
                    buttonTemplate: '<b>List</b>',
                    addParagraphTemplate: 'Add new paragraph',
                    isEditable: true
                }
            });
        </script>
    </body>
</html>
```

## Options

Options to customize medium-editor-list are passed as the argument of the MediumEditor options. Example:

```javascript
            var editor = new MediumEditor(document.getElementById('editor'), {
                toolbar: {
                    buttons: ['bold', 'italic', 'underline', 'list-extension']
                },
                extensions: {
                    'list-extension': new MediumEditorList()
                },
                mediumEditorList: {
                    newParagraphTemplate: '<li>...</li>',
                    buttonTemplate: '<b>List</b>',
                    addParagraphTemplate: 'Add new paragraph',
                    isEditable: true
                }
            });
```

 *  **newParagraphTemplate** - template for new paragraph adding by "Add new Paragraph" button
 *  **buttonTemplate** - toolbar button template
 *  **addParagraphTemplate** - "Add new Paragraph" button template
 *  **isEditable** - if this flag is set to **false** Add new Paragraph button will not be display.

## How to run example page?

 Clone repository and:
```
 npm install
 gulp
```

## License

https://github.com/mkawczynski07/medium-editor-list/blob/master/LICENSE.md