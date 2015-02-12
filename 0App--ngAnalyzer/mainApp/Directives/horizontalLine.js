/**
 * Created by rotem.jackoby on 21/01/2015.
 */
(function (angular) {
    "use strict";

    /* ------ AngularJS code ------*/
    myApp.directive('horizontalLine', horizontalLine);

    /* ------ JavaScript code ------*/
    function horizontalLine() {

        var directiveDefinitionObject = {
            restrict: 'E',
            template: '<hr style="margin: 15px 0; border: 1px solid rgb(219, 219, 217);">'
        };

        return directiveDefinitionObject;
    }

})(angular);