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