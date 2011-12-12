var org;
org = org || {};

(function() {

    ///////////////////////////////////////////////////////////////////////////////
    //
    // Define the root namespace
    //
    ///////////////////////////////////////////////////////////////////////////////

    org.protopatterns = {
        XHR: {
            getResponseData: function(response) {
                var data = null;
                if (response.responseXML) {
                    data = response.responseXML;
                }
                else if (response.responseJSON) {
                    data = response.responseJSON;
                }
                else {
                    data = response.responseText;
                }
                return data;
            }
        },
        DOM: {
            ///////////////////////////////////////////////////////////////////////////////
            //
            // The static getResourceID() method provides a single wrapper for extracting
            // a resource identifier from the context of the supplied element. URI's are encoded
            // as <a href='...'> or <button value='...'> attributes.
            //
            getResourceID: function(element) {
                var id = null;
                if (element) {
                    var DOM = org.protopatterns.DOM;
                    switch (element.tagName.toLowerCase()) {
                        case 'img':
                            id = DOM.getResourceID(element.up('form') || element.up('a'));
                            break;

                        case 'button':
                            id = DOM.getResourceID(element.up('form'));
                            break;

                        case 'form':
                            var hidden = element.select('input[type="hidden"]')[0];
                            id = hidden.readAttribute('value');
                            break;

                        case 'input':
                            id = DOM.getResourceID(element.up('form'));
                            break;

                        case 'a':
                            id = element.readAttribute('href');
                            break;

                        case 'tr':
                        case 'li':
                            id = DOM.getResourceID(element.select('a')[0]);
                            break;
                    }
                    if (id) {
                        id = id.substr(id.lastIndexOf("/") + 1);
                    }
                }
                return id;
            }
        },
        options: {
        }
    };
})();