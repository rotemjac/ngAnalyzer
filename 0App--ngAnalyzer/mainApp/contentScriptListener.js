'use strict';
(function() {
    chrome.extension.onMessage.addListener(function (message,sender,sendResponse) {
        //dispachEventOnDom(message);

        var scope = angular.element($("#mainContainer")).scope();
        scope.$apply(function(){
            scope.$broadcast('dataFromExtension' , message);
        })
    });

    //Another way to fire events on the DOM
    function dispachEventOnDom(message) {
        var event = new CustomEvent(
            "dataOnDom",
            {
                detail: {
                    message: message,
                    time: new Date()
                },
                bubbles: true,
                cancelable: true
            }
        );

        var head = document.getElementsByTagName('head')[0];
        head.dispatchEvent(event);
    }
})();



