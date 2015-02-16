# ngAnalyzer


Bugs tracking:


1. Error:     Uncaught TypeError: Cannot read property 'name' of undefined:
   Location : AngularEx.js:351.
   Code:
     function getModulesTree(module) {
        module = module || ngEx.appModule;
        var m = {
            name: module.name,
