;
(function($, window, document, undefined) {

    event.preventDefault();
    event.stopPropagation();
    $.tradePassword = function(element, options) {
        this.element = element;
        this.options = options || {};
        this.init();
        var _this = this;
    }

    //定义Beautifier的方法
    // Beautifier.prototype = {
    //     beautify: function() {
    //         return this.$element.css({
    //             'color': this.options.color,
    //             'fontSize': this.options.fontSize,
    //             'textDecoration': this.options.textDecoration
    //         });
    //     }
    // }
    $.fn.extend({
        init: function() {
            var that = this;
            this.html = "<div class='tradePasswordDiv'></div>";
        }
    });
    //在插件中使用Beautifier对象
    $.fn.tradePasswordPlugin = function(options) {

        //创建Beautifier的实体
        var beautifier = new Beautifier(this, options);
        //调用其方法
        return beautifier.beautify();
    }
})(jQuery, window, document);
