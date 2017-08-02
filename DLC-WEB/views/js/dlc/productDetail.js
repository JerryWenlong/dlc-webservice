(function ($) {
    'use strict';
    var prod_Detail = null;
    var that = null;
    DLC.ProductDetail = DLC.derive(DLC.DLC, {
        create: function (productId) {
            DLC.Util.initPage();
            window.app.initHeader(2);
            this.productId = productId;
            this.user = app.currentUser;
            this.productService = app.product;
            this.account = app.account;
            this.trade = app.trade;
            this.hasPaging = false;
            that = this;
            this.initAccount();
            this.initProduct();
            this.randerRecords(1, productId);
            this.imgsList = [];
            this.buyAmount = 0;
            this.coupon = null;
        },
        initProduct: function () {
            this.productService.getDlcByProductId(this.productId, function (prodDetail) {
                if (prodDetail.prodType == "2") {
                    $(".proTypeShow").html("节");
                } else {
                    $(".proTypeShow").html("优");
                }
                $.cookie('prodType', prodDetail.prodType, {
                    expires: DLC.Util.getExpiresDate(30)
                });
                window.scrollTo(0, 0);
                that.prodDetail = prodDetail;
                prod_Detail = prodDetail;
                var productTimeLeft = new DLC.Timer(prodDetail.leftTimeSeconds, '#secondShow', '#minuteShow', '#hourShow', '#dayShow');
                var htmlStr = prodDetail.name;
                if (prodDetail.coupons) {
                    for (var i = 0; i < prodDetail.coupons.length; i++) {
                        switch (prodDetail.coupons[i]) {
                        case "2":
                            htmlStr += '<span class="prod-coupons prod-coupons-fx">返现券</span>';
                            break;
                        case "3":
                            htmlStr += '<span class="prod-coupons prod-coupons-mj">满减券</span>';
                            break;
                        case "4":
                            htmlStr += '<span class="prod-coupons prod-coupons-jx">加息券</span>';
                            break;
                        case "5":
                            htmlStr += '<span class="prod-coupons prod-coupons-jj">投资送升息令牌</span>';
                            break;
                        default:

                        }
                    }
                }
                $('#prodName').html(htmlStr);
                var expectYearReturn = prodDetail.expectYearReturn;
                if (prodDetail.invest2YearReturn != '0.0') {
                    expectYearReturn += '~' + prodDetail.invest2YearReturn;
                }
                expectYearReturn += '<span class="s">%</span>';
                $('#expectYearReturn').html(expectYearReturn);
                $('#productPeriod').text(prodDetail.prodPeriod);
                $('#maxRaisedAmount').text(prodDetail.maxRaisedAmount);
                $('#availableAmount').text(prodDetail.availableAmount);
                $('.invest-type').text(prodDetail.returnMethodStr_1);
                var progressWidth = (600 * prodDetail.quotaProgress * 0.01) + 'px';
                var progressNoStr = prodDetail.quotaProgress + '%';
                $('#progressNo').text(progressNoStr);
                $('#progressBar').css({
                    width: progressWidth
                });
                var progressIconLeft = (600 * prodDetail.quotaProgress * 0.01 - 10) + 'px';
                $('.progress-icon').css({
                    left: progressIconLeft
                });
                $('#reviewedAt').text(prodDetail.issuedAt);
                $('#buyAmount').get(0).setAttribute('placeholder', prodDetail.minApplyAmountStr);
                $('input').placeholder({
                    isUseSpan: true,
                    placeholderColor: '#8d8d8d'
                });
                $('#buyAmount').bind('keyup', function () {
                    that.amountChange();
                });
                $('#buyAmount').bind('blur', function () {
                    that.inintCouponList();
                });
                $('#buyAmount').keyup();
                $('#allInvest').bind('click', function () {
                    that.maxAmount();
                });
                $('#createOrderBtn').bind('click', function () {
                    if (!$('#chkContract').get(0).checked) {
                        $('#errorMsg').text('请先阅读《点理财平台委托代扣授权书》');
                        return;
                    }
                    // validate
                    var buyAmount = $('#buyAmount').val();
                    var validation = that.validateAmount(buyAmount, prodDetail.minApplyAmount, prodDetail.maxApplyAmount, prodDetail.minAddAmount);
                    if (validation[0]) {
                        if (that.balance - buyAmount >= 0) {
                            // createOrder
                            that.buyAmount = buyAmount;
                            var hasCard = app.account.accountInfo["hasCard"];
                            if (!hasCard) {
                                window.location.href = "/myCenter_userBindBankCard";
                            } else {
                                that.showTradePwd();
                            }
                        } else {
                            that.showRecharge();
                        }
                    } else {
                        $('#amountBox').addClass('error');
                        $("#errorMsg").text(validation[1]);
                    }
                });
                $('#buyAmount').bind('change', function () {
                    $('#amountBox').removeClass('error');
                    $("#errorMsg").text("");
                })
                var buyBtnLabel = "立即投资";
                switch (prod_Detail.prodStatus) {
                case '1':
                    ;
                    break;
                case '2':
                    buyBtnLabel = "已售罄";
                    break;
                case '3':
                    buyBtnLabel = "还款中";
                    break;
                case '4':
                    buyBtnLabel = "已流标";
                    break;
                case '7':
                    buyBtnLabel = "已兑付";
                    break;
                default:
                    buyBtnLabel = "停止";
                    break;
                }
                $('#createOrderBtn').html(buyBtnLabel);

                $('.prod-coupons-fx').bind('mouseenter', function () {
                    var top = $(this).offset().top + 30;
                    var left = $(this).offset().left;
                    var html = "<div style='left:" + left + "px;top:" + top + "px;' class='coupon-tips-div'>该项目可使用返现券</div>";
                    $('#couponTips').html(html);
                });
                $('.prod-coupons-mj').bind('mouseenter', function () {
                    var top = $(this).offset().top + 30;
                    var left = $(this).offset().left;
                    var html = "<div style='left:" + left + "px;top:" + top + "px;' class='coupon-tips-div'>该项目可使用满减券</div>";
                    $('#couponTips').html(html);
                });
                $('.prod-coupons-jx').bind('mouseenter', function () {
                    var top = $(this).offset().top + 30;
                    var left = $(this).offset().left;
                    var html = "<div style='left:" + left + "px;top:" + top + "px;' class='coupon-tips-div'>该项目可使用加息券</div>";
                    $('#couponTips').html(html);
                });
                $('.prod-coupons-jj').bind('mouseenter', function () {
                    var top = $(this).offset().top + 30;
                    var left = $(this).offset().left;
                    var html = "<div style='left:" + left + "px;top:" + top + "px;' class='token-tips-div'>使用升息令牌后，可提升年化收益</div>";
                    $('#couponTips').html(html);
                });
                $('.prod-coupons').bind('mouseleave', function () {
                    $('#couponTips').html('');
                });

                if (prod_Detail.prodStatus != "1") {
                    $('#buyAmount').attr("disabled", "disabled");
                    $('#createOrderBtn').attr("disabled", "disabled");

                }

                //contract checkbox
                $('#chkContractIcon').bind('click', function () {
                    var currentStatus = !($('#chkContract').get(0).checked);
                    $('#chkContract').prop("checked", currentStatus);
                    if (currentStatus) {
                        $('#chkContractIcon').addClass('checked');
                    } else {
                        $('#chkContractIcon').removeClass('checked');
                    }
                });
                console.log("111");
                that.initDetail();
            }, function () {
                window.location.href = "/404";
            })
        },
        //初始化优惠券
        inintCouponList: function () {            
            $('#couponSel').val('您有0张优惠券可选择');
            $('#couponSel').css('color', '#3c3c3c');
            $('#couponSel').removeClass('down').removeClass('up').unbind("click");
            $("#couponList").html("").hide();            
            if (that.user.hasLogin && that.buyAmount > 0) {
                app.account.getProductCoupon(that.productId, that.buyAmount, function (list) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].status == 0 && parseFloat(that.buyAmount) >= parseFloat(list[i].minInvestAmount)) {
                            if (i == 0) {
                                that.coupon = list[i];
                                break;
                            }
                        } else {
                            list.splice(i, 1);
                        }
                    }
                    if (list != null) {
                        var listLen = list.length;
                        var i = 1;
                        var listStr = "";
                        for (var key in list) {
                            var words = '';
                            switch (list[key].categoryType) {
                                case '2':
                                    words = '返现券' + list[key].amount + '元 起投金额：' + parseInt(list[key].minInvestAmount) + '元';
                                    break;
                                case '3':
                                    words = '满减券' + list[key].amount + '元 起投金额：' + parseInt(list[key].minInvestAmount) + '元';
                                    break;
                                case '4':
                                    words = '加息券' + list[key].amount + '% 起投金额：' + parseInt(list[key].minInvestAmount) + '元';
                                    break;
                            }
                            if (i == listLen) {
                                listStr += "<div class='last coupon' cType='" + list[key].categoryType + "' amount='" + list[key].amount + "' tag='" + list[key].couponId + "'><span class='sel-icon unselect'></span>" + words + "</div>";
                                break;
                            } else {
                                if (i == 1) {
                                    listStr += "<div class='coupon' cType='" + list[key].categoryType + "' amount='" + list[key].amount + "' tag='" + list[key].couponId + "'><span class='sel-icon select'></span>" + words + "</div>";
                                } else {
                                    listStr += "<div class='coupon' cType='" + list[key].categoryType + "' amount='" + list[key].amount + "' tag='" + list[key].couponId + "'><span class='sel-icon unselect'></span>" + words + "</div>";
                                }
                                i++;
                            }
                        }
                        $("#couponList").html(listStr);
                        $('#couponSel').addClass('down');
                        $('#couponSel').css('color', '#ff7800');
                        $('#couponSel').unbind('click').bind('click', function () {
                            if ($("#couponList").css("display") == 'none') {
                                $("#couponList").fadeIn(200);
                                $('#couponSel').removeClass('down').addClass('up');
                            } else {
                                $("#couponList").fadeOut(200);
                                $('#couponSel').removeClass('up').addClass('down');
                            }
                        });
                        $(".coupon").mousemove(function () {
                            $(this).addClass("bgc");
                        });
                        $(".coupon").mouseout(function () {
                            $(this).removeClass("bgc");
                        });
                        $(".coupon").unbind('click').click(function () {
                            that.coupon = {
                                'couponId': $(this).attr("tag"),
                                'categoryType': $(this).attr("cType"),
                                'amount': $(this).attr("amount"),
                            }
                            $('.sel-icon.select').removeClass('select').addClass('unselect');
                            $('#couponSel').removeClass('up').addClass('down');
                            $(this).children(".sel-icon").addClass('select');
                            $("#couponList").fadeOut(200);
                            that.selectedCoupon();
                        });
                        that.selectedCoupon();
                    } else {
                        that.selectedCoupon();
                    }
                }, function (errorCode, errorMsg) {});
            }
        },
        selectedCoupon: function () {
            if (!that.coupon) {
                $('#couponSel').val('您有0张优惠券可选择');
                $('#couponSel').css('color', '#3c3c3c');
                return;
            }
            var words = '使用' + that.coupon.amount;
            switch (that.coupon.categoryType) {
                case '2':
                    words += '元的返现券';
                    break;
                case '3':
                    words += '元满减券';
                    break;
                case '4':
                    words += '%加息券';
                    break;
                default:
                    words = '暂无优惠券';
            }
            $('#couponSel').val(words);
            $("#couponId").val(that.coupon.couponId);
        },
        validateAmount: function (amount, minApplyAmount, maxApplyAmount, minAddAmount) {
            var result = true;
            var errorMsg = "";
            // 数字
            if (!DLC.Util.testCurrencyAmount(amount)) {
                result = false;
                errorMsg = "请输入正确的金额";
                return [result, errorMsg]
            }
            if (amount < minApplyAmount) {
                result = false;
                errorMsg = "最低购买金额为" + minApplyAmount + "元";
                return [result, errorMsg]
            }
            if (amount > maxApplyAmount) {
                result = false;
                errorMsg = "超过最大剩余可投金额";
                return [result, errorMsg];
            }
            if (!DLC.Util.testMinAddAmount(parseFloat(amount) - parseFloat(minApplyAmount), minAddAmount)) {
                result = false;
                errorMsg = "起购金额为" + minApplyAmount + "元,追加金额必须是" + minAddAmount + '元的倍数';
                return [result, errorMsg]
            }

            return [result, errorMsg]
        },

        addAmount: function (add) {
            var buyAmount = parseFloat($('#buyAmount').val());
            var baseAmount = isNaN(buyAmount) ? 0 : buyAmount;
            var addAmount = this.prodDetail.minAddAmount;
            if (add) {
                baseAmount += addAmount;
            } else {
                baseAmount -= addAmount;
            }
            if (baseAmount < 0) {
                baseAmount = 0;
            }
            $('#buyAmount').val(baseAmount);
            $('#buyAmount').trigger('keyup');
        },
        maxAmount: function () {
            $('#buyAmount').val(parseInt(that.balance));
            that.amountChange();
            that.inintCouponList();
        },
        amountChange: function () {
            var value = parseFloat($('#buyAmount').val());
            if (isNaN(value)) {
                $('#buyAmount').val('');
                $('#expectDayInterest').text("0.00");
                $('#exprctYearInterest').text("0.00");
            } else {
                var amount = parseInt(value);
                var max_money = parseInt(prod_Detail.maxApplyAmount);
                var min_money = parseInt(prod_Detail.minApplyAmount);

                if (amount > max_money) {
                    $('#buyAmount').val(max_money);
                    amount = max_money;
                }
                if (amount < min_money) {
                    amount = 0;
                }
                if (amount > that.balance) {
                    amount = that.balance;
                }
                that.buyAmount = amount;
                var expectDayInterest = (amount * this.prodDetail.expectYearReturn * 0.01 / this.prodDetail.yearDays).toFixed(3);
                var exprctYearInterest = (amount * this.prodDetail.expectYearReturn * 0.01 / this.prodDetail.yearDays * this.prodDetail.prodPeriod).toFixed(3);
                $('#expectDayInterest').text(expectDayInterest.substring(0, expectDayInterest.lastIndexOf('.') + 3));
                $('#exprctYearInterest').text(exprctYearInterest.substring(0, exprctYearInterest.lastIndexOf('.') + 3));
            }
        },

        initAccount: function () {
            $('.unloginShow').bind('click', function () {
                that.user.clearUserTemp();
                window.location.href = '/login';
            })
            $('.rechargeShow').bind('click', function () {
                window.location.href = '/myCenter_deposit';
            })
            if (this.user.hasLogin) {
                //get accountInfo success
                this.account.getBizAccountInfo(function () {
                    window.scrollTo(0, 0);
                    var totalAsset = that.account.accountInfo.balance.available;
                    that.balance = totalAsset;
                    $('.loginShow').text(totalAsset);
                    $('.loginShow').show();
                    $('.rechargeShow').show();
                }, function () {
                    $('.unloginShow').show();
                }, false)
            } else {
                $('.unloginShow').show();
                window.scrollTo(0, 0);
            }
        },
        initDetail: function () {
            var details = that.prodDetail.details;
            for (var i = 0; i < details.length; i++) {
                var item = details[i];
                var info = item.prodInfo;
                if (info == "产品介绍") {
                    // $(".prodIntroduce").show();
                    // $("#prodIntroduce").show();
                    // that.initIntroduce(item);
                    continue;
                } else if (info == "资金用途") {
                    // $(".prodUsage").show();
                    // $("#prodUsage").show();
                    // that.initUsage(item);
                    continue;
                } else if (info == "借款人基本信息") {
                    $(".prodUserInfo").show();
                    $("#prodUserInfo").show();
                    that.initUserInfo(item);
                    continue;
                } else if (info == "借款档案") {
                    $(".prodImgs").show();
                    $("#prodImgs").show();
                    that.initImgs(item);
                    continue;
                } else if (info == "项目附件") {
                    // $(".prodAttacheds").show();
                    // $("#prodAttacheds").show();
                    // that.initAttachment(item);
                    continue;
                } else if (info == "投资亮点") {
                    $(".prodStrengths").show();
                    $("#prodStrengths").show();
                    that.initStrengths(item);
                    continue;
                }
                if (info == "合同范本") {
                    // $('#withholdContract').attr('href', item.attacheds[0].fileUrl);
                    continue;
                }
            }

            $("#tab1").bind('click', function () {
                that.changeTab($("#tab1"), $("#detail1"));
            });
            $("#tab2").bind('click', function () {
                that.changeTab($("#tab2"), $("#detail2"));
            });
            $("#tab3").bind('click', function () {
                that.changeTab($("#tab3"), $("#detail3"));
            });
            $("#tab4").bind('click', function () {
                that.changeTab($("#tab4"), $("#detail4"));
            });
            this.changeTab($('#tab1'), $('#detail1'));
            window.scrollTo(0, 0);
        },

        changeTab: function (currentTitle, currentTab) {
            if (this.currentTabTitle) {
                this.currentTabTitle.removeClass('currentSelect');
                this.currentTabTitle = currentTitle;
                this.currentTabTitle.addClass('currentSelect')
            } else {
                this.currentTabTitle = currentTitle;
                this.currentTabTitle.addClass('currentSelect');
            }
            if (this.currentTab) {
                this.currentTab.fadeOut(200, function () {
                    that.currentTab = currentTab;
                    that.currentTab.fadeIn(200);
                });
            } else {
                this.currentTab = currentTab;
                this.currentTab.show();
            }
        },

        //show recharge tips
        showRecharge: function () {
            $('#adjust').load('../pages/payTips.html', function () {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
            })
        },
        //show tradePassword
        showTradePwd: function () {
            $('#adjust').load('../pages/tradePassword.html', function () {
                var forgetPasswordLink = that.account.accountInfo.hasCard ? "/myCenter_cardTstPwd" : "/myCenter_noCardTstPwd";
                $('#forgotPassword').attr('href', forgetPasswordLink);
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                $('#cancelBtn').click(function () {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                });
                $('#hidPaySpan').click(function () {
                    that.tradePassword = $('#tradePassword').val();
                    $('#tradePassword').val('');
                    that.createOrder();
                });
            });
        },
        createOrder: function () {
            var productId = this.productId;
            var amount = $('#buyAmount').val();

            app.trade.createOrder(productId, amount, function (responseData) {
                that.orderNo = responseData['orderNo'];
                that.createTrade();
                // window.location.href = '/pay_' + orderNo;
            }, function (errorCode, errorMsg) {
                $("#errorMsg").text(errorMsg);
            });
        },
        //create trade
        createTrade: function () {
            app.trade.createOrderTrade(that.orderNo, function (responseData) {
                that.tradeSerialNo = responseData['tradeSerialNo'];
                that.total = responseData['total'];
                that.payTrade(that.tradeSerialNo, that.total);
            }, function (errorCode, errorMsg) {
                $('#errorMsg').text(errorMsg);
            })
        },
        //total calc
        calcPay: function () {
            that.balancePamount = that.buyAmount;
            if (that.coupon && that.coupon.categoryType && that.coupon.categoryType == "3") {
                //还需支付金额大于满减券金额
                if (parseFloat(that.buyAmount) >= parseFloat(that.coupon.amount)) {
                    that.needPay = parseFloat(DLC.Util.accSub(that.buyAmount, that.coupon.amount)); //还需支付金额-点币
                }
            }
            if (this.needPay <= this.balance) {
                that.balancePamount = that.needPay;
            }
        },
        //pay trade
        payTrade: function (tradeSerialNo, total) {
            that.calcPay();
            $('#adjust').load('../pages/processing.html', function () {
                DLC.Util.showAdjust('#adjust');
                var param = {
                    acceptTos: true,
                    tradeSerialNo: tradeSerialNo,
                    tradePassword: that.tradePassword,
                    items: []
                };
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
                if (that.coupon) {
                    param.items.push({
                        assetType: '3',
                        assetId: that.coupon.couponId,
                        amount: parseFloat(that.coupon.amount)
                    })
                }
                //点币支付
                // if (parseFloat(that.coinPamount) > 0 && $('#chkCoin').get(0).checked) {
                //     param.items.push({
                //         assetType: '4',
                //         amount: parseFloat(that.coinPamount)
                //     })
                // }
                // console.log(param);
                // return;
                app.trade.tradePay(param, function (data) {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                    $('.prod-detail').load('../pages/paySuccess.html', function () {
                        that.completePay(data, true)
                    })
                }, function (errorCode, errorMsg, response) {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                    if (errorCode.toString() == '2055' || errorCode.toString() == '2056') {
                        $('#errorMsg').text(errorMsg);
                        $('#tradePassword').val('');
                        $('#tradePassword').focus();
                    } else {
                        //goto error page
                        var data = response['data'];
                        $('.prod-detail').load('../pages/payFailed.html', function () {
                            that.completePay(data, false, errorMsg)
                        })
                    }
                });
            });
        },
        //complete pay
        completePay: function (data, success, errorMsg) {
            $('#totalAmount').text(data.totalAmount);
            $('#payTotal').text(data.payAmount);
            $('#orderNo').text(data.orderSerialNo);
            $('#prodName').text(data.prodName);

            // $.cookie('orderNo', null, {
            //     expires: -1
            // });
            if (success) {
                $('#buyTime').text(data.paidAt.replace('T', ' ').replace(RegExp('/-/', 'gm'), '/'));
                $('#tradeRecordBtn').bind('click', function () {
                    window.location.href = "/myCenter_orders";
                });
                $('#homepageBtn').bind('click', function () {
                    window.location.href = "/";
                });
                //get luncky num
                if (data.prizes) {
                    var luckyNum = [];
                    $.each(data.prizes, function (i, obj) {
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
                    $('#gotoPayBtn').bind('click', function () {
                        window.location.href = "/";
                    })
                    return;
                }
                $('#gotoPayBtn').bind('click', function () {
                    window.location.reload();
                })
            }
        },
        initUsage: function (item) {
            var context = item.prodDetail;
            $('#prodUsage').text(context);
            $('#prodUsage').html('<div class=" font15px">' + $('#prodUsage').html().split("\n").join("<br />") + '</div>');
        },
        initIntroduce: function (item) {
            var context = item.prodDetail;
            $('#prodIntroduce').text(context);
            $('#prodIntroduce').html('<div class=" font15px">' + $('#prodIntroduce').html().split("\n").join("<br />") + '</div>');
        },
        initStrengths: function (item) {
            var context = item.prodDetail;
            $('#prodStrengths').text(context);
            $('#prodStrengths').html('<div class=" font15px">' + $('#prodStrengths').html().split("\n").join("<br />") + '</div>');
        },
        initUserInfo: function (item) {
            var context = item.prodDetail;
            var html = '<ul>';
            var hList = context.split("\n");
            for (var i = 0; i < hList.length; i++) {
                var oneList = (hList[i].indexOf(":") != -1) ? hList[i].split(":") : hList[i].split("：");
                html += '<li class="liT">' + oneList[0] + '：<span class="liC">' + oneList[1] + '</span></li>';
            }
            html += '</ul>';
            $('#prodUserInfo').html(html);
        },
        initImgs: function (item) {
            var hList = item.attacheds;
            var nList = [];
            for (var i = 0; i < hList.length; i++) {
                var isHave = false;
                for (var j = 0; j < nList.length; j++) {
                    if (hList[i].fileTitle == nList[j].fileTitle) {
                        isHave = true;
                        nList[j].fileUrlList.push(hList[i].fileUrl);
                        break;
                    }
                }
                if (!isHave) {
                    var oneInfo = [];
                    oneInfo['fileTitle'] = hList[i].fileTitle;
                    oneInfo['fileUrlList'] = [];
                    oneInfo.fileUrlList.push(hList[i].fileUrl);
                    nList.push(oneInfo);
                }
            }
            this.imgsList = nList;
            var html = '<ul class=" font15px"><li class="liT1">审核项目</li><li class="liT2">审核状态</li><li class="liT3">图片</li>';
            for (var j = 0; j < nList.length; j++) {
                if (j % 2 == 1) {
                    html += '<li class="liC1 libg">' + nList[j].fileTitle + '</li><li class="liC2 libg"><span class="ok"></span></li><li class="liC3 libg"><a href="JavaScript:void(0)" tag="' + j + '" title="' + nList[j].fileTitle + '" class="imgShow">查看</a></li>';
                } else {
                    html += '<li class="liC1">' + nList[j].fileTitle + '</li><li class="liC2"><span class="ok"></span></li><li class="liC3"><a href="JavaScript:void(0)" tag="' + j + '" title="' + nList[j].fileTitle + '" class="imgShow">查看</a></li>';
                }
            }
            html += '</ul>';
            $('#prodImgs').html(html);

            var maxTId = 0;
            var nowTId = 0;
            var tagIndex = 0;
            $(".imgShow").click(function () {
                DLC.Util.showOverlay();
                tagIndex = $(this).attr("tag");
                $("#showImg").removeAttr("src");
                $("#showImg").attr("src", nList[tagIndex]['fileUrlList'][0]);
                that.showImgDiv("#showImgDiv");
                maxTId = nList[$(this).attr("tag")]['fileUrlList'].length;
                nowTId = 1;
                $(".showIndex2").html(maxTId);
                $(".showIndex1").html(nowTId);
                $(".showIndex0").html($(this).attr("title"));
                if (nowTId == 1) {
                    $(".showImgL").removeClass("left_h").addClass("left_n");
                } else {
                    $(".showImgL").removeClass("left_n").addClass("left_h");
                }
                if (nowTId == maxTId) {
                    $(".showImgR").removeClass("right_h").addClass("right_n");
                } else {
                    $(".showImgR").removeClass("right_n").addClass("right_h");
                }
            });
            $("#showImgDivClose").click(function () {
                DLC.Util.hideOverlay();
                DLC.Util.hideAdjust("#showImgDiv");
            });
            var showWitchImg = function (leftNum) {
                $("#showImgDiv").animate({
                    left: leftNum,
                    opacity: '0.1'
                }, 200, function () {
                    DLC.Util.hideAdjust("#showImgDiv");
                    $("#showImg").removeAttr("src");
                    $("#showImg").attr("src", nList[tagIndex]['fileUrlList'][nowTId - 1]);
                    $("#showImgDiv").css({
                        opacity: 1
                    });
                    that.showImgDiv("#showImgDiv");
                });
            }
            $(".showImgDivL").click(function () {
                if ($(".showImgL").hasClass("left_n")) {
                    return;
                }
                nowTId--;
                $(".showIndex1").html(nowTId);
                if (nowTId == 1) {
                    $(".showImgL").removeClass("left_h").addClass("left_n");
                }
                if (nowTId == (maxTId - 1)) {
                    $(".showImgR").removeClass("right_n").addClass("right_h");
                }
                showWitchImg("30%");
            }).mousemove(function () {
                $(".showImgL").show();
            }).mouseout(function () {
                $(".showImgL").hide();
            });
            $(".showImgDivR").click(function () {
                if ($(".showImgR").hasClass("right_n")) {
                    return;
                }
                nowTId++;
                $(".showIndex1").html(nowTId);
                if (nowTId == maxTId) {
                    $(".showImgR").removeClass("right_h").addClass("right_n");
                }
                if (nowTId == 2) {
                    $(".showImgL").removeClass("left_n").addClass("left_h");
                }
                showWitchImg("70%");
            }).mousemove(function () {
                $(".showImgR").show();
            }).mouseout(function () {
                $(".showImgR").hide();
            });
        },
        showImgDiv: function (id) {
            var w = $(id).width();
            var h = $(id).height();
            var marginL = w / 2;
            var marginT = h / 2;
            $(id).css({
                zIndex: '1001',
                left: '50%',
                top: '50%',
                marginLeft: '-' + marginL + 'px',
                marginTop: '-' + (marginT - 30) + 'px',
                position: 'fixed'
            })
            $(id).fadeIn(200);
        },
        initContract: function (item) {
            var list = item.attacheds;
            for (var i = 0; i < list.length; i++) {
                var attahcedItem = list[i];
                var thumbnailUrl = attahcedItem.thumbnailUrl;
                var fileUrl = attahcedItem.fileUrl;
                var id = 'contract_' + i;
                $('#prodContract').append(that.attachmentContract(thumbnailUrl, fileUrl, id));
                that.showContractPDF(id, fileUrl);
            }
        },
        initAttachment: function (item) {
            var list = item.attacheds;
            for (var i = 0; i < list.length; i++) {
                var attahcedItem = list[i];
                var thumbnailUrl = attahcedItem.thumbnailUrl;
                var fileUrl = attahcedItem.fileUrl;
                var fileName = attahcedItem.fileName;
                var id = 'attached_' + i;
                var zoomId = 'attached_zoom_' + i;
                $('#prodAttacheds').append(that.attachmentPic(thumbnailUrl, fileUrl, id, zoomId, fileName));
                that.zoomImg(id, zoomId);
            }
        },
        attachmentContract: function (thumbnailUrl, fileUrl, id) {
            var htmlStr =
                '<div class="contract attahced-img">' +
                '<a id="' + id + '" ><img src="' + thumbnailUrl + '" /></a>' +
                '</div>';
            return htmlStr;
        },
        attachmentPic: function (thumbnailUrl, fileUrl, id, zoomId, fileName) {
            var indexS = (id.substr(9, id.length - 9));
            var index = indexS * 1 + 1;
            var htmlStr =
                '<div class="div_attahced">' +
                '<div class="attahced-img">' +
                '<a id="' + id + '" ><img class="img_attached" src="' + thumbnailUrl + '" /></a>' +
                '<div id="' + zoomId + '" style="position:relative; display:none;">' +
                '<span id="' + zoomId + '_close" style="width:25px;height:25px;position:absolute;top:0;right:0;" class="window-close-btn"></span>' +
                '<img  src="' + fileUrl + '"/>' +
                '</div>' +
                '</div>' +
                '<div class="attahced_name">' + fileName + '</div>' +
                '</div>';
            return htmlStr;
        },
        showContractPDF: function (id, src) {
            $("#" + id).bind('click', function () {
                window.open(src)
            })
        },
        zoomImg: function (id, zoomId) {
            $("#" + id).bind('click', function () {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#' + zoomId);
            });
            $("#" + zoomId + '_close').bind('click', function () {
                DLC.Util.hideOverlay();
                DLC.Util.hideAdjust('#' + zoomId);
            });
            $("#" + zoomId).bind('click', function () {
                DLC.Util.hideOverlay();
                DLC.Util.hideAdjust('#' + zoomId);
            })
        },
        randerRecords: function (page, productId) {
            this.trade.getNewProductTradeList({
                page: page,
                productId: productId
            }, function (tradeList, paging) {
                that.initRecords(tradeList);
                if (that.hasPaging == false) {
                    that.initPagination(paging);
                    that.hasPaging = true;
                }
            }, function () {
                //error
            });
        },
        initRecords: function (list) {
            //
            var len = list.length;
            var node = $('#tradeRecords');
            node.text("");
            node.hide();
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var item = list[i];
                    var bc = "";
                    if (i % 2 > 0) {
                        bc = "cc";
                    }
                    var htmlStr =
                        '<p class="item">' +
                        '<span class="c c1 ' + bc + '">' + item.userName + '</span>' +
                        '<span class="c c2 ' + bc + '">' + item.entrustAmount + '</span>' +
                        '<span class="c c3 ' + bc + '">' + ((item.investFrom > 0) ? "APP" : "PC") + '</span>' +
                        '<span class="c c4 ' + bc + '">' + item.createdAt + '</span>' +
                        '</p>';
                    node.append(htmlStr);
                }
            } else {
                node.text('暂无数据').css({
                    width: '100%',
                    height: '300px',
                    'line-height': '300px',
                    'text-align': 'center'
                });
            }
            node.fadeIn(200, function () {
                window.scrollTo(0, 0);
            });
        },
        initPagination: function (paging) {
            // page : response['paging'].page,
            // 		pageSize: response['paging'].pageSize,
            // 		total: response['paging'].total
            $('#tradeRecordsPagination').pagination(paging.total * paging.pageSize, {
                num_edge_entries: 1,
                num_display_entries: 4,
                callback: function (page) {
                    that.randerRecords(page, that.productId)
                },
                items_per_page: paging.pageSize,
            })
        },
    }, {});
})($)