(function() {

    var FX = org.protopatterns;
    var MVC = FX.mvc;
    var PATTERN = FX.pattern;


    PATTERN.XRefList = {
        _getOwner: function (id) {
            var owner = null;
            var item = this._find(id);
            if (item) {
            }
            return owner;
        }
    };


    PATTERN.NullPickList = Class.create(PATTERN.NullPattern, {
        list: function() {
        }
    });


    PATTERN.PickList = Class.create(PATTERN.Pattern, {
        initialize: function($super, container, srcController, dstListManager, transform) {
            $super(container);
            var that = this;

            this.srcController = srcController;
            var srcContainer = $(srcController.containerID);
            var srcListView = srcContainer.select('.fx-list')[0]._view;
            srcListView.policy = MVC.view.ListView.SELECTION_POLICY.MULTI_SELECT;

            this.dstListManager = dstListManager;

            var transformer = new FX.Transformer(transform);


            var map = $H({}); // Map of Destination ID's to Source ID's
            var actions = $H({
                start: {
                    target: this.srcController,
                    method: 'read',
                    next: 'transform'
                },
                transform: {
                    target: transformer,
                    next: 'add'
                },
                add: {
                    target: this.dstListManager
                }
            });
            var transaction = new FX.Transaction(container, actions);
            container.observe('transaction:complete', function() {
                container.stopObserving('transaction:success');
                container.stopObserving('transaction:failure');
            });


            srcContainer.observe('list:success', function(event) {
                srcListView.render(event.memo.data);
            });
            srcContainer.observe('on:add-to', function(event) {
                srcListView.select(event.memo.id);
            });
            srcContainer.observe('on:remove-from', function(event) {
                var link = event.element().up().select('link[rel="belongs_to"]')[0];
                var id = map.index(event.memo.id);
                if (id) {
                    that.dstListManager.remove(id);
                }
            });
            srcContainer.observe('before:select', function(event) {
                if (srcListView.isSelected(event.memo.id)) {
                    event.stop();
                }
            });
            srcContainer.observe('after:select', function(event) {
                container.observe('transaction:success', function(tx) {
                    map.set(tx.memo.id, event.memo.id);
                    that.dstListManager.list();
                });
                container.observe('transaction:failure', function() {
                    srcListView.clearSelection(event.memo.id);
                });
                transaction.execute(event.memo.id);
            });

            $(dstListManager.containerID).observe('remove:success', function(event) {
                srcListView.clearSelection(map.get(event.memo.id));
                map.unset(event.memo.id);
            });
        },


        list: function(query) {
            this.srcController.list(query);
            this.dstListManager.list();
        }
    });


    PATTERN.PickListFactory = {
        create: function(container) {
            var pattern = null;
            container = $(container);

            var srcContainers = container.select('.fx-source.fx-controller');
            var srcController = MVC.controller.ControllerFactory.create($(srcContainers[0]));

            var dstContainers = container.select('.fx-destination.fx-list-manager');
            var dstListManager = PATTERN.ListManagerFactory.create(dstContainers[0]);

            var transformers = container.select('.fx-transformer');

            if (!srcController.isNullController() && !dstListManager.isNullPattern() && transformers.length == 1) {
                pattern = new PATTERN.PickList(container, srcController, dstListManager, transformers[0]);
            }
            return pattern || new PATTERN.NullPickList();
        }
    };
})();