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

    var PATTERN = org.protopatterns.pattern;


    PATTERN.NullDetailManager = Class.create(PATTERN.NullPattern, {
        list: function() {
        }
    });


    PATTERN.DetailManager = Class.create(PATTERN.Pattern, {
        initialize: function($super, container, masterList, detailLists) {
            $super(container);

            var detailsConsent = function() {
                var stopped = false;
                detailLists.each(function(detailList) {
                    var stop = detailList.isDirty() && !confirm("Do you want to discard your changes?");
                    if (!stop) {
                        detailList.cancel();
                    }
                    stopped = stopped || stop;
                });
                return !stopped;
            };

            var masterContainer = $(masterList.containerID);
            this.masterList = masterList;
            Object.extend(this.masterList, {
                _changeState: function(state) {
                    Object.extend(this, state);
                    Object.extend(this, {
                        'before:create': function(event) {
                            var masterStop = this.isDirty() && !confirm("Do you want to discard your changes?");
                            var detailStop = !detailsConsent();
                            if (masterStop || detailStop) {
                                event.stop();
                            }
                        },
                        'before:select': function(event) {
                            var masterStop = this.isDirty() && !confirm("Do you want to discard your changes?");
                            var detailStop = !detailsConsent();
                            if (masterStop || detailStop) {
                                event.stop();
                            }
                        },
                        'before:remove': function(event) {
                            var masterStop = this.isDirty() && !confirm("Do you want to discard your changes?");
                            var detailStop = !detailsConsent();
                            if (masterStop || detailStop) {
                                event.stop();
                            }
                            else {
                                // TODO Determine how to fix hide() & highlight() - Is confirm() modal?
                                // Something halts execution of effects
                                this.formView.hide();
                                this.listView.highlight(event.memo.id);
                                if (!confirm("Do you want to remove this item?")) {
                                    event.stop();
                                }
                            }
                        }
                    });
                }
            });

            masterContainer.observe('before:add', function(event) {
                if (!detailsConsent()) {
                    event.stop();
                }
                else {
                    detailLists.each(function(detailList) {
                        detailList.hide();
                    });
                }
            });
            masterContainer.observe('before:update', function(event) {
                if (!detailsConsent()) {
                    event.stop();
                }
                else {
                    detailLists.each(function(detailList) {
                        detailList.hide();
                    });
                }
            });
            masterContainer.observe('remove:success', function() {
                detailLists.each(function(detailList) {
                    detailList.hide();
                });
            });
            masterContainer.observe('during:clear-selections', function() {
                detailLists.each(function(detailList) {
                    detailList.hide();
                });
            });
            masterContainer.observe('after:select', function(event) {
                // NOTE 'this' is the masterContainer
                var baseURI = this._controller.resource.resource + "/" + event.memo.id + "/";
                detailLists.each(function(detailList) {
                    detailList.setBaseURI(baseURI);
                    detailList.list();
                    detailList.show();
                });
            });
        },

        list: function(query) {
            this.masterList.list(query);
        }
    });


    PATTERN.DetailManagerFactory = {
        create: function(container) {
            var pattern = null;

            var masterContainers = container.select('.fx-list-manager.fx-master');
            var detailContainers = container.select('.fx-list-manager.fx-detail');

            if (masterContainers.length == 1 && detailContainers.length) {
                var masterContainer = masterContainers[0];
                var masterList = PATTERN.ListManagerFactory.create(masterContainer);
                if (!masterList.isNullPattern()) {
                    var detailLists = [];
                    detailContainers.each(function(detailContainer) {
                        var detailList = PATTERN.ListManagerFactory.create(detailContainer);
                        if (!detailList.isNullPattern()) {
                            detailLists.push(detailList);
                        }
                    });
                    if (detailLists.length) {
                        pattern = new PATTERN.DetailManager(container, masterList, detailLists);
                    }
                }
            }
            return pattern || new PATTERN.NullDetailManager();
        }
    }
})();