
(function (angular) {

    myApp.directive('componentSelector',componentSelector) ;

    componentSelector.$inject = ['$compile'];

    function componentSelector($compile) {
        return {
            restrict: 'E',
            replace:true,
            template:
                    '<div>'+
                        '<dynamic-columns colnum="3.5" c1="8" c2="1" c3="3" class="well">'+
                            '<div>'+
                                '<span style="color: white">Youre here: {{mainCtrl.mainModuleName}} </span>' +
                                '<span id="selectContainer"></span>'+
                            '</div>'+
                            '<div>'+
                                '<span class="glyphicon glyphicon-arrow-left" style="color: white" ng-click="componentSelectorCtrl.goOneModuleBack()"></span>'+
                                '<span style="color: white" ng-show="!componentSelectorCtrl.hasRequiresFlag">'+
                                    '<p>No sub modules</p>'+
                                '</span>'+
                                '<span ng-show="componentSelectorCtrl.hasRequiresFlag">'+
                                    '<select ng-options="require.name for require in componentSelectorCtrl.requires" ng-model="componentSelectorCtrl.selectedRequire" ng-change="componentSelectorCtrl.requireSelected()">'+
                                '</span>'+
                            '</div>'+
                        '</dynamic-columns>'+
                    '</div>',

            require: ['^ngAnalyzer','^componentSelector'],
            controller: function () {
                this.requires = [];

                this.selectedRequire = {};
                this.hasRequiresFlag = false;
            },
            controllerAs: 'componentSelectorCtrl',
            link: function postLink(scope, iElement, iAttrs, ctrlArr){

                        var mainCtrl  = ctrlArr[0];
                        var localCtrl = ctrlArr[1];

                        //Initialization - get the requires for main module
                        if (mainCtrl.directiveTabDataArrivedFlag) {
                            localCtrl.requires = mainCtrl.directivesTabLogic.getRequiresOfCurrentModule();
                        }
                        //Listen to data changes in mainCtrl
                        scope.$on('directivesTabEvent', function(event) {
                            localCtrl.requires   = mainCtrl.directivesTabLogic.getRequiresOfCurrentModule();
                            if (localCtrl.requires.length > 0) {
                                localCtrl.hasRequiresFlag = true;
                            }
                            else {
                                localCtrl.hasRequiresFlag = false;
                            }
                        });


                        //Handler for the ng-select
                        localCtrl.requireSelected = function () {

                            addSelectElement(localCtrl.selectedRequire.name,$compile,iElement,scope);
                            mainCtrl.directivesTabLogic.changeCurrentModule(localCtrl.selectedRequire.name);

                            if (this.selectedRequire.requires.length > 0) {
                                localCtrl.requires   = mainCtrl.directivesTabLogic.getRequiresOfCurrentModule();
                                localCtrl.hasRequiresFlag = true;
                            }
                            else {
                                localCtrl.hasRequiresFlag = false;
                            }
                        }

                        localCtrl.goOneModuleBack = function () {
                            removeSelectElement(mainCtrl);
                        }

            }
        }
    };

    function addSelectElement(moduleName,$compile,iElement,scope) {
        var el = $compile('<span class="glyphicon glyphicon-arrow-right" style="color: white">'+moduleName+'</span>')( scope );
        iElement.find("#selectContainer").append(el);
    }

    function removeSelectElement (mainCtrl) {
        $('#selectContainer :last-child').remove();
        if ($('#selectContainer').children().length > 0) {
            var numberOfChildren = $('#selectContainer').children().length;
            var nameOfLastChild  = $('#selectContainer').children(numberOfChildren-1)[0].innerHTML;
            mainCtrl.directivesTabLogic.changeCurrentModule(nameOfLastChild);
        }
        else {
            mainCtrl.directivesTabLogic.changeCurrentModule(mainCtrl.mainModuleName);
        }

    }

    function getDepth (obj) {
        var depth = 0;
        if (obj.requires) {
            obj.requires.forEach(function (d) {
                var tmpDepth = getDepth(d);
                if (tmpDepth > depth) {
                    depth = tmpDepth
                }
            })
        }
        return 1 + depth
    }


})(angular)





