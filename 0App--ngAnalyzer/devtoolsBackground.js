var panels = chrome.devtools.panels;

var angularPanel = panels.create(
    "ngAnalyzer",
    "img/angular.png",
    "mainApp/index.html",
    function (panel) {
        panel.onShown.addListener(function(win) {
            console.log('i think this is the right onshow');
        });

        chrome.devtools.network.onRequestFinished.addListener(
            function(request) {
                console.log('yes');
            });
    }
);

