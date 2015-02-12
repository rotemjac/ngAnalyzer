

console.log("--In angularEx--");

function sendToContentScript(title,data) {

    if (!data) {
        data = "unusedData";
    }
    else {
        data = JSON.stringify(data);
    }

    var event = new CustomEvent(
        "dataFromAngularEx",
        {
            detail: {
                message: {
                    title :title,
                    data: data
                },
                time: new Date()
            },
            bubbles: true,
            cancelable: true
        }
    );

    var head = document.getElementsByTagName('head')[0];
    head.dispatchEvent(event);
}


///#source 1 1 /AngularEx/AngularEx.Base.js
'use strict'; 
(function (angular, undefined) {

    var moduleFn = angular.module,
        createInjector = angular.injector,
        originalModules = {},
        appModule = undefined,
        appElement,
        ngState,
        requires = [],
        plugins = [],
        moduleOrder = [],
        numOfModules = 0,
        isString = angular.isString,
        isArray = angular.isArray,
        isFunction = angular.isFunction,

    ngEx = {
        plugins: plugins,
        addRequiretongApp: addRequiretongApp,
        moduleOrder: moduleOrder,

        isString: angular.isString,
        isArray: angular.isArray,
        isFunction: angular.isFunction,
        forEach:forEach
    };
    window.angularEx = ngEx;
    //DEFER_BOOTSTRAP!
    window.name = 'NG_DEFER_BOOTSTRAP!';

    function addRequiretongApp(name) {
        requires.push(name);
    }
    /////////////////////////////////////////
    //  AngularJS override module function
    ////////////////////////////////////////
    angular.module = function (moduleName, req, config) {
            var mi = moduleFn(moduleName, req, config);
            numOfModules++;
            propertyDecorator(mi, '_invokeQueue');
            originalModules[mi.name] = mi;
            ngState = "create modules";
            mi.config(function() {
                ngState = mi.name + " in config state";
            });
            mi.run(function() {
                ngState = mi.name + " in run state";
            });
            return mi;
    };

    angular.injector = function () {
        ngState = "Create Injector";
        var start = new Date();
        var injector = createInjector.apply(this, arguments);
        var end = new Date() - start;
        sendToContentScript('createInjector : ' + end, 'ms');
        ngState = "Injector Created";
        return injector;

    };

    /////////////////////////////////////////
    //   Document Ready
    ////////////////////////////////////////
    angular.element(document).ready(function () {
        reloadAllScripts();
    });

    function reloadAllScripts() {
        var allUserScripts = [];
        for (var i = document.scripts.length-1; i >=0 ; i--) {
            if (
                (document.scripts[i].src.indexOf("angular.js") == -1) &&
                (document.scripts[i].src.indexOf("angularEx.js") == -1)
                ) {

                //Push user script to array and remove from DOM
                document.scripts[i].src  = document.scripts[i].src + '?x='+( Math.random() ) ;
/*
                document.scripts[i].defer = true;
                document.scripts[i].async = true;
*/


                allUserScripts.push(document.scripts[i]);

                document.scripts[i].remove();
            }
        }

        for (var i = allUserScripts.length-1; i >=0 ; i--) {

            //Worked
            $.getScript( allUserScripts[i].src );
            //Did not worked (files werent upload)
            /*
             var head = document.getElementsByTagName('head')[0];
             for (var i = allUserScripts.length - 1; i >= 0; i--) {
             head.appendChild(allUserScripts[i]);
             }
             */
        }


        //If we won't put a timeout we'll get an error in line 218 that 'appModule' isn't defined
        setTimeout(function () {
            buildAndResume();
        }, 2000);
    }
    function buildAndResume() {
        ngEx.modules = originalModules;

        findNgAppElement(window.document);

        forEach(plugins, function (plg) {
            plg();
        });

        if ( (angular) && (typeof(angular.resumeBootstrap) == "function") ) {
            angular.resumeBootstrap([]);
        }
        else {
            location.reload();
        }

    }


    function propertyDecorator(obj, propName) {
        var newPropName = "_" + propName,
            propDesc = {},
            value = obj[propName];

        propDesc[propName] = {
            get: function () {
                if (appModule && appElement && !appElement.injector && ngState != "run") {
                    //console.debug('module name ' + obj.name);
                    if (window.angularEx.moduleOrder.length < numOfModules)
                        window.angularEx.moduleOrder.push(obj);
                }
                return this[newPropName];
            },
            set: function (nvalue) {
                //console.debug('set ' + propName + ' : ' + nvalue);
                if (this[newPropName] !== nvalue) {
                    this[newPropName] = nvalue;
                }
            }
        };

        Object.defineProperties(obj, propDesc);
        obj[newPropName] = value;
    }

    /////////////////////////////////////////
    //   AngularJS Methods (Copy)
    ////////////////////////////////////////
    function findNgAppElement(element) {
        var elements = [element],
        //appElement,
        module,
        names = ['ng:app', 'ng-app', 'x-ng-app', 'data-ng-app'],
        NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;

        function append(element) {
            element && elements.push(element);
        }

        forEach(names, function (name) {
            names[name] = true;
            append(document.getElementById(name));
            name = name.replace(':', '\\:');
            if (element.querySelectorAll) {
                forEach(element.querySelectorAll('.' + name), append);
                forEach(element.querySelectorAll('.' + name + '\\:'), append);
                forEach(element.querySelectorAll('[' + name + ']'), append);
            }
        });

        forEach(elements, function (element) {
            if (!appElement) {
                var className = ' ' + element.className + ' ';
                var match = NG_APP_CLASS_REGEXP.exec(className);
                if (match) {
                    appElement = element;
                    module = (match[2] || '').replace(/\s+/g, ',');
                } else {
                    forEach(element.attributes, function (attr) {
                        if (!appElement && names[attr.name]) {
                            appElement = element;
                            module = attr.value;
                        }
                    });
                }
            }
        });

        if (appElement) {
            if (!appModule) {
                    appModule = originalModules[module];
                    appModule.requires = appModule.requires.concat(requires);
                    ngEx.appModule = appModule;
                    ngEx.rootElement = angular.element(appElement);
            }
        }
    }
    function forEach(obj, iterator, context) {
        var key;
        if (obj) {
            if (isFunction(obj)) {
                for (key in obj) {
                    if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key);
                    }
                }
            } else if (obj.forEach && obj.forEach !== forEach) {
                obj.forEach(iterator, context);
            } else if (isArrayLike(obj)) {
                for (key = 0; key < obj.length; key++)
                    iterator.call(context, obj[key], key);
            } else {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key);
                    }
                }
            }
        }
        return obj;
    }
    function isArrayLike(obj) {
        if (obj == null || isWindow(obj)) {
            return false;
        }

        var length = obj.length;

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return isString(obj) || isArray(obj) || length === 0 ||
               typeof length === 'number' && length > 0 && (length - 1) in obj;
    }
    function isWindow(obj) {
        return obj && obj.document && obj.location && obj.alert && obj.setInterval;
    }

})(angular);


