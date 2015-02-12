
(function (angular) {

    myApp.directive('ngAnalyzer',ngAnalyzerFunc) ;

    ngAnalyzerFunc.$inject = [];

    function ngAnalyzerFunc() {
        return {
            restrict: 'E',
            replace: true,
            template:'<div id="appWrapper">'+
                        '<my-tabs2></my-tabs2>'+
                        '<main-view-drc></main-view-drc>'+
                     '</div>',
            controller: "MainCtrl as mainCtrl"
        };
    }

})(angular)





