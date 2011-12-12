(function() {

    org.protopatterns.pattern = {};
    var PATTERN = org.protopatterns.pattern;


    PATTERN.NullPattern = Class.create({
        isNullPattern: function() {
            return true;
        }
    });


    PATTERN.Pattern = Class.create({
        initialize: function(container) {
            container._pattern = this;
            this.containerID = container.identify();
        },

        isNullPattern: function() {
            return false;
        }
    });


    PATTERN.Pattern.autoInitialize = function(context) {
        context.select('.fx-pattern').each(function(container) {
            PATTERN.PatternClassFactory.create(container);
        });
    };


    PATTERN.PatternClassFactory = {
        create: function(container) {
            var pattern = null;
            container = $(container);

            if (container.hasClassName('fx-in-context-editor')) {
                pattern = PATTERN.InContextEditorFactory.create(container);
            }
            else if (container.hasClassName('fx-list-manager')) {
                pattern = PATTERN.ListManagerFactory.create(container);
            }
            else if (container.hasClassName('fx-pick-list')) {
                pattern = PATTERN.PickListFactory.create(container);
            }
            else if (container.hasClassName('fx-detail-manager')) {
                pattern = PATTERN.DetailManagerFactory.create(container);
            }
            return pattern;
        }
    };
})();