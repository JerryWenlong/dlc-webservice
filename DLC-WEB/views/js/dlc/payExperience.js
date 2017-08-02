(function($) {
    'use strict'
    DLC.PayExperience = DLC.derive(null, {
        create: function(prodCodeId) {
            var that = this;
            DLC.Util.initPage();
            window.app.initHeader(2);
            that.initComponents();
            this.account = app.account;
            this.trade = app.trade;
            this.prodCodeId = prodCodeId;
            //get couponsList and init page
            that.getCouponsList(this.prodCodeId);
            // get product detail
            app.product.getDlcByProductId(prodCodeId, function(prodDetail) {
                that.prodDetail = prodDetail;
                $("#prodName").text(prodDetail.name);
            }, function() {
                that.disabledExperience();
            });
        },
        //init component
        initComponents: function() {
            $('input').placeholder({
                isUseSpan: false,
                placeholderColor: '#8d8d8d'
            });
            $(':text').focus(function() {
                $(this).css("border-color", "#398be1");
            });
            clearInterval(app.experienceOtpTimer);
        },
        //get user coupon list
        getCouponsList: function(productId) {
            var that = this;
            var couponCode = 0;
            if ($.cookie('couponCode') != null) {
                couponCode = $.cookie('couponCode');
            }
            app.account.getExperiencesCoupon(productId, function(couponList) {
                that.couponsList = couponList;
                for (var i = 0; i < couponList.length; i++) {
                    if (couponList[i].status == 0) {
                        if (couponCode == 0) {
                            that.coupon = couponList[i];
                            break;
                        } else {
                            if (couponCode == couponList[i].couponCode) {
                                that.coupon = couponList[i];
                                break;
                            }
                        }
                    }
                }
                that.createCouponsListView(couponList);
                that.initButtons();
                that.selectedCoupon();
                $('#couponPannel').fadeIn(200);
                window.scrollTo(0, 0);
            }, function(errorCode, errorMsg) {
                that.disabledExperience();
            })
        },
        //create user coupon list view
        createCouponsListView: function(couponList) {
            var that = this;
            if (!couponList) {
                $('#chkCouponIcon').unbind();
                that.disabledExperience();
                return;
            }
            var list = couponList;
            var content = '<div class="expRuleHead">我的体验金<div class="expRuleClose" id="expRuleClose"></div></div>';
            for (var i = 0; i < list.length; i++) {
                if (list[i].status != 0) {
                    continue;
                }
                var amount = parseInt(list[i].amount),
                    couponCode = list[i].couponCode,
                    incomeMoney = list[i].expectProfit,
                    timeStart = list[i].validFrom,
                    timeEnd = list[i].validThru,
                    couponRules = (list[i].minInvestAmount) == 0 ? '' : "(满" + parseInt(list[i].minInvestAmount) + "以上使用)",
                    couponRange = list[i].products && list[i].products[0] && list[i].products[0].prodName ? list[i].products[0].prodName : '';

                content += that.createCouponView(amount, couponCode, couponRules, timeStart, timeEnd, couponRange);
            }
            $(".coupon-list-adjust").html(content);
        },
        //create user coupon view
        createCouponView: function(amount, couponCode, couponRules, timeStart, timeEnd, couponRange) {

            var content = '<div class="ucecOne" tag="' + couponCode + '">';
            content += '<div class="ucecOneLeft expOn expRule">';
            content += '<div class="h18px"></div>';
            content += '<div class="ucecolMid">';
            content += '<ul><li class="useContent"><span>' + amount + '</span><span class="fs24px ml5px">元</span></li><li class="useContenetRight"><div class="fs24px">体验金</div><div>' + couponRules + '</div></li></ul>';
            content += '</div><div class="h26px"></div><div class="h20px2">编号：' + couponCode + '</div>';
            content += '<div class="h20px2">有效时间：' + timeStart + ' ~ ' + timeEnd + '</div>';
            content += '<div class="h20px2">适用产品：' + couponRange + '</div></div></div>';
            return content;
        },
        //init button event
        initButtons: function() {
            var that = this;
            if (!that.coupon) {
                $('#chkCouponIcon').unbind();
                that.disabledExperience();
                return;
            }

            //select coupon
            $("#pay-coupon").bind('click', function() {
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#coupon-list-adjust');
            });
            $('.ucecOne').click(function() {
                var couponCode = $(this).attr("tag");
                that.coupon = null;
                for (var i = 0; i < that.couponsList.length; i++) {
                    if (that.couponsList[i].couponCode == couponCode) {
                        that.coupon = that.couponsList[i];
                        that.selectedCoupon();
                        break;
                    }
                }
                DLC.Util.hideAdjust('#coupon-list-adjust');
                DLC.Util.hideOverlay();
            });
            $('#expRuleClose').click(function() {
                DLC.Util.hideAdjust('#coupon-list-adjust');
                DLC.Util.hideOverlay();
            });

            //otp
            $('#otpBtn').bind('click', function() {
                if (!that.checkCoupon()) {
                    return;
                }
                //otp send
                $('#tips1').fadeIn(100);
                var time = 60;

                function timeCountDown() {
                    if (time == 0) {
                        if (app.experienceOtpTimer)
                            clearInterval(app.experienceOtpTimer);
                        $('#otpBtn').removeAttr("disabled");
                        $('#otpBtn').text("获取验证码");
                        time = 60;
                    } else {
                        $('#otpBtn').attr("disabled", true);
                        $('#otpBtn').text(time + " s");
                        time--;
                    }
                }
                timeCountDown();
                app.experienceOtpTimer = setInterval(timeCountDown, 1000);
                that.account.getPayOtp('pay', function(response) {
                    $('#tips1').show();
                }, function(errorCode, errorMsg) {
                    $('#tips1').hide();
                    $("#errorMsg").text(errorMsg);
                    $("#errorMsg").show();
                });
            });

            $('#otpNo').bind('focus', function() {
                $('#tips1').fadeOut(100);
                $('#errorMsg').hide();
            })

            $('#otpNo').bind('blur', function() {
                that.checkOtpCode();
            });

            $('#payBtn').bind('click', function() {
                $("#errorMsg").text('');
                $("#errorMsg").hide();
                if (that.checkOtpCode() && that.checkCoupon()) {
                    that.account.getOtpValidate('pay', $('#otpNo').val(), function(response) {
                        $('#otpNo').removeClass('errorInput');
                        $('#errorMsg').text('');
                        $('#errorMsg').hide();
                        that.showTradePwd();
                    }, function(errorCode, errorMsg) {
                        $('#otpNo').addClass('errorInput');
                        $('#errorMsg').text(errorMsg);
                        $('#errorMsg').show();
                        return false;
                    });
                } else {
                    return;
                }
            })
        },
        //select coupon
        selectedCoupon: function() {
            var that = this;
            if (!that.coupon) {
                $('#chkCouponIcon').unbind();
                that.disabledExperience();
                $('#orderYields').text('0.00');
                $("#experienceAmount").text('请选择');
                $("#experienceAmountUnit").hide();
                $('#amount').text('0.00');
                $('#coupon-rules').text('');
                $('#couponCode').text('');
                $('#timeStart').text('');
                $('#timeEnd').text('');
                $('#couponRange').text('');

                $('#chkCouponIcon').removeClass('checked');
                $('#chkCoupon').prop("checked", "false");
                $('#pay-coupon').addClass("pay-list-disabled");
                $('#arrow-coupon').removeClass('arrow-enabled').addClass("arrow-disabled");
                return;
            }
            var amount = isNaN(that.coupon.amount) ? 0 : parseInt(that.coupon.amount);
            //预计总收益 = 体验金金额 * 年化率 * 期限 / 年化时间
            var exprctYearInterest = (amount * parseFloat(that.prodDetail.expectYearReturn) * 0.01 / parseFloat(that.prodDetail.yearDays) * parseFloat(that.prodDetail.prodPeriod)).toFixed(3);
            $('#orderYields').text(exprctYearInterest.substring(0, exprctYearInterest.lastIndexOf('.') + 3));
            $("#experienceAmount").text(amount);
            $("#experienceAmountUnit").show();
            $('#amount').text(amount);
            var minInvestAmount = parseInt(that.coupon.minInvestAmount) == 0 ? '' : "(满" + parseInt(that.coupon.minInvestAmount) + "以上使用)";
            $('#coupon-rules').text(minInvestAmount);
            $('#couponCode').text(that.coupon.couponCode);
            $('#timeStart').text(that.coupon.validFrom);
            $('#timeEnd').text(that.coupon.validThru);
            var couponRange = that.coupon && that.coupon.products[0] && that.coupon.products[0].prodName ? that.coupon.products[0].prodName : '';
            $('#couponRange').text(couponRange);

            $('#chkCouponIcon').addClass('checked');
            $('#chkCoupon').prop("checked", "checked");
            $('#pay-coupon').removeClass("pay-list-disabled");
            $('#arrow-coupon').addClass('arrow-enabled').removeClass("arrow-disabled");

            $('.expSelected').removeClass("expSelected");
            $(".ucecOne[tag='" + that.coupon.couponCode + "']>div:first").addClass('expSelected');

        },
        //check otp
        checkOtpCode: function() {
            var otpNo = $('#otpNo').val();
            if (otpNo == "") {
                $('#errorMsg').text('请输入正确的验证码!');
                $('#errorMsg').show();
                return false;
            }
            if (!DLC.Util.testOtpCode(otpNo)) {
                $('#otpNo').addClass('errorInput');
                $('#errorMsg').text('请输入正确的验证码!');
                $('#errorMsg').show();
                return false;
            } else {
                return true;
            }
        },
        //check coupon
        checkCoupon: function() {
            if (!$('#chkCoupon').get(0).checked) {
                $('#errorMsg').text('请选择优惠券!');
                $('#errorMsg').show();
                return false;
            } else {
                return true;
            }
        },
        //disable button
        disabledExperience: function() {
            $('#otpBtn').attr("disabled", true);
            $('#payBtn').attr("disabled", true);
        },
        //show tradePassword dialog
        showTradePwd: function() {
            // 弹出交易密码层
            var that = this;
            $('#adjust').load('../pages/tradePassword.html', function() {
                var forgetPasswordLink = that.account.accountInfo.hasCard ? "/myCenter_cardTstPwd" : "/myCenter_noCardTstPwd";
                $('.forgotPassword').attr('href', forgetPasswordLink);
                DLC.Util.showOverlay();
                DLC.Util.showAdjust('#adjust');
                $('#cancelBtn').click(function() {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                });
                $('#hidPaySpan').click(function() {
                    that.tradePassword = $('#tradePassword').val();
                    $('#tradePassword').val('');
                    // create order detail
                    that.createOrder(that.coupon.amount);
                });

            });
        },
        //start order process
        createOrder: function(amount) {
            var that = this;
            var productId = that.prodCodeId;
            this.trade.createOrder(productId, amount, function(responseData) {
                that.orderNo = responseData['orderNo'];
                that.createOrderTrade(that.orderNo);
            }, function(errorCode, errorMsg) {
                $("#errorMsg").text(errorMsg);
                $("#errorMsg").show();
                if (errorCode.toString() == '41010') {
                    $('#adjust').load('../pages/authMessage.html', function() {
                        $('#adjustBtn').bind('click', function() {
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
                    that.disabledExperience();
                }
            });
        },
        createOrderTrade: function(orderNo) {
            var that = this;
            that.trade.createOrderTrade(orderNo, function(responseData) {
                that.tradeSerialNo = responseData['tradeSerialNo'];
                that.total = responseData['total'];
                that.payTrade(that.tradeSerialNo, that.total);
            }, function(errorCode, errorMsg) {
                $("#errorMsg").text(errorMsg);
                $("#errorMsg").show();
                DLC.Util.hideAdjust('#adjust');
                DLC.Util.hideOverlay();
                that.disabledExperience();
            });
        },
        payTrade: function(tradeSerialNo, total) {
            var that = this;
            $('#adjust').load('../pages/processing.html', function() {
                DLC.Util.showAdjust('#adjust');
                var param = {
                    acceptTos: true,
                    tradeSerialNo: tradeSerialNo,
                    tradePassword: that.tradePassword,
                    smsCode: $('#otpNo').val(),
                    items: []
                };
                //只用体验金券支付
                param.items.push({
                    assetType: '3',
                    assetId: that.coupon.couponId,
                    amount: total
                })
                that.trade.tradePay(param, function(data) {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                    if (app.experienceOtpTimer) clearInterval(app.experienceOtpTimer);
                    $('#mainContent').load('../pages/paySuccess.html', function() {
                        that.completePay(data, true)
                    })
                }, function(errorCode, errorMsg, response) {
                    DLC.Util.hideAdjust('#adjust');
                    DLC.Util.hideOverlay();
                    if (app.experienceOtpTimer) {
                        clearInterval(app.experienceOtpTimer);
                        $("#otpNo").val('');
                        $('#otpBtn').removeAttr("disabled");
                        $('#otpBtn').text("获取验证码");
                    }
                    if (errorCode.toString() == '2055') {
                        $('#errorMsg').text(errorMsg);
                        $('#errorMsg').show();
                    } else if (errorCode.toString() == '2054') {
                        $('#errorMsg').text(errorMsg);
                        $('#errorMsg').show();
                    } else {
                        var data = response['data'];
                        //goto error page
                        $('#mainContent').load('../pages/payFailed.html', function() {
                            that.completePay(data, false, errorMsg)
                        })
                    }
                });
            });
        },
        completePay: function(data, success, errorMsg) {
            $('#totalAmount').text(data.totalAmount);
            $('#payTotal').text(data.payAmount);
            $('#orderNo').text(data.orderSerialNo);
            $('#prodName').text(data.prodName);

            if (success) {
                $('#buyTime').text(data.paidAt.replace('T', ' '));
                $('#paySuccessAction').text('');

                var sStr =
                    '<span>尊敬的用户，您已成功支付，您可以点击</span>' +
                    '<button class="btn" id="tradeRecordBtn">我的体验金</button>' +
                    '<span>进行查看。</span>';
                $('#paySuccessAction').append(sStr);

                $('#tradeRecordBtn').bind('click', function() {
                    window.location.href = "/myCenter_experience";
                });
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
