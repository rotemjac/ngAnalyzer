
'use strict';
(function () {

    //document.addEventListener ('DOMNodeInsertedIntoDocument', whenANodeIsInserted , true );
    if ( !checkIfCoreFilesWereInjected() ) {
        injectJsFileDynamically("mainApp/lib/angularEx.js");
    }

    document.addEventListener ('dataFromAngularEx', function(e) {
        chrome.extension.sendMessage(e.detail.message);
    });

    function injectJsFileDynamically(filePath){
        var newFile = document.createElement('script');
        newFile.type = 'text/javascript';
        //newFile.src  = chrome.extension.getURL(filePath);
        newFile.src  = chrome.extension.getURL(filePath+'?x='+(Math.random()));

        //This command added the core files under the "content scripts" tab
        //$( newFile ).insertAfter( "script[src='lib/AngularJS/angular.js']" );

        //This workes GOOD but not generic enough
        //var refChild = document.querySelector('script[src="lib/AngularJS/angular.js"]');
        var refChild = findAngularScript();
        refChild.parentNode.insertBefore(newFile,refChild.nextSibling);


            //var head = document.getElementsByTagName('head')[0];
            //head.appendChild(newFile);
    }

    function checkIfCoreFilesWereInjected() {
        var scriptInjected = false;
        for (var i=0; i<document.getElementsByTagName('script').length-1; i++) {
            if (document.getElementsByTagName('script')[i].src.indexOf("angularEx.js") != -1) {
                scriptInjected=true;
                break;
            }
        }
        return scriptInjected;
    }

    function findAngularScript() {
        for (var i=0; i<document.getElementsByTagName('script').length-1; i++) {
            if ((document.getElementsByTagName('script')[i].src.indexOf("angular.js") != -1)  ||
                (document.getElementsByTagName('script')[i].src.indexOf("angular.min.js") != -1) )
            {
                return document.getElementsByTagName('script')[i];
            }
        }
    }

    function whenANodeIsInserted (e) {
        var element = e.target;
        if ( (element.tagName === "SCRIPT") && (window.angular) ) {
            injectJsFileDynamically("mainApp/lib/angularEx.js");
        }
    }

})();

