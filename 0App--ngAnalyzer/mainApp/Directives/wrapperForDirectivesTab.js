
(function (angular) {

    myApp.directive('wrapperForDirectivesTab',wrapperForDirectivesTab) ;

    wrapperForDirectivesTab.$inject = [];

    function wrapperForDirectivesTab() {
        return {
            restrict: 'E',
            replace:true,
            template:
/*                        '<div class="row clearfix">'+
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
*/
                '<div style="position: relative; border: 2px solid #989ba2; height: 650px; overflow-y: auto">'+
                     '<bg-splitter orientation="horizontal">'+
                            '<bg-pane min-size="50">' +
                                '<requires-tree></requires-tree>'+
                            '</bg-pane>'+
                            '<bg-pane min-size="250">'+
                                '<directives-grid></directives-grid>'+
                                '<horizontal-line></horizontal-line>'+
                                '<components-grid></component-grid>' +
                            '</bg-pane>'+
                    '</bg-splitter>'+
                '</div>'


        }
    };

})(angular)





