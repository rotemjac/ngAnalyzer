
(function (angular) {

    myApp.directive('wrapperForDirectivesTab',wrapperForDirectivesTab) ;

    wrapperForDirectivesTab.$inject = [];

    function wrapperForDirectivesTab() {
        return {
            restrict: 'E',
            replace:true,
            template:  '<div>' +
                            '<div>' +
                                '<component-selector></component-selector>'+
                                '<components-grid></component-grid>' +
                            '</div>'+
                            '<div>'+
                                '<directives-grid></directives-grid>'+
                            '</div>'+
                       '</div>'
        }
    };

})(angular)





