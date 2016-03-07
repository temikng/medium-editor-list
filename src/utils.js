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