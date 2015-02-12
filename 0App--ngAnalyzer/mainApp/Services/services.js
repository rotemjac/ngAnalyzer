

myApp.service('extensionService', function($rootScope) {

    chrome.extension.onRequest.addListener(function (message,sender,sendResponse) {

        if (message) {
            $rootScope.$broadcast('ScopesEvent', message);
        }
        else {
            $rootScope.$broadcast('WatchesEvent', message);
        }

    });
});
