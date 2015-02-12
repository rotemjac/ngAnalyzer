/**
 * Created by רותם on 31/12/2014.
 */


(function (angular) {

    myApp.config(function($stateProvider ) {

        $stateProvider
            .state('Scopes', {
                views: {
                        "chosenChart": {
                            template:
                                    '<div class="row clearfix">'+
                                        '<div class="col-md-12 column">'+
                                           '<div class="column col-md-5">'+
                                                '<my-chart type="line" title="Scopes"></my-chart>'+
                                            '</div>'+
                                            '<div class="column col-md-2"></div>'+
                                            '<div class="column col-md-5">'+
                                                '<my-chart type="line" title="Watches"></my-chart>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'
                        }
                }
                /*templateUrl: '../Templates/routeTemplates/modules.html'*/
            })
            .state('Events', {
                views: {
                    "chosenChart": {
                    template:
                            '<div> <my-grid></my-grid> </div>'
                    }
                }
                /*  templateUrl: '../Templates/routeTemplates/events.html' */
            })
            .state('Directives', {
                views: {
                    "chosenChart": {
                        template: '<div> <wrapper-for-directives-tab></wrapper-for-directives-tab> </div>'
                    }
                }
            })
            .state('Modules', {
                templateUrl: '../Templates/routeTemplates/modules.html'
            })

    });

})(angular)





