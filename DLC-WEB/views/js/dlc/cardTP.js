(function ($) {
    'use strict'
    DLC.CardTstPwd = DLC.derive(DLC.DLC, {
        create: function () {
            this.user = app.currentUser;
            this.account = app.account;
            window.app.initHeader(4);
        },
        init: function () {
            DLC.Util.initPage();
            var that = this;

            $('input').placeholder({
                placeholderColor: '#d2d2d2',
                isUseSpan: true,
                onInput: true,
            });

            that.account.getBizAccountInfo(function () {
                var data = that.account.accountInfo;
                if (data == null) return

                if (data["hasCard"] != true) {
                    window.location.href = "/myCenter_account";
                }

                $('#realname').val(data["name"]);
                var bankPhone = data["cards"][0]["cellphone"];
                $('#bankPhone').html(bankPhone);
            }, function (errorCode, errorMsg) {

            })

            //交易密码的可见与不可见事件
            $('#eye1').bind('click', function () {
                if ($('#cardTstPwd').attr('type') == 'password') {
                    $('#eye1').removeClass('e_one').addClass('e_two');
                    $('#cardTstPwd').attr('type', 'text');
                } else {
                    $('#eye1').removeClass('e_two').addClass('e_one');
                    $('#cardTstPwd').attr('type', 'password');
                }
            });
            $('#eye2').bind('click', function () {
                if ($('#cardAgainTstPwd').attr('type') == 'password') {
                    $('#eye2').removeClass('e_one').addClass('e_two');
                    $('#cardAgainTstPwd').attr('type', 'text');
                } else {
                    $('#eye2').removeClass('e_two').addClass('e_one');
                    $('#cardAgainTstPwd').attr('type', 'password');
                }
            });

            $('#cardCode').focus(function () {
                $('#cardCode').css("border-color", "#398be1");
                $('#proCard').html('');
            }).blur(function () {
                $('#cardCode').css("border-color", "");
            });
            $('#bankCode').focus(function () {
                $('#bankCode').css("border-color", "#398be1");
                $("#proBank").html('');
            }).blur(function () {
                $('#bankCode').css("border-color", "");
            });
            $('#bPCode').focus(function () {
                $('#bPCode').css("border-color", "#398be1");
                $("#proPCode").html('');
            }).blur(function () {
                $('#bPCode').css("border-color", "");
            });

            //获取手机验证码
            $('#getBPCode').bind('click', function () {
                that.account.resetTradePasswordOtp(function (data) {
                    //倒计时
                    var timeY = 60;
                    $('#getBPCode').attr("disabled", true);
                    $('#getBPCode').addClass('send').removeClass('m_gc');
                    $('#getBPCode').val(timeY + " s");
                    timeY--;
                    var timerY = setInterval(function () {
                        if ($('#getBPCode').val() == '获取验证码') {
                            clearInterval(timerY);
                            return;
                        }
                        $('#getBPCode').val(timeY + " s");
                        if (timeY == 0) {
                            $('#getBPCode').removeAttr("disabled");
                            $('#getBPCode').addClass('m_gc').removeClass('send').val("获取验证码");
                            clearInterval(timerY);
                            timeY = 60;
                        }
                        timeY--;
                    }, 1000);

                    $('#bPCode').css('border-color', '');
                    $('#cardError').hide();
                    $('.modifyPrompt').show();
                }, function (errorCode, errorMsg) {
                    $('#bPCode').css('border-color', '#ff0045');
                    $('#cardError').show();
                    $('.modifyPrompt').hide();
                    $('#proPCode').html(errorMsg);
                });
            });

            //验证手机验证码
            $('#confirm').bind('click', function () {
                var cardCode = $('#cardCode').val();
                var bankCode = $('#bankCode').val();
                var bPCode = $('#bPCode').val();
                var isOk = true;
                if (!that.checkIDCard(cardCode)) {
                    isOk = false;
                }
                if (!that.checkBankCard(bankCode)) {
                    isOk = false;
                }
                if (!that.cardPhoneCode(bPCode)) {
                    isOk = false;
                }
                if (!isOk) {
                    return false;
                }

                var data = {
                    smsCode: bPCode,
                    cardNo: bankCode,
                    idNo: cardCode,
                }
                $('#confirm').attr('disabled', 'true');
                that.account.validateResetTradePassword(data, function (responseData) {
                    $('#proPCode').html('验证成功').css('color', 'green');
                    $('#one').css('display', 'none');
                    $('#two').css('display', 'block');
                }, function (errorCode, errorMsg) {
                    $('#confirm').removeAttr("disabled");
                    $('#cardError').show();
                    $('.modifyPrompt').hide();
                    $('#proPCode').html(errorMsg);
                })
            });


            /*************修改交易密码*************/
            $('#cardTstPwd').focus(function () {
                $('#cardTstPwd').css("border-color", "#398be1");
                $('#proPwdOne').html('');
            }).blur(function () {
                $('#cardTstPwd').css("border-color", "");
            });
            $('#cardAgainTstPwd').focus(function () {
                $('#cardAgainTstPwd').css("border-color", "#398be1");
                $("#proPwdTow").html('');
            }).blur(function () {
                $('#cardAgainTstPwd').css("border-color", "");
            });
            //提交修改
            $('#mC_but').bind('click', function () {
                var newTstPwd = $('#cardTstPwd').val();
                var againNew = $('#cardAgainTstPwd').val();
                var isOK = true;
                if (!that.cardTstPwdFun(newTstPwd)) {
                    isOK = false;
                }
                if (!that.cardAgainTstPwdFun(newTstPwd, againNew)) {
                    isOK = false;
                }
                if (!isOK) {
                    return;
                }
                $('#mC_but').attr("disabled", 'true');
                that.account.resetTradePassword(newTstPwd, function () {
                    $('#proPwdTow').html('修改成功').css('color', 'green');
                    window.location.href = "/myCenter_account";
                }, function (errorCode, errorMsg) {
                    $('#mC_but').removeAttr("disabled");
                    $('#proPwdTow').html(errorMsg);
                })
            });

        },

        //身份证号验证
        checkIDCard: function (IDCard) {
            var isOk = true;
            var regCard = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
            if (IDCard.trim() == "" || IDCard == null) {
                $('#proCard').html('请输入身份证号');
                $('#cardCode').css("border-color", "#ff0045");
                isOk = false;
            } else if (!regCard.test(IDCard)) {
                $('#proCard').html('请输入18位正确的身份证号');
                $('#cardCode').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $('#proCard').html('');
            }
            return isOk;
        },
        //银行卡号验证
        checkBankCard: function (bankCard) {
            var isOk = true;
            var regBank = /^(\d{16}|\d{19}|\d{17}|\d{18})$/;
            if (bankCard.trim() == "" || bankCard == null) {
                $('#proBank').html('请输入银行卡号');
                $('#bankCode').css("border-color", "#ff0045");
                isOk = false;
            } else if (!regBank.test(bankCard)) {
                $('#proBank').html('请输入16-19位数字正确的银行卡号');
                $('#bankCode').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $('#proBank').html('');
            }
            return isOk;
        },
        //手机验证码验证
        cardPhoneCode: function (code) {
            var isOk = true;
            var reg = /^[0-9]{6}$/;
            if (code.trim() == "" || code == null) {
                $('#cardError').show();
                $('.modifyPrompt').hide();
                $("#proPCode").html("请输入验证码");
                $('#bPCode').css("border-color", "#ff0045");
                isOk = false;
            } else if (!reg.test(code)) {
                $('#cardError').show();
                $('.modifyPrompt').hide();
                $("#proPCode").html("请输入6位数字的验证码");
                $('#bPCode').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#proPCode").html('');
            }
            return isOk;
        },
        //交易密码验证
        cardTstPwdFun: function (newTstPass) {
            var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
            var isOk = true;
            if (newTstPass.trim() == "" || newTstPass == null) {
                $('#proPwdOne').html('请输入新交易密码');
                $('#cardTstPwd').css("border-color", "#ff0045");
                isOk = false;
            } else if (!reg.test(newTstPass)) {
                $('#proPwdOne').html('请输入8-16位数字和字母组合的密码');
                $('#cardTstPwd').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $('#proPwdOne').html('');
            }
            return isOk;
        },
        //确认交易密码验证
        cardAgainTstPwdFun: function (newPwd, newAgainPwd) {
            var isOk = true;
            if (newAgainPwd.trim() == "" || newAgainPwd == null) {
                $("#proPwdTow").html("请再次输入新交易密码");
                $('#cardAgainTstPwd').css("border-color", "#ff0045");
                isOk = false;
            } else if (newPwd != newAgainPwd) {
                $("#proPwdTow").html("两次输入的新交易密码不一致");
                $('#cardAgainTstPwd').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#proPwdTow").html('');
            }
            return isOk;
        },

    }, {})
})($)
