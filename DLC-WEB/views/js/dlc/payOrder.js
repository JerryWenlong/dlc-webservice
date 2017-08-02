(function() {
    'use strict';
    var that;
    DLC.PayOrder = DLC.derive(null, {
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

            this.currUseCoin = 0.00; //当前选择点币兑换后的使用金额
            this.coinPamount = 0.00; //点币支付金额

            this.currUseCoupon = 0.00; //当前选择满减券使用金额
            this.couponPamount = 0.00; //优惠券支付金额-满减券

            this.balancePamount = 0.00; //余额支付金额
            // this.bankPamount = 0.00; //银行卡支付金额
            this.redBagPamount = 0.00; //红包
            this.couponType = ''; //红包类型

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
            app.account.getProductCoupon(orderDetail.productId, orderDetail.total, function(couponList) {
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
            that.coinPamount = 0;
            $('#chkCoinIcon').removeClass('checked');
            $('#chkCoin').prop("checked", false);
            var amount = isNaN(that.coupon.amount) ? 0 : parseFloat(that.coupon.amount);
            that.redBagPamount = amount;
            $('.coupon-selected').removeClass("coupon-selected");
            $(".coupon-detail[tag='" + that.coupon.couponCode + "'] .coupon-state").addClass('coupon-selected');

            var categoryType = that.coupon.categoryType;
            var couponType = '';
            $('#annualYieldJX').text('');
            $('#anticipatedIncomeJX').text('');
            $('#purposeField').text('');
            $('#purposeUnit').text('');
            $('#coinAmount').text('');
            switch (categoryType) {
              case "2":
                couponType = 'fx';
                break;
              case "3":
                couponType = 'mj';
                $('#coinAmount').text('-￥' + DLC.Util.formatCurrency(amount, 2, true));
                that.currUseCoupon = amount;
                break;
              case "4":
                couponType = 'jx';
                $('#annualYieldJX').text('+'+amount+'%');
                var jx_money = Math.floor(that.orderInfo.expectedProfit/that.orderInfo.productRate*amount*100)/100;
                $('#anticipatedIncomeJX').text('+'+jx_money);
                break;
              default:
                break;
            }
            that.couponType = couponType;
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
                    couponRules = (list[i].minInvestAmount) == 0 ? '' : "(满" + parseInt(list[i].minInvestAmount) + "以上使用)",
                    couponRange = list[i].description;
                content += that.createCouponView(amount, couponCode, couponRules, timeStart, timeEnd, couponRange, prodTerm, minInvestMoney, couponCategory,status,maxInvestMoney);
            }
            if (content !== '') {
                $('#noRedBag').hide();
                $(".red-bag-list").html(content);
                $('.coupon-detail').click(function() {
                    that.coupon = null;
                    if ($(this).find("coupon-state").hasClass('coupon-selected')) {
                        $('.coupon-selected').removeClass("coupon-selected");
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
            }else{
              $('.red-bag-list').hide();
            }
        },
        //create user coupon view
        createCouponView: function(money, couponCode, couponRules, useStarTime, useEndTime, couponRange, prodTerm, minInvestMoney, couponCategory,status,maxInvestMoney) {
            var classState = '',
                classType = '';
            if (status == 0) {
                classState = "noUse";
            } else if (status == 1) {
                classState = "use";
            } else {
                classState = "exp";
            }
            if (couponCategory == 4) {
                classType = 'jx';
            } else if (couponCategory == 3) {
                classType = 'mj';
            } else if (couponCategory == 2) {
                classType = 'fx';
            }
            var content = '<div class="coupon-detail ' + classState + ' ' + classType + '" tag="' + couponCode + '">';
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
            content += '<p>3.有效期' + useStarTime + '至' + useEndTime + '</p></div>';
            content += '<div class="coupon-state coupon-selected"></div>';
            content += '</div></div>';
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
            //coin checkbox
            $('#chkCoinIcon').bind('click', function() {
                var currentStatus = !($('#chkCoin').get(0).checked);
                $('#chkCoin').prop("checked", currentStatus);
                if (currentStatus) {
                    that.redBagPamount = 0;
                    that.coupon = null;
                    $('.coupon-selected').removeClass("coupon-selected");
                    $('#chkCoinIcon').addClass('checked');
                } else {
                    $('#chkCoinIcon').removeClass('checked');
                }
                that.calcPay();
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
            $("#showUcRpRule").click(function() {
                that.showPointCoinRule();
            });

            $(window).scroll(function() {
                var s = $(window).height() + $(window).scrollTop();
                var h = $('.red-bag-list').height();
                var height = 950;
                // console.log(h);
                if(h > 162){
                  height = 1000;
                }
                // console.log($(window).height(),$(window).scrollTop());
                if (s <= height) {
                    $('#payDiv').show();
                } else {
                    $('#payDiv').hide();
                }
            });

            $(window).scroll();
        },

        //calc coin
        calcCoin: function() {
            if ($('#chkCoin').get(0) && $('#chkCoin').get(0).checked) {
                //还需支付金额大于点币 不够付
                if (parseFloat(that.orderPay) >= parseFloat(that.currUseCoin)) {
                    that.coinPamount = that.currUseCoin;
                    that.needPay = parseFloat(DLC.Util.accSub(that.orderPay, that.coinPamount)); //还需支付金额-点币
                }
                $('#purposeField').text('点币抵用：');
                $('#coinAmount').text(DLC.Util.formatCurrency(that.coinPamount, 2, true));
                $('#purposeUnit').text('-￥');
            } else {
                that.coinPamount = 0;
                that.needPay = that.orderPay;
            }
            return that.coinPamount;
        },
        //计算点币
        calcMJ: function() {
            if (that.couponType == "mj") {
                //还需支付金额大于点币 不够付
                if (parseFloat(that.orderPay) >= parseFloat(that.currUseCoupon)) {
                    that.couponPamount = that.currUseCoupon;
                    that.needPay = parseFloat(DLC.Util.accSub(that.orderPay, that.couponPamount)); //还需支付金额-点币
                }
                $('#purposeField').text('满减抵用：');
                $('#purposeUnit').text('-￥');
                $('#coinAmount').text(DLC.Util.formatCurrency(that.couponPamount, 2, true));

            } else {
                that.couponPamount = 0;
                // that.needPay = that.orderPay;
            }
            return that.couponPamount;
        },
        //total calc
        calcPay: function() {
            this.calcCoin();
            this.calcMJ();
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
        //show PointCoinRule
        showPointCoinRule: function() {
            $('#adjust').load('../pages/contract/rpRule.html', function() {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                $('#pcRuleClose').click(function() {
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
                for (var i = 0; i < responseData['assets'].length; i++) {
                    if (responseData['assets'][i]['assetType'] == 4) {
                        that.currUseCoin = responseData['assets'][i]['amount'];
                        if (that.currUseCoin > 0) {
                            $('#coinText').text("可用" + responseData['assets'][i]['assetCode'] + "点币扣" + that.currUseCoin + "元");
                            $(".checkboxIcon").show();
                            if (!that.coupon) {
                                $('#chkCoinIcon').click();
                            }
                        }
                        break;
                    }
                }
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
                //点币支付
                if (parseFloat(that.coinPamount) > 0 && $('#chkCoin').get(0).checked) {
                    param.items.push({
                        assetType: '4',
                        amount: parseFloat(that.coinPamount)
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
