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
    // Controller Events:
    //      before:during
    //          :create
    //          :add
    //          :edit
    //          :update
    //          :read
    //          :list
    //          :remove
    //      success:failure:complete
    //
    ///////////////////////////////////////////////////////////////////////////////

    var MVC = org.protopatterns.mvc;

    var ACTIONS = [
        'create',
        'add',
        'edit',
        'update',
        'read',
        'list',
        'remove'
    ];

    ///////////////////////////////////////////////////////////////////////////////
    //
    // The NullController implements the Null Object pattern for Controller
    //
    var NullActions = {};
    ACTIONS.each(function(action) {
        NullActions[action] = function() {
        };
    });
    MVC.controller.NullController = Class.create(NullActions, {
        isNullController: function() {
            return true;
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ControllerAdapter mix-in provides default, no-op event handlers for the
    // Controller class.
    //
    MVC.controller.ControllerAdapter = {};
    ACTIONS.each(function(action) {
        ['before', 'during'].each(function(sequence) {
            MVC.controller.ControllerAdapter[sequence + ":" + action] = function() {
            };
        });
        ['success', 'failure', 'complete'].each(function(status) {
            MVC.controller.ControllerAdapter[action + ':' + status] = function() {
            };
        });
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ControllerFacade mix-in provides a simple facade to a pattern's controller
    //
    MVC.controller.ControllerFacade = {};
    ACTIONS.each(function(action) {
        MVC.controller.ControllerFacade[action] = function() {
            this.controller[action].apply(this.controller, arguments);
        };
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The Controller 'class' implements a basic RESTful Controller that knows how
    // to interpret View events and map them to the appropriate Resource methods.
    //
    MVC.controller.Controller = Class.create({
        initialize: function(container, anchor, views) {

            ///////////////////////////////////////////////////////////////////
            //
            // Initialize container, resource and views
            //
            container = $(container);
            container._controller = this;

            this.containerID = container.identify();
            this.resource = MVC.resource.ResourceFactory.create(anchor);
            this._observeResource(container);

            views = views || [];
            if (views.length) {
                views.each(function(viewContainer) {
                    MVC.view.ViewClassFactory.create(viewContainer);
                });
                this._observeViews(container);
            }
        },


        _observeResource: function(container) {
            container.observe('post:success', function(event) {
                var memo = Object.extend({}, event.memo);
                container.fire('add:success', memo);
            });
            container.observe('post:failure', function(event) {
                var memo = Object.extend({}, event.memo);
                container.fire('add:failure', memo);
            });
            container.observe('post:complete', function(event) {
                var memo = Object.extend({}, event.memo);
                container.fire('add:complete', memo);
            });

            container.observe('put:success', function(event) {
                var memo = Object.extend({}, event.memo);
                container.fire('update:success', memo);
            });
            container.observe('put:failure', function(event) {
                var memo = Object.extend({}, event.memo);
                container.fire('update:failure', memo);
            });
            container.observe('put:complete', function(event) {
                var memo = Object.extend({}, event.memo);
                container.fire('update:complete', memo);
            });

            container.observe('delete:success', function(event) {
                var memo = Object.extend({}, event.memo);
                container.fire('remove:success', memo);
            });
            container.observe('delete:failure', function(event) {
                var memo = Object.extend({}, event.memo);
                container.fire('remove:failure', memo);
            });
            container.observe('delete:complete', function(event) {
                var memo = Object.extend({}, event.memo);
                container.fire('remove:complete', memo);
            });
        },

        _observeViews: function(container) {
            var that = this;
            container.observe('on:create', function() {
                that.create();
            });
            container.observe('on:add', function(event) {
                that.add(event.memo.data);
            });
            container.observe('on:edit', function(event) {
                that.edit(event.memo.id);
            });
            container.observe('on:update', function(event) {
                that.update(event.memo.id, event.memo.data);
            });
            container.observe('on:read', function(event) {
                that.read(event.memo.id)
            });
            container.observe('on:list', function(event) {
                that.list(event.memo.query);
            });
            container.observe('on:remove', function(event) {
                that.remove(event.memo.id);
            });
        },

        isNullController: function() {
            return false;
        },


        ///////////////////////////////////////////////////////////////////////////////
        //
        // Controller Actions
        //     create / add
        //     edit / update
        //     read / list
        //     remove
        //
        create: function() {
            var container = $(this.containerID);
            var event = container.fire('before:create');
            if (!event.stopped) {
                container.fire('during:create');
                container.observe('get:success', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('create:success', memo);
                });
                container.observe('get:failure', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('create:failure', memo);
                });
                container.observe('get:complete', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('create:complete', memo);
                    container.stopObserving('get:success');
                    container.stopObserving('get:failure');
                    container.stopObserving('get:complete');
                });
                this.resource.GET("/new");
            }
        },


        add: function(data) {
            var container = $(this.containerID);
            var event = container.fire('before:add', {
                data: data
            });
            if (!event.stopped) {
                container.fire('during:add', {
                    data: data
                });
                this.resource.POST(data);
            }
        },


        edit: function(id) {
            var container = $(this.containerID);
            var event = container.fire('before:edit', {
                id: id
            });
            if (!event.stopped) {
                container.fire('during:edit', {
                    id: id
                });
                container.observe('get:success', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('edit:success', memo);
                });
                container.observe('get:failure', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('edit:failure', memo);
                });
                container.observe('get:complete', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('edit:complete', memo);
                    container.stopObserving('get:success');
                    container.stopObserving('get:failure');
                    container.stopObserving('get:complete');
                });
                this.resource.GET("/" + id);
            }
        },


        update: function(id, data) {
            var container = $(this.containerID);
            var event = container.fire('before:update', {
                id: id,
                data: data
            });
            if (!event.stopped) {
                container.fire('during:update', {
                    id: id,
                    data: data
                });
                this.resource.PUT(id, data);
            }
        },


        read: function(id) {
            var container = $(this.containerID);
            var event = container.fire('before:read', {
                id: id
            });
            if (!event.stopped) {
                container.fire('during:read', {
                    id: id
                });
                container.observe('get:success', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('read:success', memo);
                });
                container.observe('get:failure', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('read:failure', memo);
                });
                container.observe('get:complete', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('read:complete', memo);
                    container.stopObserving('get:success');
                    container.stopObserving('get:failure');
                    container.stopObserving('get:complete');
                });
                this.resource.GET("/" + id);
            }
        },


        list: function(query) {
            var container = $(this.containerID);
            var event = container.fire('before:list', {
                query: query
            });
            if (!event.stopped) {
                container.fire('during:list', {
                    query: query
                });
                container.observe('get:success', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('list:success', memo);
                });
                container.observe('get:failure', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('list:failure', memo);
                });
                container.observe('get:complete', function(event) {
                    var memo = Object.extend({}, event.memo);
                    container.fire('list:complete', memo);
                    container.stopObserving('get:success');
                    container.stopObserving('get:failure');
                    container.stopObserving('get:complete');
                });
                this.resource.GET(query);
            }
        },


        remove: function(id) {
            var container = $(this.containerID);
            var event = container.fire('before:remove', {
                id: id
            });
            if (!event.stopped) {
                container.fire('during:remove', {
                    id: id
                });
                this.resource.DELETE(id);
            }
        },


        setBaseURI: function(uri) {
            this.resource.baseURI = uri;
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ControllerFactory singleton constructs either a Controller, or a NullController
    //
    MVC.controller.ControllerFactory = {
        create: function(container) {
            var controller = null;
            container = $(container);
            if (container) {
                controller = container._controller;
                if (!controller && container.hasClassName('fx-controller')) {
                    var resource = container.select('.fx-resource')[0];
                    if (resource) {
                        var views = container.select(MVC.view.ViewClassFactory.classes);
                        controller = new MVC.controller.Controller(container, resource, views);
                    }
                }
            }
            return controller || new MVC.controller.NullController();
        }
    };
})();