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

    var MVC = org.protopatterns.mvc;
    var PATTERN = org.protopatterns.pattern;


    PATTERN.NullCrossReferenceManager = Class.create(PATTERN.NullPattern, {
        list: function() {
        }
    });


    PATTERN.CrossReferenceManager = Class.create(PATTERN.Pattern, {
        initialize: function($super, container, detailManager, pickList) {
            $super(container);

            this.detailManager = detailManager;
            this.pickList = pickList;
            var srcList = container.select('.fx-source .fx-list')[0]._view;

            var masterContainer = container.select('.fx-master')[0];
            masterContainer.observe('after:select', function() {
                srcList.clearSelections();
            });
        },

        list: function() {
            this.detailManager.list();
            this.pickList.list();
        }
    });


    PATTERN.CrossReferenceManagerFactory = {
        create: function(container) {
            var pattern = null;

            var detailManager = PATTERN.DetailManagerFactory.create(container);
            var pickList = PATTERN.PickListFactory.create(container);

            if (!detailManager.isNullPattern() && !pickList.isNullPattern()) {
                pattern = new PATTERN.CrossReferenceManager(container, detailManager, pickList);
            }
            return pattern || new PATTERN.NullCrossReferenceManager();
        }
    }
})();