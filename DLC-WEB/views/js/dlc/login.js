(function ($) {
    'use strict'
    DLC.Login = DLC.derive(DLC.DLC, {
        create: function () {
            var app = new DLC.App();
            this.User = app.currentUser;
            this.init();
        },
        init: function () {
            DLC.Util.initPage();
            window.app.initHeader(1);
            var that = this;
            $('input').placeholder({
                isUseSpan: true
            });
            that.getCaptcha();
            $(".loginEye").click(function () {
                if ($(this).hasClass("logEye")) {
                    $(this).removeClass("logEye");
                    $(this).addClass("logEye1");
                    $("#loginPassword").attr("type", "text");
                } else {
                    $(this).removeClass("logEye1");
                    $(this).addClass("logEye");
                    $("#loginPassword").attr("type", "password");
                }
            });
            $('#userName').focus(function () {
                $(this).css("border-color", "#398be1");
                //                $("#loginPanUserNamePoint").html('');
            }).blur(function () {
                $(this).css("border-color", "");
                that.userNameFun($(this).val());
            });
            $('#loginPassword').focus(function () {
                $(this).css("border-color", "#398be1");
                //                $("#loginPanPasswordPoint").html('');
            }).blur(function () {
                $(this).css("border-color", "");
                that.passwordFun($(this).val());
            });
            $('#captcha').focus(function () {
                $(this).css("border-color", "#398be1");
                //                $("#loginPanCaptchaPoint").html('');
            }).blur(function () {
                $(this).css("border-color", "");
                that.captchaFun($(this).val());
            });
            $('#captchaImg').click(function () {
                that.getCaptcha();
                $('#captcha').val("");
            });
            $('#loginBtn').bind("click", function () {
                var userName = $('#userName').val();
                var password = $('#loginPassword').val();
                var captcha = $('#captcha').val();
                var isOk = true;
                if (!that.userNameFun(userName)) {
                    isOk = false;
                }
                if (!isOk) {
                    return;
                }
                if (!that.passwordFun(password)) {
                    isOk = false;
                }
                if (!isOk) {
                    return;
                }
                if (!that.captchaFun(captcha)) {
                    isOk = false;
                }
                if (!isOk) {
                    return;
                }
                $('#loginBtn').attr("disabled", "true");
                $('#loginBtn').val("登 录 中 . . .");
                that.User.login(userName, password, captcha, that.captchaToken, function () {
                    //刷新头部
                    app.initHeader();
                    //跳转至来源页
                    that.goToComePage();
                }, function (errorMsg) {
                    that.getCaptcha();
                    $('#captcha').val("");
                    if (!(errorMsg == '验证码出错' || errorMsg == '验证码过期')) {
                        $('#loginPassword').val("");
                    }
                    $("#loginShowError").html(errorMsg);
                    $("#loginShowError").show();
                    $('#loginBtn').removeAttr("disabled");
                    $('#loginBtn').val("登 录");
                });
            });

            $("body").keydown(function () {
                if (event.keyCode == "13") { //keyCode=13是回车键
                    $('#loginBtn').click();
                }
            });
        },
        userNameFun: function (userName) {
            var userNameRule = /^1[3|4|5|7|8][0-9][A-Za-z0-9]{4}[0-9]{4}$/; //手机号码验证规则
            var isOk = true;
            if (userName.trim() == "" || userName == null) {
                $("#loginShowError").html("请输入用户名/手机号");
                $('#userName').css("border-color", "#ff0045");
                isOk = false;
            } else if (!userNameRule.test(userName)) {
                $("#loginShowError").html("请输入11位正确的手机号码");
                $('#userName').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#loginShowError").html('');
            }
            if (!isOk) {
                $("#loginShowError").show();
            } else {
                $("#loginShowError").hide();
            }
            return isOk;
        },
        passwordFun: function (password) {
            var passwordRule = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/; //密码验证规则
            var isOk = true;
            if (password.trim() == "" || password == null) {
                $("#loginShowError").html("请输入密码");
                $('#loginPassword').css("border-color", "#ff0045");
                isOk = false;
            } else if (!passwordRule.test(password)) {
                $("#loginShowError").html("请输入8-16位数字和字母组合的密码");
                $('#loginPassword').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#loginShowError").html('');
            }
            if (!isOk) {
                $("#loginShowError").show();
            } else {
                $("#loginShowError").hide();
            }
            return isOk;
        },
        captchaFun: function (captcha) {
            var captchaRule = /^.{4}$/; //验证码规则
            var isOk = true;
            if (captcha.trim() == "" || captcha == null) {
                $("#loginShowError").html("请输入图片验证码");
                $('#captcha').css("border-color", "#ff0045");
                isOk = false;
            } else if (!captchaRule.test(captcha)) {
                $("#loginShowError").html("请输入4位验证码");
                $('#captcha').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#loginShowError").html('');
            }
            if (!isOk) {
                $("#loginShowError").show();
            } else {
                $("#loginShowError").hide();
            }
            return isOk;
        },
        goToComePage: function () {
            //获取来源页面
            var hash = '/';
            if (app.route.oldHash) {
                if (app.route.oldHash == 'editLoginPwd' || app.route.oldHash == 'userChangePhone') {
                    app.route.oldHash = 'account';
                }
                hash = '/myCenter_' + app.route.oldHash;
            }
            window.location.href = hash;
            // window.location.reload();
        },
        //生成图片验证码
        getCaptcha: function () {
            var that = this;
            this.User.getCaptcha(function (url, token) {
                that.captchaToken = token;
                $('#captchaImg').removeAttr('src');
                $('#captchaImg').attr('src', url);
            }, function () {})
        }
    }, {})
})($)
