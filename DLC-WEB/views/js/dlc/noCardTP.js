(function ($) {
    'use strict'
    DLC.NoCardTstPwd = DLC.derive(DLC.DLC, {
        create: function () {
            this.user = app.currentUser;
            this.account = app.account;
        },
        init: function () {
            DLC.Util.initPage();
            window.app.initHeader(4);
            var that = this;

            $('input').placeholder({
                placeholderColor: '#d2d2d2',
                isUseSpan: true,
                onInput: true,
            });

            that.user.getUserInfo(function () {
                if (!that.user.userInfo) return;
                var cellphone = that.user.userInfo.cellphone;
                $('#oldPhone').val(cellphone);
                $('#userPhone').html(cellphone);
            }, function (errorCode, errorMsg) {});

            //交易密码的可见与不可见事件
            $('#eye1').bind('click', function () {
                if ($('#noNewTstPwd').attr('type') == 'password') {
                    $('#eye1').removeClass('e_one').addClass('e_two');
                    $('#noNewTstPwd').attr('type', 'text');
                } else {
                    $('#eye1').removeClass('e_two').addClass('e_one');
                    $('#noNewTstPwd').attr('type', 'password');
                }
            });
            $('#eye2').bind('click', function () {
                if ($('#againNoNew').attr('type') == 'password') {
                    $('#eye2').removeClass('e_one').addClass('e_two');
                    $('#againNoNew').attr('type', 'text');
                } else {
                    $('#eye2').removeClass('e_two').addClass('e_one');
                    $('#againNoNew').attr('type', 'password');
                }
            });

            $('#writeCode').focus(function () {
                $('#writeCode').css("border-color", "#398be1");
                $('#noCTPOne').html('');
            }).blur(function () {
                $('#writeCode').css("border-color", "");
            });
            //获取手机验证码
            $('#noGetCode').bind('click', function () {
                that.account.resetTradePasswordOtp(function (data) {
                    //倒计时
                    var timeN = 60;
                    $('#noGetCode').attr("disabled", true);
                    $('.modify input.m_gc').css('cursor', 'Default');
                    $('#noGetCode').val(timeN + " s");
                    timeN--;
                    var timerN = setInterval(function () {
                        if ($('#noGetCode').val() == '获取验证码') {
                            clearInterval(timerN);
                            return;
                        }
                        $('#noGetCode').val(timeN + " s");
                        if (timeN == 0) {
                            $('#noGetCode').removeAttr("disabled");
                            //$('#noGetCode').addClass('m_gc').removeClass('send').val("获取验证码");
                            $('#noGetCode').css('cursor', 'pointer').val("获取验证码");
                            clearInterval(timerN);
                            timeN = 60;
                        }
                        timeN--;
                    }, 1000);

                    //$('#writeCode').val(data.otp);
                    $('#writeCode').css('border-color', '');
                    $('#modifyError').css('display', 'none');
                    $('.modifyPrompt').css('display', 'block');
                }, function (errorCode, errorMsg) {
                    $('#writeCode').css('border-color', '#ff0045');
                    $('#noCTPOne').html(errorMsg);
                });
            });
            //验证手机验证码
            $('#butOne').bind('click', function () {
                var oldCode = $('#writeCode').val();
                var isOk = true;
                if (!that.noCPhoneCode(oldCode)) {
                    isOk = false;
                }
                if (!isOk) {
                    return;
                }
                var data = {
                    smsCode: oldCode,
                }
                that.account.validateResetTradePassword(data, function () {
                    $('#noCTPOne').html('验证成功').css('color', 'green');
                    $('#one').css('display', 'none');
                    $('#two').css('display', 'block');
                }, function (errorCode, errorMsg) {
                    $('#modifyError').css('display', 'block');
                    $('.modifyPrompt').css('display', 'none');
                    $('#noCTPOne').html(errorMsg);
                });
            });

            //修改交易密码
            $('#noNewTstPwd').focus(function () {
                $('#noNewTstPwd').css("border-color", "#398be1");
                $('#noCTPTwo').html('');
            }).blur(function () {
                $('#noNewTstPwd').css("border-color", "");
            });
            $('#againNoNew').focus(function () {
                $('#againNoNew').css("border-color", "#398be1");
                $("#noCTPThree").html('');
            }).blur(function () {
                $('#againNoNew').css("border-color", "");
            });
            $('#mNoC_but').bind('click', function () {
                var newTstPwd = $('#noNewTstPwd').val();
                var againNew = $('#againNoNew').val();
                var isOK = true;
                if (!that.newTstPwdFun(newTstPwd)) {
                    isOK = false;
                }
                if (!that.againNewTstPwdFun(newTstPwd, againNew)) {
                    isOK = false;
                }
                if (!isOK) {
                    return;
                }
                $('#mNoC_but').attr("disabled", 'true');
                //设置新交易密码
                that.account.resetTradePassword(newTstPwd, function () {
                    $('#noCTPThree').html('修改成功').css('color', 'green');
                    window.location.href = "/myCenter_account";
                }, function (errorCode, errorMsg) {
                    $('#mNoC_but').removeAttr("disabled");
                    $('#noCTPThree').html(errorMsg);
                })
            });
        },

        //手机验证码验证
        noCPhoneCode: function (code) {
            var isOk = true;
            var reg = /^[0-9]{6}$/;
            if (code.trim() == "" || code == null) {
                $('#modifyError').css('display', 'block');
                $('.modifyPrompt').css('display', 'none');
                $("#noCTPOne").html("请输入验证码");
                $('#writeCode').css("border-color", "#ff0045");
                isOk = false;
            } else if (!reg.test(code)) {
                $('#modifyError').css('display', 'block');
                $('.modifyPrompt').css('display', 'none');
                $("#noCTPOne").html("请输入6位数字的验证码");
                $('#writeCode').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#noCTPOne").html('');
            }
            return isOk;
        },
        //交易密码验证
        newTstPwdFun: function (newTstPass) {
            var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
            var isOk = true;
            if (newTstPass.trim() == "" || newTstPass == null) {
                $('#noCTPTwo').html('请输入新交易密码');
                $('#noNewTstPwd').css("border-color", "#ff0045");
                isOk = false;
            } else if (!reg.test(newTstPass)) {
                $('#noCTPTwo').html('请输入8-16位数字和字母组合的密码');
                $('#noNewTstPwd').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $('#noCTPTwo').html('');
            }
            return isOk;
        },
        //确认交易密码验证
        againNewTstPwdFun: function (newPwd, newAgainPwd) {
            var isOk = true;
            if (newAgainPwd.trim() == "" || newAgainPwd == null) {
                $("#noCTPThree").html("请再次输入新交易密码");
                $('#againNoNew').css("border-color", "#ff0045");
                isOk = false;
            } else if (newPwd != newAgainPwd) {
                $("#noCTPThree").html("两次输入的新交易密码不一致");
                $('#againNoNew').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#noCTPThree").html('');
            }
            return isOk;
        },

    }, {})
})($)
