(function ($) {
    'use strict';
    var that;
    DLC.ExperienceProduct = DLC.derive(null, {
        create: function (prodCodeId) {
            // clearInterval(app.experienceOtpTimer);
            // this.user = app.currentUser;
            this.account = app.account;
            this.trade = app.trade;
            this.prodCodeId = prodCodeId;
            this.hasPaging = false;
            DLC.Util.initPage();
            // this.randerRecords(1, prodCodeId);
            that = this;

            $('input').placeholder({
                isUseSpan: false,
                placeholderColor: '#8d8d8d'
            });
            $('.unloginShow').bind('click', function () {
                window.location.href = '/login';
            });

            $('.rechargeShow').bind('click', function () {
                var hasCard = app.account.accountInfo["hasCard"];
                if (!hasCard) {
                    window.location.href = "/myCenter_userBindBankCard";
                } else {
                    window.location.href = "/myCenter_deposit";
                }
            });
            if (app.currentUser.hasLogin) {
                app.account.getBizAccountInfo(function () {
                    var totalAsset = app.account.accountInfo.totalAsset;
                    var balance = app.account.accountInfo.balance.available;
                    that.balance = balance;
                    that.totalAsset = totalAsset;
                    $('.loginShow').text(balance);
                    $('.loginShow').show();
                    $('.rechargeShow').show();
                }, function () {
                    $('.unloginShow').show();
                }, false)
            } else {
                $('.unloginShow').show();
            }
            // get product detail
            app.product.getDlcByProductId(prodCodeId, function (prodDetail) {
                that.prodDetail = prodDetail;
                that.initProductView(prodDetail);
                that.initDetail();
                if (app.currentUser.hasLogin) {
                    that.getCouponList(prodCodeId, prodDetail);
                }
                window.scrollTo(0, 0);
            }, function() {
                window.location.href = "/404";
            });
        },
        getCouponList: function (prodCodeId, prodDetail) {
            // get user coupon list
            app.account.getExperiencesCoupon(prodCodeId, function (coupon) {
                coupon.prodCodeId = prodCodeId;
                for (var i = 0; i < coupon.length; i++) {
                    if (coupon[i].status == 0) {
                        that.coupon = coupon[i];
                        break;
                    }
                }
                that.initCouponView(that.coupon, prodDetail);
                window.scrollTo(0, 0)
            }, function (errorCode, errorMsg) {
                window.scrollTo(0, 0)
            })
        },
        initProductView: function (prodDetail) {
            // $('#prodName').text('体验金专享标'); //prodDetail.name
            $('#expectYearReturn').text(prodDetail.expectYearReturn);
            $('#expectYearReturn2').text(prodDetail.invest1IncReturn);

            $('#productPeriod').text(prodDetail.prodPeriod);
            $('#totalAmount').text(prodDetail.maxRaisedAmount);
            $('.invest-type').text(prodDetail.returnMethodStr_1);
            $('#buyAmount').get(0).setAttribute('placeholder', prodDetail.minApplyAmountStr);
            $('input').placeholder({
                isUseSpan: true,
                placeholderColor: '#8d8d8d'
            });
            $('#buyAmount').bind('keyup', function () {
                that.amountChange(prodDetail);
            });
            $('#buyAmount').keyup();
            $('#allInvest').bind('click', function () {
                that.maxAmount(prodDetail);
            });
            // $('#clickBtn_left').bind('click', function () {
            //     $('#buyAmount').trigger('change');
            //     that.addAmount(false);
            // });
            // $('#clickBtn_right').bind('click', function () {
            //     $('#buyAmount').trigger('change');
            //     that.addAmount(true);
            // });
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
            // $('#interestDays').text(parseInt(prodDetail.prodPeriod) + 2);
            // $('#investCount').text(prodDetail.investCount);
            // if (prodDetail.details) {
            //     for (var j = 0; j < prodDetail.details.length; j++) {
            //         if (prodDetail.details[j]['prodInfo']) {
            //             switch (prodDetail.details[j]['prodInfo']) {
            //                 case '产品描述':
            //                     var cpms_arr = prodDetail.details[j]['prodDetail'].split("\n");
            //                     var cpms = '';
            //                     for (var i = 0; i < cpms_arr.length; i++) {
            //                         cpms += '<p>' + cpms_arr[i] + '</p>';
            //                     }
            //                     $('#cpms').html(cpms);
            //                     break;
            //                 case '赚了多少':
            //                     var zlds_arr = prodDetail.details[j]['prodDetail'].split("\n");
            //                     var zlds = '';
            //                     var len = zlds_arr.length;
            //                     for (var i = 0; i < len; i++) {
            //                         if (i == len - 1) {
            //                             zlds += '<p>' + zlds_arr[i] + ' <a href="javascript:;" id="cashRule" style="color:#396be1">查看提现规则>></a></p>';
            //                         } else {
            //                             zlds += '<p>' + zlds_arr[i] + '</p>';
            //                         }
            //                     }
            //                     $('#zlds').html(zlds);
            //
            //                     //show PointCoinRule
            //                     $('#cashRule').bind('click', function() {
            //                         $('#adjust').load('../pages/contract/rpCashRule.html', function() {
            //                             DLC.Util.showOverlay();
            //                             DLC.Util.showAdjust('#adjust');
            //                             $('#pcRuleClose').click(function() {
            //                                 DLC.Util.hideAdjust('#adjust');
            //                                 DLC.Util.hideOverlay();
            //                             });
            //
            //                         })
            //                     });
            //                     break;
            //                 case '如何使用':
            //                     var rhsy_arr = prodDetail.details[j]['prodDetail'].split("\n");
            //                     var rhsy = '';
            //                     for (var i = 0; i < rhsy_arr.length; i++) {
            //                         rhsy += '<p>' + rhsy_arr[i] + '</p>';
            //                     }
            //                     $('#rhsy').html(rhsy);
            //                     break;
            //                 case '活动说明':
            //                     var tyjsm_arr = prodDetail.details[j]['prodDetail'].split("\n");
            //                     var tyjsm = '<p style="margin:79px 0px 20px 0px;color:#656565;" class="label">体验金专享标说明：</p>';
            //                     for (var i = 0; i < tyjsm_arr.length; i++) {
            //                         tyjsm += '<p class="label" style="color:#656565;">' + tyjsm_arr[i] + '</p>';
            //                     }
            //                     $('#tyjsm').html(tyjsm);
            //                     break;
            //                 default:
            //                     break;
            //             }
            //         }
            //     }
            // }
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
        maxAmount: function (prodDetail) {
            $('#buyAmount').val(parseInt(that.balance));
            that.amountChange(prodDetail);
        },
        amountChange: function (prodDetail) {
            var value = parseFloat($('#buyAmount').val());
            if (isNaN(value)) {
                $('#buyAmount').val('');
                $('#expectDayInterest').text("0.00");
                $('#exprctYearInterest').text("0.00");
            } else {
                var amount = parseInt(value);
                var max_money = parseInt(prodDetail.maxApplyAmount);
                var min_money = parseInt(prodDetail.minApplyAmount);
                if (amount > max_money) {
                    $('#buyAmount').val(max_money);
                    amount = max_money;
                }
                if (amount > 2000) {
                    $('#buyAmount').val(2000);
                    amount = 2000;
                }
                if (amount < min_money) {
                    amount = 0;
                }
                var expectDayInterest = (amount * prodDetail.expectYearReturn * 0.01 / prodDetail.yearDays).toFixed(3);
                var exprctYearInterest = (amount * prodDetail.expectYearReturn * 0.01 / prodDetail.yearDays * prodDetail.prodPeriod).toFixed(3);
                var expectDayInterest2 = (amount * prodDetail.invest1IncReturn * 0.01 / prodDetail.yearDays).toFixed(3);
                var exprctYearInterest2 = (amount * prodDetail.invest1IncReturn * 0.01 / prodDetail.yearDays * prodDetail.prodPeriod).toFixed(3);

                $('#expectDayInterest').text(expectDayInterest.substring(0, expectDayInterest.lastIndexOf('.') + 3) + '+' + expectDayInterest2.substring(0, expectDayInterest2.lastIndexOf('.') + 3));
                $('#exprctYearInterest').text(exprctYearInterest.substring(0, exprctYearInterest.lastIndexOf('.') + 3) + '+' + exprctYearInterest2.substring(0, exprctYearInterest2.lastIndexOf('.') + 3));
                // console.log(amount+'*'+prodDetail.expectYearReturn+'*0.01/'+prodDetail.yearDays+'*'+prodDetail.prodPeriod);
            }
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
            if (amount > 2000) {
                result = false;
                errorMsg = "超过最大可投金额2000元";
                return [result, errorMsg];
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
        initCouponView: function (coupon, prodDetail) {
            // var amount = parseFloat(coupon.amount);
            //预计总收益 = 体验金金额 * 年化率 * 期限 / 年化时间
            // var exprctYearInterest = (amount * this.prodDetail.expectYearReturn * 0.01 / this.prodDetail.yearDays * this.prodDetail.prodPeriod).toFixed(3);
            // $('#exprctYearInterest').text(exprctYearInterest.substring(0, exprctYearInterest.lastIndexOf('.') + 3));

            switch (coupon.status) {
                case "0":
                case 0:
                    $("#toExperience").attr("disabled", false);
                    $("#toExperience").bind("click", function () {
                        var buyAmount = $('#buyAmount').val();
                        var validation = that.validateAmount(buyAmount, prodDetail.minApplyAmount, prodDetail.maxApplyAmount, prodDetail.minAddAmount);
                        if (validation[0]) {
                            if (that.balance - buyAmount >= 0) {
                                that.showTradePwd();
                            } else {
                                that.showRecharge();
                            }
                        } else {
                            $("#errorMsg").text(validation[1]);
                        }
                    });
                    break;
                case "1":
                case 1:
                    $("#toExperience").attr("disabled", true);
                    // $(".ex_icon").addClass("ex_icon_1").removeClass("ex_icon_3");
                    break;
                case "2":
                case 2:
                    $("#toExperience").attr("disabled", true);
                    // $(".ex_icon").addClass("ex_icon_2").removeClass("ex_icon_3");
                    break;
                default:
                    $("#toExperience").attr("disabled", true);
            }

        },
        initDetail: function () {
            var details = that.prodDetail.details;
            // for (var i = 0; i < details.length; i++) {
            //     var item = details[i];
            //     var info = item.prodInfo;
            // if (info == "产品介绍") {
            //     that.initIntroduce(item);
            //     continue;
            // }
            // if(info == "投资亮点"){
            // 	that.initStrengths(item);
            // 	continue;
            // }
            // if(info == "资金用途"){
            // 	that.initUsage(item);
            // 	continue;
            // }
            // if(info == "合同范本"){
            // 	that.initContract(item);
            // 	continue;
            // }
            // if(info == "项目附件"){
            // 	that.initAttachment(item);
            // }
            // }

            $("#tab1").bind('click', function () {
                that.changeTab($("#tab1"), $("#detail1"));
            });
            // $("#tab2").bind('click', function() {
            //     that.changeTab($("#tab2"), $("#detail2"));
            // });
            // $("#tab3").bind('click', function() {
            //     that.changeTab($("#tab3"), $("#detail3"));
            // });
            this.changeTab($('#tab1'), $('#detail1'));
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
        initIntroduce: function (item) {
            var context = item.prodDetail;
            $('#prodIntroduce').text(context);
            $('#prodIntroduce').html($('#prodIntroduce').html().split("\n").join("<br />"));
        },
        randerRecords: function (page, productId) {
            this.trade.getProductTradeList({
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
            node.fadeIn(200);
            this.initHighlight();
        },
        initPagination: function (paging) {
            // page : response['paging'].page,
            // 		pageSize: response['paging'].pageSize,
            // 		total: response['paging'].total
            $('#tradeRecordsPagination').pagination(paging.total * paging.pageSize, {
                num_edge_entries: 1,
                num_display_entries: 4,
                callback: function (page) {
                    that.randerRecords(page, that.prodCodeId)
                },
                items_per_page: paging.pageSize,
            })
        },
        initHighlight: function () {
            $(".tradeRecords .item").bind('mousemove', function () {
                $(this).addClass('highlight');
            });
            $(".tradeRecords .item").bind('mouseout', function () {
                $(this).removeClass('highlight');
            });
        },
        //show recharge tips
        showRecharge: function () {
            $('#adjust').load('../pages/payTips.html', function () {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
            })
        },
        //show tradePassword dialog
        showTradePwd: function () {
            // 弹出交易密码层
            var that = this;
            $('#adjust').load('../pages/tradePassword.html', function () {
                var forgetPasswordLink = that.account.accountInfo.hasCard ? "/myCenter_cardTstPwd" : "/myCenter_noCardTstPwd";
                $('.forgotPassword').attr('href', forgetPasswordLink);
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                $('#cancelBtn').click(function () {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                });
                $('#hidPaySpan').click(function () {
                    that.tradePassword = $('#tradePassword').val();
                    $('#tradePassword').val('');
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                    $('#toExperience').attr('disabled', true);
                    // create order detail buyAmount
                    that.createOrder($('#buyAmount').val());
                });

            });
        },
        //start order process
        createOrder: function (amount) {
            var that = this;
            var productId = that.prodCodeId;
            if (!$('#chkContract').get(0).checked) {
                $('#errorMsg').text('请先阅读《点理财平台委托代扣授权书》');
                return;
            }
            this.trade.createOrder(productId, amount, function (responseData) {
                that.orderNo = responseData['orderNo'];
                that.createOrderTrade(that.orderNo);
            }, function (errorCode, errorMsg) {
                $("#errorMsg").text(errorMsg);
                $("#errorMsg").show();
                $('#toExperience').attr('disabled', false);
                if (errorCode.toString() == '41010') {
                    $('#adjust').load('../pages/authMessage.html', function () {
                        $('#adjustBtn').bind('click', function () {
                            app.route.oldHash = 'experienceProduct_' + that.prodCodeId;
                            window.location.href = '/myCenter_auth';
                            DLC.Util.hideAdjust('#adjust');
                            DLC.Util.hideOverlay();
                        })
                        DLC.Util.showOverlay();
                        DLC.Util.showAdjust('#adjust');

                    });
                } else {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                }
            });
        },
        createOrderTrade: function (orderNo) {
            that.trade.createOrderTrade(orderNo, function (responseData) {
                that.tradeSerialNo = responseData['tradeSerialNo'];
                that.total = responseData['total'];
                that.payTrade(that.tradeSerialNo, that.total);
            }, function (errorCode, errorMsg) {
                $("#errorMsg").text(errorMsg);
                $("#errorMsg").show();
                $('#toExperience').attr('disabled', false);
                DLC.Util.hideAdjust('#adjust');
                DLC.Util.hideOverlay();
            });
        },
        payTrade: function (tradeSerialNo, total) {
            $('#adjust').load('../pages/processing.html', function () {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                var param = {
                    acceptTos: true,
                    tradeSerialNo: tradeSerialNo,
                    tradePassword: that.tradePassword,
                    // smsCode: $('#otpNo').val(),
                    items: []
                };
                //只用体验金券支付
                param.items.push({
                    assetType: '3',
                    assetId: that.coupon.couponId,
                    amount: that.coupon.amount
                })
                param.items.push({
                    assetType: '1',
                    amount: total
                })
                that.trade.tradePay(param, function (data) {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                    $('#mainContent').load('../pages/paySuccess.html', function () {
                        that.completePay(data, true)
                    })
                }, function (errorCode, errorMsg, response) {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                    $('#toExperience').attr('disabled', false);
                    if (errorCode.toString() == '2055') {
                        $('#errorMsg').text(errorMsg);
                        $('#errorMsg').show();
                    } else if (errorCode.toString() == '2054') {
                        $('#errorMsg').text(errorMsg);
                        $('#errorMsg').show();
                    } else {
                        var data = response['data'];
                        //goto error page
                        $('#mainContent').load('../pages/payFailed.html', function () {
                            that.completePay(data, false, errorMsg)
                        })
                    }
                });
            });
        },
        completePay: function (data, success, errorMsg) {
            $('#totalAmount').text(data.totalAmount);
            $('#payTotal').text(data.payAmount);
            $('#orderNo').text(data.orderSerialNo);
            $('#prodName').text(data.prodName);

            if (success) {
                $('#buyTime').text(data.paidAt.replace('T', ' '));
                $('#paySuccessAction').text('');

                var sStr = '<span>尊敬的用户，您已成功支付!</span>';
                $('#paySuccessAction').append(sStr);
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
    }, {})
})($)