(function() {

    var FX = org.protopatterns;

    FX.Transformer = Class.create({
        initialize: function(anchor) {
            var that = this;
            this.xsl = null;
            this.anchorID = anchor.identify();
            anchor._transformer = this;

            new Ajax.Request(anchor.readAttribute('href'), {
                method: "get",
                onSuccess: function(response) {
                    that.xsl = response.responseXML;
                    anchor.fire('initialize:success');
                },
                onFailure: function(response) {
                    anchor.fire('initialize:failure', {
                        data: FX.XHR.getResponseData(response),
                        code: response.status,
                        message: response.statusText
                    });
                },
                onComplete: function() {
                    anchor.fire('initialize:complete');
                }
            });
        },


        transform: function(xml) {
            var anchor = $(this.anchorID);
            try {
                if (xml && this.xsl) {
                    var event = anchor.fire('before:transform');
                    if (!event.stopped) {
                        var result = null;
                        anchor.fire('during:transform');
                        if (window.XSLTProcessor) {
                            if (!this.transformer) {
                                this.transformer = new XSLTProcessor();
                                this.transformer.importStylesheet(this.xsl);
                            }
                            // TODO Determine why XML doesn't work here
                            var fragment = this.transformer.transformToFragment(xml, document);
                            result = fragment.textContent.strip();
                        }
                        else if (window.ActiveXObject) {
                            result = xml.transformNode(this.xsl);
                        }
                        anchor.fire('transform:success', {
                            data: result
                        });
                    }
                }
            }
            catch (error) {
                anchor.fire('transform:failure', {
                    data: error,
                    code: error.name,
                    message: error.message
                });
            }
        }
    });
})();