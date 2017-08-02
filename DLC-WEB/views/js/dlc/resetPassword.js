(function ($) {
    'use strict'
    DLC.ResetPassword = DLC.derive(DLC.DLC, {
        create: function () {
            this.user = app.currentUser;
        },
        init: function () {
            DLC.Util.initPage();
            window.app.initHeader(1);
            var that = this;
            var resetToken_g = null;
            var phone = '';

            $('input').placeholder({
                placeholderColor: '#d2d2d2',
                isUseSpan: true,
                onInput: true,
            });

            //图形验证码点击刷新事件
            this.getCaptcha();
            $('#captchaImg').bind('click', function () {
                that.getCaptcha();
            });

            /**************第一步->检测用户手机是否存在（是否注册）***********/
            $('#mobile').focus(function () {
                $('#mobile').css('border-color', '#398be1');
                $('#proPhone').html('');
            }).blur(function () {
                $('#mobile').css('border-color', '');
            });
            $('#captcha').focus(function () {
                $(this).css('border-color', '#398be1');
                $('#proCaptcha').html('');
            }).blur(function () {
                $(this).css('border-color', '');
            });
            //下一步
            $('#check_phone').bind("click", function () {
                var mobile = $('#mobile').val(); // || '13636398500'
                var captcha = $('#captcha').val();
                var isOk = true;
                if (!that.checkUserPhone(mobile)) {
                    isOk = false;
                }
                if (!that.checkCaptcha(captcha)) {
                    isOk = false;
                }
                if (!isOk) {
                    return;
                }
                phone = mobile;
                $('#check_phone').attr('disabled', 'true');
                //先判断图形验证码
                that.user.getCaptchaValidate(that.captchaToken, captcha, function () {
                    //再判断手机号码
                    that.user.getRestToken(mobile, captcha, that.captchaToken, function (resetToken) {
                        resetToken_g = resetToken;
                        //控制页面显示效果
                        $('.resetCon .RC_step .RC_sumB').css('background', '#398be1');
                        $('#RC_lineOne').css('border-bottom', '3px solid #398be1');
                        $('.resetCon .RC_word .RC_wordB').css('color', '#398be1');
                        $("#one").css('display', 'none');
                        $("#two").css('display', 'block');
                        //$('.resetCon_step').removeClass('onePic').addClass('twoPic');
                        $('#writePhone').html(mobile);
                    }, function (errorCode, errorMsg) {
                        $('#check_phone').removeAttr('disabled');
                        $('#mobile').css('border', '1px solid #ff0045');
                        $('#captcha').val(''); //清空图形验证码框的错误验证码
                        that.getCaptcha(); //刷新图形验证码
                        $('#proPhone').text(errorMsg);
                        that.getCaptcha();
                    })
                }, function (errorCode, errorMsg) {
                    $('#check_phone').removeAttr('disabled');
                    $('#captcha').val(''); //清空图形验证码框的错误验证码
                    $('#captcha').css('border', '1px solid #ff0045');
                    that.getCaptcha(); //刷新图形验证码
                    $('#proCaptcha').html(errorMsg);
                });
            });

            /**************第二步->手机验证码***********/
            $('#phoneCode').focus(function () {
                $('#phoneCode').css('border-color', '#398be1');
                $('#proCode').html('');
            }).blur(function () {
                $('#phoneCode').css('border-color', '');
            });
            //获取手机验证码
            $('#getCode').bind("click", function () {
                that.user.getRestOTP(resetToken_g, function (otp) {
                    //60秒倒计时
                    var downTime = 60;
                    $('#getCode').attr("disabled", true);
                    $('#getCode').css('cursor', 'auto');
                    $('#getCode').val(downTime + " s");
                    downTime--;
                    var timeClear = setInterval(function () {
                        if ($('#getCode').val() == '获取验证码') {
                            clearInterval(timeClear);
                            return;
                        }
                        $('#getCode').val(downTime + " s");
                        if (downTime == 0) {
                            clearInterval(timeClear);
                            $('#getCode').removeAttr("disabled");
                            //$('#getCode').addClass('code_but').removeClass('sendInfo').val("获取验证码");
                            $('#getCode').css('cursor', 'pointer').val("获取验证码");
                            downTime = 60;
                        }
                        downTime--;
                    }, 1000);

                    //测试显示，上线屏蔽
                    //$('#phoneCode').val(otp);
                    $('#phoneCode').css('border-color', '');
                    $('#resetCon_err').css('display', 'none');
                    $('.resetCon_message').css('display', 'block');
                }, function (errorCode, errorMsg) {
                    $('#phoneCode').css('border-color', '#ff0045');
                    $('#proCode').html(errorMsg);
                })
            });
            //下一步 判断手机验证码
            $('#phone_code').bind("click", function () {
                var phoneCode = $('#phoneCode').val();
                var isOk = true;
                if (!that.checkPhoneCodeFun(phoneCode)) {
                    isOk = false;
                }
                if (!isOk) {
                    return;
                }
                $('#phone_code').attr("disabled", true);
                that.user.otpRestValidate(phoneCode, resetToken_g, function () {
                    //验证成功，执行设置新密码操作
                    $('.resetCon .RC_step .RC_sumC').css('background', '#398be1');
                    $('#RC_lineTwo').css('border-bottom', '3px solid #398be1');
                    $('.resetCon .RC_word .RC_wordC').css('color', '#398be1');
                    $("#one").css('display', 'none');
                    $("#two").css('display', 'none');
                    $("#three").css('display', 'block');
                    //$('.resetCon_step').removeClass('twoPic').addClass('threePic');
                }, function (errorCode, errorMsg) {
                    $('#phone_code').removeAttr('disabled');
                    $('#resetCon_err').css('display', 'block');
                    $('.resetCon_message').css('display', 'none');
                    $('#proCode').html(errorMsg);
                })
            });


            /*****************第三步->保存新密码*****************/
            $('#newPass').focus(function () {
                $('#newPass').css('border-color', '#398be1');
                $('#proPwd').html('');
            }).blur(function () {
                $('#newPass').css('border-color', '');
            });
            $('#againNew').focus(function () {
                $('#againNew').css('border-color', '#398be1');
                $('#proNewPwd').html('');
            }).blur(function () {
                $('#againNew').css('border-color', '');
            });
            //确认修改按钮
            $('#nwePass_but').bind("click", function () {
                var newPassword = $('#newPass').val();
                var againNew = $('#againNew').val();
                var isOk = true;
                if (!that.newPasswordFun(newPassword)) {
                    isOk = false;
                }
                if (!that.againNewPasswordFun(newPassword, againNew)) {
                    isOk = false;
                }
                if (!isOk) {
                    return;
                }
                $('#phone_code').attr("disabled", true);
                that.user.passwordRest(phone, newPassword, resetToken_g, function () {
                    window.location.href = '/login';
                }, function (errorCode, errorMsg) {
                    $('#nwePass_but').removeAttr("disabled");
                    $('#proNewPwd').text(errorMsg);
                })

            });
        },

        //生成图片验证码
        getCaptcha: function () {
            var that = this;
            this.user.getCaptcha(function (url, token) {
                that.captchaToken = token;
                $('#captchaImg').removeAttr('src');
                $('#captchaImg').attr('src', url);
            }, function () {
            })
        },
        //验证图形验证码
        checkCaptcha: function (captcha) {
            var isOk = true;
            var reg = /^.{4}$/;
            if (captcha.trim() == "" || captcha == null) {
                $('#proCaptcha').html('请输入图形验证码');
                $('#captcha').css('border-color', '#ff0045');
                isOk = false;
            } else if (!reg.test(captcha)) {
                $('#proCaptcha').html('图形验证码错误');
                $('#captcha').css('border-color', '#ff0045');
                isOk = false;
            } else {
                $('#proCaptcha').html('');
            }
            return isOk;
        },
        //手机号码验证方法
        checkUserPhone: function (phone) {
            var isOk = true;
            var reg = /^1[3|4|5|7|8]\d{9}$/;
            if (phone.trim() == "" || phone == null) {
                $('#proPhone').html('请输入手机号码');
                $('#mobile').css('border-color', '#ff0045');
                isOk = false;
            } else if (!reg.test(phone)) {
                $('#proPhone').html('请输入11位正确的手机号码');
                $('#mobile').css('border-color', '#ff0045');
                isOk = false;
            } else {
                $('#proPhone').html('');
            }
            return isOk;
        },
        //手机验证码验证
        checkPhoneCodeFun: function (code) {
            var isOk = true;
            var reg = /^[0-9]{6}$/;
            if (code.trim() == "" || code == null) {
                $('#resetCon_err').css('display', 'block');
                $('.resetCon_message').css('display', 'none');
                $("#proCode").html("请输入验证码");
                $('#phoneCode').css("border-color", "#ff0045");
                isOk = false;
            } else if (!reg.test(code)) {
                $('#resetCon_err').css('display', 'block');
                $('.resetCon_message').css('display', 'none');
                $("#proCode").html("请输入6位数字的验证码");
                $('#phoneCode').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#proCode").html('');
            }
            return isOk;
        },
        //新密码验证
        newPasswordFun: function (newTstPwd) {
            var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
            var isOk = true;
            if (newTstPwd.trim() == "" || newTstPwd == null) {
                $('#proPwd').html('请输入新密码');
                $('#newPass').css("border-color", "#ff0045");
                isOk = false;
            } else if (!reg.test(newTstPwd)) {
                $('#proPwd').html('请输入8-16位数字和字母组合的密码');
                $('#newPass').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $('#proPwd').html('');
            }
            return isOk;
        },
        //确认新密码验证
        againNewPasswordFun: function (newPwd, newAgainPwd) {
            var isOk = true;
            if (newAgainPwd.trim() == "" || newAgainPwd == null) {
                $("#proNewPwd").html("请再次输入新密码");
                $('#againNew').css("border-color", "#ff0045");
                isOk = false;
            } else if (newPwd != newAgainPwd) {
                $("#proNewPwd").html("两次输入的新密码不一致");
                $('#againNew').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#proNewPwd").html('');
            }
            return isOk;
        },

    }, {})
})($)
