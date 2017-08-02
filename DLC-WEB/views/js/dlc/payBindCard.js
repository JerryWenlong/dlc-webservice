(function() {
    'use strict'
    DLC.PayBindCard = DLC.derive(null, {
        create: function(orderNo) {
            DLC.Util.initPage();
            window.app.initHeader(2);
            clearInterval(app.payUnbindOtpTimer);
            $('input[type="text"]').placeholder({
                isUseSpan: false,
                placeholderColor: '#8d8d8d'
            });
            this.orderNo = orderNo;
            this.user = app.currentUser;
            this.account = app.account;
            this.trade = app.trade;
            this.initPage();
            this.inintBankList();
        },
        initPage: function() {
            var that = this;
            this.initBindCard();
            $('#payBtn').bind('click', function() {
                //TODO validate
                that.validateInput(true);
                if (that.validateError) {
                    //
                } else {
                    that.account.getBindCardOtpValidate($('#phoneNo').val(), $('#otpNo').val(), function(response) {
                        $('#otpNo').removeClass('errorInput');
                        $('#otpNoError').text('');
                        $('#otpNoError').hide();
                        that.bindCard();
                    }, function(errorCode, errorMsg) {
                        $('#otpNo').addClass('errorInput');
                        $('#otpNoError').text(errorMsg);
                        $('#otpNoError').show();
                        return false;
                    });
                }
            });
        },

        initBindCard: function() {
            var that = this;
            //bankName
            $('#bankName').bind('click', function() {
                if ($("#bankList").css("display") == 'none') {
                    $("#bankList").fadeIn(200);
                } else {
                    $("#bankList").fadeOut(200);
                }
            });
            //otp
            $('#otpBtn').bind('click', function() {
                //otp send
                var checkPhone = that.checkPhoneNo(true);
                if (!checkPhone[0]) {
                    return;
                }
                var time = 60;

                function timeCountDown() {
                    if (time == 0) {
                        clearInterval(app.payUnbindOtpTimer);
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
                app.payUnbindOtpTimer = setInterval(timeCountDown, 1000);
                var phoneNo = $('#phoneNo').val();
                that.account.bindCardOtp(phoneNo, function(responseData) {

                }, function(errorCode, errorMsg) {

                })
            });

            $('#bankId').bind('blur', function() {
                that.validateInput(false, 1)
            });
            $('#bankName').bind('focus', function() {
                that.validateInput(false, 1)
            });
            $('#cardNo').bind('blur', function() {
                that.validateInput(false, 2)
            });
            $('#holderName').bind('blur', function() {
                that.validateInput(false, 3)
            });
            $('#idNo').bind('blur', function() {
                that.validateInput(false, 4)
            });
            $('#phoneNo').bind('blur', function() {
                that.validateInput(false, 5)
            });
            $('#otpNo').bind('blur', function() {
                that.validateInput(false, 6)
            });
        },
        checkPhoneNo: function(checkNull) {
            var cellphone = $('#phoneNo').val();
            if (!checkNull && cellphone == "") {
                $('#phoneNo').removeClass('errorInput');
                $('#otpBtn').removeClass('action');
                $('#phoneNoError').hide();
                return [true, ""]
            }
            if (!DLC.Util.testBankPhone(cellphone)) {
                $('#otpBtn').removeClass('action');
                $('#phoneNo').addClass('errorInput');
                $('#phoneNoError').text('请输入正确的银行预留手机号');
                $('#phoneNoError').show();
                return [false, '请输入正确的银行预留手机号']
            } else {
                $('#phoneNo').removeClass('errorInput');
                $('#phoneNoError').hide();
                $('#phoneNoError').text('');
                $('#otpBtn').addClass('action');
                return [true, ""];
            }
        },

        checkIdNo: function(checkNull) {
            var idNo = $('#idNo').val();
            if (!checkNull && idNo == "") {
                $('#idNo').removeClass('errorInput');
                $('#idNoError').hide();
                $('#tips2').show();
                return [true, ""]
            }
            if (!DLC.Util.validateIdCard(idNo) && "readonly" != $('#idNo').attr("readonly")) {
                $('#idNo').addClass('errorInput');
                $('#tips2').hide();
                $('#idNoError').text('请输入正确的身份证号');
                $('#idNoError').show();
                return [false, '请输入正确的身份证号']
            } else {
                $('#idNo').removeClass('errorInput');
                $('#idNoError').hide();
                $('#tips2').show();
                return [true, ""]
            }
        },

        checkBankNo: function(checkNull) {
            var bankNo = $('#bankId').val();
            if (!checkNull && bankNo == "") {
                $('#bankId').removeClass('errorInput');
                $('#bankIdError').hide();
                $('#tips1').show();
                return [true, ""]
            }
            if (bankNo == "") {
                $('#bankId').addClass('errorInput');
                $('#tips1').hide(); // hide the tips show error
                $('#bankIdError').text('请选择发卡行');
                $('#bankIdError').show();
                return [false, '请选择发卡行']
            } else {
                $('#bankId').removeClass('errorInput');
                $('#bankIdError').hide();
                $('#tips1').show();
                return [true, ""]
            }
        },

        checkBankCardNo: function(checkNull) {
            var bankCardNo = $('#cardNo').val();
            var bankNo = $('#bankId').val();
            if (!checkNull && bankCardNo == "") {
                $('#cardNo').removeClass('errorInput');
                $('#cardNoError').hide();
                return [true, ""]
            }
            if (!DLC.Util.validateBankNum(bankNo, bankCardNo)) {
                $('#cardNo').addClass('errorInput');
                $('#cardNoError').text('请输入正确的银行卡号');
                $('#cardNoError').show();
                return [false, "请输入正确的银行卡号"]
            } else {
                $('#cardNo').removeClass('errorInput');
                $('#cardNoError').hide();
                return [true, ""]
            }
        },
        checkHolderName: function(checkNull) {
            var holderName = $('#holderName').val();
            if (!checkNull && holderName == "") {
                $('#holderName').removeClass('errorInput');
                $('#holderNameError').hide();
                return [true, ""]
            }
            if (!DLC.Util.testUserName(holderName) && "readonly" != $('#holderName').attr("readonly")) {
                $('#holderName').addClass('errorInput');
                $('#holderNameError').text('请输入正确的姓名');
                $('#holderNameError').show();
                return [false, '请输入正确的姓名']
            } else {
                $('#holderName').removeClass('errorInput');
                $('#holderNameError').hide();
                return [true, ""]
            }
        },

        checkOtpCode: function(checkNull) {
            var otpNo = $('#otpNo').val();
            if (!checkNull && otpNo == "") {
                $('#otpNo').removeClass('errorInput');
                $('#otpNoError').hide();
                return [true, ""]
            }
            if (!DLC.Util.testOtpCode(otpNo)) {
                $('#otpNo').addClass('errorInput');
                $('#otpNoError').text('请输入正确的验证码');
                $('#otpNoError').show();
                return [false, '请输入正确的验证码']
            } else {
                $('#otpNo').removeClass('errorInput');
                $('#otpNoError').hide();
                return [true, ""];
            }
        },

        checkList: function() {
            var r1 = this.checkBankNo;
            var r2 = this.checkBankCardNo;
            var r3 = this.checkHolderName;
            var r4 = this.checkIdNo;
            var r5 = this.checkPhoneNo;
            var r6 = this.checkOtpCode;
            var results = [r1, r2, r3, r4, r5, r6];
            return results;
        },
        validateInput: function(checkNull, checkIndex) {
            var results = this.checkList();
            if (checkIndex != null) {
                var i = checkIndex - 1;
                var result = results[i].call(this, checkNull);
            } else {
                var msg = "";
                this.validateError = false;
                for (var i = 0; i < results.length; i++) {
                    var result = results[i].call(this, checkNull);
                    if (!result[0]) {
                        this.validateError = true;
                    }
                }
            }
        },

        bindCard: function() {
            var that = this;
            var bankNo = $('#bankId').val();
            var cardNo = $('#cardNo').val();
            var holderName = $('#holderName').val();
            var idNo = $('#idNo').val();
            var cellphone = $('#phoneNo').val();
            var smsCode = $('#otpNo').val();

            //bind card api
            var data = {
                cardNo: cardNo,
                bankNo: bankNo,
                cellphone: cellphone,
                smsCode: smsCode,
                acceptTos: true
            };
            "readonly" != $('#holderName').attr("readonly") ? data['holderName'] = holderName : '';
            "readonly" != $('#idNo').attr("readonly") ? data['idNo'] = idNo : '';

            this.account.bindAccountCard(data, function(responseData) {
                window.location.href = "/pay_" + that.orderNo;
            }, function(errorCode, errorMsg) {
                if (app.payUnbindOtpTimer) {
                    clearInterval(app.payUnbindOtpTimer);
                    $('#otpBtn').removeAttr("disabled");
                    $('#otpBtn').text("获取验证码");
                    $("#otpNo").val('');
                }
                $("#payBtn").removeAttr("disabled");
                $("#showErr").show();
                $("#showErr").html(errorMsg);
                DLC.Util.hideAdjust('#adjust');
                DLC.Util.hideOverlay();
            });
        },

        //初始化银行列表
        inintBankList: function() {
            this.account.getAllBanks(function(list) {
                if (list != null) {
                    var listLen = list.length;
                    var i = 1;
                    var listStr = "";
                    for (var key in list) {
                        if (i == listLen) {
                            listStr += "<div class='last ucUBBCBankOne' tag='" + list[key].bankNo + "'>" + list[key].bankName + "</div>";
                            break;
                        } else {
                            i++;
                            listStr += "<div class='ucUBBCBankOne' tag='" + list[key].bankNo + "'>" + list[key].bankName + "</div>";
                        }
                    }
                    $("#bankList").html(listStr);
                    $(".ucUBBCBankOne").mousemove(function() {
                        $(this).addClass("bgc");
                    });
                    $(".ucUBBCBankOne").mouseout(function() {
                        $(this).removeClass("bgc");
                    });
                    $(".ucUBBCBankOne").click(function() {
                        $("#bankId").val($(this).attr("tag"));
                        $("#bankName").val($(this).html());
                        $("#bankList").fadeOut(200);
                    });
                }
            }, function(errorCode, errorMsg) {});
        },

    }, {})
})($)
