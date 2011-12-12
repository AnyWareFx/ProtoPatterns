(function() {

    ///////////////////////////////////////////////////////////////////////////////
    //
    // Resource Events:
    //      before:create
    //          :get
    //          :put
    //          :post
    //          :delete
    //      :success:failure:complete
    //
    ///////////////////////////////////////////////////////////////////////////////

    var FX = org.protopatterns;
    var RESOURCE = FX.mvc.resource;

    var ACTIONS = ['GET', 'PUT', 'POST', 'DELETE'];

    ///////////////////////////////////////////////////////////////////////////////
    //
    // The NullResource implements the Null Object pattern for Resource
    //
    var NullActions = {};
    ACTIONS.each(function(action) {
        NullActions[action] = function() {
        };
    });

    RESOURCE.NullResource = Class.create(NullActions, {
        isNullResource: function() {
            return true;
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The ResourceAdapter mix-in provides default, no-op event handlers for the
    // Resource class.
    //
    RESOURCE.ResourceAdapter = {};
    ACTIONS.each(function(method) {
        RESOURCE.ResourceAdapter['before:' + method.toLowerCase()] = function() {
        };
        ['create', 'success', 'failure', 'complete'].each(function(status) {
            RESOURCE.ResourceAdapter[method.toLowerCase() + ':' + status] = function() {
            };
        });
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The Resource 'class' represents a RESTful resource with the HTTP
    // verbs for methods
    //
    RESOURCE.Resource = Class.create({
        initialize: function(anchor) {
            anchor = $(anchor);

            var that = this;
            anchor._resource = this;
            this.anchorID = anchor.identify();
            this.baseURI = '';
            this.resource = anchor.readAttribute('href');
            this.callbacks = {};
            ACTIONS.each(function(method) {
                that.callbacks[method] = {
                    onCreate: function() {
                        anchor.fire(method.toLowerCase() + ':create');
                    },
                    onSuccess: function(response) {
                        anchor.fire(method.toLowerCase() + ':success', {
                            data: FX.XHR.getResponseData(response)
                        });
                    },
                    onFailure: function(response) {
                        anchor.fire(method.toLowerCase() + ':failure', {
                            data: FX.XHR.getResponseData(response),
                            code: response.status,
                            message: response.statusText
                        });
                    },
                    onComplete: function(response) {
                        anchor.fire(method.toLowerCase() + ':complete', {
                            data: FX.XHR.getResponseData(response)
                        });
                    }
                };
            });
            // POST success is a special case. We need to get the URI of the newly created RESOURCE
            this.callbacks.POST.onSuccess = function(response) {
                var location = response.getHeader('Location');
                var id = location.substr(location.lastIndexOf('/') + 1);
                anchor.fire('post:success', {
                    id: id,
                    data: FX.XHR.getResponseData(response)
                });
            };
        },


        isNullResource: function() {
            return false;
        },


        /////////////////////////////////////////////////////////////
        //
        //  Actions
        //
        GET: function(query) {
            var event = $(this.anchorID).fire('before:get');
            if (!event.stopped) {
                query = (query ? query.toString() : "");
                if (query.length && query[0] != "/") {
                    query = "/" + query;
                }
                var options = Object.extend({
                    method: "get"
                }, this.callbacks.GET);
                new Ajax.Request(this.baseURI + this.resource + query, options);
            }
        },

        PUT: function(id, data) {
            var event = $(this.anchorID).fire('before:put');
            if (!event.stopped) {
                var options = Object.extend({
                    method: "put",
                    parameters: data
                }, this.callbacks.PUT);
                new Ajax.Request(this.baseURI + this.resource + "/" + id, options);
            }
        },

        POST: function(data) {
            var event = $(this.anchorID).fire('before:post');
            if (!event.stopped) {
                var options = Object.extend({
                    method: "post",
                    parameters: data
                }, this.callbacks.POST);
                new Ajax.Request(this.baseURI + this.resource, options);
            }
        },

        DELETE: function(id) {
            // DELETE is a special case. We need to pass the ID of the resource to the handlers.
            var anchor = $(this.anchorID);
            var event = anchor.fire('before:delete');
            if (!event.stopped) {
                var options = {
                    onCreate: function() {
                        anchor.fire('delete:create', {
                            id: id
                        });
                    },
                    onSuccess: function(response) {
                        anchor.fire('delete:success', {
                            id: id,
                            data: FX.XHR.getResponseData(response)
                        });
                    },
                    onFailure: function(response) {
                        anchor.fire('delete:failure', {
                            id: id,
                            data: FX.XHR.getResponseData(response),
                            code: response.status,
                            message: response.statusText
                        });
                    },
                    onComplete: function(response) {
                        anchor.fire('delete:complete', {
                            id: id,
                            data: FX.XHR.getResponseData(response)
                        });
                    },
                    method: "delete"
                };
                new Ajax.Request(this.baseURI + this.resource + "/" + id, options);
            }
        }
    });


    RESOURCE.ResourceFactory = {
        create: function(anchor) {
            var resource = null;
            anchor = $(anchor);
            if (anchor) {
                resource = anchor._resource;
                if (!resource && anchor.hasClassName('fx-resource')) {
                    resource = new RESOURCE.Resource(anchor);
                }
            }
            return resource || new RESOURCE.NullResource();
        }
    };
})();
