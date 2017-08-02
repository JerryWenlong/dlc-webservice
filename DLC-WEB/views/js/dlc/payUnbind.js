(function() {
    'use strict'
    DLC.PayUnbind = DLC.derive(null, {
        create: function(orderNo) {
            DLC.Util.initPage();
            window.app.initHeader(2);
            this.orderNo = orderNo;
            this.user = app.currentUser;
            this.account = app.account;
            this.trade = app.trade;
            this.getOrderInfo(orderNo);
            this.productService = app.product;
            this.maxCoin = app.account.accountInfo.asset.availablePoint; //当前用户点币余额
            this.coinRule = 10; //10:1兑换RMB
            this.maxAssetCode = 0; //本次支付最大点币
            this.currAssetCode = 0; //当前选择点币
            this.maxUseCoin = 0.00; //本次支付最大点币兑换后的使用金额
            this.currUseCoin = 0.00; //当前选择点币兑换后的使用金额

            this.coinPamount = 0.00; //点币支付金额
            this.balancePamount = 0.00; //余额支付金额
            this.bankPamount = 0.00; //银行卡支付金额
            this.redBagPamount = 0.00; //红包

            this.balance = parseFloat(app.account.accountInfo.balance.available) > 0 ? parseFloat(app.account.accountInfo.balance.available) : 0.00; //余额可用金额
            this.needPay = 0.00; //还需支付金额
            this.orderPay = 0.00; //订单金额
        },

        initPage: function(orderDetail) {
            var that = this;
            //check order status
            if (orderDetail.orderStatus == 0 || orderDetail.orderStatus == 2) { //未支付 或者 支付失败 则可以支付
                that.createTrade();
                var orderTimeLeft = new DLC.Timer(orderDetail.leftTimeSeconds, '#secondShow', '#minuteShow');
            } else if (orderDetail.orderStatus == 3) {
                $('#pay').text('已过期');
                $('#pay').attr('disabled', true);
                return;
            } else {
                $('#pay').text('已支付');
                $('#pay').attr('disabled', true);
                return;
            }
            that.getCouponsList(orderDetail);
            that.initComponents(orderDetail);
            that.initButtons();
        },
        //get user coupon list
        getCouponsList: function(orderDetail) {
            var that = this;
            app.account.getProductCoupon(orderDetail.productId, orderDetail.total, function(couponList) {
                var couponCode = 0;
                if ($.cookie('currRedBag') != null) {
                    couponCode = $.cookie('currRedBag');
                }
                var list = couponList;
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
                that.createCouponsListView(list);
                that.selectedCoupon();
            }, function(errorCode, errorMsg) {

            })
        },
        //select coupon
        selectedCoupon: function() {
            var that = this;
            if (!that.coupon) {
                $('#chkRedBagIcon').unbind();
                $('#amount').text('0.00');
                $('#chkRedBagIcon').removeClass('checked');
                $('#chkRedBag').prop("checked", "false");
                $.cookie('currRedBag', null, {
                    expires: -1
                });
                return;
            }
            $.cookie('currRedBag', that.coupon.couponCode);
            var amount = isNaN(that.coupon.amount) ? 0 : parseFloat(that.coupon.amount);
            $('#redBagAmount').text(amount);
            that.redBagPamount = amount;
            $('#chkRedBagIcon').addClass('checked');
            $('#chkRedBag').prop("checked", "checked");
            $('.redBagSelected').removeClass("redBagSelected").addClass("redBagUnSelected");
            $(".ucecOne[tag='" + that.coupon.couponCode + "']>div:first").removeClass("redBagUnSelected").addClass('redBagSelected');
        },
        //create user coupon list view
        createCouponsListView: function(couponList) {
            if (!couponList) {
                return;
            }
            var list = couponList;
            var that = this;
            var contentPre = '<div class="expRuleHead">我的红包<div class="expRuleClose" id="redBagClose"></div></div>';
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
                    couponRules = (list[i].minInvestAmount) == 0 ? '' : "(满" + parseInt(list[i].minInvestAmount) + "以上使用)",
                    couponRange = list[i].description;

                content += that.createCouponView(amount, couponCode, couponRules, timeStart, timeEnd, couponRange);
            }

            if (content == '') {
                $('#pay-redBag-show').unbind();
            } else {
                $(".coupon-list-adjust").html(contentPre + content);
                $("#pay-redBag-show").bind('click', function() {
                    DLC.Util.showOverlay();
                    DLC.Util.showAdjust('#coupon-list-adjust');
                });
                $('#redBagClose').click(function() {
                    DLC.Util.hideAdjust('#coupon-list-adjust');
                    DLC.Util.hideOverlay();
                });
                $('.ucecOne').click(function() {
                    var couponCode = $(this).attr("tag");
                    that.coupon = null;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].couponCode == couponCode) {
                            that.coupon = list[i];
                            break;
                        }
                    }
                    that.selectedCoupon();
                    DLC.Util.hideAdjust('#coupon-list-adjust');
                    DLC.Util.hideOverlay();
                });
                $('#pay-redBag').removeClass("pay-list-disabled");
            }
        },
        //create user coupon view
        createCouponView: function(amount, couponCode, couponRules, timeStart, timeEnd, couponRange) {
            var content = '<div class="ucecOne" tag="' + couponCode + '">';
            content += '<div class="ucecOneLeft redBagUnSelected expRule">';
            content += '<div class="h18px"></div>';
            content += '<div class="ucecolMid">';
            content += '<ul><li class="useContent "><span>' + amount + '</span><span class="fs24px ml5px">元</span></li><li class="useContenetRight"><div class="fs24px">红包</div><div class="paddingTop3">' + couponRules + '</div></li></ul>';
            content += '</div><div class="h26px"></div><div class="h20px2 ">编号：' + couponCode + '</div>';
            content += '<div class="h20px2">有效时间：' + timeStart + ' ~ ' + timeEnd + '</div>';
            content += '<div class="h20px2">适用产品：' + couponRange + '</div></div></div>';
            return content;
        },
        //init component
        initComponents: function(orderDetail) {
            $('input').placeholder({
                isUseSpan: false,
                placeholderColor: '#8d8d8d'
            });
            $(':text').focus(function() {
                $(this).css("border-color", "#398be1");
            });
            $('.pay-prod .name').text(orderDetail.productName);
            $('#orderNo').text(orderDetail.orderNo);
            $('#totalAsset').text(this.account.accountInfo.balance.available);
            $('#orderTotal').text(orderDetail.total);

            this.orderPay = orderDetail.total;
            this.needPay = this.orderPay;
            $('#needPay').text(this.needPay);
        },
        initButtons: function() {
            var that = this;
            $('#pay').bind('click', function() {
                if (!$('#chkContract').get(0).checked) {
                    $('#errorMsg').text('请先阅读《点理财平台委托代扣授权书》');
                    return;
                }
                $('#errorMsg').text('');
                that.saveTradeInfo();
            });
            //select coin view
            $("#pay-coin-show").bind('click', function() {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#pay-coin-adjust');
            });
            $('#expRuleClose').click(function() {
                DLC.Util.hideAdjust('#pay-coin-adjust');
                DLC.Util.hideOverlay();
            });
            $("#useCoinInput").bind('keyup', function() {
                var val = parseFloat($(this).val());
                if (!/^[1-9]\d{0,9}$/.test(val)) {
                    val = 0;
                    $(this).val('');
                } else if (val > that.maxAssetCode) {
                    val = that.maxAssetCode;
                    $(this).val(that.maxAssetCode);
                }
                $("#li-error-msg").html('');
                that.coinPamount = val / parseFloat(that.coinRule);
                $("#useCoinAmount").text(that.coinPamount);
            });
            $("#confirmCoinBtn").bind('click', function() {
                var val = parseFloat($("#useCoinInput").val());
                if (!/^[1-9]\d{0,9}$/.test(val)) {
                    $("#li-error-msg").html('请输入正确的点金币');
                    return;
                } else if (val > that.maxAssetCode) {
                    $("#li-error-msg").html('您输入的点金币超过剩余的点金币数量');
                    return;
                }
                DLC.Util.hideOverlay();
                DLC.Util.hideAdjust('#pay-coin-adjust');
                DLC.Util.hideAdjust('#coupon-list-adjust');
                that.currAssetCode = val;
                that.coinPamount = val / parseFloat(that.coinRule);
                that.currUseCoin = that.coinPamount;
                $('#experienceAmount').text("点金币" + val + "抵扣" + that.coinPamount);
                $('#chkCoin').prop("checked", "checked");
                $('#chkCoinIcon').removeClass('checked').addClass('checked');
                that.calcBankPay();
            });
            //协议展示
            $('#withholdContract').click(function() {
                that.showWithholdContract();
            });
            //redBag checkbox
            $('#chkRedBagIcon').bind('click', function() {
                var currentStatus = !($('#chkRedBag').get(0).checked);
                $('#chkRedBag').prop("checked", currentStatus);
                if (currentStatus) {
                    $('#chkRedBagIcon').addClass('checked');
                } else {
                    $('#chkRedBagIcon').removeClass('checked');
                }
            });
            //coin checkbox
            $('#chkCoinIcon').bind('click', function() {
                var currentStatus = !($('#chkCoin').get(0).checked);
                $('#chkCoin').prop("checked", currentStatus);
                if (currentStatus) {
                    $('#chkCoinIcon').addClass('checked');
                } else {
                    $('#chkCoinIcon').removeClass('checked');
                }
                that.calcBankPay();
            });

            //blance checkbox
            $('#chkBalanceIcon').bind('click', function() {
                var currentStatus = !($('#chkBalance').get(0).checked);
                $('#chkBalance').prop("checked", currentStatus);
                if (currentStatus) {
                    $('#chkBalanceIcon').addClass('checked');
                } else {
                    $('#chkBalanceIcon').removeClass('checked');
                }
                that.calcBankPay();
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
        },

        getOrderInfo: function(orderNo) {
            this.orderInfo = null;
            var that = this;
            this.trade.getOrderDetail(orderNo, function(orderDetail) {
                that.orderInfo = orderDetail;
                that.initPage(orderDetail);
            }, function(errorCode, errorMsg) {
                // window.history.go(-1);
            })
        },

        getBankInfo: function(bankNo) {
            //bankLimit
            this.account.getBanks(bankNo, function(data) {
                var limit = data.oneUpperLimitOut ? data.oneUpperLimitOut.replace('.00', '') : '100000';
                $('#bankLimit').text(limit)
            }, function() {
                $('#bankLimit').text('100000')
            })
        },

        //计算点币
        calcCoin: function() {
            var that = this;
            if ($('#chkCoin').get(0).checked) {
                //还需支付金额大于点币 不够付
                if (parseFloat(that.orderPay) >= parseFloat(that.currUseCoin)) {
                    that.coinPamount = that.currUseCoin;
                    that.needPay = parseFloat(DLC.Util.accSub(that.orderPay, that.coinPamount)); //还需支付金额-点币
                } else {
                    //不会发生点币比订单金额还大的情况
                    that.coinPamount = parseFloat(DLC.Util.accSub(that.orderPay, that.balancePamount)); //支付点币为还需支付金额
                    that.needPay = 0; //还需支付金额为0
                }
            } else {
                that.coinPamount = 0;
                that.needPay = that.orderPay;
            }
            return that.coinPamount;
        },
        //计算余额
        calcBalance: function() {
            var that = this;
            if ($('#chkBalance').get(0).checked) {
                //还需支付总额大于余额 不够付
                if (parseFloat(that.needPay) >= parseFloat(that.balance)) {
                    that.balancePamount = that.balance;
                    that.needPay = parseFloat(DLC.Util.accSub(that.needPay, that.balancePamount)); //还需支付总额-已支付余额
                } else {
                    //that.balancePamount = parseFloat(DLC.Util.accSub(that.orderPay, that.coinPamount)); //已支付余额=订单金额-已支付点金币
                    that.balancePamount = parseFloat(that.needPay);
                    that.needPay = 0; //还需支付总额为0
                }
            } else {
                that.balancePamount = 0;
                that.needPay = parseFloat(DLC.Util.accSub(that.orderPay, that.coinPamount)); //返还之前扣除的余额
            }
            return that.balancePamount;
        },
        calcBankPay: function() {
            this.calcCoin();
            this.calcBalance();
            if (this.needPay <= 0) {
                this.bankPamount = 0;
            } else {
                this.bankPamount = this.needPay;
            }
            $('#needPay').text(DLC.Util.formatCurrency(this.bankPamount, 2, true));
        },

        createTrade: function() {
            var that = this;
            that.trade.createOrderTrade(that.orderNo, function(responseData) {
                that.tradeSerialNo = responseData['tradeSerialNo'];
                that.total = responseData['total'];
                for (var i = 0; i < responseData['assets'].length; i++) {
                    if (responseData['assets'][i]['assetType'] == 4) {
                        $('#experienceAmount').text("点金币" + responseData['assets'][i]['assetCode'] + "抵扣" + responseData['assets'][i]['amount']);
                        that.maxUseCoin = responseData['assets'][i]['amount'];
                        that.maxAssetCode = responseData['assets'][i]['assetCode'];
                        var coinRule = parseFloat(that.maxAssetCode) / parseFloat(that.maxUseCoin);
                        if (coinRule > 0) {
                            that.coinRule = coinRule;
                        }
                        that.coinPamount = that.maxUseCoin;
                        that.currUseCoin = that.maxUseCoin;
                        that.currAssetCode = that.maxAssetCode;
                        $("#maxCoin").text(that.maxCoin);
                        $("#useMaxCoin").text(that.maxUseCoin);
                        break;
                    }
                }
                if (parseFloat(that.currUseCoin) > 0) {
                    $('#chkCoinIcon').addClass('checked');
                    $('#chkCoin').prop("checked", "checked");
                    $('#pay-coin').removeClass("pay-list-disabled");
                } else {
                    $('#chkCoinIcon').unbind();
                    $('#pay-coin-show').unbind();
                }
                if (parseFloat(that.balance) > 0) {
                    $('#chkBalanceIcon').addClass('checked');
                    $('#chkBalance').prop("checked", "checked");
                    $('#pay-balance').removeClass("pay-list-disabled");
                } else {
                    $('#chkBalanceIcon').unbind();
                }
                that.calcBankPay();
            }, function(errorCode, errorMsg) {
                $('#errorMsg').text(errorMsg);
            })
        },

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
        saveTradeInfo: function() {
            $.cookie('coinPamount', this.coinPamount);
            $.cookie('currUseCoin', this.currUseCoin);
            $.cookie('currAssetCode', this.currAssetCode);
            if (this.coupon && this.coupon.couponCode) {
                $.cookie('currRedBag', this.coupon.couponCode);
            }
            window.location.href = '/myCenter_payBindCard/' + this.orderNo;
        },
    }, {})
})($)
