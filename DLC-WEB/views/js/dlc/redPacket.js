(function($) {
    'use strict'
    var that = null;
    DLC.RedPacket = DLC.derive(DLC.DLC, {
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
            $(".fx-tip").click(function() {
                that.showFXRule();
            });
            $(".mj-tip").click(function() {
                that.showMJRule();
            });
            $(".jx-tip").click(function() {
                that.showJXRule();
            });
            // that.Account.getCouponsCount(0, 2, function (data) {
            //     $("#sumRedPacket").html(data.count);
            // }, function (errorCode, errorMsg) {});
        },
        ruleFun: function() {
            $(".fx").click(function() {
                that.showExpRule($(this).attr("tag"));
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
        showExpRule: function(expTag) {
            $('#adjust').load('../pages/contract/rpUseRule.html', function() {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                var expOne = that.expsList[expTag];
                var proList = expOne.products;
                var proStr = expOne.description;

                var tyUrl = "";
                if (proList.length == 1) {
                    tyUrl = "/experienceProduct_" + proList[0].prodCodeId;
                }
                $("#expRuleId").html(expOne.couponCode);
                $("#expRuleMoney").html(expOne.amount);
                $("#expRuleTime").html(expOne.validFrom.split("T")[0].replace(/-/g, "/") + " ~ " + expOne.validThru.split("T")[0].replace(/-/g, "/"));
                $("#expRuleBorrow").html(proStr);
                if (tyUrl != "") {
                    $(".expRuleButton").show();
                    $('.expRuleButton').click(function() {
                        DLC.Util.hideAdjust('#adjust');
                        DLC.Util.hideOverlay();
                        $.cookie('couponCode', expOne.couponCode, {
                            expires: DLC.Util.getExpiresDate(10)
                        });
                        window.location.href = tyUrl;
                    });
                }
                $('#expRuleClose').click(function() {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                });
            })
        },
        getExperiences: function(page, succFun) {
            that.Account.getRedPacket(that.type, page, 9, function(list, paging) {
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
                        description = list[i].description;

                    var proList = list[i].products;
                    var proStr = list[i].description;
                    if (status == 0) {
                        isSuccFun = true;
                    }
                    content += that.uceOne(tag, status, code, money, incomeMoney, useStarTime, useEndTime, incomeTime, incomeStarTime, incomeEndTime, description, prodTerm, proStr, minInvestMoney, couponCategory, maxInvestMoney);
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
                // if (isSuccFun) {
                //     that.ruleFun();
                // }
                // var box = $('.pagination');
                // $(window).myPaging({
                //     total: paging.total,
                //     currentPage: paging.page,
                //     box: box,
                //     fun: that.getExperiences
                // });
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
        uceOne: function(tag, status, code, money, incomeMoney, useStarTime, useEndTime, incomeTime, incomeStarTime, incomeEndTime, description, prodTerm, proStr, minInvestMoney, couponCategory, maxInvestMoney) {
            var classState = '',
                classType = '',
                dateDif = (prodTerm == 0) ? "----" : prodTerm + "天";
            if (status == 0) {
                classState = "noUse";
            } else if (status == 1) {
                classState = "use";
            } else {
                classState = "exp";
            }
            if (couponCategory == 4) {
                classType = 'jx'
            } else if (couponCategory == 3) {
                classType = 'mj'
            } else if (couponCategory == 2) {
                classType = 'fx'
            }
            var investMoney = parseInt(minInvestMoney);
            var showInvestMoneyTxt = "&nbsp;";
            if (investMoney > 0) {
                showInvestMoneyTxt = '( 满' + investMoney + '以上使用 )';
            }
            var content = '<div class="coupon-detail ' + classState + ' ' + classType + '" tag="' + tag + ' code="' + code + '">';
            content += '<div class="redPkt-act"><div class="cp-con-top">';
            if (couponCategory == 4) {
                content += '<span class="unit" style="margin-left:25px;">' + money + '</span><span class = "icon-rmb" style = "vertical-align: bottom;"> % </span></div>';
            } else {
                content += '<span class = "icon-rmb" > ￥ </span><span class="unit">' + money + '</span></div>';
            }
            content += '<div class="cp-con-bottom">';

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
            if (couponCategory == 4) {
                content += '<p>2.适用于投资期限=' + prodTerm + '天产品</p>';
            }else{
                content += '<p>2.适用于投资期限≥' + prodTerm + '天产品</p>';
            }
            content += '<p>3.有效期' + useStarTime + '至' + useEndTime + '</p></div></div></div>';
            return content;
        },
        uceNone: function() {
            var content = '<div class="ucecNone"><div class="no-coupon-icon"></div><div class="no-coupon-desc">暂无优惠券</div></div>';
            return content;
        },
        showFXRule: function() {
            $('#adjust').load('../pages/contract/fxRule.html', function() {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                $('#pcRuleClose').click(function() {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                });

            })
        },
        showMJRule: function() {
            $('#adjust').load('../pages/contract/mjRule.html', function() {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                $('#pcRuleClose').click(function() {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                });

            })
        },
        showJXRule: function() {
            $('#adjust').load('../pages/contract/jxRule.html', function() {
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
