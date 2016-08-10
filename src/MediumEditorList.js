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
        // call inside a timeout to send at the end of the event stack. Needed when used with angular.
        (function (self) {
            window.setTimeout(function () {
                self.initExistsingLists();
            }, 0);
        })(me);
    },
    initExistsingLists: function () {
        var $lists = this.getExistsingLists(),
                x = 0, length = $lists.length, list;
        for (; x < length; x += 1) {
            list = new List(this, this.options).init($lists[x]);
            this.addList(list);
        }
    },
    getExistingLists: function () {
        var $lists = this.editor.origElements[0]
            ? this.editor.origElements[0].querySelector('ul.' + MEDIUM_EDITOR_CLASS)
            : this.editor.origElements.querySelector('ul.' + MEDIUM_EDITOR_CLASS);
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
