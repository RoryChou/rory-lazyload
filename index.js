(function () {
    var $window = $(window);

    $.fn.lazyload = function (options) {
        var elements = this;
        var $container = $window;
        var settings = {
            threshold       : 0,
            data_attribute  : "original"
        };
        function update() {
            console.log('updated')
            var counter = 0;
            elements.each(function() {
                var $this = $(this);
                if (!$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                    /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                    console.log('triggered')
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    return false;
                }
            });

        }
        $.extend(settings, options);
        $container.bind("scroll", function() {
            return update();
        });
        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            $self.one("appear", function() {
                if (!this.loaded) {
                    $("<img />").bind("load", function() {
                        var original = $self.attr("data-" + settings.data_attribute);
                        $self.attr("src", original);
                        $self.show();
                        self.loaded = true;
                        var temp = $.grep(elements, function(element) {
                            return !element.loaded;
                        });
                        elements = $(temp);
                    }).attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });
        });
        $window.bind("resize", function() {
            update();
        });
        $(document).ready(function() {
            update();
        });
        return this;
    }

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };
})(jQuery, window, document);
