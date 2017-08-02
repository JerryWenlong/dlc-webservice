(function ($) {
    'use strict'
    var that = null;
    DLC.UserRefer = DLC.derive(DLC.DLC, {
        create: function (para) {
            this.User = app.currentUser;
            this.Account = app.account;
            that = this;
            this.showPage = para;
            window.app.initHeader(4);
        },
        init: function () {
            var hasCard = false;
            //先读取数据，是否绑卡
            that.Account.getBizAccountInfo(function () {
                var data = that.Account.accountInfo;
                if (data.cards[0] != null) {
                    hasCard = true;
                    $(".isBindCard").show();
                    $(".userCenterMain").css("height", "1400px");
                    $(".userCenterRightMain").css("height", "1280px");
                    $(".referBg").css("height", "1372px");
                    that.User.getRefer(function (data) {
                        var qrCode = data.qrCode;
                        var link = data.link;
                        var code = data.token;
                        $("#imgQrCode").attr("src", qrCode);
                        $("#divCode").html(code);
                        $("#inputLink").val(link);
                        $("#inputLink").click(function () {
                            this.select();
                        });
                        var c1 = new NewClipBoard({
                            handlerID: 'inputButton',
                            textID: 'inputLink',
                            isAttr: false,
                            type: 'copy'
                        });
                        c1.attach(function () {
                            $(".clickShow").html("复制成功！");
                            $(".clickShow").fadeIn(500);
                            setTimeout(function () {
                                $(".clickShow").fadeOut(1000);
                            }, 1000);
                        }, function () {
                            $(".clickShow").html("复制失败，请手动复制！");
                            $(".clickShow").fadeIn(500);
                        });
                    }, function (errorMsg) {

                    });
                } else {
                    $(".noBindCard").show();
                }
                if (that.showPage == 'refList') {
                    $(".referH1").removeClass("rhb");
                    $(".refList").addClass("rhb");
                    $(".rhDiv").hide();
                    $(".rhDiv2").show();
                    $(".userCenterMain").css("height", "895px");
                    $(".userCenterRightMain").css("height", "830px");
                    $(".referBg").css("height", "805px");
                    $("#listInvestShow").html("");
                    $(".page-r3").html("");
                    that.getPointsCount("1", "noPeoSpan");
                    that.getPointsCount("2", "isPeoSpan");
                    that.getReferPoints(1, null);
                }
            });
            that.Account.getBizAccountInfo(function () {
                var data = that.Account.accountInfo;
                if (data == null) return
                $("#sumMoneySpan").html(data.asset.totalReward);
                $("#noMoneySpan").html(data.asset.expectReward);
                $("#isMoneySpan").html(data.asset.actualReward);
            });
            that.getPointsCount("1,2", "sumPeoSpan");
            $(".referH1").click(function () {
                $(".referH1").removeClass("rhb");
                $(this).addClass("rhb");
                var html = $(this).html();
                $(".rhDiv").hide();
                if (html == '邀请好友') {
                    $(".rhDiv1").show();
                    if (hasCard) {
                        $(".userCenterMain").css("height", "1500px");
                        $(".userCenterRightMain").css("height", "1397px");
                        $(".referBg").css("height", "1372px");
                    } else {
                        $(".userCenterMain").css("height", "895px");
                        $(".userCenterRightMain").css("height", "830px");
                        $(".referBg").css("height", "805px");
                    }
                } else if (html == '邀请奖励') {
                    $(".rhDiv2").show();
                    $(".userCenterMain").css("height", "895px");
                    $(".userCenterRightMain").css("height", "830px");
                    $(".referBg").css("height", "805px");
                    $("#listInvestShow").html("");
                    $(".page-r3").html("");
                    if ($("#listPointShow").html() == "") {
                        that.getPointsCount("1", "noPeoSpan");
                        that.getPointsCount("2", "isPeoSpan");
                        that.getReferPoints(1, null);
                    }
                } else if (html == '投资奖励') {
                    $(".rhDiv3").show();
                    $(".userCenterMain").css("height", "895px");
                    $(".userCenterRightMain").css("height", "830px");
                    $(".referBg").css("height", "805px");
                    $("#listPointShow").html("");
                    $(".page-r2").html("");
                    if ($("#listInvestShow").html() == "") {
                        that.getReferInvests(1, null);
                    }
                }
            });
        },
        getReferPoints: function (page, sucFun) {
            var pageSize = 10;
            that.Account.getPointsRefer(page, pageSize, function (list, paging) {
                var pcHtml = "";
                for (var i = 0; i < list.length; i++) {
                    var colorClass = "backgroundColorFc";
                    if ((i + 1) % 2 == 1) {
                        colorClass = "backgroundColorFf";
                    }
                    var createdAt = list[i].createdAt.replace(/-/g, "/").replace('T', " ");
                    var type = (list[i].type == "1") ? "否" : "是";
                    pcHtml += '<li class="pc_limit_item ' + colorClass + '"><span class="urItem item220">' + createdAt + '</span> <span class="urItem item220">' + list[i].source + '</span> <span class="urItem item220 ">' + type + '</span> <span class="urItem item220">' + list[i].pointValue + '</span></li>';
                }
                $("#listPointShow").html(pcHtml);
                var box = $('.page-r2');
                $(window).myPaging({
                    total: paging.total,
                    currentPage: paging.page,
                    box: box,
                    fun: that.getReferPoints
                });
            }, function (errorCode, errorMsg) {

            })
        },
        getPointsCount: function (type, spanName) {
            that.Account.getPointsCount(type, function (count) {
                $("#" + spanName).html(count);
            }, function (errorCode, errorMsg) {})
        },
        getReferInvests: function (page, sucFun) {
            var pageSize = 10;
            that.Account.getReferInvests(page, pageSize, function (list, paging) {
                var pcHtml = "";
                for (var i = 0; i < list.length; i++) {
                    var colorClass = "backgroundColorFc";
                    if ((i + 1) % 2 == 1) {
                        colorClass = "backgroundColorFf";
                    }
                    var createdAt = list[i].orderCreatedAt.replace(/-/g, "/").replace('T', " ");
                    pcHtml += '<li class="pc_limit_item ' + colorClass + '"><span class="urItem item200">' + createdAt + '</span> <span class="urItem item120">' + list[i].orderUsername + '</span> <a href="/product_' + list[i].orderProductId + '"><span class="urItem item200 cursor">' + list[i].orderProductName + '</span></a> <span class="urItem item120">' + list[i].totalCredit + '</span> <span class="urItem item120">' + list[i].unpaidCredit + '</span> <span class="urItem item120">' + list[i].paidCredit + '</span></li>';
                }
                $("#listInvestShow").html(pcHtml);
                var box = $('.page-r3');
                $(window).myPaging({
                    total: paging.total,
                    currentPage: paging.page,
                    box: box,
                    fun: that.getReferInvests
                });
            }, function (errorCode, errorMsg) {

            })
        }
    }, {})
})($)