///#source 1 1 /AngularEx/AngularEx.ModulesDumper.js
'use strict';
(function (angular) {
    var ngEx = window.angularEx;

    ngEx.printModuleTree = printModuleTree;
    ngEx.getModulesTree = getModulesTree;

    /////////////////////////////////////////
    //   AngularEx Functions
    ////////////////////////////////////////
   
    function printModuleTree(module) {
        var tree = getModulesTree(module);

        printModule(tree, 0);

        function printModule(m, level) {
            var space = '';
            for (var i = 0; i < level; i++) {
                space += ' ';
            }
            if (!m || typeof m === 'string') {
                sendToContentScript ("In printModule: " +space + m);
                return;
            }

            sendToContentScript("In printModule: " +space + m.name);

            space += '  ';
            printItem('controllers', m.controllers, space);
            printItem('directive', m.directive, space);
            printItem('filter', m.filter, space);

            printItem('provider', m.provider, space);
            printItem('factory', m.factory, space);
            printItem('service', m.service, space);
            printItem('value', m.value, space);
            printItem('constant', m.constant, space);

            printItem('animation', m.animation, space);


            level += 4;
            if (m.requires && m.requires.length != 0) {
                sendToContentScript("In printModule: " +space + 'requires');
                m.requires.forEach(function (mi) {
                    printModule(mi, level);
                });
            }
        }
    }
    function printItem(name, items, space) {
        if (!items) return;
        sendToContentScript("In printItem: " +space + name);
        items.forEach(function (item) {
            sendToContentScript("In printItem: " +space + '  ' + item);
        });
    }

    function getModulesTree(module) {
        module = module || ngEx.appModule;
        var m = {
            name: module.name,

            provider: getInvokeQueueItems('$provide', 'provider', module),
            factory: getInvokeQueueItems('$provide', 'factory', module),
            service: getInvokeQueueItems('$provide', 'service', module),
            value: getInvokeQueueItems('$provide', 'value', module),
            constant: getInvokeQueueItems('$provide', 'constant', module),

            controllers: getInvokeQueueItems('$controllerProvider', 'register', module),
            animation: getInvokeQueueItems('$animateProvider', 'register', module),
            filter: getInvokeQueueItems('$filterProvider', 'register', module),
            directive: getInvokeQueueItems('$compileProvider', 'directive', module),
            //config:'',
            //run: '',
            requires: buildRequires(module.requires)

        }
        for (var p in m) {
            if (!m[p]) {
                delete m[p];
            }
        }
        return m;
    }
    function buildRequires(requires) {
        var modules = [];
        if (requires) {
            requires.forEach(function (m) {
                if (ngEx.modules[m]) {
                    modules.push(getModulesTree(ngEx.modules[m]));
                }
            });
        }
        return modules;
    }
    function getInvokeQueueItems(provider, method, module) {
        var items = [];

        if (!module._invokeQueue || module._invokeQueue.length == 0) return;

        module._invokeQueue.forEach(function (item) {
            if (item[0] == provider && item[1] == method) {
                items.push((item[2][0]));
            }
        });

        if (items.length === 0) return;

        return items;
    }

})(angular);


