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

    ///////////////////////////////////////////////////////////////////////////////
    //
    // View Events:
    //      before:during:after
    //          :show
    //          :hide
    //          :render
    //
    //      render:failure
    //      initialize:failure
    //
    ///////////////////////////////////////////////////////////////////////////////

    var FX = org.protopatterns;
    var VIEW = FX.mvc.view;

    var ACTIONS = ['show', 'hide', 'render'];

    ///////////////////////////////////////////////////////////////////////////////
    //
    // The NullView implements the Null Object pattern for Controller
    //
    var NullActions = {};
    ACTIONS.each(function(action) {
        NullActions[action] = function() {
        };
    });

    VIEW.NullView = Class.create(NullActions, {
        isNullView: function() {
            return true;
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ViewAdapter mix-in provides default, no-op event handlers for the
    // View class.
    //
    VIEW.ViewAdapter = {};
    ['before', 'during', 'after'].each(function(event) {
        ACTIONS.each(function(action) {
            VIEW.ViewAdapter[event + ":" + action] = function() {
            };
        });
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The View 'class' knows how to render data to a given container using a template
    //
    VIEW.View = Class.create({

        initialize: function(container) {
            container = $(container);
            container._view = this;

            this.containerID = container.identify();
            this.effect = 'appear';
            this._initTemplate(container);
        },

        _initTemplate: function(container) {
            var intersection = $A(container.classNames()).intersect(VIEW.ViewClassFactory._classes);
            if (intersection.length == 1) {
                var marker = "." + intersection[0] + "-template";
                var templates = container.up().select(marker);
                if (templates.length == 1) {
                    var template = templates[0];
                    this.templateID = template.identify();
                    var that = this;
                    template.observe('load:success', function() {
                        that.render();
                        container.fire('initialize:success');
                    });
                    template.observe('load:failure', function(event) {
                        container.fire('initialize:failure', Object.extend({}, event.memo.data));
                    });
                    FX.TemplateClassFactory.create(template).load();
                }
            }
        },

        isNullView: function() {
            return false;
        },


        /////////////////////////////////////////////////////////////
        //
        //  Actions
        //
        show: function() {
            var container = $(this.containerID);
            if (!container.visible()) {
                var event = container.fire('before:show');
                if (!event.stopped) {
                    container.fire('during:show');
                    Effect.toggle(container, this.effect, {
                        duration: 0.25,
                        afterFinish: function() {
                            container.fire('after:show');
                        }
                    });
                }
            }
        },


        hide: function() {
            var container = $(this.containerID);
            if (container.visible()) {
                var event = container.fire('before:hide');
                if (!event.stopped) {
                    container.fire('during:hide');
                    Effect.toggle(container, this.effect, {
                        duration: 0.25,
                        afterFinish: function() {
                            container.fire('after:hide');
                        }
                    });
                }
            }
        },


        render: function(data) {
            this.data = this.data || data;
            var template = $(this.templateID)._template;
            if (this.data && template) {
                var container = $(this.containerID);
                var event = container.fire('before:render');
                if (!event.stopped) {
                    container.fire('during:render');
                    template.render(data, $(this.containerID));
                    container.fire('after:render');
                    this.data = null;
                }
            }
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ViewFactory singleton constructs either a View or a NullView
    //
    VIEW.ViewFactory = {
        create: function(container) {
            var view = null;
            container = $(container);
            if (container) {
                view = container._view;
                if (!view && container.hasClassName('fx-view')) {
                    view = new VIEW.View(container);
                }
            }
            return view || new VIEW.NullView();
        }
    };


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ViewClassFactory singleton constructs a View or one of its subclasses based
    // on the given container. This factory allows a Controller to iterate through its
    // list of view containers and construct the corresponding view class for each.
    //
    VIEW.ViewClassFactory = {
        classes: ['.fx-view', '.fx-panel', '.fx-form', '.fx-list'],
        _classes: ['fx-view', 'fx-panel', 'fx-form', 'fx-list'],
        create: function(container) {
            var view = null;
            container = $(container);
            if (container) {
                view = container._view;
                if (!view) {
                    if (container.hasClassName('fx-view')) {
                        view = VIEW.ViewFactory.create(container);
                    }
                    else if (container.hasClassName('fx-panel')) {
                        view = VIEW.PanelViewFactory.create(container);
                    }
                    else if (container.hasClassName('fx-form')) {
                        view = VIEW.FormViewFactory.create(container);
                    }
                    else if (container.hasClassName('fx-list')) {
                        view = VIEW.ListViewFactory.create(container);
                    }
                }
            }
            return view || new VIEW.NullView();
        }
    };


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The static View onRender() callback provides a single hook for system-wide view
    // notifications, specifically that a render action has occurred. This provides a hook
    // for an Application-level singleton to 'auto-initialize' as new content is loaded
    //
    VIEW.View.onRender = function() {
    };
})();