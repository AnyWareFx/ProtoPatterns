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

    var FX = org.protopatterns;
    var DOM = FX.DOM;
    var VIEW = FX.mvc.view;

    ///////////////////////////////////////////////////////////////////////////////
    //
    // The NullPanelView implements the Null Object pattern for Controller
    //
    VIEW.NullPanelView = Class.create(VIEW.NullView);


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The PanelViewAdapter mix-in provides default, no-op event handlers for the
    // PanelView class.
    //
    VIEW.PanelViewAdapter = {
        'on:edit': function() {
        }
    };
    Object.extend(VIEW.PanelViewAdapter, VIEW.ViewAdapter);


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The PanelView displays an read-only view of a resource. An
    // Edit button provides Controller with a hook for in-place editing.
    //
    VIEW.PanelView = Class.create(VIEW.View, {
        initialize: function($super, container) {
            $super(container);

            this.effect = 'slide';

            container = $(container);
            container.on('click', '.fx-edit', function(event) {
                event.preventDefault();
                container.fire('on:edit', {
                    id: DOM.getResourceID(event.element())
                });
            });
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The PanelViewFactory singleton constructs either a PanelView or a NullPanelView
    //
    VIEW.PanelViewFactory = {
        create: function(container) {
            var panel = null;
            container = $(container);
            if (container) {
                panel = container._view;
                if (!panel && container.hasClassName('fx-panel')) {
                    panel = new VIEW.PanelView(container);
                }
            }
            return panel || new VIEW.NullPanelView();
        }
    };
})();