(function() {
    'use strict';
    var that;
    DLC.PayJJOrder = DLC.derive(null, {
        create: function(orderNo) {
            DLC.Util.initPage();
            window.app.initHeader(2);
            that = this;
            this.orderNo = orderNo;
            this.user = app.currentUser;
            this.account = app.account;
            this.trade = app.trade;
            this.getOrderInfo(orderNo);
            this.productService = app.product;

            this.balancePamount = 0.00; //余额支付金额
            this.redBagPamount = 0.00; //红包

            this.balance = parseFloat(app.account.accountInfo.balance.available) > 0 ? parseFloat(app.account.accountInfo.balance.available) : 0.00; //余额可用金额
            this.needPay = 0.00; //还需支付金额
            this.orderPay = 0.00; //订单金额
            this.canPay = false;
        },
        //init pages
        initPage: function(orderDetail) {
            //check order status
            if (orderDetail.orderStatus == 0 || orderDetail.orderStatus == 2) { //未支付 或者 支付失败 则可以支付
                that.createTrade();
                var orderTimeLeft = new DLC.Timer(orderDetail.leftTimeSeconds, '#secondShow', '#minuteShow');
            } else if (orderDetail.orderStatus == 3) {
                window.location.href = '/';
                $('.order-pay').text('已过期');
                $('.order-pay').attr('disabled', true);
                return;
            } else {
                window.location.href = '/';
                $('.order-pay').text('已支付');
                $('.order-pay').attr('disabled', true);
                return;
            }
            that.getCouponsList(orderDetail);
            that.initComponents(orderDetail);
            that.initButtons();
        },
        //get orderInfo
        getOrderInfo: function(orderNo) {
            this.orderInfo = null;
            this.trade.getOrderDetail(orderNo, function(orderDetail) {
                that.orderInfo = orderDetail;
                that.initPage(orderDetail);
            }, function(errorCode, errorMsg) {
                window.location.href = '/';
            })
        },
        //get user coupon list
        getCouponsList: function(orderDetail) {
            app.account.getProductToken(orderDetail.productId, orderDetail.total, function(couponList) {
                var list = couponList;
                var couponCode = 0;
                if ($.cookie('currRedBag') != null) {
                    couponCode = $.cookie('currRedBag');
                }
                for (var i = 0; i < list.length; i++) {
                    if (list[i].status == 0 && parseFloat(that.orderPay) >= parseFloat(list[i].minInvestAmount)) {
                        if (couponCode == 0) {
                            that.coupon = list[i];
                            break;
                        } else if (couponCode == list[i].couponCode) {
                            that.coupon = list[i];
                            break;
                        }
                    } else {
                        list.splice(i, 1);
                    }
                }
                if (list.length <= 3 && list.length > 0) {
                    $('.red-bag-list').css("height", "162px");
                    $('.red-bag-list').css("overflow-y", "hidden");
                }
                that.createCouponsListView(list);
                that.selectedCoupon();
                that.calcPay();
            }, function(errorCode, errorMsg) {
                $('.red-bag-list').hide();
                that.selectedCoupon();
                that.calcPay();
            })
        },
        //select coupon
        selectedCoupon: function() {
            if (!that.coupon) {
                that.redBagPamount = 0;
                return;
            }
            var amount = isNaN(that.coupon.amount) ? 0 : parseFloat(that.coupon.amount);
            that.redBagPamount = amount;
            $('.token-selected').removeClass("token-selected");
            $(".token-detail[tag='" + that.coupon.couponCode + "'] .token-state").addClass('token-selected');

            var categoryType = that.coupon.categoryType;
            var rateSteps = that.coupon.rateSteps;
            // console.log(that.coupon);
            $('#annualYieldJX').text('');
            $('#anticipatedIncomeJX').text('');
            switch (categoryType) {
                case "5":
                    $('#annualYieldJX').text('+' + amount + '%');
                    var jx_money = Math.floor(that.orderInfo.expectedProfit / that.orderInfo.productRate * amount * 100) / 100;
                    $('#anticipatedIncomeJX').text('+' + jx_money);
                    break;
                default:
                    break;
            }
        },
        //create user coupon list view
        createCouponsListView: function(couponList) {
            if (!couponList) {
                return;
            }
            var list = couponList;
            var content = '';
            for (var i = 0; i < list.length; i++) {
                if (list[i].status != 0 || parseFloat(that.orderPay) < parseFloat(list[i].minInvestAmount)) {
                    continue;
                }
                var amount = parseFloat(list[i].amount),
                    couponCode = list[i].couponCode,
                    incomeMoney = list[i].expectProfit,
                    timeStart = list[i].validFrom,
                    timeEnd = list[i].validThru,
                    prodTerm = list[i].prodTerm,
                    minInvestMoney = list[i].minInvestAmount,
                    maxInvestMoney = list[i].maxInvestAmount,
                    couponCategory = list[i].categoryType,
                    rateSteps = list[i].rateSteps,
                    couponRules = (list[i].minInvestAmount) == 0 ? '' : "(满" + parseInt(list[i].minInvestAmount) + "以上使用)",
                    couponRange = list[i].description;
                content += that.createCouponView(amount, couponCode, couponRules, timeStart, timeEnd, couponRange, prodTerm, minInvestMoney, couponCategory, status, rateSteps,maxInvestMoney);
            }
            if (content !== '') {
                $('#noRedBag').hide();
                $(".red-bag-list").html(content);
                $('.token-detail').click(function() {
                    that.coupon = null;
                    if ($(this).find("token-state").hasClass('token-selected')) {
                        $('.token-selected').removeClass("token-selected");
                    } else {
                        var couponCode = $(this).attr("tag");
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].couponCode == couponCode) {
                                that.coupon = list[i];
                                break;
                            }
                        }
                    }
                    that.selectedCoupon();
                    that.calcPay();
                });
            } else {
                $('.red-bag-list').hide();
            }
        },
        //create user coupon view
        createCouponView: function(money, couponCode, couponRules, useStarTime, useEndTime, couponRange, prodTerm, minInvestMoney, couponCategory, status, rateSteps,maxInvestMoney) {
            var classState = '',
                classType = '';
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
            var content = '<div class="token-detail ' + classState + '" tag="' + couponCode + '">';
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
        //init component
        initComponents: function(orderDetail) {
            $('.pay-prod .name').text(orderDetail.productName);
            $('#annualYield').text(orderDetail.productRate + '%');
            $('#anticipatedIncome').text(orderDetail.expectedProfit);
            $('#orderNo').text(orderDetail.orderNo);
            $('#totalAsset').text(this.account.accountInfo.balance.available);
            $('#orderTotal').text(orderDetail.total);
            this.orderPay = orderDetail.total;
            this.needPay = this.orderPay;
            $('#needPay').text(this.needPay);
            $('#needPay2').text($('#needPay').text());
        },
        //init button
        initButtons: function() {
            $('.order-pay').bind('click', function() {
                if (!$('#chkContract').get(0).checked) {
                    $('#errorMsg').text('请先阅读《点理财平台委托代扣授权书》');
                    return;
                }
                $('#errorMsg').text('');
                that.calcPay();
                if (that.canPay) {
                    that.showTradePwd();
                } else {
                    that.showRecharge();
                }
            });
            //协议展示
            $('#withholdContract').click(function() {
                that.showWithholdContract();
            });

            //contract checkbox
            $('#chkContractIcon').bind('click', function() {
                var currentStatus = !($('#chkContract').get(0).checked);
                $('#chkContract').prop("checked", currentStatus);
                if (currentStatus) {
                    $('#chkContractIcon').addClass('checked');
                } else {
                    $('#chkContractIcon').removeClass('checked');
                }
            });
            $("#showSXRule").click(function() {
                $('#adjust').load('../pages/contract/sxRule.html', function() {
                    DLC.Util.showOverlay();
                    DLC.Util.showAdjust('#adjust');
                    $('#pcRuleClose').click(function() {
                        DLC.Util.hideAdjust('#adjust');
                        DLC.Util.hideOverlay();
                    });

                });
            });

            $(window).scroll(function() {
                // $('#payDiv').hide();
                var s = $(window).height() + $(window).scrollTop();
                var h = $('.pay-order').height()+380;
                // var height = 650;
                // console.log(h,$(window).height(),$(window).scrollTop(),s);
                // if(h > 162){
                //   height = 720;
                // }
                // console.log(h,s);
                if (s <= h) {
                    $('#payDiv').show();
                } else {
                    $('#payDiv').hide();
                }
            });

            $(window).scroll();
        },

        //total calc
        calcPay: function() {
            if (this.needPay <= this.balance) {
                this.canPay = true;
                that.balancePamount = that.needPay;
            } else {
                this.canPay = false;
            }
            $('#needPay').text(DLC.Util.formatCurrency(this.needPay, 2, true));
            $('#needPay2').text($('#needPay').text());
        },
        //contract
        showWithholdContract: function() {
            $('#adjust').load('../pages/contract/withholdContract.html', function() {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                $('#wcClose').click(function() {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                });
            })
        },
        //show recharge tips
        showRecharge: function() {
            //alert('余额不足!点币抵用:'+that.coinPamount+',红包支付:'+that.redBagPamount+',余额支付:'+that.balancePamount+',应付总额:'+that.needPay);
            $('#adjust').load('../pages/payTips.html', function() {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
            })
        },
        //show tradePassword
        showTradePwd: function() {
            //alert('余额充足!点币抵用:'+that.coinPamount+',红包支付:'+that.redBagPamount+',余额支付:'+that.balancePamount+',应付总额:'+that.needPay);
            $('#adjust').load('../pages/tradePassword.html', function() {
                var forgetPasswordLink = that.account.accountInfo.hasCard ? "/myCenter_cardTstPwd" : "/myCenter_noCardTstPwd";
                $('#forgotPassword').attr('href', forgetPasswordLink);
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                $('#cancelBtn').click(function() {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                });
                $('#hidPaySpan').click(function() {
                    that.tradePassword = $('#tradePassword').val();
                    $('#tradePassword').val('');
                    that.payTrade(that.tradeSerialNo, that.total);
                });
            });
        },
        //create trade
        createTrade: function() {
            that.trade.createOrderTrade(that.orderNo, function(responseData) {
                that.tradeSerialNo = responseData['tradeSerialNo'];
                that.total = responseData['total'];
                that.calcPay();
            }, function(errorCode, errorMsg) {
                $('#errorMsg').text(errorMsg);
            })
        },
        //pay trade
        payTrade: function(tradeSerialNo, total) {
            $.cookie('currRedBag', null, {
                expires: -1
            });
            $('#adjust').load('../pages/processing.html', function() {
                DLC.Util.showAdjust('#adjust');
                var param = {
                    acceptTos: true,
                    tradeSerialNo: tradeSerialNo,
                    tradePassword: that.tradePassword,
                    items: []
                };
                var orderAmount = total;
                //银行卡支付
                // if (parseFloat(that.bankPamount) > 0) {
                //     param.items.push({
                //         assetType: '0',
                //         amount: parseFloat(that.bankPamount)
                //     });
                // }
                //余额支付
                if (parseFloat(that.balancePamount) > 0) {
                    param.items.push({
                        assetType: '1',
                        amount: parseFloat(that.balancePamount)
                    })
                }
                //红包
                if (parseFloat(that.redBagPamount) > 0) {
                    param.items.push({
                        assetType: '3',
                        assetId: that.coupon.couponId,
                        amount: parseFloat(that.redBagPamount)
                    })
                }
                // console.log(param);return;
                that.trade.tradePay(param, function(data) {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                    $('#mainContent').load('../pages/paySuccess.html', function() {
                        that.completePay(data, true)
                    })
                }, function(errorCode, errorMsg, response) {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                    if (errorCode.toString() == '2055' || errorCode.toString() == '2056') {
                        $('#errorMsg').text(errorMsg);
                        $('#tradePassword').val('');
                        $('#tradePassword').focus();
                    } else {
                        //goto error page
                        var data = response['data'];
                        $('#mainContent').load('../pages/payFailed.html', function() {
                            that.completePay(data, false, errorMsg)
                        })
                    }
                });
            });
        },
        //complete pay
        completePay: function(data, success, errorMsg) {
            $('#totalAmount').text(data.totalAmount);
            $('#payTotal').text(data.payAmount);
            $('#orderNo').text(data.orderSerialNo);
            $('#prodName').text(data.prodName);

            $.cookie('orderNo', null, {
                expires: -1
            });
            if (success) {
                $('#buyTime').text(data.paidAt.replace('T', ' ').replace(RegExp('/-/', 'gm'), '/'));
                $('#tradeRecordBtn').bind('click', function() {
                    window.location.href = "/myCenter_orders";
                });
                $('#homepageBtn').bind('click', function() {
                    window.location.href = "/";
                });
                //get luncky num
                if (data.prizes) {
                    var luckyNum = [];
                    $.each(data.prizes, function(i, obj) {
                        if (obj.prizeType === 5) {
                            luckyNum.push(obj.prizeName);
                        }
                    });
                    if (luckyNum.length > 0) {
                        $('#luckyNum').text(luckyNum.join('、'));
                        $('#luckyDiv').show();
                    }
                    $('#jjsxDiv').show();
                }
            } else {
                $('#errorMsg').text(errorMsg);
                if (errorMsg.indexOf("已售罄")) {
                    $('#gotoPayBtn').text('继续购买')
                    $('#gotoPayBtn').bind('click', function() {
                        window.location.href = "/";
                    })
                    return;
                }
                $('#gotoPayBtn').bind('click', function() {
                    window.location.reload();
                })
            }
        },

    }, {})
})($)
