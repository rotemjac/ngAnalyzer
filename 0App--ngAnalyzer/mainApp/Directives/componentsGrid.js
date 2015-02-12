
(function (angular) {

    myApp.directive('componentsGrid',componentsGrid) ;

    componentsGrid.$inject = ['$compile'];

    function componentsGrid($compile) {
        return {
            restrict: 'E',
            replace:true,
            template:
                '<div>'+
                '<h4>Components table</h4>'+
                '<table class="table table-bordered table-hover">'+
                '<thead>'+
                '<tr class="active">'+
                '<th>Type</th>'+
                '<th>Components in this module</th>'+
                '</tr>'+
                '</thead>'+
                '<tbody>'+
                '<tr class="success"> ' +
                '<td>Controllers</td>' +
                '<td> {{componentsGridCtrl.controllers}} </td>' +
                '</tr>'+
                '<tr class="success"> ' +
                '<td>Services</td>' +
                '<td> {{componentsGridCtrl.services}} </td>' +
                '</tr>'+
                '<tr class="success"> ' +
                '<td>Providers</td>' +
                '<td> {{componentsGridCtrl.providers}} </td>' +
                '</tr>'+
                '<tr class="success"> ' +
                '<td>Factories</td>' +
                '<td> {{componentsGridCtrl.factories}} </td>' +
                '</tr>'+
                '<tr class="success"> ' +
                '<td>Filters</td>' +
                '<td> {{componentsGridCtrl.filters}} </td>' +
                '</tr>'+
                '<tr class="success"> ' +
                '<td>Constants</td>' +
                '<td> {{componentsGridCtrl.constants}} </td>' +
                '</tr>'+
                '</tbody>'+
                '</table>'+
                '</div>',
            require: ['^ngAnalyzer', '^componentsGrid'],
            controller: function () {
                //Initialize values
                var stringToShow = "Data hasn't arrived yet..."
                this.controllers = stringToShow;
                this.services    = stringToShow;
                this.providers   = stringToShow;
                this.factories   = stringToShow;
                this.filters     = stringToShow;
                this.constants   = stringToShow;
            },
            controllerAs: 'componentsGridCtrl',
            link: function postLink(scope, iElement, iAttrs, ctrlArr){
                var mainCtrl  = ctrlArr[0];
                var localCtrl = ctrlArr[1];


                //Initialization - get the componentsData for main module
                if (mainCtrl.directiveTabDataArrivedFlag) {
                    var resData              = mainCtrl.directivesTabLogic.getComponentsOfCurrentModule();
                    localCtrl.componentsData = mainCtrl.directivesTabLogic.getComponentsOfCurrentModule();

                    if (resData.name) {
                        createComponentsData(localCtrl,resData);
                    }
                }
                //Listen to data changes in mainCtrl
                scope.$on('directivesTabEvent', function(event) {
                    var resData   = mainCtrl.directivesTabLogic.getComponentsOfCurrentModule();
                    createComponentsData(localCtrl,resData);
                });
            }
        }
    };


    function createComponentsData (localCtrl,currentModuleData) {
        var data = {};
        //All modules beside the mainModule comes inside a sub module called "foundModule" - please change this in the future so that they both will point to "foundModule"
        if (currentModuleData.foundModule)  {
            data = currentModuleData.foundModule;
        }
        else {
            data = currentModuleData;
        }

        localCtrl["controllers"] = buildStringFromArray(data.controllers);
        localCtrl["services"]    = buildStringFromArray(data.services);
        localCtrl["providers"]   = buildStringFromArray(data.provider);
        localCtrl["factories"]   = buildStringFromArray(data.factory);
        localCtrl["filters"]     = buildStringFromArray(data.filter);
        localCtrl["constants"]   = buildStringFromArray(data.constant);

    }

    function buildStringFromArray (arr) {
        if (!arr) {
            return "None";
        }

        var res="";
        for (var i=0;i<arr.length; i++) {
            res += arr[i];
            //If its not the last item in the array - add "," after it
            if ( i!=(arr.length-1) ) {
                res += ", ";
            }
        }
        return res;
    }


    function appendComponents(scope,iElement) {
        var tableElement = iElement.find("tbody");

        for (var i=0; i<scope.tabsData.currentData.components.length ; i++) {
            var currentNamesString = buildStringFromArray(scope.tabsData.currentData.components[i].names);
            tableElement.append(
                    '<tr class="success"> ' +
                    '<td>' +scope.tabsData.currentData.components[i].type+  '</td>' +
                    '<td>' +currentNamesString+                             '</td>' +
                    '</tr>');
        }
    }



})(angular)



