
(function (angular) {

    myApp.directive('requiresTree',requiresTree) ;

    requiresTree.$inject = ['$compile'];

    function requiresTree($compile) {
        return {
            restrict: 'E',
            replace:true,
            template:
                    '<div>'+
                           '<treecontrol class="tree-classic"'+
                                'tree-model="treeCtrl.treeData"' +
                                'options="treeCtrl.treeOptions"'+
                                'on-selection="treeCtrl.showSelected(node)"'+
                                'selected-node="node1">'+
                                '{{node.name}}'+
                            '</treecontrol>'+
                    '</div>',

            require: ['^ngAnalyzer','^requiresTree'],
            controller: function () {
                this.treeData = [
                    {
                        "name"     : "No Modules were found",
                        "requires" : []
                    }

                ];

                this.treeOptions = {
                    nodeChildren: "requires",
                    dirSelectable: true,
                    injectClasses: {
                        ul: "a1",
                        li: "a2",
                        liSelected: "a7",
                        iExpanded: "a3",
                        iCollapsed: "a4",
                        iLeaf: "a5",
                        label: "a6",
                        labelSelected: "a8"
                    }
                }
            },
            controllerAs: 'treeCtrl',
            link: function postLink(scope, iElement, iAttrs, ctrlArr){

                var mainCtrl  = ctrlArr[0];
                var localCtrl = ctrlArr[1];

                //Initialization - get the requires for main module
                if (mainCtrl.directiveTabDataArrivedFlag) {
                    populateData(localCtrl , mainCtrl.directivesTabLogic.getAllRequires() );
                }
                //Listen to data changes in mainCtrl
                scope.$on('directivesTabEvent', function(event) {
                    populateData(localCtrl , mainCtrl.directivesTabLogic.getAllRequires() );
                });

                //Handler for the ng-select
                localCtrl.showSelected = function (node) {
                    mainCtrl.directivesTabLogic.changeCurrentModule(node.name);
                }
            }
        }
        function populateData(localCtrl,data) {
            //If the data contains the field of "foundModule" that means we're not in the main module so dont change tree!!
            if (!data.foundModule) {
                localCtrl.treeData[0].name     = data.name;
                localCtrl.treeData[0].requires = data.requires;
            }
        }

    };




})(angular)





