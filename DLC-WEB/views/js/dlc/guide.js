(function($) {
    'use strict';
    var that = null;
    DLC.Guide = DLC.derive(DLC.DLC, {
        create: function() {
            this.user = app.currentUser;
            that = this;
            DLC.Util.initPage();
        },
        init: function() {
            window.scrollTo(0, 0);
            $(".guide_logo").bind('click', function() {
                window.location.href = "/signup";
            });
            $(".guide_signup_btn").bind('click', function() {
                window.location.href = "/signup";
            });
            $(".left_arrow").bind('click', function() {
                that.changeGuidePic("left");
            });
            $(".right_arrow").bind('click', function() {
                that.changeGuidePic("right");
            });
            $(document).click(function(event) {
                event = event || window.event;
                event.stopPropagation();
                $('.guide_pic').attr('disabled', true);
            });
        },
        changeGuidePic: function(type) {
            var flag = parseInt($(".guide_pic:visible").attr("flag"));
            var newFlag = flag;
            if (type == 'left') {
                newFlag--;
            } else if (type == 'right') {
                newFlag++;
            }
            if (newFlag > 0 && newFlag < 6) {
                //ico
                $(".gpl" + flag + "s").addClass("gpl" + flag + "h").removeClass("gpl" + flag + "s");
                $(".gpl" + newFlag + "h").addClass("gpl" + newFlag + "s").removeClass("gpl" + newFlag + "h");
                //span
                $(".guide_pp_active").addClass("guide_pp").removeClass("guide_pp_active");
                $(".gpl" + newFlag + "s>span").addClass("guide_pp_active").removeClass("guide_pp");
                //bar
                $(".guide_progress_bar:visible").addClass("hide");
                $(".guide_progress_bar:eq(" + (newFlag - 1) + ")").removeClass("hide");
                //pic
                $(".guide_pic:visible").addClass("hide");
                $(".guide_pic:eq(" + (newFlag - 1) + ")").removeClass("hide");
            }
            switch (newFlag) {
                case 1:
                    $(".left_arrow").addClass("guide_left_arrow_h").removeClass("guide_left_arrow");
                    break;
                case 2:
                    $(".left_arrow").addClass("guide_left_arrow").removeClass("guide_left_arrow_h");
                case 4:
                    $(".right_arrow").addClass("guide_right_arrow").removeClass("guide_right_arrow_h");
                    break;
                case 5:
                    $(".right_arrow").addClass("guide_right_arrow_h").removeClass("guide_right_arrow");
                    break;
                default:
                    break;
            }
        }
    }, {})
})($)
