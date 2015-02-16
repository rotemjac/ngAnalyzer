# ngAnalyzer


Bugs tracking:


1. Error:     Uncaught TypeError: Cannot read property 'name' of undefined.
   
   Location : AngularEx.js:351.
   
   Code:
     function getModulesTree(module) {
        module = module || ngEx.appModule;
        var m = {
            name: module.name,

2. Error: Uncaught TypeError: Cannot read property 'run' of undefined.
   Location: AngularEx.js:416.
   Code:
             ngEx.plugins.push(function () {
                 ngEx.appModule.run(function ($injector) {
