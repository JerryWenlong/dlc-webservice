(function ($, window) {
    'use strict'
    var phoneNum = "";
    DLC.Activity170410 = DLC.derive(null, {
        create: function () {
            var app = new DLC.App();
            this.user = app.currentUser;
            this.account = app.account;
            this.product = app.product;
            this.init();
            this.initHotProduc();
            DLC.Util.initPage();
            window.app.initHeader(1);
        },
        init: function () {
            var that = this;
            var validator;
            var interval;
            var times = 60;
            that.getCaptcha(); //图形验证码
            $('#captchaImg').bind('click', function () {
                that.getCaptcha();
            });
            $("form :input").bind("copy cut paste", function (e) {
                return false;
            });
            $('input').placeholder({
                isUseSpan: true
            });
            $('.ac170410D3CD2D1A').click(function () {
                that.phoneNum = $("#getPhone").val();
                $("#phone").val(that.phoneNum);
                if (that.phoneNum == "") {
                    console.log("1");
                    $('#getErr').text("请输入手机号");
                } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(that.phoneNum)) {
                    console.log("2");
                    $('#getErr').text("请输入11位正确的手机号码");
                } else {
                    $('#getErr').text("");
                    that.signSuccess(1);
                }
            });
            //sms send
            $('#verifyCodeBtn').bind("click", function (e) {
                e.preventDefault();
                var captcha = $('#picVerifyCode').val();
                if (validator.element("#phone") && validator.element("#password") && validator.element("#picVerifyCode")) {
                    that.user.getCaptchaValidate(that.captchaToken, captcha, function () {
                        that.user.getOtpSignup($('#phone').val(), that.captchaToken, function (otp) {
                            that.hideError();
                            clearInterval(interval);
                            interval = setInterval(verifyClock, 1000);
                        }, function (errorCode, errorMsg) {
                            that.showError(errorMsg);
                        });
                    }, function (errorCode, errorMsg) {
                        that.showError(errorMsg);
                        that.getCaptcha();
                    });
                }
            });
            //signup
            $('#signupBtn2').bind("click", function (e) {
                e.preventDefault();
                that.hideError();
                if (validator.element("#phone") && validator.element("#password") && validator.element("#picVerifyCode") && validator.element("#verifyCode") && validator.element("#chkAgree")) {
                    $('#signupBtn2').attr("disabled", true);
                    that.phoneNum = $('#phone').val();
                    that.user.fastsignup($('#password').val(), $('#phone').val(), $('#verifyCode').val(), true, $('#picVerifyCode').val(), that.captchaToken, "", '', function (otp) {
                        //刷新头部
                        app.initHeader();
                        that.signSuccess(2);
                    }, function (errorCode, errorMsg) {
                        $('#signupBtn2').attr("disabled", false);
                        that.showInviteError(errorCode, errorMsg);
                    })
                }

            });
            //sms clock
            function verifyClock() {
                times--;
                if (0 < times) {
                    $('#verifyCodeBtn').css('color', "#39a6ff");
                    $('#verifyCodeBtn').text(times + " s");
                    $('#verifyCodeBtn').attr("disabled", true);
                } else {
                    $('#verifyCodeBtn').css('color', "#39a6ff");
                    $('#verifyCodeBtn').text("获取验证码");
                    $('#verifyCodeBtn').removeAttr("disabled");
                    clearInterval(interval);
                    times = 60;
                }
            }

            $(':text').focus(function () {
                $(this).css("border-color", "#39a6ff");
            });

            validator = $('#signupForm').validate({
                rules: {
                    phone: {
                        required: true,
                        phone: true
                    },
                    email: {
                        email: true
                    },
                    password: {
                        required: true,
                        password: true
                    },
                    picVerifyCode: {
                        required: true,
                        picVerifyCode: true
                    },
                    verifyCode: {
                        required: true,
                        verifyCode: true
                    },
                    chkAgree: {
                        chkAgree: true
                    },
                },
                messages: {
                    phone: {
                        required: "请输入手机号码"
                    },
                    email: {
                        email: "请输入正确的邮箱号码"
                    },
                    password: {
                        required: "请输入密码"
                    },
                    picVerifyCode: {
                        required: "请输入图片验证码"
                    },
                    verifyCode: {
                        required: "请输入验证码"
                    },
                    chkAgree: {
                        chkAgree: "请先阅读《点理财用户协议》"
                    },
                },
                success: function (element) {
                    var id = element[0]['id'];
                    var index = id.indexOf("-error");
                    var success_id = id.substring(0, index);
                    $("#" + success_id).css("border-color", "");
                    that.hideError();
                },
                errorPlacement: function (error, element) {
                    var id = element[0]['id'];
                    var error_html = error[0].innerHTML;
                    if ('' != error_html) {
                        that.showError(error_html);
                        $("#" + id).css("border-color", "#ff0045");
                    }
                },

            });
            $.validator.addMethod("phone", function (value, element) {
                return this.optional(element) || /^1[3|4|5|7|8][0-9]{9}$/.test(value);
            }, "请输入11位正确的手机号码");
            $.validator.addMethod("password", function (value, element) {
                return this.optional(element) || /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(value);
            }, "请输入8-16位数字和字母组合的密码");
            $.validator.addMethod("chkAgree", function (value, element) {
                return element.checked;
            }, "请先阅读《点理财用户协议》");
            $.validator.addMethod("picVerifyCode", function (value, element) {
                return this.optional(element) || /^[\u4e00-\u9fa5a-zA-Z0-9\-]{4}$/.test(value);
            }, "请输入正确的图形验证码");
            $.validator.addMethod("verifyCode", function (value, element) {
                return this.optional(element) || /^\d{6}$/.test(value);
            }, "请输入数字验证码");

        },
        //生成图片验证码
        getCaptcha: function () {
            var that = this;
            this.user.getCaptcha(function (url, token) {
                that.captchaToken = token;
                $('#captchaImg').removeAttr('src');
                $('#captchaImg').attr('src', url);
                $('#picVerifyCode').val('');
            }, function () {});
        },
        hideError: function () {
            $(".allErrors").addClass('hide');
        },
        showError: function (error) {
            $(".allErrors").removeClass('hide');
            $(".allErrorsSpan").html(error);
        },
        showInviteError: function (errorCode, errorMsg) {
            var html = "";
            if (errorCode == '610') {
                html = '../pages/inviteNotInvalid.html';
            } else if (errorCode == '609') {
                html = '../pages/inviteNotBind.html';
            } else if (errorCode == '608') {
                html = '../pages/inviteNotExist.html';
            }
            var that = this;
            if (html != '') {
                $('#adjust').load(html, function () {
                    $('#cancelBtn').click(function () {
                        that.hideError();
                        DLC.Util.hideAdjust('#adjust');
                        DLC.Util.hideOverlay();
                    });
                    $('#confirmBtn').click(function () {
                        that.user.fastsignup($('#password').val(), $('#phone').val(), $('#verifyCode').val(), true, $('#picVerifyCode').val(), that.captchaToken, '', '', function (otp) {
                            $(this).attr("disabled", true);
                            app.initHeader(); //刷新头部
                            window.location.href = '/signupSuccess';
                        }, function (errorCode, errorMsg) {
                            that.showInviteError(errorCode, errorMsg);
                        })
                    });
                    DLC.Util.showOverlay();
                    DLC.Util.showAdjust('#adjust');
                });
            } else {
                that.showError(errorMsg);
            }
        },
        //跳转
        signSuccess: function (num) {
            var that = this;
            this.account.getcouponToken(function (data) {
                //领取成功，跳首页
                that.account.couponTokenValidate(that.phoneNum, data.couponToken, function (data) {
                    $(".ac170410ProdTerm").html(data.prodTerm);
                    $(".ac170410MinInvestAmount").html(data.minInvestAmount);
                    $(".ac170410Time").html(data.validFrom.split("T")[0]+"至"+data.validThru.split("T")[0]);
                    DLC.Util.showOverlay();
                    DLC.Util.showAdjust(".showOkDiv");
                }, function (errorCode, errorMsg) {
                    $(".ac170410D3CD2Div1").hide();
                    $(".ac170410D3CD2Div2").show();
                });
            }, function (errorCode, errorMsg) {
                console.log(errorMsg);
            });
        },
        //热门推荐
        initHotProduc: function () {
            $(".showOkClose").click(function () {
                DLC.Util.hideOverlay();
                DLC.Util.hideAdjust(".showOkDiv");
            })
            var that = this;
            var param = {};
            param.periodMin = "89";
            param.page = 1;
            param.pageSize = 1;
            this.product.getProductList(param, function (dataList, paging) {
                if (dataList.length > 0) {
                    var productObj = dataList[0];
                    $('.exp_day2').text(productObj.prodPeriod);
                    $('.exp_money2').text(productObj.expectYearReturn);
                    $('.exp_count2').text(productObj.maxRaisedAmount);
                    $('.prodName').text(productObj.name);                    
                    if (productObj.invest1IncReturn > 0) {
                        $('.isJX').html('<div style="margin-top:-65px;margin-left:55px;font-size:12px;color:#fff;border-radius:3px;text-align: center;width:78px;background-color: #ff7800;height:20px;line-height: 20px;">已加息' + productObj.invest1IncReturn + '%</div>');
                    }
//                    $('.showOkDD2Span2').text(productObj.quotaProgress + '%');
                    $('.newIndexYXPBarS').css("width", productObj.quotaProgress + '%');
                    var showText = "立即投资";
                    switch (productObj.prodStatus) {
                    case "1":
                        $('.newIndexSMC5A2').removeClass("bgcd2");
                        $('.newIndexSMC5A2').attr("href", '/#/product/' + productObj.id);
                        break;
                    case "2":
                        showText = "已售罄";
                        break;
                    case "3":
                        showText = "还款中";
                        break;
                    case "4":
                        showText = "已流标";
                        break;
                    case "7":
                        showText = "已兑付";
                        break;
                    default:
                        showText = "停止";
                        break;
                    }
                    $('.newIndexSMC5ACss').text(showText);
                }
            }, function () {

            })
        }
    }, {});
})($, window);