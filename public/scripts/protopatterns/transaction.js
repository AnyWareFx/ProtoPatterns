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