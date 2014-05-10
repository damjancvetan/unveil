/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(options, callback) {

    var scrollDir;

    if(typeof options === "object"){
      var threshold = options.threshold || 0;
      var element = options.element;
      if (options.scroll){
        scrollDir = options.scroll;
      }
    }

    // Check for valid vaues
    if(!scrollDir || !( scrollDir == 'vertical' || scrollDir == 'horizontal') ){
      scrollDir = 'vertical';
    }

    var $w = $(window),
        $el = element || $w,
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        loaded;

    this.one("unveil", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
    });

    function unveil() {

      var inview = images.filter(function() {
        
        var $e = $(this);
        if ($e.is(":hidden")){ return };        

        if(scrollDir == 'horizontal'){
          var wl = $el.scrollLeft(),
              wr = wl + $el.width(),
              el = $e.offset().left,
              er = el + $e.width();

          return er >= wl - th && el <= wr + th;
        }

        var wt = $el.scrollTop(),
            wb = wt + $el.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $el.scroll(unveil);
    $w.resize(unveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);