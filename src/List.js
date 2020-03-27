var List = function (extension, options) {
    var me = this,
            $document = extension.document,
            editor = extension.base,
            $editorElement = editor.origElements[0] || editor.origElements,
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
        content = content ? '<li>' + content + '</li>' : options.newParagraphTemplate;
        var htmlData = '<ul class="' + MEDIUM_EDITOR_CLASS + '" ' + ID_ATTRIBUTE + '="' + time + '">'
            + content
            + getAddParagraphTemplate()
            + '</ul>';
        editor.pasteHTML(htmlData, { cleanAttrs: [] });
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
        if (options.addParagraphTemplate === '') {
            return '';
        }
        return '<li class="' + ADD_PARAGRAPH_CLASS + '">' + options.addParagraphTemplate + '</li>';
    }
};
