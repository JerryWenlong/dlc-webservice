(function($) {
    'use strict'
    var that = null;
    DLC.Experience = DLC.derive(DLC.DLC, {
        create: function(loadPage) {
            this.User = app.currentUser;
            this.Account = app.account;
            that = this;
            this.type = "";
            window.app.initHeader(4);
        },
        init: function() {
            DLC.Util.initPage();
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
        },
        expRuleFun: function() {
            $(".expRule").click(function() {
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
        //show recharge tips
        showRecharge: function() {
            $('#adjust').load('../pages/payTips.html', function() {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
            })
        },
        showExpRule: function(expTag) {
            $('#adjust').load('../pages/contract/expRule.html', function() {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                var expOne = that.expsList[expTag];
                var proList = expOne.products;
                var proStr = "";
                for (var i in proList) {
                    if (i == 'find' || i == 'forEach') {
                        break;
                    }
                    if (proStr != '') {
                        proStr += ",";
                    }
                    proStr += proList[i].prodName;
                }
                var tyUrl = "";
                if (proList.length == 1) {
                    if (that.Account.accountInfo.balance.available >= 2) {
                        tyUrl = "/experienceProduct_" + proList[0].prodCodeId;
                    } else {
                        that.showRecharge();
                    }
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
            var exStatus = that.type;
            that.Account.getExperiences(exStatus, page, 3, function(list, paging) {
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
                        money = parseInt(list[i].amount),
                        prodTerm = list[i].prodTerm,
                        incomeMoney = list[i].expectProfit,
                        useStarTime = list[i].validFrom.split("T")[0].replace(/-/g, "/"),
                        useEndTime = list[i].validThru.split("T")[0].replace(/-/g, "/"),
                        incomeTime = (list[i].redeemedAt == "1970-01-01T08:00:00") ? "----/--/--" : list[i].redeemedAt.split("T")[0].replace(/-/g, "/"),
                        incomeStarTime = (list[i].usedAt == "1970-01-01T08:00:00") ? "----/--/--" : list[i].usedAt.split("T")[0].replace(/-/g, "/"),
                        incomeEndTime = (list[i].expiredAt == "1970-01-01T08:00:00") ? "----/--/--" : list[i].expiredAt.split("T")[0].replace(/-/g, "/"),
                        minInvestMoney = list[i].minInvestAmount,
                        description = list[i].description;

                    var proList = list[i].products;
                    var proStr = "";
                    for (var i in proList) {
                        if (i == 'find' || i == 'forEach') {
                            break;
                        }
                        if (proStr != '') {
                            proStr += ",";
                        }
                        proStr += proList[i].prodName;
                    }
                    if (status == 0) {
                        isSuccFun = true;
                    }
                    content += that.uceOne(tag, status, code, money, incomeMoney, useStarTime, useEndTime, incomeTime, incomeStarTime, incomeEndTime, description, prodTerm, proStr, minInvestMoney);
                }
                if (content == "") {
                    $("#ucEContent").html(that.uceNone());
                } else {
                    $("#ucEContent").html(content);
                }
                if (isSuccFun) {
                    that.expRuleFun();
                }
                var box = $('.page-r');
                $(window).myPaging({
                    total: paging.total,
                    currentPage: paging.page,
                    box: box,
                    fun: that.getExperiences
                });
            }, function(errorCode, errorMsg, response) {

            });
        },
        uceOne: function(tag, status, code, money, incomeMoney, useStarTime, useEndTime, incomeTime, incomeStarTime, incomeEndTime, description, prodTerm, proStr, minInvestMoney) {
            var expRule = (status == 0) ? "expRule" : "",
                biStatus = "",
                dateDif = (prodTerm == 0) ? "----" : prodTerm + "天";
            if (status == 0) {
                biStatus = "expOn";
            } else if (status == 1) {
                biStatus = "expUsed";
            } else {
                biStatus = "expLost";
            }
            var investMoney = parseInt(minInvestMoney);
            var showInvestMoneyTxt = "&nbsp;";
            if (investMoney > 0) {
                showInvestMoneyTxt = '( 满' + investMoney + '以上使用 )';
            }
            var content = '<div class="ucecOne"><div class="ucecOneLeft ' + biStatus + ' ' + expRule + '" tag="' + tag + '"><div class="h18px"></div><div class="ucecolMid"><ul><li class="useContent"><span>' + money + '</span><span class="fs24px ml5px">元</span></li><li class="useContenetRight"><div class="fs24px">体验金</div><div >' + showInvestMoneyTxt + '</div></li></ul></div><div class="h26px"></div><div class="h20px2">编号：' + code + '</div><div class="h20px2">有效时间：' + useStarTime + ' ~ ' + useEndTime + '</div><div class="h20px2">适用产品：' + proStr + '</div></div><div class="ucecOne"><div class = "ucecOneRight" > <div class = "uceh20px" > <div class = "uceor1" > 体验金额： ' + money + '.00元 </div> <div class = "uceor2" > 预计到账日期： ' + incomeTime + ' </div > </div> <div class = "h28px" > </div > <div class = "uceh20px" ><div class = "uceor1" > 预计收益： ' + incomeMoney + '元 </div> <div class = "uceor2" > 收益开始时间： ' + incomeStarTime + ' </div > </div> <div class = "h28px" > </div > <div class = "uceh20px" ><div class = "uceor1" > 体验期限： ' + dateDif + ' </div> <div class = "uceor2" > 收益结束时间： ' + incomeEndTime + ' </div></div></div></div></div>';
            return content;
        },
        uceNone: function() {
                var content = '<div class="ucecOne"><div class="ucecOneLeft expOff"></div><div class="ucecOneRight"><div class="uceh20px"><div class="uceor1">体验金额： ----</div><div class="uceor2">预计到账日期： ----/--/--</div></div><div class="h28px"></div><div class="uceh20px"><div class="uceor1">预计收益： ----</div><div class="uceor2">收益开始时间： ----/--/--</div></div><div class="h28px"></div><div class="uceh20px"><div class="uceor1">体验期限： ----</div><div class="uceor2">收益结束时间： ----/--/--</div></div></div></div></div>';
                return content;
            }
            /*
            ,dateDiff: function (sDate1, sDate2) {
                var aDate, oDate1, oDate2, iDays;
                aDate = sDate1.split("/");
                oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
                aDate = sDate2.split("/");
                oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
                iDays = parseInt(Math.abs(oDate2 - oDate1) / 1000 / 60 / 60 / 24);
                return iDays + 1;
            }
            */
    }, {})
})($)
