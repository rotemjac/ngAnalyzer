
(function (angular) {

    myApp.directive('directivesGrid',directivesGrid) ;

    directivesGrid.$inject = [];

    function directivesGrid() {
        return {
            restrict: 'E',
            replace: true,
            template:
                '<div class="scrollIt">'+
                        '<h4>Directives table</h4>'+

                        '<div style="color: white" ng-show="!directivesGridCtrl.hasDirectivesFlag">'+
                            '<p>This module doesnt contain any directives</p>'+
                        '</div>'+

                        '<div ng-show="directivesGridCtrl.hasDirectivesFlag">'+
                             '<table class="table table-striped table-bordered table-hover">'+
                                 '<thead>'+
                                     '<tr>'+
                                         '<th>Name</th>'+
                                         '<th>Module</th>'+
                                         '<th>Restrict</th>'+
                                         '<th>Template</th>'+
                                         '<th>Replace</th>'+
                                         '<th>Priority</th>'+
                                         '<th>Terminal</th>'+
                                         '<th>Compile</th>'+
                                         '<th>Link</th>'+
                                         '<th>Controller</th>'+
                                         '<th>Require</th>'+
                                     '</tr>'+
                                 '</thead>'+
                             '<tbody id="directivesTBody"> </tbody>'+
                             '</table>'+
                        '</div>'+

                  '</div>',
            require: ['^ngAnalyzer', '^directivesGrid'],
            controller: function () {
                this.hasDirectivesFlag = false;
                this.directivesData = [];
            },
            controllerAs: 'directivesGridCtrl',
            link: function postLink(scope, iElement, iAttrs, ctrlArr) {
                var mainCtrl  = ctrlArr[0];
                var localCtrl = ctrlArr[1];

                //Initialization - get the directivesData for main module
                if (mainCtrl.directiveTabDataArrivedFlag) {
                    localCtrl.directivesData = mainCtrl.directivesTabLogic.getDirectivesOfCurrentModule();

                    if (localCtrl.directivesData.length > 0) {
                        appendDirectives(localCtrl.directivesData, iElement);
                        localCtrl.hasDirectivesFlag = true;
                    }
                    else {
                        localCtrl.hasDirectivesFlag = false;
                    }

                }

                //Listen to data changes in mainCtrl
                scope.$on('directivesTabEvent', function (event) {
                    localCtrl.directivesData = mainCtrl.directivesTabLogic.getDirectivesOfCurrentModule();
                    if (localCtrl.directivesData.length > 0) {
                        appendDirectives(localCtrl.directivesData, iElement);
                        localCtrl.hasDirectivesFlag = true;
                    }
                    else {
                        localCtrl.hasDirectivesFlag = false;
                    }
                });
            }
        };
    }

    function appendDirectives(data,iElement) {

        //First of all remove all previous nodes
        $("#directivesTBody").empty();

        //Then start appending new ones
        var tableElement = iElement.find("#directivesTBody");

        //Get all events previous events that were saved in the array and add them to the HTML
        for (var i=0; i<data.length ; i++) {
            tableElement.append(
                    '<tr class="success"> ' +
                        '<td>' +data[i].name+       '</td>' +
                        '<td>' +data[i].module+     '</td>' +
                        '<td>' +data[i].restrict+   '</td>' +
                        '<td>' +data[i].template+   '</td>' +
                        '<td>' +data[i].repelace+   '</td>' +
                        '<td>' +data[i].priority+   '</td>' +
                        '<td>' +data[i].terminal+   '</td>' +
                        '<td>' +data[i].compile+    '</td>' +
                        '<td>' +data[i].link+       '</td>' +
                        '<td>' +data[i].controller+ '</td>' +
                        '<td>' +data[i].require+    '</td>' +
                    '</tr>');
        }
    }

})(angular)