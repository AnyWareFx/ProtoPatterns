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