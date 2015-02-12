/**
 * Created by רותם on 31/12/2014.
 */

(function (angular) {

    myApp.directive('myTabs', myTabs);

    myTabs.$inject = [];

    function myTabs () {
        return {
            restrict: 'E',
            replace:true,
            template:
                    '<div style="background-color: black">' +
                        '<tabset justified="true">'+
                            '<tab heading="Modules"     ui-sref="Modules"></tab>'+
                            '<tab heading="Events"      ui-sref="Events"></tab>' +
                            '<tab heading="Scopes"      ui-sref="Scopes"></tab>' +
                            '<tab heading="Directives"  ui-sref="Directives"></tab>' +
                        '</tabset>'+
                        '<div ui-view="chosenChart" class="well">'+
                        '<!--View will be injected into here-->'+
                        '</div>'+
                    '</div>',
            /*templateUrl: '/Templates/directiveTemplates/myTabs.html',*/
            compile: function(tElement, tAttrs){
                return {
                    pre: function(scope, iElement, iAttrs ) {
                    },
                    post: function(scope, iElement, iAttrs ) {

                    }
                }
            }
        }
    };


})(angular)



