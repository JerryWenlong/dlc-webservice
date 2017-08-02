/**
 * Created by chenwei on 2016/6/12.
 */

(function ($) {
    'use strict'
    var that = null;
    var hasCard = false;
    DLC.myAccount = DLC.derive(DLC.DLC, {
        create: function (paras) {
            this.User = app.currentUser;
            this.account = app.account;
            this.trade = app.trade;
            that = this;
            that.paras = paras;
            window.app.initHeader(4);
        },
        init: function () {
            DLC.Util.initPage();
            $(".myAccountGG").click(function () {
                window.location.href = "/activity161121";
            });
            $(".uCTSpan").hide();
            that.User.getUserInfo(function () {
                var avatar = that.User.userInfo.avatar;
                var mail = that.User.userInfo.email;
                $(".notes_help").hover(function () {
                        $(".notes").show();
                    },
                    function () {
                        $(".notes").hide();
                    })
                if (mail != "") {
                    $('#mail_card').html(mail);

                    $('#mail_icon').addClass("mailedit");
                } else {
                    $('#mail_card').html("- - - - - -");
                    $('#mail_icon').addClass("mailno");
                }
                if (avatar != "") {
                    $('#img_account').attr('src', avatar);
                    $('#picS').attr('src', avatar);
                    $('#title_accounticon').addClass("account_info_iconH");
                    $('#account_info_status').html("已设置");
                    $('#account_info_icon').addClass("account_info_iconH");

                } else {
                    $('#account_info_icon').addClass("account_info_iconN");
                    $('#title_accounticon').addClass("account_info_iconN");
                    $('#account_info_status').html("未设置");
                    //    $('#img_account').attr('src', "../images/userCenter/default.png");
                    //    $('#picS').attr('src', "../images/userCenter/default.png");
                    $('#img_account').addClass("default");
                    $('#picS').addClass("default");

                    var browser = navigator.appName;
                    var b_version = navigator.appVersion;
                    var version = b_version.split(";");
                    if (version.length > 1) {
                        var trim_Version = parseInt(version[1].replace(/[ ]/g, "").replace(/MSIE/g, ""));
                        if (trim_Version < 9) {

                            $('#img_account').addClass("defaultIE8");
                            $('#picS').addClass("defaultIE8");
                            $('#img_account').attr('src', "");
                            $('#picS').attr('src', "");
                        }
                    }
                }
            }, function (errorCode, errorMsg) {

            })
            that.account.getBizAccountInfo(function () {
                var data = that.account.accountInfo;
                if (data == null) return
                $('#mayProfit').html(data["asset"]["expectProfit"]);
                $('#totalProfit').html(data["asset"]["totalProfit"]);
                $('#available').html(data["balance"]["available"]);
                $('#total').html(data["totalAsset"]);
                $('#title_phone').html(data["cellphone"]);
                hasCard = data["hasCard"];
                if (data["hasCard"] == true) {
                    $('#card_info_status').html("已绑定");
                    $('#card_info_icon').addClass("card_info_iconH");
                    $('#title_varicon').addClass("card_info_iconH");
                    $('#card_edit').addClass("card_info_content_editNo");
                } else {
                    $('#card_edit').bind("click", function () {
                        window.location.href = "/myCenter_userBindBankCard";
                    });
                    $('#card_info_status').html("未绑定");
                    $('#card_info_icon').addClass("card_info_iconN");
                    $('#title_varicon').addClass("card_info_iconN");
                }
                if (data["authed"] == true) {
                    $('#var_info_status').html("已认证");
                    $('#name_info_content_value').html(data["name"]);
                    $('#name_info_content_value1').html(data["idNo"]);
                    $('#var_info_icon').addClass("var_info_iconH");
                    $('#var_edit').addClass("card_info_content_editNo");
                    $('#title_cardicon').addClass("var_info_iconH");

                } else {
                    $('#var_info_status').html("未认证");
                    $('#name_info_content_value').html("- - - - - -");
                    $('#name_info_content_value1').html("- - - - - -");
                    $('#var_info_icon').addClass("var_info_iconN");
                    $('#title_cardicon').addClass("var_info_iconN");

                    $('#var_edit').bind("click", function () {
                        window.location.href = "/myCenter_auth";
                    });

                }
                var cardNo = "";
                var cellphone = "";
                var bank = "";
                if (data["cards"].length > 0) {
                    bank = data["cards"][0]["bankName"];
                    cardNo = data["cards"][0]["cardNo"];
                }
                cellphone = data["cellphone"];
                if (cellphone != "") {
                    $('#phone_info_status').html("已认证");
                    $('#phone_card').html(cellphone);
                    $('#phone_info_icon').addClass("bindphone_info_iconH");

                } else {
                    $('#phone_info_status').html("未认证");
                    $('#phone_card').html("- - - - - -");
                    $('#phone_info_icon').addClass("bindphone_info_iconN");
                }

                if (bank != "") {
                    $('#card_info_content_value').html(bank);
                } else {
                    $('#card_info_content_value').html("- - - - - -");
                }


                if (cardNo != "") {
                    $('#card_info_content_value1').html(cardNo);
                    $('#trade_reset').bind("click", function () {

                        window.location.href = "/myCenter_cardTstPwd";
                    });
                } else {
                    $('#card_info_content_value1').html("- - - - - -");
                    $('#trade_reset').bind("click", function () {

                        window.location.href = "/myCenter_noCardTstPwd";
                    });
                }

                if (data["hasPassword"] == true) {
                    $('#trade_info_status').html("已设置");
                    $('#trade_info_icon').addClass("trade_info_iconH");
                } else {
                    $('#trade_info_status').html("未设置");
                    $('#trade_info_icon').addClass("trade_info_iconN");
                }

            }, function (errorCode, errorMsg) {

            })

            $('#deposit_page').bind("click", function () {
                if (!hasCard) {
                    window.location.href = "/myCenter_userBindBankCard";
                } else {
                    window.location.href = "/myCenter_deposit";
                }

            });
            $('#withdraw_page').bind("click", function () {
                if (!hasCard) {
                    window.location.href = "/myCenter_userBindBankCard";
                } else {
                    window.location.href = "/myCenter_withdraw";
                }

            });


            $('#phone_edit').bind("click", function () {
                window.location.href = "/myCenter_userChangePhone";
            });

            $('#login_edit').bind("click", function () {
                window.location.href = "/myCenter_editLoginPwd";
            });
            $('#trade_edit').bind("click", function () {
                window.location.href = "/myCenter_modifyTstPwd";
            });
            $('#account_edit').bind("click", function () {
                window.location.href = "/myCenter_userInfo";
            });

            $('#mail_icon').bind("click", function () {
                window.location.href = "/myCenter_editEmail";
            });
            if (this.paras) {
                this.showLog(this.paras);
            }
        },
        showLog: function (paras) {
            var bfResult = paras.substr(paras.indexOf("Result=") + 7, 1);
            if (bfResult == "1") {
                DLC.Util.showOverlay();
                DLC.Util.showErrorAdjust("充值成功！", null);
            } else {
                DLC.Util.showOverlay();
                DLC.Util.showErrorAdjust("充值失败！", null);
            }
        }
    }, {})
})($)
