(function($) {
    'use strict';
    var _this;
    DLC.ReferOld = DLC.derive(DLC.DLC, {
        create: function(token,utm_source) {
            var app = new DLC.App();
            this.user = app.currentUser;
            this.refereeToken = token;
            _this = this;

            if (token != '' && token != undefined && token != null) {
                $.cookie('refereeToken', token, {
                    expires: 365
                });
            }
            if (utm_source != '' && utm_source != undefined && utm_source != null) {
                app.currentUser.getReferToken(utm_source, function(response) {
                    $.cookie('refereeToken', response, {
                        expires: 365
                    });
                    _this.refereeToken = response;
                }, function() {})
            }
            this.init();

            if (_this.refereeToken=='reIjEf' || _this.refereeToken == '2UjeYv') {
              $("#signupMiddleDiv").removeClass("nb2").addClass("nb1");
            }else if (_this.refereeToken=='EFZJny'||_this.refereeToken=='iuMNRj') {
              $("#signupMiddleDiv").removeClass("nb2").addClass("nb3");
            }
            this.user.getReferInfo(token, function(responseData) {
                var title = "好友" + responseData['name'] + " " + responseData['cellphone'] + "给你发来红包";
                $("#referTitle").text(title);
            }, function(errorCode, errorMsg) {
                // _this.showError(errorMsg);
            })
        },
        init: function() {
            DLC.Util.initPage();
            window.app.initHeader(1);
            var that = this;
            var validator;
            var interval;
            var times = 60;
            that.getCaptcha(); //图形验证码
            $('#captchaImg').bind('click', function() {
                that.getCaptcha();
            });
            $("form :input").bind("copy cut paste", function(e) {
                return false;
            });
            $('input').placeholder({
                isUseSpan: true
            });
            //show or hide password
            $("#pwdEyes").bind('click', function(e) {
                e.preventDefault();
                var val = $("#password").val();
                if ($('#password').attr('type') == 'password') {
                    $('#pwdEyes').addClass('eyePic2').removeClass('eyePic1');
                    $('#password').attr('type', 'text');
                } else {
                    $('#pwdEyes').addClass('eyePic1').removeClass('eyePic2');
                    $('#password').attr('type', 'password');
                }
            });

            //sms send
            $('#verifyCodeBtn').bind("click", function(e) {
                e.preventDefault();
                var captcha = $('#picVerifyCode').val();
                if (validator.element("#phone") && validator.element("#password") && validator.element("#picVerifyCode")) {
                    that.user.getCaptchaValidate(that.captchaToken, captcha, function() {
                        that.user.getOtpSignup($('#phone').val(), that.captchaToken, function(otp) {
                            that.hideError();
                            clearInterval(interval);
                            interval = setInterval(verifyClock, 1000);
                        }, function(errorCode, errorMsg) {
                            that.showError(errorMsg);
                        });
                    }, function(errorCode, errorMsg) {
                        that.showError(errorMsg);
                        that.getCaptcha();
                    });
                }
            });

            //signup
            $('#signupBtn').bind("click", function(e) {
                e.preventDefault();
                that.hideError();
                if (validator.element("#phone") && validator.element("#password") && validator.element("#picVerifyCode") && validator.element("#verifyCode")) {
                    $('#signupBtn').attr("disabled", true);
                    that.user.fastsignup($('#password').val(), $('#phone').val(), $('#verifyCode').val(), true, $('#picVerifyCode').val(), that.captchaToken, '', that.refereeToken, function() {
                        //刷新头部
                        app.initHeader();
                        that.signSuccess();
                    }, function(errorCode, errorMsg) {
                        $('#signupBtn').attr("disabled", false);
                        that.showInviteError(errorCode, errorMsg);
                    })
                }

            });

            //sms clock
            function verifyClock() {
                times--;
                if (0 < times) {
                    $('#verifyCodeBtn').css('color', "#398be1");
                    $('#verifyCodeBtn').text(times + " s");
                    $('#verifyCodeBtn').attr("disabled", true);
                } else {
                    $('#verifyCodeBtn').css('color', "#398be1");
                    $('#verifyCodeBtn').text("获取验证码");
                    $('#verifyCodeBtn').removeAttr("disabled");
                    clearInterval(interval);
                    times = 60;
                }
            }

            $(':text').focus(function() {
                $(this).css("border-color", "#398be1");
            });

            validator = $('#signupForm').validate({
                rules: {
                    phone: {
                        required: true,
                        phone: true
                    },
                    email: {
                        email: true
                    },
                    password: {
                        required: true,
                        password: true
                    },
                    picVerifyCode: {
                        required: true,
                        picVerifyCode: true
                    },
                    verifyCode: {
                        required: true,
                        rangelength: [6, 6]
                    },
                },
                messages: {
                    phone: {
                        required: "请输入手机号码"
                    },
                    email: {
                        email: "请输入正确的邮箱号码"
                    },
                    password: {
                        required: "请输入密码"
                    },
                    picVerifyCode: {
                        required: "请输入图片验证码"
                    },
                    verifyCode: {
                        required: "请输入验证码",
                        rangelength: "请输入短信验证码"
                    },
                },
                success: function(element) {
                    var id = element[0]['id'];
                    var index = id.indexOf("-error");
                    var success_id = id.substring(0, index);
                    $("#" + success_id).css("border-color", "");
                    that.hideError();
                },
                errorPlacement: function(error, element) {
                    var id = element[0]['id'];
                    var error_html = error[0].innerHTML;
                    if ('' != error_html) {
                        that.showError(error_html);
                        $("#" + id).css("border-color", "#ff0045");
                    }
                },

            });

            $.validator.addMethod("phone", function(value, element) {
                return this.optional(element) || /^1[3|4|5|7|8][0-9]{9}$/.test(value);
            }, "请输入11位正确的手机号码");
            $.validator.addMethod("password", function(value, element) {
                return this.optional(element) || /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value);
            }, "请输入8-16位数字和字母组合的密码");
            $.validator.addMethod("picVerifyCode", function(value, element) {
                return this.optional(element) || /^[\u4e00-\u9fa5a-zA-Z0-9\-]{4}$/.test(value);
                // return that.captchaValidate;
            }, "请输入正确的图形验证码");
        },
        //生成图片验证码
        getCaptcha: function() {
            var that = this;
            this.user.getCaptcha(function(url, token) {
                that.captchaToken = token;
                $('#captchaImg').removeAttr('src');
                $('#captchaImg').attr('src', url);
                $('#picVerifyCode').val('');
            }, function() {});
        },
        hideError: function() {
            $(".allErrors").addClass('hide');
        },
        showError: function(error) {
            $(".allErrors").removeClass('hide');
            $(".allErrorsSpan").html(error);
        },
        showInviteError: function(errorCode, errorMsg) {
            var html = "";
            if (errorCode == '610') {
                html = '../pages/inviteNotInvalid.html';
            } else if (errorCode == '609') {
                html = '../pages/inviteNotBind.html';
            } else if (errorCode == '608') {
                html = '../pages/inviteNotExist.html';
            }
            var that = this;
            if (html != '') {
                $('#adjust').load(html, function() {
                    $('#cancelBtn').click(function() {
                        that.hideError();
                        DLC.Util.hideAdjust('#adjust');
                        DLC.Util.hideOverlay();
                    });
                    $('#confirmBtn').click(function() {
                        that.user.fastsignup($('#password').val(), $('#phone').val(), $('#verifyCode').val(), true, $('#picVerifyCode').val(), that.captchaToken, '', '', function(otp) {
                            $(this).attr("disabled", true);
                            app.initHeader(); //刷新头部
                            window.location.href = '/signupSuccess';
                        }, function(errorCode, errorMsg) {
                            that.showInviteError(errorCode, errorMsg);
                        })
                    });
                    DLC.Util.showOverlay();
                    DLC.Util.showAdjust('#adjust');
                });
            } else {
                that.showError(errorMsg);
            }
        },
        //跳转成功页面
        signSuccess: function() {
            if (this.refereeToken != '') {
                window.location.href = '/signupSuccess?token=' + this.refereeToken;
            } else {
                window.location.href = '/signupSuccess';
            }
            // app.account.getExperiences(0, 1, 1, function(list) {
            //     var length = list.length;
            //     if (length > 0) {
            //         window.location.href = '/signupSuccess';
            //     } else {
            //         window.location.href = "/";
            //     }
            // }, function(errorCode, errorMsg) {
            //     window.location.href = "/";
            // });
        },
    }, {})
})($)
