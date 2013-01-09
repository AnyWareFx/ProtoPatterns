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

    var ACTIONS = ['show', 'hide', 'cancel'];

    var NullActions = Object.extend({}, MVC.controller.NullController);
    ACTIONS.each(function(action) {
        NullActions[action] = function() {
        };
    });
    Object.extend(NullActions, {
        isDirty: function() {
            return false;
        }
    });
    PATTERN.NullListManager = Class.create(PATTERN.NullPattern, NullActions);


    var BaseState = {};
    Object.extend(BaseState, MVC.view.FormViewAdapter);
    Object.extend(BaseState, MVC.view.ListViewAdapter);
    Object.extend(BaseState, MVC.controller.ControllerAdapter);
    Object.extend(BaseState, {
        'before:create': function(event) {
            if (this.formView.isDirty() && !confirm("Do you want to discard your changes?")) {
                event.stop();
            }
        },
        'create:success': function(event) {
            this.listView.clearSelections();
            this.formView.render(event.memo.data);
            this.formView.show();
        },
        'before:select': function(event) {
            if (this.formView.isDirty() && !confirm("Do you want to discard your changes?")) {
                event.stop();
            }
        },
        'after:select': function(event) {
            this.controller.edit(event.memo.id);
        },
        'edit:success': function(event) {
            this.formView.render(event.memo.data);
            // TODO Position to selected list item - style form with drop shadow
            this.formView.show();
        },
        'before:remove': function(event) {
            if (this.formView.isDirty() && !confirm("Do you want to discard your changes?")) {
                event.stop();
            }
            else {
                // TODO Determine how to fix hide() & highlight() - Is confirm() modal?
                // Something halts execution of effects
                this.formView.hide();
                this.listView.highlight(event.memo.id);
                if (!confirm("Do you want to remove this item?")) {
                    event.stop();
                }
            }
        },
        'remove:success': function() {
            this.controller.list();
        },
        'list:success': function(event) {
            this.listView.render(event.memo.data);
        }
    });


    var ListState = Object.extend({}, BaseState);
    Object.extend(ListState, {
        'after:show': function() {
            this._changeState(FormState);
        }
    });


    var FormState = Object.extend({}, BaseState);
    Object.extend(FormState, {
        'after:hide': function() {
            this.listView.clearSelections();
            this._changeState(ListState);
        },
        'add:success': function() {
            this.formView.hide();
            this.controller.list();
        },
        'add:failure': function(event) {
            this.formView.render(event.memo.data);
        },
        'update:success': function() {
            this.formView.hide();
            this.controller.list();
        },
        'update:failure': function(event) {
            this.formView.render(event.memo.data);
        },
        'on:cancel': function() {
            if (!this.formView.isDirty() || confirm("Do you want to discard your changes?")) {
                this.cancel();
            }
        }
    });


    PATTERN.ListManager = Class.create(PATTERN.Pattern, {
        initialize: function($super, container, controller, list, form) {
            $super(container);
            var that = this;

            this.controller = MVC.controller.ControllerFactory.create(controller);
            Object.extend(this, MVC.controller.ControllerFacade);

            form.setStyle({
                display: 'none'
            });
            this.formView = form._view;
            this.listView = list._view;

            $H(BaseState).keys().each(function(type) {
                container.observe(type, function(event) {
                    that[type](event);
                });
            });
            this._changeState(ListState);
        },

        show: function() {
            this.listView.show();
        },

        hide: function() {
            this.cancel();
            this.listView.hide();
        },

        isDirty: function() {
            return this.formView.isDirty();
        },

        cancel: function() {
            this.formView.hide();
        },

        setBaseURI: function(uri) {
            this.controller.setBaseURI(uri);
        },

        _changeState: function(state) {
            Object.extend(this, state);
        }
    });


    PATTERN.ListManagerFactory = {
        create: function(container) {
            var pattern = null;

            container = $(container);
            if (container) {
                pattern = container._pattern;
                if (!pattern && container.hasClassName('fx-list-manager')) {
                    var controllers = container.hasClassName('fx-controller') ? [container] : [];
                    var lists = container.select('.fx-list');
                    var forms = container.select('.fx-form');
                    if (controllers.length == 1 && lists.length == 1 && forms.length == 1) {
                        pattern = new PATTERN.ListManager(container,
                                controllers[0], lists[0], forms[0]);
                    }
                }
            }
            return pattern || new PATTERN.NullListManager();
        }
    }
})();