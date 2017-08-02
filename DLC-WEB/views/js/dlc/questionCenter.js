(function ($) {
    'use strict'
    DLC.QuestionCenter = DLC.derive(DLC.DLC, {
        create: function (loadPage) {
            DLC.Util.initPage();
            window.app.initHeader(3);
            $("#questionCenterRightMain").load(loadPage);
        },
        init: function (showMenu) {
            $("#questionCenterA").click(function () {
                window.location.href = "/myCenter_questionUser";
            });
            $("#questionCenterB").click(function () {
                window.location.href = "/myCenter_questionPwd";
            });
            $("#questionCenterC").click(function () {
                window.location.href = "/myCenter_questionBank";
            });
            $("#questionCenterD").click(function () {
                window.location.href = "/myCenter_questionRecharge";
            });
            $("#questionCenterE").click(function () {
                window.location.href = "/myCenter_questionCash";
            });
            $("#questionCenterF").click(function () {
                window.location.href = "/myCenter_questionInvest";
            });
            $("#questionCenterG").click(function () {
                window.location.href = "/myCenter_questionIncomeAndRedeem";
            });
            switch (showMenu) {
            case "A":
                $("#questionCenterA").addClass("menuChoose");
                $("#questionCenter_A").removeClass("questionCenterA");
                $("#questionCenter_A").addClass("questionCenterA1");
                break;
            case "B":
                $("#questionCenterB").addClass("menuChoose");
                $("#questionCenter_B").removeClass("questionCenterB");
                $("#questionCenter_B").addClass("questionCenterB1");
                break;
            case "C":
                $("#questionCenterC").addClass("menuChoose");
                $("#questionCenter_C").removeClass("questionCenterC");
                $("#questionCenter_C").addClass("questionCenterC1");
                break;
            case "D":
                $("#questionCenterD").addClass("menuChoose");
                $("#questionCenter_D").removeClass("questionCenterD");
                $("#questionCenter_D").addClass("questionCenterD1");
                break;
            case "E":
                $("#questionCenterE").addClass("menuChoose");
                $("#questionCenter_E").removeClass("questionCenterE");
                $("#questionCenter_E").addClass("questionCenterE1");
                break;
            case "F":
                $("#questionCenterF").addClass("menuChoose");
                $("#questionCenter_F").removeClass("questionCenterF");
                $("#questionCenter_F").addClass("questionCenterF1");
                break;
            case "G":
                $("#questionCenterG").addClass("menuChoose");
                $("#questionCenter_G").removeClass("questionCenterG");
                $("#questionCenter_G").addClass("questionCenterG1");
                break;
            default:
                $("#questionCenterA").addClass("menuChoose");
                $("#questionCenter_A").removeClass("questionCenterA");
                $("#questionCenter_A").addClass("questionCenterA1");
                break;
            }
            window.scrollTo(0 , 0)
        }
    }, {})
})($)
