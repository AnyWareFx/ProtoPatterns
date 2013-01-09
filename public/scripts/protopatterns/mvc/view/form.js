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

    var ACTIONS = ['enable', 'disable', 'serialize'];

    ///////////////////////////////////////////////////////////////////////////////
    //
    // The NullFormView implements the Null Object pattern for Controller
    //
    var NullActions = Object.extend({}, VIEW.NullView);
    ACTIONS.each(function(action) {
        NullActions[action] = function() {
        };
    });
    VIEW.NullFormView = Class.create(NullActions, {
        isDirty: function() {
            return false;
        }
    });

    ///////////////////////////////////////////////////////////////////////////////
    //
    // The FormViewAdapter mix-in provides default, no-op event handlers for the
    // FormView class.
    //
    VIEW.FormViewAdapter = {};
    ['add', 'update', 'cancel', 'remove'].each(function(event) {
        VIEW.FormViewAdapter['on:' + event] = function() {
        };
    });
    ['before', 'during', 'after'].each(function(sequence) {
        ['enable', 'disable'].each(function(action) {
            VIEW.FormViewAdapter[sequence + ":" + action] = function() {
            };
        });
    });
    Object.extend(VIEW.FormViewAdapter, VIEW.ViewAdapter);


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The FormView displays an interactive form to Add, Update or Remove
    // a resource.
    //
    VIEW.FormView = Class.create(VIEW.View, {

        initialize: function($super, container) {
            $super(container);

            this.memento = null;
            this.effect = 'slide';

            container = $(container);
            this._observeKeyboard(container);
            this._observeMouse(container);
        },


        _observeMouse: function(container) {
            var that = this;
            container.on('click', '.fx-add', function(event) {
                event.preventDefault();
                container.fire('on:add', {
                    data: that.serialize()
                });
            });
            container.on('click', '.fx-update', function(event) {
                event.preventDefault();
                container.fire('on:update', {
                    id: DOM.getResourceID(event.element()),
                    data: that.serialize()
                });
            });
            container.on('click', '.fx-cancel', function(event) {
                event.preventDefault();
                container.fire('on:cancel');
            });
            container.on('click', '.fx-remove', function(event) {
                event.preventDefault();
                container.fire('on:remove', {
                    id: DOM.getResourceID(event.element())
                });
            });
        },


        _observeKeyboard: function(container) {
            container.on('keyup', function(event) {
                if (event.keyCode == 13) { // ENTER
                    event.preventDefault();
                    if (event.element().tagName.toLowerCase() != 'textarea') {
                        var add = container.select('.fx-add')[0];
                        if (add) {
                            add.fire('click');
                        }
                        else {
                            var update = container.select('.fx-update')[0];
                            if (update) {
                                update.fire('click');
                            }
                        }
                    }
                }
                else if (event.keyCode == 27) { // ESC
                    container.fire('on:cancel');
                }
            });
        },


        /////////////////////////////////////////////////////////////
        //
        //  Actions
        //
        /////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////
        //  View 'overrides'
        show: function($super) {
            $super();
            var container = $(this.containerID);
            var form = container.select('form')[0];
            if (form) {
                this.memento = null;
                this.memento = this.serialize();
                var update = container.select('.fx-update')[0];
                if (update) {
                    Form.Element.disable(update);
                }
                // TODO Focus first fx-invalid element or first element
                form.focusFirstElement(); // TODO Bug - determine why this doesn't always work
            }
        },

        hide: function($super) {
            $super();
            this.memento = null;
        },

        render: function($super, data) {
            $super(data);
            var that = this;
            var container = $(this.containerID);
            var update = container.select('.fx-update')[0];
            if (update) {
                var form = container.select('form')[0];
                if (form) {
                    new Form.Observer(form, 0.25, function() {
                        if (that.isDirty()) {
                            Form.Element.enable(update);
                        }
                        else {
                            Form.Element.disable(update);
                        }
                    });
                }
            }
        },


        /////////////////////////////////////////////////////////////
        //  Form-specific actions
        enable: function() {
            var container = $(this.containerID);
            var event = container.fire('before:enable');
            if (!event.stopped) {
                container.fire('during:enable');
                var form = container.select('form')[0];
                if (form && container.visible()) {
                    form.enable();
                    container.fire('after:enable');
                    // TODO Enable buttons
                }
            }
        },

        disable: function() {
            var container = $(this.containerID);
            var event = container.fire('before:disable');
            if (!event.stopped) {
                container.fire('during:disable');
                var form = container.select('form')[0];
                if (form && container.visible()) {
                    form.disable();
                    container.fire('after:disable');
                    // TODO Disable buttons
                }
            }
        },


        /////////////////////////////////////////////////////////////
        //
        //  Serialization, Memento Stuff
        //
        serialize: function() {
            var form = $(this.containerID).select('form')[0];
            return form ? Object.toJSON(form.serialize(true)) : '';
        },


        isDirty: function() {
            var dirty = false;
            if (this.memento) {
                var data = this.serialize();
                dirty = data ? this.memento != data : false;
            }
            return dirty;
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The FormViewFactory singleton constructs either a FormView or a NullFormView
    //
    VIEW.FormViewFactory = {
        create: function(container) {
            var form = null;
            container = $(container);
            if (container) {
                form = container._view;
                if (!form && container.hasClassName('fx-form')) {
                    form = new VIEW.FormView(container);
                }
            }
            return form || new VIEW.NullFormView();
        }
    };
})();