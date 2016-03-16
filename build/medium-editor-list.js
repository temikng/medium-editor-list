(function (root, factory) {
    'use strict';
    if (typeof module === 'object') {
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.MediumEditorList = factory;
    }
}(this, function (MediumEditor) {
    
function isDefined(object) {
    return typeof object !== 'undefined' && object !== null;
}

function placeCaretAtNode(doc, node, before) {
    if (doc.getSelection !== undefined && node) {
        var range = doc.createRange(),
                selection = doc.getSelection();

        if (before) {
            range.setStartBefore(node);
        } else {
            range.setStartAfter(node);
        }

        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
    }
}

if (typeof Object.assign !== 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}
var ADD_PARAGRAPH_CLASS = 'medium-editor-list-add-paragraph',
        ID_ATTRIBUTE = 'data-medium-editor-list-id',
        MEDIUM_EDITOR_CLASS = 'medium-editor-list';

var List = function (extension, options) {
    var me = this,
            $document = extension.document,
            editor = extension.base,
            $editorElement = editor.origElements,
            $addParagraph,
            $paragraphs,
            $element,
            id;
    me.init = init;
    me.create = create;
    me.show = showAddParagraph;
    me.getId = getId;

    function init($list) {
        $element = $list;
        findAddParagraph();
        extension.on($addParagraph, 'click', onAddParagraphClick);
        extension.on($editorElement, 'click', toggleAddListParagraphOnEditorClick);
        id = Number($list.getAttribute(ID_ATTRIBUTE));
        return me;
    }

    function create(content) {
        var time = new Date().getTime(), $list;
        content = content ? '<li>' + content + '<li>' : options.newParagraphTemplate;
        editor.pasteHTML('<ul class="' + MEDIUM_EDITOR_CLASS + '" ' + ID_ATTRIBUTE + '="' + time + '">'
                + ' <li>' + content + '</li>'
                + getAddParagraphTemplate()
                + '</ul><br/>', {
                    cleanAttrs: []
                });
        $list = $editorElement.querySelector('ul[' + ID_ATTRIBUTE + '="' + time + '"].' + MEDIUM_EDITOR_CLASS);
        return init($list);
    }

    function getId() {
        return id;
    }

    function onAddParagraphClick() {
        $addParagraph.insertAdjacentHTML('beforebegin', options.newParagraphTemplate);
        findParagrpahs();
        placeCaretAtNode($document, $paragraphs[$paragraphs.length - 2], true);
        showAddParagraph();
    }

    function toggleAddListParagraphOnEditorClick() {
        if (isCaretInsideList()) {
            showAddParagraph();
        } else {
            hideAddParagraph();
        }
    }

    function isCaretInsideList() {
        var range = MediumEditor.selection.getSelectionRange($document),
                $parent = MediumEditor.selection.getSelectedParentElement(range),
                closest = MediumEditor.util.getClosestTag($parent, 'li');
        if (closest) {
            return Number(closest.parentElement.getAttribute(ID_ATTRIBUTE)) === id;
        }
        return false;
    }

    function showAddParagraph() {
        if (isEditable() === false) {
            return;
        }
        if (isAddParagraphExists()) {
            display($addParagraph, 'block');
        } else {
            createAddParagpraph();
            display($addParagraph, 'block');
        }
    }

    function isAddParagraphExists() {
        return isDefined($element.querySelector('.' + ADD_PARAGRAPH_CLASS));
    }

    function createAddParagpraph() {
        $element.insertAdjacentHTML('beforeend', getAddParagraphTemplate());
        findParagrpahs();
        findAddParagraph();
    }

    function findAddParagraph() {
        $addParagraph = $element.querySelector('.' + ADD_PARAGRAPH_CLASS);
    }

    function hideAddParagraph() {
        if ($addParagraph) {
            $addParagraph.style.display = 'none';
        }
    }

    function isEditable() {
        return options.isEditable === true;
    }

    function display($element, state) {
        $element.style.display = state;
    }

    function findParagrpahs() {
        $paragraphs = $element.querySelectorAll('li');
    }

    function getAddParagraphTemplate() {
        return '<li class="' + ADD_PARAGRAPH_CLASS + '">' + options.addParagraphTemplate + '</li>';
    }
};

var MediumEditorList = MediumEditor.Extension.extend({
    name: 'list-extension',
    init: function () {
        var me = this;
        me.options = Object.assign({}, {
            newParagraphTemplate: '<li>...</li>',
            buttonTemplate: '<b>List</b>',
            addParagraphTemplate: 'Add new paragraph',
            isEditable: true
        }, (me.base.options.mediumEditorList || {}));
        me.button = me.document.createElement('button');
        me.button.classList.add('medium-editor-action');
        me.button.innerHTML = me.options.buttonTemplate;
        me.editor = this.base;
        me.listInstances = {};
        me.on(me.button, 'click', me.onClick.bind(me));
        me.initExistsingLists();
    },
    initExistsingLists: function () {
        var $lists = this.getExistsingLists(),
                x = 0, length = $lists.length, list;
        for (; x < length; x += 1) {
            list = new List(this, this.options).init($lists[x]);
            this.addList(list);
        }
    },
    getExistsingLists: function () {
        var $lists = this.editor.origElements.querySelector('ul.' + MEDIUM_EDITOR_CLASS);
        return isDefined($lists) ? $lists : [];
    },
    getButton: function () {
        return this.button;
    },
    onClick: function () {
        var list = this.getCurrentList();
        if (isDefined(list)) {
            list.show();
        } else {
            list = new List(this, this.options).create(this.getSelectedContextHtml());
            this.addList(list);
            //.placeCaretAtNode(this.document, elements[elements.length - 2], false);
        }
    },
    addList: function (list) {
        this.listInstances[list.getId()] = list;
    },
    getSelectedContextHtml: function () {
        var $fakeDiv = this.document.createElement('div'),
                $context = MediumEditor.selection.getSelectionRange(this.document).cloneContents().cloneNode(true);
        $fakeDiv.appendChild($context);
        return $fakeDiv.innerHTML;

    },
    getCurrentList: function () {
        var range = MediumEditor.selection.getSelectionRange(this.document),
                $parent = MediumEditor.selection.getSelectedParentElement(range),
                closest = MediumEditor.util.getClosestTag($parent, 'li'),
                id;
        if (closest) {
            id = closest.parentElement.getAttribute(ID_ATTRIBUTE);
            return this.listInstances[Number(id)];
        }
    }
});

    return MediumEditorList;
}(typeof require === 'function' ? require('medium-editor') : MediumEditor)));