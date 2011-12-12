(function() {

    var FX = org.protopatterns;

    FX.Transaction = Class.create({
        initialize: function(context, actions) {
            this.contextID = context.identify();
            this.actions = actions || $H({});

            // Initialize the event handlers
            actions.keys().each(function(name) {
                var action = actions.get(name);
                var next = actions.get(action.next);

                // Default method to action name
                var method = action.method || name;
                context.observe(method + ":success", function(event) {
                    if (next) {
                        var data = next.data || event.memo.data;

                        // Default method to action name
                        next.target[next.method || action.next](data);
                    }
                    else {
                        var memo = Object.extend({}, event.memo);
                        context.fire('transaction:success', memo);
                    }
                });
                context.observe(method + ":failure", function(event) {
                    var memo = Object.extend({}, event.memo);
                    context.fire('transaction:failure', memo);
                });
                context.observe(method + ":complete", function(event) {
                    if (!action.next) {
                        var memo = Object.extend({}, event.memo);
                        context.fire('transaction:complete', memo);
                    }
                });
            });
        },

        // NOTE: The 'actions' object must have a 'start' property with a method specified
        execute: function(data) {
            var start = this.actions.get('start');
            if (start && start.method) {
                var context = $(this.contextID);
                var event = context.fire('before:execute', {
                    data: data
                });
                if (!event.stopped) {
                    context.fire('during:execute', {
                        data: data
                    });
                    start.target[start.method](data);
                }
            }
        }
    });
})();