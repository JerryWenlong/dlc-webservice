(function ($) {
    'use strict'
    DLC.UserCenter = DLC.derive(DLC.DLC, {
        create: function (loadPage, objPage) {
            this.User = app.currentUser;
            DLC.Util.initPage();
            if (app.route.oldHash == '') {
                app.route.oldHash = 'account';
            }
            if (this.User.hasLogin == false) {
                window.location.href = '/login';
            } else {
                $(".userCenterRightMain").show();
                $(".userCenterMain").show();
            }
            $("#userCenterRightMain").load(loadPage, function () {
                objPage.init();
            });
        },
        init: function (showMenu) {
            window.scroll(0, 0);
            $("#userCenterA").click(function () {
                window.location.href = "/myCenter_account";
            });
            $("#userCenterB").click(function () {
                window.location.href = "/myCenter_orders";
            });
            $("#userCenterC").click(function () {
                window.location.href = "/myCenter_financial";
            });
            $("#userCenterD").click(function () {
                window.location.href = "/myCenter_bills";
            });
            //            $("#userCenterE").click(function () {
            //                window.location.href = "/myCenter_experience";
            //            });
            $("#userCenterF").click(function () {
                window.location.href = "/myCenter_pointCoin";
            });
            $("#userCenterG").click(function () {
                window.location.href = "/myCenter_userRefer";
            });
            $("#userCenterH").click(function () {
                window.location.href = "/myCenter_userRedPacket";
            });
            $("#userCenterJ").click(function () {
                window.location.href = "/myCenter_userInterestToken";
            });
            switch (showMenu) {
            case "A":
                $("#userCenterA").addClass("menuChoose");
                $("#userCenter_A").removeClass("userCenterA");
                $("#userCenter_A").addClass("userCenterA1");
                $("#userCenterTopSpan").html("我的账户");
                break;
            case "B":
                $("#userCenterB").addClass("menuChoose");
                $("#userCenter_B").removeClass("userCenterB");
                $("#userCenter_B").addClass("userCenterB1");
                $("#userCenterTopSpan").html("我的订单");
                break;
            case "C":
                $("#userCenterC").addClass("menuChoose");
                $("#userCenter_C").removeClass("userCenterC");
                $("#userCenter_C").addClass("userCenterC1");
                $("#userCenterTopSpan").html("我的理财");
                break;
            case "D":
                $("#userCenterD").addClass("menuChoose");
                $("#userCenter_D").removeClass("userCenterD");
                $("#userCenter_D").addClass("userCenterD1");
                $("#userCenterTopSpan").html("资金明细");
                break;
            case "E":
                $("#userCenterE").addClass("menuChoose");
                $("#userCenter_E").removeClass("userCenterE");
                $("#userCenter_E").addClass("userCenterE1");
                $("#userCenterTopSpan").html("我的体验金");
                break;
            case "F":
                $("#userCenterF").addClass("menuChoose");
                $("#userCenter_F").removeClass("userCenterF");
                $("#userCenter_F").addClass("userCenterF1");
                $("#userCenterTopSpan").html("我的点币");
                break;
            case "G":
                $("#userCenterG").addClass("menuChoose");
                $("#userCenter_G").removeClass("userCenterG");
                $("#userCenter_G").addClass("userCenterG1");
                $("#userCenterTopSpan").html("邀请有礼");
                break;
            case "H":
                $("#userCenterH").addClass("menuChoose");
                $("#userCenter_H").removeClass("userCenterH");
                $("#userCenter_H").addClass("userCenterH1");
                $("#userCenterTopSpan").html("我的优惠券");
                break;
            case "J":
                $("#userCenterJ").addClass("menuChoose");
                $("#userCenter_J").removeClass("userCenterJ");
                $("#userCenter_J").addClass("userCenterJ1");
                $("#userCenterTopSpan").html("我的升息令牌");
                break;
            default:
                $("#userCenterA").addClass("menuChoose");
                $("#userCenter_A").removeClass("userCenterA");
                $("#userCenter_A").addClass("userCenterA1");
                $("#userCenterTopSpan").html("我的账户");
                break;
            }
        }
    }, {})
})($)