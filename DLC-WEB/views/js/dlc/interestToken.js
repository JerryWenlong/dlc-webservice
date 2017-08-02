(function($) {
    'use strict'
    var that = null;
    DLC.InterestToken = DLC.derive(DLC.DLC, {
        create: function(loadPage) {
            this.User = app.currentUser;
            this.Account = app.account;
            that = this;
            this.type = "0";
        },
        init: function() {
            DLC.Util.initPage();
            window.app.initHeader(4);
            $(".userCenterMain").css("height", "965px");
            $(".userCenterRightMain").css("height", "900px");
            var expsList = "";
            $(".ucemlDiv").click(function() {
                $(".ucemlDiv").removeClass("ucemlDivOn");
                $(this).addClass("ucemlDivOn");
                that.type = $(this).attr("tag");
                that.getExperiences(1, null);
            });
            that.Account.getBizAccountInfo(function() {
                var data = that.Account.accountInfo;
                if (data == null) return
                $("#sumCon").html(data.asset.totalCoupon);
                $("#incomeCon").html(data.asset.couponExpect);
                $("#sumIncomeCon").html(data.asset.couponProfit);
                if (parseFloat(data.asset.couponProfit) > 0 && parseFloat(data.asset.frozenProfit) > 0) {
                    $(".ucETopGetIncome").show();
                }
            });

            that.getExperiences(1, null);
            $(".sx-tip").click(function() {
                that.showSXRule();
            });
        },
        magic_number: function(who, num) {
            var whoObj = $("#" + who);
            num++;
            whoObj.animate({
                count: num
            }, {
                duration: 500,
                step: function() {
                    whoObj.html(String(parseInt(this.count)));
                }
            });
        },
        getExperiences: function(page, succFun) {
            that.Account.getInterestToken(that.type, page, 8, function(list, paging) {
                that.expsList = list;
                var isSuccFun = false;
                var content = "";
                for (var i in list) {
                    if (i == 'forEach' || i == 'find') {
                        break;
                    }
                    var tag = i,
                        status = list[i].status,
                        code = list[i].couponCode,
                        money = list[i].amount,
                        prodTerm = list[i].prodTerm,
                        incomeMoney = list[i].expectProfit,
                        useStarTime = list[i].validFrom.split("T")[0].replace(/-/g, "/"),
                        useEndTime = list[i].validThru.split("T")[0].replace(/-/g, "/"),
                        incomeTime = (list[i].redeemedAt == "1970-01-01T08:00:00") ? "----/--/--" : list[i].redeemedAt.split("T")[0].replace(/-/g, "/"),
                        incomeStarTime = (list[i].usedAt == "1970-01-01T08:00:00") ? "----/--/--" : list[i].usedAt.split("T")[0].replace(/-/g, "/"),
                        incomeEndTime = (list[i].expiredAt == "1970-01-01T08:00:00") ? "----/--/--" : list[i].expiredAt.split("T")[0].replace(/-/g, "/"),
                        minInvestMoney = list[i].minInvestAmount,
                        maxInvestMoney = list[i].maxInvestAmount,
                        couponCategory = list[i].categoryType,
                        rateSteps = list[i].rateSteps,
                        description = list[i].description;

                    var proList = list[i].products;
                    var proStr = list[i].description;
                    if (status == 0) {
                        isSuccFun = true;
                    }
                    content += that.uceOne(tag, status, code, money, incomeMoney, useStarTime, useEndTime, incomeTime, incomeStarTime, incomeEndTime, description, prodTerm, proStr, minInvestMoney, couponCategory, rateSteps,maxInvestMoney);
                }
                if (content == "") {
                    content += that.uceNone();
                }
                $("#ucEContent").html(content);
                if (list.length < 1) {
                    $('.product-list').hide();
                } else {
                    $('.product-list').show();
                }
                $('.pagination').pagination(paging.total * paging.pageSize, {
                    num_edge_entries: 1,
                    num_display_entries: 5,
                    current_page: paging.page - 1,
                    callback: function(page) {
                        that.getExperiences(page, null)
                    },
                    items_per_page: paging.pageSize,
                });
            }, function(errorCode, errorMsg, response) {

            });
        },
        uceOne: function(tag, status, code, money, incomeMoney, useStarTime, useEndTime, incomeTime, incomeStarTime, incomeEndTime, description, prodTerm, proStr, minInvestMoney, couponCategory, rateSteps,maxInvestMoney) {
            var classState = '',
                dateDif = (prodTerm == 0) ? "----" : prodTerm + "天";
            if (status == 0) {
                classState = "noUse";
            } else if (status == 1) {
                classState = "use";
            } else {
                classState = "exp";
            }

            var investMoney = parseInt(minInvestMoney);
            var showInvestMoneyTxt = "&nbsp;";
            if (investMoney > 0) {
                showInvestMoneyTxt = '( 满' + investMoney + '以上使用 )';
            }
            //money
            var content = '<div class="token-detail ' + classState + '" tag="' + tag + '" code="' + code + '">';
            content += '<div class="token-act"><div class="token-state"></div><div class="cp-con-top">';
            content += '<div class="cct"><p class="cct-p1">复投</p><p class="cct-p2">加息</p></div>';
            if (rateSteps && rateSteps.length > 0) {
                for (var z = 0; z < rateSteps.length; z++) {
                    content += '<div class="cct-one"><p class="cct-p1">' + parseInt((rateSteps[z].prodTerm) / 30) + '月</p><p class="cct-p2">' + (rateSteps[z].amount) + '%</p></div>';
                }
            }
            // content += '<div class="cct-one"><p class="cct-p1">1月</p><p class="cct-p2">1%</p></div>';
            // content += '<div class="cct-one"><p class="cct-p1">3月</p><p class="cct-p2">2%</p></div>';
            // content += '<div class="cct-one"><p class="cct-p1">6月</p><p class="cct-p2">3%</p></div>';
            // content += '<div class="cct-one"><p class="cct-p1">12月</p><p class="cct-p2">4%</p></div>';
            content += '</div><div class="cp-con-bottom">';
            if (parseInt(minInvestMoney) == 0 && parseInt(maxInvestMoney) == 2147483647) {
                content += '<p>1.单笔投资无限制</p>';
            } else if (parseInt(minInvestMoney) > 0 && parseInt(maxInvestMoney) == 2147483647) {
                content += '<p>1.单笔投资金额≥' + parseInt(minInvestMoney) + '元可使用</p>';
            } else if (parseInt(minInvestMoney) == 0 && parseInt(maxInvestMoney) > 0) {
                content += '<p>1.单笔投资≤' + parseInt(minInvestMoney) + '元可使用</p>';
            } else if (parseInt(minInvestMoney) > 0 && parseInt(maxInvestMoney) >= parseInt(minInvestMoney)) {
                content += '<p>1.单笔投资' + parseInt(minInvestMoney) + '~' + parseInt(maxInvestMoney) + '元可使用</p>';
            } else {
                content += '<p>1.单笔投资无限制</p>';
            }
            content += '<p>2.仅适用于节节升息类产品</p>';
            content += '<p>3.有效期' + useStarTime + '至' + useEndTime + '</p></div></div></div>';
            return content;
        },
        uceNone: function() {
            var content = '<div class="ucecNone"><div class="no-token-icon"></div><div class="no-token-desc">暂无升息令牌</div></div>';
            return content;
        },
        showSXRule: function() {
            $('#adjust').load('../pages/contract/sxRule.html', function() {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                $('#pcRuleClose').click(function() {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                });

            })
        },
    }, {})
})($)
