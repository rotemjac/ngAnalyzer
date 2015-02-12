(function (angular) {


 myApp.directive('dynamicColumns', dynamicColumns);
 dynamicColumns.$inject = [];

 function dynamicColumns() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: function (tElement, tAttrs) {
                var resTemp1 =
                    '<div class="row clearfix ">'
                    + '   <div class="col-md-12 column">'
                    + '        <div class="column "></div>'
                    + '        <div class="column " ></div>'
                    + '        <div class="column "></div>';

                //If there are is no need for a 4th column - don't add it
                var  resTemp2 = '<div class="column "></div>';

                var  resTemp3 = '</div>'
                                + ' </div>  ';
                if (tAttrs.colnum==4) {
                    return resTemp1 + resTemp2 + resTemp3;
                }
                else {
                    return resTemp1 + resTemp3;
                }
            } ,
            link: function (scope,iElement, iAttrs,controller, $transclude) {
                var allColumns = iElement.find(".column");
                angular.element(allColumns[1]).addClass("col-md-" + iAttrs.c1);
                angular.element(allColumns[2]).addClass("col-md-" + iAttrs.c2);
                angular.element(allColumns[3]).addClass("col-md-" + iAttrs.c3);
                angular.element(allColumns[4]).addClass("col-md-" + iAttrs.c4);

                /*
                 Here we have only one main content and it should go the the col-md-10
                 */
                if (iAttrs.colnum==3) {
                    $transclude(function(clone) {
                        var mainContent  = clone[0];
                        angular.element(allColumns[2]).append(mainContent);
                    });
                }
                /*
                 Here we have TWO main content:
                 The first  one (clone[1]) should go the "c2" column
                 The second one (clone[3]) should go the "c4" column
                 The "c1" and "c3" columns are just columns spaces
                 View the structure of "allColumns" and "clone" for a better understanding...
                 */
                else if ((iAttrs.colnum==4) || (iAttrs.colnum==3.5) ){
                    $transclude(function(clone) {
                        var leftContent  = clone[0];
                        var rightContent = clone[1];

                        angular.element(allColumns[1]).append(leftContent);
                        angular.element(allColumns[3]).append(rightContent);
                    });
                }

            }
        }
 };

})(angular)

