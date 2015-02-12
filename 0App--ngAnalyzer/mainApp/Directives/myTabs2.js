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
            template:
            '<nav style="background-color: black">'+
            '<div class="navbar-header">'+
            '    <button type="button" data-target="#navbarCollapse" data-toggle="collapse" class="navbar-toggle">'+
            '    <span class="sr-only"></span>'+
            '    <span class="icon-bar"></span>'+
            '    <span class="icon-bar"></span>'+
            '    <span class="icon-bar"></span>'+
            '    </button>'+
            '    <a href="#" class="navbar-brand"></a>'+
            '</div>'+
            '<div id="navbarCollapse" class="collapse navbar-collapse">'+
            '    <ul class="nav navbar-nav">'+
            '    </ul>'+
            '</div>'+
            '</nav>',
            replace: true,
            controller: function(){
            },
            controllerAs: 'myTabs2Ctrl',
            require: ['^ngAnalyzer','^myTabs2'],
            link: function postLink(scope,iElement,iAttr,ctrlArr) {
                var mainCtrl  = ctrlArr[0];
                var localCtrl = ctrlArr[1];

                var tabsData = mainCtrl.navData;

                var elem = iElement.find('.navbar-nav');
                for (var i=0 ; i<tabsData.length; i++) {
                    elem.append('<li> ' +
                                      '<a ng-click="mainCtrl.changeTab($event)">'  +
                                            '<span style="color: #767676"' +getGlyphiconClass(tabsData[i])+ '>'+ tabsData[i] +'</span>'  +
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


