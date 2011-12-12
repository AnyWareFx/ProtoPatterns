(function() {

    var MVC = org.protopatterns.mvc;
    var PATTERN = org.protopatterns.pattern;


    PATTERN.NullCrossReferenceManager = Class.create(PATTERN.NullPattern, {
        list: function() {
        }
    });


    PATTERN.CrossReferenceManager = Class.create(PATTERN.Pattern, {
        initialize: function($super, container, detailManager, pickList) {
            $super(container);

            this.detailManager = detailManager;
            this.pickList = pickList;
            var srcList = container.select('.fx-source .fx-list')[0]._view;

            var masterContainer = container.select('.fx-master')[0];
            masterContainer.observe('after:select', function() {
                srcList.clearSelections();
            });
        },

        list: function() {
            this.detailManager.list();
            this.pickList.list();
        }
    });


    PATTERN.CrossReferenceManagerFactory = {
        create: function(container) {
            var pattern = null;

            var detailManager = PATTERN.DetailManagerFactory.create(container);
            var pickList = PATTERN.PickListFactory.create(container);

            if (!detailManager.isNullPattern() && !pickList.isNullPattern()) {
                pattern = new PATTERN.CrossReferenceManager(container, detailManager, pickList);
            }
            return pattern || new PATTERN.NullCrossReferenceManager();
        }
    }
})();