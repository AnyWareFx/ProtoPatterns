(function() {

    var MVC = org.protopatterns.mvc;
    var PATTERN = org.protopatterns.pattern;


    PATTERN.NullInContextEditor = Class.create(PATTERN.NullPattern, {
        read: function() {
        },
        edit: function() {
        }
    });


    var BaseState = {};
    Object.extend(BaseState, MVC.view.FormViewAdapter);
    Object.extend(BaseState, MVC.view.PanelViewAdapter);
    Object.extend(BaseState, MVC.controller.ControllerAdapter);


    var InitialState = Object.extend({}, BaseState);
    Object.extend(InitialState, {
        'after:show': function(event) {
            if (event.element() == $(this.formView.containerID)) {
                this._changeState(FormState);
            }
            else {
                this._changeState(PanelState);
            }
        },
        'edit:success': function(event) {
            var data = event.memo.data;
            this.panelView.render(data);
            this.formView.render(data);
            this.formView.show();
        },
        'read:success': function(event) {
            var data = event.memo.data;
            this.panelView.render(data);
            this.formView.render(data);
            this.panelView.show();
        }
    });


    var PanelState = Object.extend({}, BaseState);
    Object.extend(PanelState, {
        'after:show': function() {
            this.panelView.hide();
        },
        'after:hide': function() {
            this._changeState(FormState);
        },
        'edit:success': function(event) {
            var data = event.memo.data;
            this.panelView.render(data);
            this.formView.render(data);
            this.formView.show();
        },
        'edit:failure': function(event) {
            this.panelView.render(event.memo.data);
        }
    });


    var FormState = Object.extend({}, BaseState);
    Object.extend(FormState, {
        'after:show': function() {
            this.formView.hide();
        },
        'after:hide': function() {
            this._changeState(PanelState);
        },
        'update:success': function(event) {
            var data = event.memo.data;     // Expects updated model to be returned
            this.panelView.render(data);
            this.formView.render(data);
            this.panelView.show();
        },
        'update:failure': function(event) {
            this.formView.render(event.memo.data);
        },
        'on:cancel': function() {
            if (!this.formView.isDirty() || confirm("Do you want to discard your changes?")) {
                this.panelView.show();
            }
        }
    });


    PATTERN.InContextEditor = Class.create(PATTERN.Pattern, {
        initialize: function($super, container, controller, form, panel) {
            $super(container);
            var that = this;

            this.controller = MVC.controller.ControllerFactory.create(controller);

            form.setStyle({
                display: 'none'
            });
            panel.setStyle({
                display: 'none'
            });
            this.formView = form._view;
            this.panelView = panel._view;

            $H(InitialState).keys().each(function(type) {
                container.observe(type, function(event) {
                    that[type](event);
                });
            });
            this._changeState(InitialState);
        },

        read: function(id) {
            this.controller.read(id);
        },

        edit: function(id) {
            this.controller.edit(id);
        },

        _changeState: function(state) {
            Object.extend(this, state);
        }
    });


    PATTERN.InContextEditorFactory = {
        create: function(container) {
            container = $(container);
            var pattern = container._pattern;
            if (!pattern) {
                var controllers = container.hasClassName('fx-controller') ? [container] : [];
                controllers.concat(container.select('.fx-controller'));
                var forms = container.select('.fx-form');
                var panels = container.select('.fx-panel');
                if (controllers.length == 1 && forms.length == 1 && panels.length == 1) {
                    pattern = new PATTERN.InContextEditor(container,
                            controllers[0], forms[0], panels[0]);
                }
            }
            return pattern || PATTERN.NullInContextEditor();
        }
    };
})();