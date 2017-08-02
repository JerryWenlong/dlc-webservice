(function ($) {
    'use strict'
    DLC.AboutCenter = DLC.derive(DLC.DLC, {
        create: function (loadPage, objPage, adId) {
            DLC.Util.initPage();
            if (adId == "") {
                adId = "#aboutUsRightMain";
            }
            $(adId).load(loadPage, function () {
                if (objPage != null) {
                    objPage.init();
                }
            });
        },
        init: function (showMenu) {
            document.getElementById('mainContent').scrollIntoView();
            $("#aboutUsA").click(function () {
                window.location.href = "/aboutCompany";
            });
            $("#aboutUsB").click(function () {
                window.location.href = "/aboutMCompany";
            });
            $("#aboutUsC").click(function () {
                window.location.href = "/aboutShareholder";
            });
            $("#aboutUsD").click(function () {
                window.location.href = "/aboutMedia";
            });
            $("#aboutUsE").click(function () {
                window.location.href = "/aboutContact";
            });
            $("#aboutUsF").click(function () {
                window.location.href = "/aboutNotice/0";
            });
            $("#aboutUsG").click(function () {
                window.location.href = "/aboutNotice/1,2";
            });
            $("#aboutUsH").click(function () {
                window.location.href = "/aboutMAdvantage";
            });

            switch (showMenu) {
            case "A":
                $("#aboutUsA").addClass("auCMOLine");
                $(".auCBDiv").html("公司简介");
                $(".aboutUsMain").hide();
                break;
            case "B":
                $("#aboutUsB").addClass("auCMOLine");
                break;
            case "C":
                $("#aboutUsC").addClass("auCMOLine");
                break;
            case "D":
                $("#aboutUsD").addClass("auCMOLine");
                $(".auCBDiv").html("媒体报道");
                break;
            case "E":
                $("#aboutUsE").addClass("auCMOLine");
                $(".auCBDiv").html("联系我们");
                break;
            case "F":
                $("#aboutUsF").addClass("auCMOLine");
                $(".auCBDiv").html("最新公告");
                break;
            case "G":
                $("#aboutUsG").addClass("auCMOLine");
                $(".auCBDiv").html("新闻动态");
                break;
            case "H":
                $("#aboutUsH").addClass("auCMOLine");
                $(".auCBDiv").html("平台优势");
                $(".aboutUsMain").hide();
                break;
            default:
                $("#aboutUsA").addClass("auCMOLine");
                $(".auCBDiv").html("公司简介");
                break;
            }
            window.scrollTo(0, 0);
        },
    }, {})
})($)
