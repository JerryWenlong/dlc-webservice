/**
 * Created by chenwei on 2016/6/14.
 */
/**
 * Created by chenwei on 2016/6/6.
 */
(function ($) {
    'use strict'
    var that = null;
    DLC.withdraw = DLC.derive(DLC.withdraw, {
        create: function () {
            this.User = app.currentUser;
            this.account = app.account;
            this.trade = app.trade;
            this.password = "";
            this.isPay = false;
            that = this;
            DLC.Util.initPage();
            window.app.initHeader(4);
        },
        passWordHide: function (inputControls, outPassword) {
            var text = inputControls.val();
            var lastIndex = text.lastIndexOf("*", text.length - 1);
            if (lastIndex == -1) {
                lastIndex = 0;
                outPassword = "";
            } else {
                lastIndex++;
            }
            var in_l = text.length;
            if (in_l <= outPassword.length && outPassword.length != 0) {
                outPassword = outPassword.substr(0, in_l);
            } else {
                outPassword += text.substr(lastIndex, text.length - lastIndex);
            }

            var prolimitval = inputControls.val().replace(/[^*]/g, '*');
            inputControls.val(prolimitval);
            return outPassword;
        },
        init: function () {
            $("#wait").hide();
            $('input').placeholder({
                isUseSpan: true,
                placeholderColor: '#8d8d8d'
            });

            $(".notes_help").hover(function () {
                    $(".rule_detail").show();
                },
                function () {
                    $(".rule_detail").hide();
                })
            that.account.getBizAccountInfo(function () {
                var data = that.account.accountInfo;
                if(data.cards.length < 1){
                    window.location.href = "/myCenter_userBindBankCard";
                }
                if (data == null) return;
                if (data["freeTimes"] < 1) $(".showTo2").show();
                DLC.Util.setBankIcon(data["cards"][0]["bankNo"], 'bank_icon');
                $('#available').html(data["balance"]["available"]);
                $('#bankName').html(data["cards"][0]["bankName"]);
                var no = data["cards"][0]["cardNo"];
                no = no.substr(no.length - 4, 4);
                $('#bankNo').html(no);
                var times = data["freeTimes"];
                if (times == 0) {
                    $('#fee').show();
                } else {
                    $('#fee').hide();
                }
                that.account.getBanks(data["cards"][0]["bankNo"], function (data) {
                        var LimitOut = data["oneUpperLimitOut"];
                        $('#notes').html(LimitOut);
                        var i = LimitOut.indexOf(".");
                        if (i < 5) {
                            LimitOut = LimitOut.substr(0, i);
                            $('#limitBit').hide();
                        } else {
                            LimitOut = LimitOut.substr(0, i - 4);
                        }
                        $('#limitNo').html(LimitOut);
                    },
                    function (errorCode, errorMsg) {})
            }, function (errorCode, errorMsg) {

            })
            $(document).on("keyup", '#no_withdraw', function () {
                var prolimitval = $(this).val().replace(/[^\d.-]/g, '');
                $(this).val(prolimitval);
            });

            $('#withdrawClick').bind("click", function () {
                var amount = $('#no_withdraw').val();
                var password = that.password; // $('#passWord_withdraw').val();
                if (amount.trim() == "" || amount.length > 10) {
                    $('#withdrawClick').addClass("mT20");
                    $('#error').html("请填写有效金额，金额需小于10位");
                    return;
                }
                if (password.trim() == "") {
                    $('#withdrawClick').addClass("mT20");
                    $('#error').html("请填写密码");
                    return;
                }
                var getPhoneCode = $('#bPCode').val();
                if (getPhoneCode.trim() == "") {
                    $('#withdrawClick').addClass("mT20");
                    $('#error').html("请填写手机验证码");
                    return;
                }
                var rul = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                var id = rul.test(amount);
                if (!id) {
                    $('#withdrawClick').addClass("mT20");
                    $('#error').html("金额是正数且精度不能大于两位小数");
                    return;
                }
                var codeRul = /^[0-9]{6}$/;
                if (!codeRul.test(getPhoneCode)) {
                    $('#withdrawClick').addClass("mT20");
                    $('#error').html("请填写六位数字验证码");
                    return;
                }
                var param = {
                    tradePassword: password,
                    acceptTos: 1,
                    amount: amount,
                    smsCode: getPhoneCode
                }
                if (that.isPay) {
                    return;
                }
                that.isPay = true;
                DLC.Util.showOverlay();
                $("#wait").show();
                that.trade.withdraw(param, function () {
                    window.location.href = "/myCenter_account";
                    //     that.isPay=false;
                    $("#wait").hide();
                    DLC.Util.hideOverlay();
                }, function (errorCode, errorMsg) {

                    $('#withdrawClick').addClass("mT20");
                    $('#error').html(errorMsg);
                    that.isPay = false;
                    $("#wait").hide();
                    DLC.Util.hideOverlay();
                })


            });
            $(document).on("keyup", '#no_deposit', function () {
                var prolimitval = $(this).val().replace(/[^\d.-]/g, '');
                $(this).val(prolimitval);
            });
            $(document).on("keyup", '#passWord_withdraw', function () {
                that.password = that.passWordHide($(this), that.password);
            });
            $(document).on("keyup", '#passWord_deposit', function () {
                that.password = that.passWordHide($(this), that.password);
            });
            $('#depositClick').bind("click", function () {
                var amount = $('#no_deposit').val();
                var password = that.password; //$('#passWord_deposit').val();
                if (amount.trim() == "" || amount.length > 10) {
                    $('#depositClick').addClass("mT20");
                    $('#error').html("请填写有效金额，金额需小于10位");
                    return;
                }
                if (password.trim() == "") {
                    $('#depositClick').addClass("mT20");
                    $('#error').html("请填写密码");
                    return;
                }
                var getPhoneCode = $('#bPCode').val();
                if (getPhoneCode.trim() == "") {
                    $('#depositClick').addClass("mT20");
                    $('#error').html("请填写手机验证码");
                    return;
                }
                var rul = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                var id = rul.test(amount);
                if (!id) {
                    $('#depositClick').addClass("mT20");
                    $('#error').html("金额是正数且精度不能大于两位小数");
                    return;
                }
                var codeRul = /^[0-9]{6}$/;
                if (!codeRul.test(getPhoneCode)) {
                    $('#depositClick').addClass("mT20");
                    $('#error').html("请填写六位数字验证码");
                    return;
                }
                var param = {
                    tradePassword: password,
                    acceptTos: 1,
                    amount: amount,
                    smsCode: getPhoneCode
                }
                if (that.isPay) {
                    return;
                }
                that.isPay = true;
                DLC.Util.showOverlay();
                $("#wait").show();

                that.trade.deposit(param, function () {
                    if ($.cookie('orderNo')) {
                        window.location.href = "/pay_" + $.cookie('orderNo');
                    } else {
                        window.location.href = "/myCenter_account";
                    }
                    DLC.Util.hideOverlay();
                    $("#wait").hide();
                    //   that.isPay=false;
                }, function (errorCode, errorMsg) {
                    $('#depositClick').addClass("mT20");
                    $('#error').html(errorMsg);
                    that.isPay = false;
                    $("#wait").hide();
                    DLC.Util.hideOverlay();
                })
            });
            //获取手机验证码
            $('#getBPCode').bind('click', function () {
                var otpType = $(this).attr("tag");
                that.account.getPayOtp(otpType,function (data) {
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
                    $('#error').html('');
                }, function (errorCode, errorMsg) {
                    $('#bPCode').css('border-color', '#ff0045');
                    $('#error').html(errorMsg);
                });
            });
        }

    }, {})
})($)
