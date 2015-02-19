
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

        //Step 1 - create angularJS (needed anyway) and Jquery script (if site do not already have it)
        var angularScript = createNewScript("mainApp/lib/angularEx.js");
        var jqueryScript  = createNewScript("mainApp/dependencies/js/jquery.min.js");


        //This command added the core files under the "content scripts" tab
        //$( newFile ).insertAfter( "script[src='lib/AngularJS/angular.js']" );
        //This works GOOD but not generic enough
        //var refChild = document.querySelector('script[src="lib/AngularJS/angular.js"]');

        //Step 2 - find where to inject script/s and inject it
        var res                = findAngularScriptAndIfJqueryExists();
        var jqueryExists = res[1]
        var refChild     = res[0];
        var nextScriptAfterAngular  = getNextScript(refChild.nextSibling);

        //Insert jquery only if do not exists in site
        if (!jqueryExists) {
            refChild.parentNode.insertBefore(jqueryScript,refChild);
        }

        refChild.parentNode.insertBefore(angularScript,nextScriptAfterAngular);

        //var head = document.getElementsByTagName('head')[0];
        //head.appendChild(newFile);
    }

    function getNextScript (refChild) {
        var runFlag = true;
        while (runFlag) {
            if (refChild.nodeName == 'SCRIPT') {
                return refChild
            }
            else if (refChild.nodeName != null) {
                refChild = refChild.nextSibling;
            }
            //TODO: Need to handle this use case when the angularjs script is the last script
            else {
                runFlag = false;
            }
        }

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

    function findAngularScriptAndIfJqueryExists() {
        var res = ["",false];

        for (var i=0; i<document.getElementsByTagName('script').length-1; i++) {
            if ((document.getElementsByTagName('script')[i].src.indexOf("angular.js") != -1)  ||
                (document.getElementsByTagName('script')[i].src.indexOf("angular.min.js") != -1) )
            {
                res[0] = document.getElementsByTagName('script')[i];
            }
            else if ((document.getElementsByTagName('script')[i].src.indexOf("jquery") != -1)  ||
                (document.getElementsByTagName('script')[i].src.indexOf("jquery.min")  != -1) )
            {
                res[1] = true;
            }
            if ( (res[0] != "") && (res[1]) ) {
                return res;
            }
        }

        return res;
    }

    function  createNewScript(filePath) {
        var newFile = document.createElement('script');
        newFile.type = 'text/javascript';
        //newFile.src  = chrome.extension.getURL(filePath);
        newFile.src  = chrome.extension.getURL(filePath+'?x='+(Math.random()));

        return newFile;
    }

    function whenANodeIsInserted (e) {
        var element = e.target;
        if ( (element.tagName === "SCRIPT") && (window.angular) ) {
            injectJsFileDynamically("mainApp/lib/angularEx.js");
        }
    }

})();

