/**
 * Created by רותם on 31/12/2014.
 */

(function (angular) {
    "use strict";

    /* ------ AngularJS code ------*/
    myApp.directive('myTabs2', myTabs2);

    /* ------ JavaScript code ------*/
    function myTabs2($compile) {

        var directiveDefinitionObject = {
            restrict: 'E',
            templateUrl: 'Templates/nav.html',
            replace: true,
            controller: function(){
            },
            controllerAs: 'myTabs2Ctrl',
            require: ['^ngAnalyzer','^myTabs2'],
            link: function postLink(scope,iElement,iAttr,ctrlArr) {
                var mainCtrl  = ctrlArr[0];
                var localCtrl = ctrlArr[1];

                var tabsData = mainCtrl.navData;

                var elem = iElement.find('.nav');
                for (var i=0 ; i<tabsData.length; i++) {
                    elem.append('<li class="navitem"> ' +
                                      '<a ng-click="mainCtrl.changeTab($event)">'  +
                                            '<span ' +getGlyphiconClass(tabsData[i])+ '/><span>' + tabsData[i] +'</span>'  +
                                      '</a>' +
                                '</li>');
                }
                $compile(elem)(scope);
            }
        };

        function getGlyphiconClass (btnText) {
            switch(btnText) {
                case "Dashboard":
                    return 'class="glyphicon glyphicon-dashboard"';
                case "Components":
                    return 'class="glyphicon glyphicon-folder-close"';
                case "About":
                    return 'class="glyphicon glyphicon-user"';
            }

        }

        return directiveDefinitionObject;
    }

})(angular);


