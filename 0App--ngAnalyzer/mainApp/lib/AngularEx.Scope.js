
console.log("--In angularEx.Scope--");

(function (angular) {'use strict';
    var moduleFn = angular.module,
        ngEx = window.angularEx;

    ngEx.scopes = {};
    ngEx.scopes.events = {};
    ngEx.plugins.push(function () {
        ngEx.appModule.config(function ($provide) {
            initDecorator($provide);
        });
    });

    /////////////////////////////////////////
    //   AngularEx Functions
    ////////////////////////////////////////
    function initDecorator($provide) {
        $provide.decorator('$rootScope', function ($delegate, $log) {
            var onFn = $delegate.$on,
                emitFn = $delegate.$emit,
                bordcastFn = $delegate.$broadcast,
                innerWatch = $delegate.$watch,
                innerNew = $delegate.$new,
                innerDestroy = $delegate.$destroy,
                innerDigest = $delegate.$digest;

            ngEx.scopes.totalWatch = 0;
            ngEx.scopes.scopes = {};
            ngEx.scopes.logs = [];

            $delegate.$digest = function () {
                var start = new Date();
                innerDigest.apply(this, arguments);
                var end = new Date() - start;
                ////console.log('$digest :', end, 'ms');
                chrome.extension.sendRequest('$digest :', end, 'ms');
                ngEx.scopes.logs.push({id:this.$id,$digest:end});

            }


            $delegate.$new = function (isolate) {
                var scope = innerNew.call(this, isolate);
                scope.$watch = watchFn;
                //$log.debug(scope.$id);

                ngEx.scopes.scopes[scope.$id] = scope;

                scope.$on('$destroy', function() {
                    ngEx.scopes.totalWatch -= scope.$$watchers.length;
                    delete ngEx.scopes.scopes[scope.$id];
                });

                return scope;
            }

            //$delegate.$destroy = function () {
            //    //$log.debug("$destroy scope id: " + this.$id);
            //    ngEx.scopes.totalWatch -= this.$$watchers.length;
            //    delete ngEx.scopes[this.$id];
            //    innerDestroy.call(this);
            //};


            $delegate.$watch = watchFn;

            function watchFn(watchExp, listener, objectEquality) {
                //var start = new Date();
                var self = this;

                //$log.debug(getWatchName(watchExp));

                ngEx.scopes.totalWatch++;
                var unWatch = innerWatch.apply(self, arguments);

                return function () {
                    ngEx.scopes.totalWatch--;
                    unWatch();
                };
            }
            function getWatchName(fn) {
                if (fn.exp) {
                    return fn.exp.trim();
                } else if (fn.name) {
                    return fn.name.trim();
                } else {
                    return fn.toString();
                }
            };
            ///////////////////////////////////////
            //  Scope Events
            //////////////////////////////////////
            $delegate.$on = function (name, listener) {
                $log.debug('scope:' + this.$id + ', $on: ' + name);
                addSub(name, listener, this.$id);
                return onFn.call(this, name, listener);
            };

            $delegate.$emit = function (name, args) {
                $log.debug('scope:' + this.$id + ', $emit: ' + name);
                addPub('emit', name, args, this.$id);

                return emitFn.call(this, name, args);
            };

            $delegate.$broadcast = function (name, args) {
                $log.debug('scope:' + this.$id + ', $brodcast: ' + name + ' , args: ' + args);
                addPub('brodcast', name, args, this.$id);
                return bordcastFn.call(this, name, args);
            };

            return $delegate;

            function addPub(type, name, args, id) {
                if (!ngEx.scopes.events[name]) {
                    ngEx.scopes.events[name] = {
                        pub: [{ id: id, type: type, args: args }],
                        sub: []
                    };
                } else {
                    ngEx.scopes.events[name].pub.push({ id: id, type: type, args: args });
                }
            }
            function addSub(name, listener, id) {
                if (!ngEx.scopes.events[name]) {
                    ngEx.scopes.events[name] = {
                        pub: [],
                        sub: [{ id: id, listener: listener }]
                    };
                } else {
                    ngEx.scopes.events[name].sub.push({ id: id, listener: listener });
                }
            }
        });
    }

})(angular);
//@ sourceURL=AngularEx.Scope.js