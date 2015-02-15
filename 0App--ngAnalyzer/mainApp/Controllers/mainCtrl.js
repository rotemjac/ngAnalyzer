/* --- Unused ---*/

(function (angular) {

    myApp.controller('MainCtrl', MainCtrl);

    //For minification issues
    MainCtrl.$inject = ['$scope'];

    function MainCtrl($scope) {

        var self = this;

        this.navData     = ['Dashboard', 'Components' , 'About'];
        this.currentView =  'Dashboard';
        this.currentUrl  =  'Home';

        this.changeTab = function(event) {

            //Only if the the event contains defined data and we're switching to a new tab - change the flag
            if ( (event.target.textContent) && (event.target.textContent != "") && (event.target.textContent != this.currentView) ) {
                this.currentView = event.target.textContent;
            }


            //When we move away from the 'directives' tab - return to the default view of the mainModule
            if (this.currentView != 'Directives') {
                this.currentModuleName = this.mainModuleName;
            }
        }

        this.tabsData = {
            scopeNum : 0,
            watchNum : 0,
            digestArr: {
                labels : [],
                data   : []
            },
            eventsArr: []
        };

        /* Components tab data and logic */

        this.directiveTabDataArrivedFlag = false;
        this.mainModuleName = '';
        this.currentModuleName = '';

        this.componentsData = {};
        this.directivesData = [];

        this.directivesTabLogic = {

            getAllRequires                : getAllRequires,
            getComponentsOfCurrentModule  : getComponentsOfCurrentModule,
            getDirectivesOfCurrentModule  : getDirectivesOfCurrentModule,

            changeCurrentModule           : changeCurrentModule,

            informComponentsAndDirectives : informComponentsAndDirectives
        };


        function getAllRequires() {

            //First of all - set the current components data

            var resData = this.getComponentsOfCurrentModule();

            return resData;

            //------------------ Un-reached -------------------- //
            //If there is no data - 'resData' will be undefined
            if (resData) {
                //If we return the main module we don't wrap it
                if (resData.requires) {
                    return resData.requires;
                }
                //If its not the main module we wrap it with "foundModule" (fix this later)
                else {
                    return resData.foundModule.requires;
                }
            }
        }

        function getComponentsOfCurrentModule () {
            var data = self.componentsData;
            if (data) {
                if (data.name == self.currentModuleName) {
                    return data;
                }
                else {
                    var obj ={};
                    var currentModule = getFromTree(data,self.currentModuleName,obj);
                }
            }
            return currentModule;
        };

        function getDirectivesOfCurrentModule () {
            var resArr = [];
            var allDirectives = self.directivesData;
            for (var i=0 ; i<allDirectives.length ; i++ ) {
                if (allDirectives[i].module == self.currentModuleName)  {
                    resArr.push(allDirectives[i]);
                }
            }
            return resArr;
        }


        //This will be public to all child directives (the ng-select of them is set on it)
        function  changeCurrentModule  (moduleName) {
            self.currentModuleName = moduleName;
            self.directivesTabLogic.informComponentsAndDirectives();
        }

        function informComponentsAndDirectives () {
            $scope.$broadcast('directivesTabEvent');
        }


        $scope.$on('dataFromExtension', function (event,message) {

            var cuttingIndex,eventType,eventData;

            if (message.data == "unusedData") {
                cuttingIndex = message.title.indexOf(":");
                eventType = message.title.slice(0,cuttingIndex-1);
                eventData = message.title.slice(cuttingIndex+1);
            }
            else {
                eventData = JSON.parse(message.data);
            }

            //Notice: some of the events from the contentScript doesn't use the message.data field (like $new,totalWatches,scop) - all those that add ":" to the event name in the angularEx.js file
            // and some do use it (like digest,components)

            //The 'scopes' chart listen to this
            if (eventType == '$new' ) {
                //A javascript way to check if 'eventData' value is a number (sometimes its not a then the scopes charts becomes empty)
                if (!isNaN(parseFloat(eventData)) && isFinite(eventData)) {
                    self.tabsData.scopeNum = eventData;
                    $scope.$broadcast('ScopesEvent', eventData);
                }
            }
            //The 'watches' chart listen to this
            else if (eventType == 'totalWatches' ) {
                self.tabsData.watchNum = eventData;
                $scope.$broadcast('WatchesEvent', eventData);
            }
            //The 'digest' chart listen to this
            // Notice: here we look at 'message' and not on 'eventType'
            else if (message.title == 'digest' ) {
                //self.tabsData.digestArr = eventData;  //Do not update it in mainCtrl from here - we'll do it from the myChart directive after some extra logic
                $scope.$broadcast('DigestEvent', eventData);
            }
            //
            else if (eventType == 'scop') {

                //1 - Split the message data
                var messageArr = message.title.split( ',' );

                //2 - Then add the different fields to a new object

                var newEventObj = {
                    id        : self.tabsData.eventsArr.length,
                    scopeNum  : messageArr[0].split(":")[1], //Get the value after the ":"
                    eventType : messageArr[1],
                    eventArgs : ""
                };

                //3 - Dynamically override the default "" value - in order to avoid exceptions on the "split" operation when event doesn't have any args (most of the time)
                if (messageArr[2]) {
                    newEventObj.eventArgs = messageArr[2].split(":")[1]//Get the value after the ":"
                }

                //4 - Then to the start of scope array
                self.tabsData.eventsArr.unshift(newEventObj);

                //5 - Let the mgGrid directive know about the arrival of new data
                $scope.$broadcast('scopeEvent', eventData);

                //6 - Check if the user switched a view and broadcast the relevant event to locationUrl directive
                if (message.title.indexOf('$locationChangeStart') > -1) {
                    var directoriesArray = message.title.split( '/' );
                    for ( var i=0 ; i < directoriesArray.length ; i++) {
                        if (directoriesArray[i].indexOf('.html') > -1) {
                            var startOfBaseUrl = message.title.indexOf(directoriesArray[i]);
                            self.currentUrl    = message.title.slice(startOfBaseUrl);
                            break;
                        }
                    }
                    $scope.$broadcast('urlChangedEvent');
                }
            }
            //Notice: here we look at 'message' and not on 'eventType'
            else if (message.title == 'components') {

                //If this is the first time - mainModuleName is empty so update it
                if (self.mainModuleName == '') {
                    self.mainModuleName = eventData.components.name;
                }

                self.directiveTabDataArrivedFlag = true;
                self.currentModuleName = eventData.components.name;
                self.componentsData    = eventData.components;
                self.directivesData    = eventData.directives;

                self.directivesTabLogic.informComponentsAndDirectives();
            }
        });


        /* Local methods */

        function getFromTree (treeData,nameToSearch,obj) {
            var obj = obj;
            if (treeData.requires && treeData.requires.length>0) {
                treeData.requires.forEach(function (data) {
                    getFromTree(data,nameToSearch,obj);
                    if (data.name == nameToSearch) {
                        obj["foundModule"] = data;
                    }
                })
            }
            return obj;
        }


    };


})(angular)

