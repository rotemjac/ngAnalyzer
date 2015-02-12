
(function (angular) {

    myApp.directive('myGrid',myGrid) ;

    myGrid.$inject = [];

    function myGrid() {
        return {
            restrict: 'E',
            replace:true,
            templateUrl: 'templates/directiveTemplates/eventsGridView.html',
            controller: function () {
                this.tblHaveDataFlag = false;
            },
            controllerAs : 'myGridCtrl',
            require: ['^ngAnalyzer','^myGrid'],
            link: function postLink (scope, iElement, iAttrs , ctrlArr) {
                var mainCtrl  = ctrlArr[0];
                var localCtrl = ctrlArr[1];

                populateDataAndUpdteFlag(localCtrl,mainCtrl.tabsData.eventsArr);
                scope.$on('scopeEvent', function(event) {
                    populateDataAndUpdteFlag(localCtrl,mainCtrl.tabsData.eventsArr);
                });
            }
        }
    };

    function populateDataAndUpdteFlag(localCtrl,data) {
        localCtrl.eventsDataArray = data;
        if (localCtrl.eventsDataArray.length > 0) {
            localCtrl.tblHaveDataFlag = true;
        }
        else {
            localCtrl.tblHaveDataFlag = false;
        }
    }



})(angular)