///#source 1 1 /AngularEx/AngularEx.DirectivesDumper.js
'use strict';
(function (angular) {
    var sentFlag=false;


    var moduleFn = angular.module,
        ngEx = window.angularEx;

    ngEx.directives = [];
    ngEx.plugins.push(function () {
        ngEx.appModule.run(function ($injector) {
            ngEx.forEach(ngEx.directives, function (directive) {
                var ddo = $injector.get(directive.name + 'Directive')[0];
                angular.extend(directive, ddo);
            });
        });
    });
    
    /////////////////////////////////////////
    //  AngularJS override module function
    ////////////////////////////////////////
    angular.module = function (moduleName, req, config) {
        var mi = moduleFn(moduleName, req, config);
        mi.directive = directiveAngularEx(mi);
        return mi;
    };
    function directiveAngularEx(module) {
        var originalDirective = module.directive;
        return function (name, directiveFactory) {
            ngEx.directives.push({module: module.name, name:name, ddo:{}});

            //Added by rotem in order to send this only once
            setTimeout(function() {
                    if (sentFlag == false) {
                        sentFlag=true;
                        //console.log("directives: ", ngEx.directives);

                        var dataToSend = {
                            components: ngEx.getModulesTree(),
                            directives : ngEx.directives
                        }
                        sendToContentScript("components",dataToSend);
                    }
                }
            ,2000)

            return originalDirective(name, directiveFactory);
        }
    }

    /////////////////////////////////////////
    //   AngularEx Functions
    ////////////////////////////////////////
    function initDecorator($provide) {

        function decorator(method, provideFn) {
            return function (name, fn) {
                //console.log("Provide Method '%s',key:'%s' func '%s'", method, name, fn);
                ////console.log("$provide Method '%s',key:'%s'", method, name);

                return provideFn(name, fn);
            };
        }

        var tempProvide = $provide;

        //$provide.provider  = decorator('provider', tempProvide.provider);
        //$provide.factory   = decorator('factory', tempProvide.factory);
        //$provide.service   = decorator('service', tempProvide.service);
        //$provide.value     = decorator('value', tempProvide.value);
        //$provide.constant  = decorator('constant', tempProvide.constant);
        //$provide.decorator = decorator('decorator', tempProvide.decorator);
        

        //$provide.decorator('$compile', function ($delegate, $log) {
        //    var result = function ($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
        //        console.groupCollapsed("$compile '%s'", $compileNodes[0]);

        //        console.time("$compile");
        //        var link = $delegate($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext);
        //        console.timeEnd("$compile");


        //        return function (scope, cloneFn) {

        //            console.groupCollapsed("$compile -> Link scope.$id: '%s'", scope.$id);
        //            console.time("Link");
        //            var linkreult = link(scope, cloneFn);
        //            console.timeEnd("Link");
        //            console.groupEnd();

        //            console.groupEnd();
        //            return linkreult;
        //        };
        //    };
        //    return result;
        //});

        //$provide.decorator('$parse', function ($delegate) {
        //    var dec = function (exp) {
        //        console.time("$parse");
        //        var resultFn = $delegate(exp);

        //        console.timeEnd("$parse");
        //        console.log(exp);
        //        return resultFn;
        //    };
        //    return dec;
        //});

        //$provide.decorator('$interpolate', function ($delegate) {
        //    var dec = function (text, mustHaveExpression, trustedContext) {
        //        console.log("$interpolate '%s'", text);
        //        console.time("$interpolate");
        //        var resultFn = $delegate(text, mustHaveExpression, trustedContext);
        //        console.timeEnd("$interpolate");
        //        console.log(text);
        //        return resultFn;
        //    };
        //    dec.startSymbol = $delegate.startSymbol;
        //    dec.endSymbol = $delegate.endSymbol;
        //    return dec;
        //});

        //$provide.decorator('$injector',function($delegate) {
        //    return $delegate;
        //});
    }

})(angular);



