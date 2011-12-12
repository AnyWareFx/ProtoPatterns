(function() {

    var FX = org.protopatterns;
    var DOM = FX.DOM;
    var VIEW = FX.mvc.view;

    var ACTIONS = ['select', 'clearSelection', 'clearSelections', 'highlight'];

    ///////////////////////////////////////////////////////////////////////////////
    //
    // The NullListView implements the Null Object pattern for Controller
    //
    var NullActions = Object.extend({}, VIEW.NullView);
    ACTIONS.each(function(action) {
        NullActions[action] = function() {
        };
    });
    VIEW.NullListView = Class.create(NullActions);

    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ListViewAdapter mix-in provides default, no-op event handlers for the
    // ListView class.
    //
    VIEW.ListViewAdapter = {};
    ['create', 'remove', 'add-to', 'remove-from'].each(function(event) {
        VIEW.ListViewAdapter['on:' + event] = function() {
        };
    });
    ['before', 'during', 'after'].each(function(sequence) {
        ['select', 'clear-selection', 'clear-selections'].each(function(action) {
            VIEW.ListViewAdapter[sequence + ":" + action] = function() {
            };
        });
    });
    Object.extend(VIEW.ListViewAdapter, VIEW.ViewAdapter);


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ListView displays an interactive list to Create, Remove and Edit
    // resources.
    //
    VIEW.ListView = Class.create(VIEW.View, {

        initialize: function($super, container) {
            $super(container);
            var that = this;

            this.policy = "single";
            this.selections = $H({});
            this.resourceMap = $H({});

            container = $(container);
            this._observeMouse(container);
            container.observe('after:render', function() {
                that.selections = $H({});
                that.resourceMap = $H({});
            });
        },


        _observeMouse: function(container) {
            var that = this;
            container.on('click', '.fx-create', function(event) {
                event.stop();
                container.fire('on:create');
            });
            container.on('click', '.fx-remove', function(event) {
                event.stop();
                container.fire('on:remove', {
                    id: DOM.getResourceID(event.element())
                });
            });
            container.on('click', '.fx-add-to', function(event) {
                event.stop();
                container.fire('on:add-to', {
                    id: DOM.getResourceID(event.element())
                });
            });
            container.on('click', '.fx-remove-from', function(event) {
                event.stop();
                container.fire('on:remove-from', {
                    id: DOM.getResourceID(event.element())
                });
            });
            container.on('click', '.fx-selectable', function(event) {
                event.stop();
                var element = event.element();
                var markers = $A(['fx-create', 'fx-remove', 'fx-add-to', 'fx-remove-from']);
                var intersection = $A(element.classNames()).intersect(markers);
                if (intersection.length == 0) {
                    var selectable = element.up('.fx-selectable');
                    that._selectItem(DOM.getResourceID(selectable), selectable);
                }
            });
        },


        /////////////////////////////////////////////////////////////
        //
        //  Actions
        //
        select: function(id) {
            var selectable = this._find(id);
            if (selectable) {
                this._selectItem(id, selectable);
            }
        },


        isSelected: function(id) {
            var item = this._find(id);
            return item && item.hasClassName('fx-selected');
        },


        clearSelection: function(id) {
            var selected = this._find(id);
            if (selected) {
                var container = $(this.containerID);
                var event = container.fire('before:clear-selection', {
                    id: id
                });
                if (!event.stopped) {
                    container.fire('during:clear-selection', {
                        id: id
                    });
                    selected.removeClassName('fx-selected');
                    this.selections.unset(id);
                    container.fire('after:clear-selection', {
                        id: id
                    });
                }
            }
        },


        clearSelections: function() {
            if (this.selections.values().length) {
                var container = $(this.containerID);
                var event = container.fire('before:clear-selections');
                if (!event.stopped) {
                    container.fire('during:clear-selections');
                    this._clearSelections();
                    container.fire('after:clear-selections');
                }
            }
        },


        highlight: function(id) {
            var item = this._find(id);
            if (item) {
                item.highlight();
            }
        },


        /////////////////////////////////////////////////////////////
        //
        //  'Protected' Methods
        //
        _selectItem: function(id, selectable) {
            var container = $(this.containerID);
            var listEvent = container.fire('before:select', {
                id: id
            });
            if (!listEvent.stopped) {
                container.fire('during:select', {
                    id: id
                });
                this._select(id, selectable);
                container.fire('after:select', {
                    id: id
                });
            }
        },


        _select: function(id, selectable) {
            if (selectable) {
                if (this.policy == VIEW.ListView.SELECTION_POLICY.SINGLE_SELECT) {
                    this._clearSelections();
                }
                selectable.addClassName('fx-selected');
                this.selections.set(id, selectable);
            }
        },


        _clearSelections: function() {
            this.selections.values().each(function(selected) {
                selected.removeClassName('fx-selected');
            });
            var that = this;
            var selections = this.selections.keys().clone();
            selections.each(function(id) {
                that.selections.unset(id);
            });
        },


        _find: function(id) {
            var item = this.resourceMap.get(id);
            if (!item) {
                item = $(this.containerID).select('.fx-selectable').detect(function(candidate) {
                    return DOM.getResourceID(candidate) == id;
                });
                if (item) {
                    this.resourceMap.set(id, item);
                }
            }
            return item;
        }
    });


    VIEW.ListView.SELECTION_POLICY = {
        SINGLE_SELECT: "single",
        MULTI_SELECT: "multi"
    };


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ListViewFactory singleton constructs either a ListView or a NullListView
    //
    VIEW.ListViewFactory = {
        create: function(container) {
            var list = null;
            container = $(container);
            if (container) {
                list = container._view;
                list = new VIEW.ListView(container);
            }
            else {
                list = new VIEW.NullListView();
            }
            return list;
        }
    };
})();