
(function (angular) {

    myApp.directive('smallSelect',smallSelect) ;

    smallSelect.$inject = [];

    function smallSelect() {
        return {
            restrict: 'E',
            replace:true,
            template: function (tElement, tAttrs) {
                var res = '<span class="glyphicon glyphicon-arrow-right">' +
                              '<select ng-options="module for module in data" ng-model="selected" ng-change="moduleSelected()">'+
                          '</span>';
                return res;
            }
        }
    };

})(angular)





