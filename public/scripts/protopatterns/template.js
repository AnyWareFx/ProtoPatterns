(function() {

    var FX = org.protopatterns;

    FX.NullTemplate = Class.create({
        load:   function() {},
        render: function() {},
        isNullTemplate: function() {
            return true;
        }
    });

    ///////////////////////////////////////////////////////////////////////////////
    //
    // The TemplateAdapter mix-in provides default, no-op event handlers for the
    // Template class.
    //
    FX.TemplateAdapter = {};
    ['load:success', 'load:failure', 'load:complete'].each(function(event) {
        FX.TemplateAdapter[event] = function() {
        }
    });
    ['before:render', 'during:render', 'render:success', 'render:failure'].each(function(event) {
        FX.TemplateAdapter[event] = function() {
        }
    });


    FX.Template = Class.create({
        initialize: function(anchor) {
            this.template = null;
            this.anchorID = anchor.identify(); // Avoid circular references
            anchor._template = this;
        },

        load: function() {
            var that = this;
            var anchor = $(this.anchorID);
            new Ajax.Request(anchor.readAttribute('href'), {
                method: "get",
                onSuccess: function(response) {
                    that.template = FX.XHR.getResponseData(response);
                    anchor.fire('load:success');
                },
                onFailure: function(response) {
                    anchor.fire('load:failure', {
                        data: FX.XHR.getResponseData(response),
                        code: response.status,
                        message: response.statusText
                    });
                },
                onComplete: function() {
                    anchor.fire('load:complete');
                }
            });
        },

        // Template Method Pattern
        render: function(data, container) {
            var anchor = $(this.anchorID);
            try {
                if (data && this.template) {
                    var event = anchor.fire('before:render');
                    if (!event.stopped) {
                        anchor.fire('during:render');
                        this._render(data, container);
                        anchor.fire('render:success');
                    }
                }
            }
            catch (error) {
                anchor.fire('render:failure', {
                    data: error,
                    code: error.name,
                    message: error.message
                });
            }
        },

        _render: function() {
            // Override
        },


        isNullTemplate: function() {
            return false;
        }
    });


    FX.XSLTemplate = Class.create(FX.Template, {

        _render: function(data, container) {
            if (window.XSLTProcessor) {
                if (!this.transformer) {
                    this.transformer = new XSLTProcessor();
                    this.transformer.importStylesheet(this.template);
                }
                var fragment = this.transformer.transformToFragment(data, document);
                container.innerHTML = "";
                container.appendChild(fragment);
            }
            else if (window.ActiveXObject) {
                container.update(data.transformNode(this.template));
            }
        }
    });


    FX.MustacheTemplate = Class.create(FX.Template, {

        _render: function(data, container) {
            if (Mustache) {
                if (typeof data == "string") {
                    data = data.evalJSON();
                }
                container.update(Mustache.to_html(this.template, data));
            }
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    //
    // The TemplateClassFactory singleton constructs an XSL, or Mustache template
    //
    FX.TemplateClassFactory = {
        classes: ['fx-view-template', 'fx-panel-template', 'fx-form-template', 'fx-list-template'],
        create: function(resource) {
            resource = $(resource);
            if (resource) {
                var template = resource._template;
                if (!template) {
                    var intersection = $A(resource.classNames()).intersect(FX.TemplateClassFactory.classes);
                    if (intersection.length == 1) {
                        var href = resource.readAttribute('href');
                        var type = href.substr(href.lastIndexOf('.') + 1);
                        if (type == 'xsl') {
                            template = new FX.XSLTemplate(resource);
                        }
                        else if (type == 'html') { // FIXME - use .mustache ?
                            template = new FX.MustacheTemplate(resource);
                        }
                    }
                }
            }
            return template || new FX.NullTemplate();
        }
    };
})();