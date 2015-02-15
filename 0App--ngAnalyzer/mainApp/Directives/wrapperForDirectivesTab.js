
(function (angular) {

    myApp.directive('wrapperForDirectivesTab',wrapperForDirectivesTab) ;

    wrapperForDirectivesTab.$inject = [];

    function wrapperForDirectivesTab() {
        return {
            restrict: 'E',
            replace:true,
            template:
                        '<div class="row clearfix">'+
                            '<div class="col-md-12 column">'+
                            '<div class="column col-md-4">'+
                                '<requires-tree></requires-tree>'+
                            '</div>'+
                            '<div class="column col-md-8 leftVerticalLine">'+
                                    '<directives-grid></directives-grid>'+
                                    '<horizontal-line></horizontal-line>'+
                                    '<components-grid></component-grid>' +
                            '</div>'+
                        '</div>'
        }
    };

})(angular)





