
(function (angular) {

    myApp.directive('myGrid',myGrid) ;

    myGrid.$inject = ['$compile','$interval'];

    function myGrid() {
        return {
            restrict: 'E',
            replace:true,
            template:
                '<div class="scrollIt">'
                +'<table class="table table-striped table-bordered table-hover">'
                +'<thead>'
                +'    <tr> <th>#</th><th>Description</th></tr>'
                +'</thead>'
                +'<tbody> </tbody>'
                +'</table>'
                +'</div>',
            require: '^ngAnalyzer',
            link: function postLink (scope, iElement, iAttrs , mainCtrl) {
                var tableElement = iElement.find("tbody");

                //Get all events previous events that were saved in the array and add them to the HTML
                for (var i=mainCtrl.tabsData.eventsArr.length-1; i>=0 ; i--) {
                       tableElement.append('<tr class="success"> <td>' +i+ '</td><td>'+mainCtrl.tabsData.eventsArr[i]+'</td></tr>');
                }

                scope.$on('scopeEvent', function(event, message) {
                    //Find the '<tbody>' element and start populate it with '<tr>' nodes
                    var tableElement = iElement.find("tbody");
                    var newItem = '<tr class="success"> <td>'+(mainCtrl.tabsData.eventsArr.length-1)+'</td><td>'+message+'</td></tr>';
                    tableElement.append(newItem);

/*
                    //Didn't work
                    if (tableElement.children().length == 0) {
                        tableElement.append(newItem);
                    }
                    else {
                        //Insert it to the beginning of the list
                        //tableElement.insertBefore( newItem, tableElement.children()[0] );
                        tableElement.insertBefore(newItem, tableElement.find("tr")[0]);
                    }
*/
                });
            }
        }
    };



})(angular)





