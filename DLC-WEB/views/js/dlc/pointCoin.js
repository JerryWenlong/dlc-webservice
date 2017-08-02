(function ($) {
    'use strict'
    var that = null;
    DLC.PointCoin = DLC.derive(DLC.DLC, {
        create: function () {
            DLC.Util.initPage();
            window.app.initHeader(4);
            this.User = app.currentUser;
            this.account = app.account;
            this.item_action = 0;
            this.type = "";
            that = this;
        },
        init: function () {
            that.getPage(1, null);
            that.account.getBizAccountInfo(function () {
                var data = that.account.accountInfo;
                if (data == null) return;
                $("#sumPointCon").html(data.asset.availablePoint);
            });
            $('#item_action0').bind("click", function () {
                if (that.item_action != 0) {
                    $('#item_action' + that.item_action).removeClass("actionH");
                    $('#item_action' + that.item_action).addClass("actionN");
                }
                $('#item_action0').removeClass("actionN");
                $('#item_action0').addClass("actionH");
                that.item_action = 0;
                that.type = "";
                that.getPage(1, null);
            });
            $('#item_action1').bind("click", function () {
                if (that.item_action != 1) {
                    $('#item_action' + that.item_action).removeClass("actionH");
                    $('#item_action' + that.item_action).addClass("actionN");
                }
                $('#item_action1').removeClass("actionN");
                $('#item_action1').addClass("actionH");
                that.item_action = 1;
                that.type = 0;
                that.getPage(1, null);
            });
            $('#item_action2').bind("click", function () {
                if (that.item_action != 2) {
                    $('#item_action' + that.item_action).removeClass("actionH");
                    $('#item_action' + that.item_action).addClass("actionN");
                }
                $('#item_action2').removeClass("actionN");
                $('#item_action2').addClass("actionH");
                that.item_action = 2;
                that.type = 2;
                that.getPage(1, null);
            });
            $("#showUcEPRule").click(function () {
                that.showPointCoinRule();
            });
            $(".ucEPCC4Span").click(function () {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust(".howGetPoints");
            });
            $("#aHGPClose").click(function () {
                DLC.Util.hideOverlay();
                DLC.Util.hideAdjust(".howGetPoints");
            });
            $(".ucEPCCGG").click(function () {
                window.location.href = "/activity161121";
            });
        },
        getPage: function (page, outFun) {
            var pageSize = 10;
            that.account.getPointsJour(that.type, page, pageSize, function (list, paging) {
                var pcHtml = "";
                for (var i = 0; i < list.length; i++) {
                    var colorClass = "backgroundColorFc";
                    if ((i + 1) % 2 == 1) {
                        colorClass = "backgroundColorFf";
                    }
                    var deltaAmount = parseInt(list[i].deltaAmount);
                    var txtC = "blue";
                    var txtF = "";
                    if (deltaAmount > 0) {
                        txtC = "red";
                        txtF = "+";
                    }
                    var createdAt = list[i].createdAt.replace(/-/g, "/").replace('T', " ");
                    pcHtml += '<li class="pc_limit_item ' + colorClass + '"><span class="item item274">' + createdAt + '</span> <span class="item item274">' + list[i].subject + '</span> <span class="item item274 ' + txtC + '">' + txtF + deltaAmount + '</span></li>';
                }
                $("#listShow").html(pcHtml);
                var box = $('.page-r');
                $(window).myPaging({
                    total: paging.total,
                    currentPage: paging.page,
                    box: box,
                    fun: that.getPage
                });
            }, function (errorCode, errorMsg) {

            })
        },
        showPointCoinRule: function () {
            $('#adjust').load('../pages/contract/pointCoinRule.html', function () {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                $('#pcRuleClose').click(function () {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                });

            })
        }
    }, {})
})($)
