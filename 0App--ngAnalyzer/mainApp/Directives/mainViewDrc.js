/**
 * Created by rotem.jackoby on 21/01/2015.
 */
(function (angular) {
    "use strict";

    /* ------ AngularJS code ------*/
    myApp.directive('mainViewDrc', mainViewDrc);

    /* ------ JavaScript code ------*/
    function mainViewDrc() {

        var directiveDefinitionObject = {
            restrict: 'E',
            templateUrl: 'templates/directiveTemplates/mainView.html',
            replace: true,
            controller: function(){},
            controllerAs: 'vm',
            require: '^mainViewDrc'
        };

        return directiveDefinitionObject;
    }

})(angular);