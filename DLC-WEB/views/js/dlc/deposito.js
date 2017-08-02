/**
 * Created by chenwei on 2016/6/14.
 */
/**
 * Created by chenwei on 2016/6/6.
 */
(function ($) {
    'use strict'
    var that = null;
    DLC.DepositO = DLC.derive(DLC.DepositO, {
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
            that.inintBankList();
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
                if (data == null) return
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
            $(document).on("keyup", '#no_deposito', function () {
                var prolimitval = $(this).val().replace(/[^\d.-]/g, '');
                $(this).val(prolimitval);
            });
            $(document).on("keyup", '#passWord_deposito', function () {
                that.password = that.passWordHide($(this), that.password);
            });
            $('#depositClick').bind("click", function () {
                var amount = $('#no_deposito').val();
                var password = that.password; //$('#passWord_deposit').val();
                if (amount.trim() == "" || amount.length > 10) {
                    $('#depositClick').addClass("mT20");
                    $('#error').html("请填写有效金额，金额需小于11位");
                    return false;
                }
                if (password.trim() == "") {
                    $('#depositClick').addClass("mT20");
                    $('#error').html("请填写密码");
                    return false;
                }
                var rul = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                var id = rul.test(amount);
                if (!id) {
                    $('#depositClick').addClass("mT20");
                    $('#error').html("金额是正数且精度不能大于两位小数");
                    return false;
                }
                var param = {
                    tradePassword: password,
                    acceptTos: 1,
                    amount: amount
                }
                if (that.isPay) {
                    return false;
                }

                var redioValue = $(':radio[name="bankCode"]:checked').val();
                if (typeof redioValue == "undefined") {
                    $('#error').html("请选择银行卡");
                    return false;
                }
                that.isPay = true;
                DLC.Util.showOverlay();
                $("#wait").show();
                param.bankNo = redioValue;
                param.payChannel = 1;

                param.notifyUrl = DLC.Config.accountService.host + "/bfBack";
                that.trade.deposit(param, function (getResult) {
                    var showHtml = getResult.redirectUrl;
                    $("#bfHtml").html(showHtml);
                    $("#pay").submit();
                    DLC.Util.hideOverlay();
                    $("#wait").hide();
                }, function (errorCode, errorMsg) {
                    $('#depositClick').addClass("mT20");
                    $('#error').html(errorMsg);
                    that.isPay = false;
                    $("#wait").hide();
                    DLC.Util.hideOverlay();
                })
                return false;
            });
        },
        //初始化银行列表
        inintBankList: function () {
            this.account.getAllBfBanks(function (list) {
                if (list != null) {
                    var bankHtml = "";
                    for (var i = 0; i < list.length; i++) {
                        bankHtml += '<div class="wsone" tag="' + list[i].bankCode + '"><input type="radio" name="bankCode" class="wsoneRadio" tag="input' + list[i].bankCode + '" value="' + list[i].bankNo + '"><span class="wsoneSpan wsone' + list[i].bankCode + ' wsoneBE"></span></div>';
                    }
                    $(".withdraw_status2").html(bankHtml);
                    var isChick = "";
                    $(".wsone").mousemove(function () {
                        var tag = $(this).attr("tag");
                        $(".wsone" + tag).removeClass("wsoneBE").addClass("wsoneBB");
                    }).mouseout(function () {
                        var tag = $(this).attr("tag");
                        if (tag == isChick) {
                            return;
                        }
                        $(".wsone" + tag).removeClass("wsoneBB").addClass("wsoneBE");
                    }).click(function () {
                        if (isChick != "") {
                            $(".wsone" + isChick).removeClass("wsoneBB").addClass("wsoneBE");
                        }
                        var tag = $(this).attr("tag");
                        isChick = tag;
                        $("[tag=input" + tag + "]").get(0).checked = true;
                    });
                }
            }, function (errorCode, errorMsg) {});
        },
        postTo: function (url, params) {
            var temp = document.createElement("form");
            temp.action = url;
            temp.method = "post";
            temp.target = "_blank"
            temp.style.display = "none";
            for (var x in params) {
                var opt = document.createElement("textarea");
                opt.name = x;
                opt.value = params[x];
                temp.appendChild(opt);
            }
            document.body.appendChild(temp);
            temp.submit();
        }
    }, {})
})($)
