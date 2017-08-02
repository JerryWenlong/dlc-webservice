(function ($) {
    var That;
    DLC.App = DLC.derive(null, {
        create: function (dict) {
            this.currentUser = new DLC.User();
            this.account = new DLC.Account(this.currentUser);
            this.trade = new DLC.Trade(this.currentUser);
            this.product = new DLC.Product(this.currentUser);
            this.bulletin = new DLC.Bulletin(this.currentUser);
            // this.currUrl = window.location.protocol + '//' + window.location.host + '/signup';
            this.dict = dict;
            this.hight = 0;
            this.initAjax();
            That = this;
            // this.initRoute();
            // this.initHeader();
            //this.initFooter();

        },
        initCoupons: function () {
            var p = {};
            p.status = 0;
            this.account.getBizCoupons(function (list) {
                if (list != null && list != "" && list.length > 0) {
                    $("#tipHT1").show();
                    $("#tipT1").show();

                    var prodCodeId;
                    for (var il = 0; il < list.length; il++) {
                        if (list[il].products && list[il].products.length > 0 && list[il].products[0].prodCodeId) {
                            prodCodeId = list[il].products[0].prodCodeId;
                            break;
                        }
                    }
                    $("#tipHT1").click(function () {
                        window.location.href = '/experienceProduct_' + prodCodeId;
                    })
                    $("#tipT1").click(function () {
                        window.location.href = '/experienceProduct_' + prodCodeId;
                    })
                } else {
                    $("#tipHT1").hide();
                    $("#tipT1").hide();
                }
            }, function () {}, p)
        },
        getDictName: function (list, value) {
            var result = "";
            list.forEach(function (item) {
                if (item.value == value) {
                    result = item.name;
                    return result;
                }
            });
            return result
        },
        initBar: function (index) {
            That.hight = index;
        },
        initDict: function () {},
        // initRoute: function(){
        // 	// init route
        // 	this.route = new DLC.Route();
        // 	this.route.init();
        // },
        initFooter: function () {
            $('#index_footer').load('/pages/footer.html', function () {

            });
        },
        initHeader: function (bar) {
            var that = this;
            var user = this.currentUser;
            $('.link-sel').removeClass("link-sel");
            var index = bar || 4;
            $('.main_header').load('/pages/header.html', function () {
                if (user.hasLogin) {
                    // that.initCoupons();
                    $('#logout').hide();
                    $('#login').css('display', 'inline-block');
                    $('#tipL1').text('我的账户');
                    $('#tipL2').text('我的账户');
                    $('#tipL1').bind('mouseenter', function () {
                        $('#loginUserPannel').slideDown(100);
                    });
                    $('#loginUserPannel').bind('mouseleave', function () {
                        $('#loginUserPannel').fadeOut(100);
                    });
                    $("#tipL2").bind('click', function () {
                        window.location.href = "/myCenter_account";
                    });
                    $('#logoutB').bind('click', function () {
                        $('#logout').css('display', 'inline-block');
                        $('#login').hide();
                        user.logout(function () {
                            app.route.oldHash = null;
                            window.app = null;
                            //logout success
                            that.initHeader();
                            //刷新当前页
                            window.location.reload();
                        }, function () {
                            //logout failed
                            that.initHeader();
                            //刷新当前页
                            window.location.reload();
                        });
                    });
                    $("#logoutM").bind('click', function () {
                        window.location.href = "/myCenter_financial";
                    });
                    $("#logoutR").bind('click', function () {
                        window.location.href = "/myCenter_deposit";
                    });
                } else {
                    $('#logout').css('display', 'inline-block');
                    $('#login').hide();
                    $('#tip1').bind('click', function () {
                        window.location.href = '/login';
                    });
                    $('#tipSignup').bind('click', function () {
                        window.location.href = '/signup';
                    });
                }
                $(window).scroll(function () {
                    var s = $(window).scrollTop();
                    if (s > 40) {
                        $('#fixedNav').css({
                            "position": "fixed",
                            "top": 0,
                            "box-shadow": "0 5px 10px #bbb"
                        });
                    } else {
                        $('#fixedNav').css({
                            "position": "inherit",
                            "box-shadow": "none"
                        });
                    }
                });
                $(".logo-header").bind('click', function () {
                    window.location.href = "/";
                });
                $("#questionUser").bind('click', function () {
                    window.location.href = "/questionUser";
                });
                $("#aboutContact").bind('click', function () {
                    window.location.href = "/aboutContact";
                });

                var selectedNav = null;
                $(".nav-bar li").bind('click', function () {
                    var node = this;
                    if (selectedNav) {
                        DLC.Util.removeClass(selectedNav, 'selected');
                    }
                    selectedNav = node;
                    DLC.Util.addClass(node, 'selected');
                });
                //show wechat
                $('#wechat').bind('mouseenter', function () {
                    var pannelWidth = 280;
                    var clientWidth = document.body.clientWidth;
                    var left_d = pannelWidth / 2 - (49 * 2 + 12.5);
                    var client_left = (clientWidth - 1200) / 2;
                    var left_distence = client_left - left_d;
                    $('#wechatPannel').css({
                        'left': '50%',
                        'margin-left': '470px'
                    });
                    $('#wechatPannel').slideDown(100);
                });
                $('#wechat').bind('mouseleave', function () {
                    $('#wechatPannel').fadeOut(100);
                });
                $('#bar_h' + index).addClass("link-sel");
            });
        },
        initAjax: function (argument) {
            var that = this;
            $.ajaxSetup({
                cache: false
            });
            // body...
            $(document).bind("ajaxSend", function () {
                // loading..
            }).bind("ajaxComplete", function () {
                // remove loading
            }).bind("ajaxError", function (obj, response, request) {
                if (response['status'] == '401') {
                    that.currentUser.clearUserTemp();
                    that.initHeader();
                    window.location.href = '/login';
                }
            }).bind("click", function (e) {
                var target = $(e.target);
                if (target.closest("#container").length == 0) {
                    that.keyWordHide();
                }
            })
        },
        keyWordShow: function (sysout, isSet) {
            $("#container").slideUp(200);
            $("#container").load("../pages/keyword.html", function () {
                var write = $('#' + sysout),
                    shift = false,
                    capslock = false;
                var X = write.offset().top;
                var Y = write.offset().left;
                var H = write.outerHeight();
                var W = write.outerWidth();
                var top = X + H + 3;
                var left = Y;
                //1 居中 2 右对齐 其他 左对齐
                switch (isSet) {
                case 1:
                    left = Y - (703 - W) / 2;
                    break;
                case 2:
                    left = Y - (703 - W);
                    break;
                }
                $("#container").css("top", top);
                $("#container").css("left", left);
                $("#container").slideDown(500);
                $('#keyboard li').click(function () {
                    var $this = $(this),
                        character = $this.html();
                    // Shift keys
                    if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
                        $('.letter').toggleClass('uppercase');
                        $('.symbol span').toggle();
                        shift = (shift === true) ? false : true;
                        capslock = false;
                        return false;
                    }

                    // Caps lock
                    if ($this.hasClass('capslock')) {
                        $('.letter').toggleClass('uppercase');
                        capslock = true;
                        return false;
                    }

                    // Delete
                    if ($this.hasClass('delete')) {
                        var html = write.val();

                        write.val(html.substr(0, html.length - 1));
                        return false;
                    }

                    // Special characters
                    if ($this.hasClass('symbol')) character = $('span:visible', $this).html();
                    if ($this.hasClass('space')) character = ' ';
                    if ($this.hasClass('tab')) character = "\t";
                    if ($this.hasClass('enter')) {
                        $("#container").slideUp(200);
                        return;
                    }

                    // Uppercase letter
                    if ($this.hasClass('uppercase')) character = character.toUpperCase();

                    // Remove shift once a key is clicked.
                    if (shift === true) {
                        $('.symbol span').toggle();
                        if (capslock === false) $('.letter').toggleClass('uppercase');

                        shift = false;
                    }
                    // Add the character
                    write.val(write.val() + character);
                    write.focus()
                });
            });
        },
        keyWordHide: function () {
            $("#container").slideUp(200);
        }
    }, {})
})($)