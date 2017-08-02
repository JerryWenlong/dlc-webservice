(function ($) {
    'use strict'
    DLC.ChangePhone = DLC.derive(DLC.DLC, {
        create: function () {
            this.user = app.currentUser;
            window.app.initHeader(4);
        },
        init: function () {
            DLC.Util.initPage();
            var that = this;
            var oPhone = '';

            $('input').placeholder({
                placeholderColor: '#d2d2d2',
                isUseSpan: true,
                onInput: true,
            });

            that.user.getUserInfo(function () {
                if (!that.user.userInfo) return;
                var cellphone = that.user.userInfo.cellphone;
                $('#oldPhone').val(cellphone);
                $('#getOldPhone').html(cellphone);
                oPhone = cellphone;
            }, function (errorCode, errorMsg) {});

            //获取失去焦点事件
            $('#writeCode').focus(function () {
                $(this).css('border-color', '#398be1');
                $('#CP_proOne').html('');
            }).blur(function () {
                $(this).css('border-color', '');
            });
            $('#newPhone').focus(function () {
                $(this).css('border-color', '#398be1');
                $("#CP_proTwo").html("");
            }).keyup(function () {
                var newPhone = $('#newPhone').val();
                if (that.checkNewPhone(newPhone)) {
                    $('#getNewCode').removeAttr("disabled");
                    $('#getNewCode').addClass('CP_gcOne').removeClass('CP_gcTwo');
                    $(this).css('border-color', '');
                } else {
                    $('#getNewCode').attr("disabled", true);
                    $('#getNewCode').addClass('CP_gcTwo').removeClass('CP_gcOne');
                }
            });
            $('#writeNewCode').focus(function () {
                $(this).css('border-color', '#398be1');
                $("#CP_proThree").html("");
            }).blur(function () {
                $(this).css('border-color', '');
            });

            //获取原手机的验证码
            $('#getOldCode').bind('click', function () {
                that.user.getOtpCellphone(function (otp) {
                    //倒计时
                    var timeOne = 60;
                    $('#getOldCode').attr("disabled", true);
                    $('.CP_info input.CP_gcOne').css('cursor', 'auto');
                    $('#getOldCode').val(timeOne + " s");
                    timeOne--;
                    var timer1 = setInterval(function () {
                        if ($('#getOldCode').val() == '获取验证码') {
                            clearInterval(timer1);
                            return;
                        }
                        $('#getOldCode').val(timeOne + " s");
                        if (timeOne == 0) {
                            $('#getOldCode').removeAttr("disabled");
                            //$('#getOldCode').addClass('CP_gc').removeClass('sendCP').val("获取验证码");
                            $('.CP_info input.CP_gcOne').css('cursor', 'pointer').val("获取验证码");
                            clearInterval(timer1);
                        }
                        timeOne--;
                    }, 1000);

                    //$('#writeCode').val(otp);
                    $('#writeCode').css('border-color', '');
                    $('#CP_errorNone').css('display', 'none');
                    $('#CP_infoNone').css('display', 'block');
                }, function (errorCode, errorMsg) {
                    $('#writeCode').css('border-color', '#ff0045');
                    $('#CP_proOne').html(errorMsg);
                });
            });
            //验证原手机验证码
            $('#butOne').bind('click', function () {
                var oldCode = $('#writeCode').val();
                var isOk = true;
                if (!that.checkPhoneCode(oldCode, '')) {
                    isOk = false;
                }
                if (!isOk) {
                    return;
                }
                $('#butOne').attr('disabled', 'true');
                that.user.otpCellphoneValidate(oldCode, function () {
                    $('#CP_proOne').html('验证成功').css('color', 'green');

                    $('.CP_bar .CP_circleB').css('background', '#398be1');
                    $('.CP_bar .CP_line').css('border-bottom', '3px solid #398be1');
                    $('.CP_word .CP_wordRight').css('color', '#398be1');
                    $('#one').css('display', 'none');
                    $('#two').css('display', 'block');
                    //$('.CP_img').removeClass('img_one').addClass('img_two');
                }, function (errorCode, errorMsg) {
                    $('#butOne').removeAttr('disabled');
                    $('#CP_errorNone').css('display', 'block');
                    $('#CP_infoNone').css('display', 'none');
                    $('#writeCode').css('border-color', '#ff0045');
                    $('#CP_proOne').html(errorMsg);
                });

            });


            //获取新手机的验证码
            $('#getNewCode').bind('click', function () {
                var newPhone = $('#newPhone').val();
                var isOk = true;
                if (!that.checkNewPhone(newPhone)) {
                    isOk = false;
                }
                if (!isOk) {
                    return;
                }
                $('#getNewPhone').html(newPhone);
                that.user.getOtpCellphoneNew(newPhone, function (otp) {
                    //后台程序通过开始倒计时
                    var timeTwo = 60;
                    $('#getNewCode').attr("disabled", true);
                    $('.CP_info input.CP_gcTwo').css('cursor', 'auto');
                    $('#getNewCode').val(timeTwo + " s");
                    timeTwo--;
                    var timer2 = setInterval(function () {
                        if ($('#getNewCode').val() == '获取验证码') {
                            clearInterval(timer2);
                            return;
                        }
                        $('#getNewCode').val(timeTwo + " s");
                        if (timeTwo == 0) {
                            $('#getNewCode').removeAttr("disabled");
                            $('.CP_info input.CP_gcTwo').css('cursor', 'pointer').val("获取验证码");
                            //$('#getNewCode').addClass('CP_gcTwo').removeClass('CP_gcOne').val("获取验证码");
                            clearInterval(timer2);
                            timeTwo = 60;
                        }
                        timeTwo--;
                    }, 1000);

                    //$('#writeNewCode').val(otp);
                    $('#writeNewCode').css('border-color', '');
                    $('#CP_errorNone2').css('display', 'none');
                    $('#CP_infoNone2').css('display', 'block');
                }, function (errorCode, errorMsg) {
                    $('#newPhone').css('border-color', '#ff0045');
                    $('#CP_proTwo').html(errorMsg);
                });
            });
            //设置新手机号码
            $('#butTwo').bind('click', function () {
                var newCode = $('#writeNewCode').val();
                var newPhone = $('#newPhone').val();

                var isOk = true;
                if (!that.checkNewPhone(newPhone)) {
                    isOk = false;
                }
                if (!that.checkPhoneCode(newCode, 'new')) {
                    isOk = false;
                }
                if (!isOk) {
                    return;
                }
                $('#butTwo').attr('disabled', 'true');
                that.user.setCellphoneNew(newPhone, newCode, function () {
                    $('#CP_proThree').html('修改成功').css('color', 'green');
                    that.user.logout(function (s) {
                        window.app = null;
                        window.location.reload();
                    }, function () {});
                }, function (errorCode, errorMsg) {
                    $('#butTwo').removeAttr('disabled');
                    $('#CP_errorNone2').css('display', 'block');
                    $('#CP_infoNone2').css('display', 'none');
                    $('#writeNewCode').css("border-color", "#ff0045");
                    $('#CP_proThree').text(errorMsg);
                });
            });
        },

        //验证码正则
        checkPhoneCode: function (code, codeType) {
            var isOk = true;
            var reg = /^[0-9]{6}$/;
            if (code.trim() == "" || code == null) {
                if (codeType == 'new') {
                    $('#CP_errorNone2').css('display', 'block');
                    $('#CP_infoNone2').css('display', 'none');
                    $("#CP_proThree").html("请输入验证码");
                    $('#writeNewCode').css("border-color", "#ff0045");
                } else {
                    $('#CP_errorNone').css('display', 'block');
                    $('#CP_infoNone').css('display', 'none');
                    $("#CP_proOne").html("请输入验证码");
                    $('#writeCode').css("border-color", "#ff0045");
                }
                isOk = false;
            } else if (!reg.test(code)) {
                if (codeType == 'new') {
                    $('#CP_errorNone2').css('display', 'block');
                    $('#CP_infoNone2').css('display', 'none');
                    $("#CP_proThree").html("请输入6位数字的验证码");
                    $('#writeNewCode').css("border-color", "#ff0045");
                } else {
                    $('#CP_errorNone').css('display', 'block');
                    $('#CP_infoNone').css('display', 'none');
                    $("#CP_proOne").html("请输入6位数字的验证码");
                    $('#writeCode').css("border-color", "#ff0045");
                }
                isOk = false;
            } else {
                if (codeType == 'new') {
                    $("#CP_proThree").html("");
                } else {
                    $("#CP_proOne").html('');
                }
            }
            return isOk;
        },

        //手机号码验证
        checkNewPhone: function (phone) {
            var isOk = true;
            var reg = /^1[3|4|5|7|8]\d{9}$/;
            if (phone.trim() == "" || phone == null) {
                $("#CP_proTwo").html("请输入新手机号码");
                $('#newPhone').css("border-color", "#ff0045");
                isOk = false;
            } else if (!reg.test(phone)) {
                $("#CP_proTwo").html("请输入11位正确的手机号码");
                $('#newPhone').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#CP_proTwo").html('');
            }
            return isOk;
        }

    }, {})
})($)