///#source 1 1 /AngularEx/AngularEx.PrefCompile.js
'use strict';
(function (angular) {
    var moduleFn = angular.module,
        ngEx = window.angularEx;

    ngEx.compileData = [];
    ngEx.plugins.push(function () {
        ngEx.appModule.config(function ($provide) {
            initDecorator($provide);
        });
    });

    /////////////////////////////////////////
    //   AngularEx Functions
    ////////////////////////////////////////
    function initDecorator($provide) {

        $provide.decorator('$compile', function ($delegate, $log) {
            var result = function ($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
                var cd = {
                    compileNodes: $compileNodes.length === 1 ? $compileNodes[0] : $compileNodes,
                    scopeId: '',
                    start: new Date().getTime(),
                    end: '',
                    compileTotal: '',
                    linkStart: '',
                    linkEnd: '',
                    linkTotal: ''
                    
                }
                
                var link = $delegate($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext);
                cd.end = new Date().getTime();
                cd.compileTotal = cd.end - cd.start;
                //There was no log here (added by rotem)
                sendToContentScript("Compile: " +cd.compileTotal);


                return function (scope, cloneFn) {
                    cd.scopeId = scope.$id;
                    cd.linkStart = new Date().getTime();

                    var linkreult = link(scope, cloneFn);

                    cd.linkEnd = new Date().getTime();
                    cd.linkTotal = cd.linkEnd - cd.linkStart;
                    //There was no log here (added by rotem)
                    sendToContentScript("Link: " +cd.linkTotal);

                    ngEx.compileData.push(cd);
                    console.log("compileData: ", ngEx.compileData);
                    return linkreult;
                };
            };
            return result;
        });

        //$provide.decorator('$parse', function ($delegate) {
        //    var dec = function (exp) {
        //        console.time("$parse");
        //        var resultFn = $delegate(exp);

        //        console.timeEnd("$parse");
        //        console.log(exp);
        //        return resultFn;
        //    };
        //    return dec;
        //});

        //$provide.decorator('$interpolate', function ($delegate) {
        //    var dec = function (text, mustHaveExpression, trustedContext) {
        //        console.log("$interpolate '%s'", text);
        //        console.time("$interpolate");
        //        var resultFn = $delegate(text, mustHaveExpression, trustedContext);
        //        console.timeEnd("$interpolate");
        //        console.log(text);
        //        return resultFn;
        //    };
        //    dec.startSymbol = $delegate.startSymbol;
        //    dec.endSymbol = $delegate.endSymbol;
        //    return dec;
        //});

        //$provide.decorator('$injector',function($delegate) {
        //    return $delegate;
        //});
    }

})(angular);


'use strict';
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
                ngEx.scopes.logs.push({id:this.$id,$digest:end});
                sendToContentScript('digest', {id:this.$id,digest:end});
            }


            $delegate.$new = function (isolate) {
                var scope = innerNew.call(this, isolate);
                scope.$watch = watchFn;
                //$log.debug(scope.$id);
                sendToContentScript('$new :'+ scope.$id);
                ngEx.scopes.scopes[scope.$id] = scope;

/*
                scope.$on('$destroy', function() {
                    ngEx.scopes.totalWatch -= scope.$$watchers.length;
                    delete ngEx.scopes.scopes[scope.$id];
                });
*/

                return scope;
            }

            $delegate.$destroy = function () {
                //$log.debug("$destroy scope id: " + this.$id);
                if (this.$$watchers) {
                    ngEx.scopes.totalWatch -= this.$$watchers.length;
                }
                console.log("ngEx.scopes.totalWatch: " +ngEx.scopes.totalWatch);
                sendToContentScript('totalWatches :' + ngEx.scopes.totalWatch);
                delete ngEx.scopes[this.$id];
                innerDestroy.call(this);
            };

            $delegate.$watch = watchFn;

            function watchFn(watchExp, listener, objectEquality) {
                //var start = new Date();
                var self = this;

                ngEx.scopes.totalWatch++;
                //$log.debug(getWatchName(watchExp));
                sendToContentScript('totalWatches :' + ngEx.scopes.totalWatch);

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
                ////$log.debug('scope:' + this.$id + ', $on: ' + name);
                sendToContentScript('scope:' + this.$id + ', $on: ' + name);
                addSub(name, listener, this.$id);
                return onFn.call(this, name, listener);
            };

            $delegate.$emit = function (name, args) {
                ////$log.debug('scope:' + this.$id + ', $emit: ' + name);
                sendToContentScript('scope:' + this.$id + ', $emit: ' + name);
                addPub('emit', name, args, this.$id);

                return emitFn.call(this, name, args);
            };

            $delegate.$broadcast = function (name, args) {
                ////$log.debug('scope:' + this.$id + ', $brodcast: ' + name + ' , args: ' + args);
                sendToContentScript('scope:' + this.$id + ', $brodcast: ' + name + ' , args: ' + args);
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
//@ sourceURL=AngularEx.js
