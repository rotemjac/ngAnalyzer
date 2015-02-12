(function (angular) {



 myApp.directive('myChart', myChart);

 myChart.$inject = ['$interval'];

 function myChart ($interval) {
        return {
            restrict: 'E',
            replace:true,
            scope: true,
            template: function (tElement,tAttrs) {
                var newTemplateWithQuotes = buildChart(tAttrs.type);
                return newTemplateWithQuotes;
            },
            controller: function () {

            },
            controllerAs: 'myChartCtrl',
            require: ['^ngAnalyzer', '^myChart'],
            link: function postLink (scope, iElement, iAttrs , ctrlArr) {
                        //---------- Get all data --------//

                        var mainCtrl    = ctrlArr[0];
                        var localCtrl   = ctrlArr[1];

                        //Please notice that in the array inside 'localCtrl.data.datasets[0]' should be called data (or else we'll get the error of: "Cannot read property 'x' of undefined")
                        localCtrl.data    = initChartData(mainCtrl, iAttrs.title);
                        localCtrl.options = getChartOptions(iAttrs.type);

                        var lastUpperData = 0 ;
                        var eventName     = iAttrs.title+ "Event";

                        scope.$on(eventName, function(event, dataFromEvent) {

                            //On the first data change event - access the global variable in Chart.js and stop animating
                            window.Chart.defaults.global.animation = false;

                            if ( (iAttrs.type == 'line' || iAttrs.type == 'bar') && (lastUpperData != dataFromEvent) ) {
                                //The item of 'localCtrl.data.datasets[0].data[0]' is the most updated value in the array
                                if (localCtrl.data.datasets[0].data[0] != dataFromEvent ) {

                                    if (iAttrs.type == 'line') {
                                        //First of all make room for the new data (shift all other data to the right)
                                        localCtrl.data.datasets[0].data     = shiftPlacesInArray (localCtrl.data.datasets[0].data);
                                        //Only then you can override the first item
                                        localCtrl.data.datasets[0].data[0]  = dataFromEvent;
                                    }
                                    //Like in the line chart - but here you need to do the same for the labels as well
                                    else if (iAttrs.type == 'bar') {
                                        //I don't want to display digest of 0-1[ms]
                                        if (dataFromEvent.digest > 1) {
                                            //First of all make room for the new data (shift all other data to the right)
                                            localCtrl.data.labels                    = shiftPlacesInArray (localCtrl.data.labels);
                                            localCtrl.data.datasets[0].data          = shiftPlacesInArray (localCtrl.data.datasets[0].data);

                                            //Only then you can override the first item
                                            localCtrl.data.labels[0]            = "Scope " +dataFromEvent.id;
                                            localCtrl.data.datasets[0].data[0]  =           dataFromEvent.digest;

                                            //In the bar chart case - go and update data in the mainCtrl (when the event arrives to there wo DO NOT save the "raw" data there because it has no meaning for us
                                            mainCtrl.tabsData.digestArr.labels  = localCtrl.data.labels;
                                            mainCtrl.tabsData.digestArr.data    = localCtrl.data.datasets[0].data;
                                        }
                                    }

                                    lastUpperData = dataFromEvent;
                                }
                            }
                        });

                        //A 'moving' chart over time is relevant only for line chart (scopes and watches)
                        if (iAttrs.type == 'line') {
                            $interval(function(){
                                localCtrl.data.datasets[0].data = shiftPlacesInArray (localCtrl.data.datasets[0].data);
                            },1000);
                        }
            }
        }
 };

  /* Get a template as param, extract the selected chart type (passed as attribute) adds commas around it (because angular-charts demands for it) and return the new template */
  function buildChart(chartType) {
        //Then - build the template
        var template = "<canvas tc-chartjs chart-type = "+chartType+" chart-data='myChartCtrl.data' chart-options='myChartCtrl.options' class='well myChart'></canvas>";
        //var newTemplate = template.replace("inject",chartType);
        //var newTemplateWithQuotes = newTemplate.replace(chartType, "\"" +chartType+ "\"" );
        return template;
  }

  function getChartOptions (chartType) {
        var lineChartOptions      =  {

            // Sets the chart to be responsive
            responsive: true,

            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines : true,

            //String - Colour of the grid lines
            scaleGridLineColor : "rgba(250,250,250,.05)",

            //Number - Width of the grid lines
            scaleGridLineWidth : 3,

            //Boolean - Whether the line is curved between points
            bezierCurve : false,

            //Number - Tension of the bezier curve between points
            bezierCurveTension : 0.4,

            //Boolean - Whether to show a dot for each point
            pointDot : false,

            //Number - Radius of each point dot in pixels
            pointDotRadius : 4,

            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth : 1,

            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius : 20,

            //Boolean - Whether to show a stroke for datasets
            datasetStroke : true,

            //Number - Pixel width of dataset stroke
            datasetStrokeWidth : 2,

            //Boolean - Whether to fill the dataset with a colour
            datasetFill : true,

            // Function - on animation progress
            onAnimationProgress: function(){},

            // Function - on animation complete
            onAnimationComplete: function(){},

            //String - A legend template
            legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
        };
        var barChartOptions       =  {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
            scaleBeginAtZero : true,

            //Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines : true,

            //String - Colour of the grid lines
            scaleGridLineColor : "rgba(0,0,0,.05)",

            //Number - Width of the grid lines
            scaleGridLineWidth : 1,

            //Boolean - If there is a stroke on each bar
            barShowStroke : true,

            //Number - Pixel width of the bar stroke
            barStrokeWidth : 2,

            //Number - Spacing between each of the X value sets
            barValueSpacing : 5,

            //Number - Spacing between data sets within X values
            barDatasetSpacing : 1,

            //String - A legend template
            legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
        };
        var doughnutChartOptions  =  {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke : true,

            //String - The colour of each segment stroke
            segmentStrokeColor : '#fff',

            //Number - The width of each segment stroke
            segmentStrokeWidth : 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout : 50, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps : 100,

            //String - Animation easing effect
            animationEasing : 'easeOutBounce',

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate : true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale : false,

            //String - A legend template
            legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

        };
        var polarChartOptions     =  {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Show a backdrop to the scale label
            scaleShowLabelBackdrop : true,

            //String - The colour of the label backdrop
            scaleBackdropColor : 'rgba(255,255,255,0.75)',

            // Boolean - Whether the scale should begin at zero
            scaleBeginAtZero : true,

            //Number - The backdrop padding above & below the label in pixels
            scaleBackdropPaddingY : 2,

            //Number - The backdrop padding to the side of the label in pixels
            scaleBackdropPaddingX : 2,

            //Boolean - Show line for each value in the scale
            scaleShowLine : true,

            //Boolean - Stroke a line around each segment in the chart
            segmentShowStroke : true,

            //String - The colour of the stroke on each segement.
            segmentStrokeColor : '#000',

            //Number - The width of the stroke value in pixels
            segmentStrokeWidth : 2,

            //Number - Amount of animation steps
            animationSteps : 100,

            //String - Animation easing effect.
            animationEasing : 'easeOutBounce',

            //Boolean - Whether to animate the rotation of the chart
            animateRotate : true,

            //Boolean - Whether to animate scaling the chart from the centre
            animateScale : false,

            //String - A legend template
            legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
        };

        switch(chartType) {
            case "line":
                return lineChartOptions;
            case "bar":
                return lineChartOptions;
            case "doughnut":
                return doughnutChartOptions;
            case "polararea":
                return polarChartOptions;
            default:
                return lineChartOptions;
        }
  }

  function shiftPlacesInArray (data) {
      //Don't pass 10 items in array
      if ( (data) && (data.length > 10) ) {
          data = data.splice(0,10);
      }

      //Shift values one place to the right
      for (var i = data.length; i > 0; i--) {
          data[i] = data[i - 1];
      }

      return data;
  }

  function initChartData(mainCtrl, directiveTopic) {

      var res = {
          data   : [],
          labels : []
      };

      //Populate the init data from the controller
      if (directiveTopic == 'Scopes') {
          initDataArrayOfDynamicChart(mainCtrl.tabsData.scopeNum);
      }
      else if (directiveTopic == 'Watches') {
          initDataArrayOfDynamicChart(mainCtrl.tabsData.watchNum);
      }
      else if (directiveTopic == 'Digest') {
          initDataArrayOfStaticChart(mainCtrl.tabsData.digestArr);
      }

      function initDataArrayOfDynamicChart (initData) {
          //Initialize the array
          for (var i = 0; i < 10; i++) {
              res.labels[i] = i;
              res.data[i]   = initData;
          }
          res.labels[0] = "Now";
          res.labels[9] = "9[Sec]";
      };

      function initDataArrayOfStaticChart (initData) {

          //Initialize the array
          for (var i = 0; i < initData.labels.length; i++) {
              //If the label value DO NOT contains the word "Scope" - add it
              var prefix = "";
              if (initData.labels[i].indexOf("Scope") < 0) {
                    prefix = "Scope ";
              }
              res.labels[i] =   prefix + initData.labels[i];
              res.data[i]   =   initData.data  [i];
          }

      };

      var datasets = [
          {
              label : "Some title",
              data  : res.data
          }
      ];


      var chartTotalData = {
          labels:   res.labels,
          datasets: datasets
      };

    return chartTotalData;
  }

})(angular)






