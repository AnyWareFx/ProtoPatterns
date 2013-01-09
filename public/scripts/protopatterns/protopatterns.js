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
                            id = element.readAttribute('action');
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