
(function (angular) {

    myApp.directive('urlLocation',urlLocation) ;

    urlLocation.$inject = [];

    function urlLocation() {
        return {
            restrict: 'E',
            replace:true,
            template:
                 '<div>'
                +    '<span>You are here </span>'
                +    '<span class="glyphicon glyphicon-arrow-right"></span>'
                +    '<span style="margin-left: 5px" ng-bind="mainCtrl.currentUrl"></span>'
                +'</div>'
        }
    };

})(angular)





