(function (library) {
    // Calls the second IIFE and locally passes in the global jQuery, window, and document objects
    library(window, document);
}
// Locally scoped parameters 
(function (window, document) {
    var dynamicLoad = {};

    dynamicLoad.settings = {
        jQuery : true,
        debug : true
    }
    dynamicLoad.script = function(url,element) {
        var script      = document.createElement("SCRIPT");
        script.src      = url;
        script.type     = 'text/javascript';
        document.getElementsByTagName(element)[0].appendChild(script);
    }
    dynamicLoad.css = function(url,element) {
        if(document.createStyleSheet) {
            try { document.createStyleSheet(url); } catch (e) { }
        }
        else {
            var css;
            css         = document.createElement('link');
            css.rel     = 'stylesheet';
            css.type    = 'text/css';
            css.media   = "all";
            css.href    = url;
            document.getElementsByTagName(element)[0].appendChild(css);
        }
    }
    dynamicLoad.loadHTML = function(url,target) {
        if(dynamicLoad.settings.jQueryLoaded) {
            $(target).load(url);
        }
    }
    dynamicLoad.checkReady = function(library,callback) {
        if(library === 'jQuery') {
            if (window.jQuery) {
                callback(jQuery);
            }
            else {
                window.setTimeout(function() { dynamicLoad.checkReady(library,callback); }, 20);
            }
        }
        if(library === 'bootstrap') {
            if(dynamicLoad.settings.jQueryLoaded) {
                if(typeof($.fn.modal)) {
                    callback($.fn.modal); 
                }
            }
            else {
                window.setTimeout(function() { dynamicLoad.checkReady(library,callback); }, 20);
            }
        }
    }
    dynamicLoad.jQueryReady = function() {
        $('#jq_target').append('<i>Hello from jQuery</i><br/>');
        dynamicLoad.settings.jQueryLoaded = true;
        dynamicLoad.onjQueryLoaded();
    }
    dynamicLoad.bootstrapReady = function() {
        $('#jq_target').append('<strong>bootstrap loaded too.</strong>');
    }
    dynamicLoad.onjQueryLoaded = function() {
        dynamicLoad.script('js/bootstrap.min.js','head');
        dynamicLoad.checkReady('bootstrap',dynamicLoad.bootstrapReady);
        $('#jq_target').append('<div id="htmlcontent"></div>');
        dynamicLoad.loadHTML('loaded.html #loadcontent','#htmlcontent');
    }
    // Load jQuery
    dynamicLoad.script('js/jquery-1.11.1.min.js','head');
    dynamicLoad.css('css/bootstrap.min.css','head');
    // Check if jQuery is loaded
    dynamicLoad.checkReady('jQuery',dynamicLoad.jQueryReady);
    
// END Library code
// Expose Library to window object
window.dynamicLoad = dynamicLoad;
}));