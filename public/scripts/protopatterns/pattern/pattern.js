/*
 Copyright (c) 2013 Dave Jackson

 MIT License

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function() {

    org.protopatterns.pattern = {};
    var PATTERN = org.protopatterns.pattern;


    PATTERN.NullPattern = Class.create({
        isNullPattern: function() {
            return true;
        }
    });


    PATTERN.Pattern = Class.create({
        initialize: function(container) {
            container._pattern = this;
            this.containerID = container.identify();
        },

        isNullPattern: function() {
            return false;
        }
    });


    PATTERN.Pattern.autoInitialize = function(context) {
        context.select('.fx-pattern').each(function(container) {
            PATTERN.PatternClassFactory.create(container);
        });
    };


    PATTERN.PatternClassFactory = {
        create: function(container) {
            var pattern = null;
            container = $(container);

            if (container.hasClassName('fx-in-context-editor')) {
                pattern = PATTERN.InContextEditorFactory.create(container);
            }
            else if (container.hasClassName('fx-list-manager')) {
                pattern = PATTERN.ListManagerFactory.create(container);
            }
            else if (container.hasClassName('fx-pick-list')) {
                pattern = PATTERN.PickListFactory.create(container);
            }
            else if (container.hasClassName('fx-detail-manager')) {
                pattern = PATTERN.DetailManagerFactory.create(container);
            }
            return pattern;
        }
    };
})();