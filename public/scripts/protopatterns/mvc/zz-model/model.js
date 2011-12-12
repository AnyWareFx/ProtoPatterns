(function() {

    ///////////////////////////////////////////////////////////////////////////////
    //
    // Model Events:
    //      before:set
    //      property:changed
    //
    //  As a ControllerFacade, fires its events as well
    //
    ///////////////////////////////////////////////////////////////////////////////

    var MVC = com.webwarefx.mvc;

    ///////////////////////////////////////////////////////////////////////////////
    //
    // The NullModel implements the Null Object pattern for Model
    //
    MVC.model.NullModel = Class.create({
        get: function(property) {
        },
        set: function(property, value) {
        },
        isNullModel: function() {
            return true;
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ModelAdapter mix-in provides default, no-op event handlers for the
    // Model class.
    //
    MVC.model.ModelAdapter = Object.extend({
        'before:set': function() {
        },
        'property:changed': function() {
        }
    }, MVC.controller.ControllerAdapter);


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The Resource 'class' represents a RESTful resource with the HTTP
    // verbs for methods
    //
    MVC.model.Model = Class.create({

        initialize: function(controller) {
            this.controller = controller;
            this.validators = [];

            ///////////////////////////////////////////////////////////////////
            //
            // Initialize Controller event handlers
            //
            ///////////////////////////////////////////////////////////////////
            var that = this;

            controller.container.observe('create:success', function(event) {
                Object.extend(that, event.memo.data);
            });

            controller.container.observe('edit:success', function(event) {
                Object.extend(that, event.memo.data);
            });

            controller.container.observe('read:success', function(event) {
                Object.extend(that, event.memo.data);
            });

            controller.container.observe('remove:success', function(event) {
                // TODO Remove event handlers and release references
                Object.extend(that, MVC.model.NullModel, MVC.controller.NullController);
            });

            controller.container.observe('list:success', function(event) {
                var models = [];
                // TODO Iterate model data and construct models, extend event.memo and forward event
            });
        },

        get: function(property) {
            return this[property];
        },

        set: function(property, value) {
            var oldValue = this[property];
            if (oldValue !== value) {
                var event = this.controller.container.fire('before:change', {
                    model: this,
                    property: property,
                    oldValue: oldValue,
                    newValue: value
                });
                if (!event.stopped) {
                    this[property] = value;
                    this.controller.container.fire('property:changed', {
                        model: this,
                        property: property,
                        oldValue: oldValue,
                        newValue: value
                    });
                }
            }
        },

        isNullModel: function() {
            return false;
        }

    }, MVC.controller.ControllerFacade);


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ModelFactory singleton constructs either a Model, or a NullModel
    //
    MVC.model.ModelFactory = {
        create: function(container) {
            var model = null;
            var controller = MVC.controller.ControllerFactory.create(container);
            if (!controller.isNullController()) {
                model = new MVC.model.Model(controller);
            }
            return model || new MVC.model.NullModel();
        }
    };
})();