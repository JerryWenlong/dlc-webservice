(function ($) {
    'use strict'
    DLC.UserBindBankCard = DLC.derive(DLC.DLC, {
        create: function () {
            this.User = app.currentUser;
            this.Account = app.account;
        },
        init: function () {
            DLC.Util.initPage();
            window.app.initHeader(4);
            var that = this;
            $('input').placeholder({
                isUseSpan: true,
                placeholderColor: '#d2d2d2'
            });
            //先读取数据，如果有数据，直接显示
            that.Account.getBizAccountInfo(function () {
                var data = that.Account.accountInfo;
                var isNoSm = true;
                var isNoBd = true;
                if (data.name != '') {
                    isNoSm = false;
                    $(".isSm").show();
                    $("#realNameShow").html(data.name);
                    $("#cardNumShow").html(data.idNo);
                } else {
                    $(".isNoSm").show();
                }
                if (data.cards[0] != null) {
                    isNoBd = false;
                    $(".isBd").show();
                    $("#bankNameShow").html(data.cards[0].bankName);
                    $("#bankNumShow").html(data.cards[0].cardNo);
                    $("#bankPhoneShow").html(data.cards[0].cellphone);
                } else {
                    $(".isNoBd").show();
                }
                if (isNoBd) {
                    $('#realName').focus(function () {
                        $(this).css("border-color", "#398be1");
                        if ($("#realNameShowErr").html().indexOf("提示") == -1) {
                            $("#realNameShowErr").html('');
                        }
                    }).blur(function () {
                        $(this).css("border-color", "");
                    });
                    $('#cardNum').focus(function () {
                        $(this).css("border-color", "#398be1");
                        if ($("#cardNumShowErr").html().indexOf("提示") == -1) {
                            $("#cardNumShowErr").html('');
                        }
                    }).blur(function () {
                        $(this).css("border-color", "");
                    });
                    $('#bankNum').focus(function () {
                        $(this).css("border-color", "#398be1");
                        $("#bankNumShowErr").html('');
                    }).blur(function () {
                        $(this).css("border-color", "");
                    });
                    $('#bankPhone').focus(function () {
                        $(this).css("border-color", "#398be1");
                        $("#bankPhoneShowErr").html('');
                    }).blur(function () {
                        $(this).css("border-color", "");
                    }).keyup(function () {
                        var bankPhoneRule = /^1[3|4|5|7|8][0-9]{9}$/; //手机号码验证规则
                        if (bankPhoneRule.test($(this).val())) {
                            if ($("#captchaBtn").val() == '获取验证码') {
                                $("#captchaBtn").removeAttr("disabled");
                            }
                            $("#captchaBtn").removeClass("col8d");
                            $("#captchaBtn").addClass("col398be1");
                        } else {
                            $("#captchaBtn").attr("disabled", "true");
                            $("#captchaBtn").addClass("col8d");
                            $("#captchaBtn").removeClass("col398be1");
                        }
                    });
                    $('#captcha').focus(function () {
                        $(this).css("border-color", "#398be1");
                        $("#captchaShowErr").html('');
                    }).blur(function () {
                        $(this).css("border-color", "");
                    });

                    //初始化银行卡列表
                    that.inintBankList();
                    //选择银行卡
                    var showBankListFun = function () {
                        $("#bankName").css("border-color", "");
                        $("#bankNameShowErr").html('');
                        if ($("#bankList").css("display") == 'none') {
                            $("#bankList").show(500);
                        } else {
                            $("#bankList").hide(500);
                        }
                    };
                    $("#bankName").click(showBankListFun);
                    $("#bankNameBtn").click(showBankListFun);
                    //发送验证码按钮
                    $("#captchaBtn").click(function () {
                        var isOk = true;
                        if (isNoSm) {
                            var realName = $('#realName').val();
                            var cardNum = $('#cardNum').val();
                            //判断实名认证
                            if (!that.validateRealNameAndCard(realName, cardNum)) {
                                isOk = false;
                            }
                        }
                        var bankName = $('#bankName').val();
                        var bankNum = $('#bankNum').val();
                        //判断银行卡号
                        if (!that.validateBankNum(bankName, bankNum)) {
                            isOk = false;
                        }
                        var bankPhone = $('#bankPhone').val();
                        //判断银行预留手机号
                        if (!that.validateBankPhone(bankPhone)) {
                            isOk = false;
                        }
                        if (!isOk) {
                            return;
                        }
                        $("#captchaShowErr").html('');
                        $(this).attr("disabled", "true");
                        that.Account.bindCardOtp(bankPhone, function (data) {
                            var count = 60;
                            $("#capSuccShow").show();
                            $("#capSuccShow").html("温馨提示：验证码已发送至"+bankPhone+"，请注意接收，如需帮助请联系客服：400-820-2450。");
                            $("#captchaShowErr").hide();
                            $("#captchaBtn").val(count + ' s');
                            count--;
                            var countdown = setInterval(function () {
                                if ($("#captchaBtn").val() == '获取验证码') {
                                    clearInterval(countdown);
                                    return;
                                }
                                $("#captchaBtn").val(count + ' s');
                                if (count == 0) {
                                    $("#captchaBtn").val('获取验证码');
                                    var bankPhoneRule = /^1[3|4|5|7|8][0-9]{9}$/; //手机号码验证规则
                                    if (bankPhoneRule.test($("#bankPhone").val())) {
                                        $("#captchaBtn").removeAttr("disabled");
                                    }
                                    clearInterval(countdown);
                                }
                                count--;
                            }, 1000);
                        }, function (errorCode, errorMsg) {
                            $("#captchaShowErr").html(errorMsg);
                            $(this).removeAttr("disabled");
                        });
                    });

                    $(".showUbbcRule").mousemove(function () {
                        $('#urRuleShow').show();
                    }).mouseout(function () {
                        $('#urRuleShow').hide();
                    });

                    //立即绑定按钮事件
                    $("#editBotton").click(function () {
                        var realName = "";
                        var cardNum = "";
                        var isOk = true;
                        if (isNoSm) {
                            realName = $('#realName').val();
                            cardNum = $('#cardNum').val();
                            //判断实名认证
                            if (!that.validateRealNameAndCard(realName, cardNum)) {
                                isOk = false;
                            }
                        }
                        var bankName = $('#bankName').val();
                        var bankNum = $('#bankNum').val();
                        var bankId = $('#bankId').val();
                        //判断银行卡号
                        if (!that.validateBankNum(bankName, bankNum)) {
                            isOk = false;
                        }
                        var bankPhone = $('#bankPhone').val();
                        //判断银行预留手机号
                        if (!that.validateBankPhone(bankPhone)) {
                            isOk = false;
                        }

                        var captcha = $('#captcha').val();
                        //判断验证码
                        if (!that.validateCaptcha(captcha)) {
                            isOk = false;
                        }
                        if (!isOk) {
                            return;
                        }
                        var data = {
                            holderName: realName,
                            idNo: cardNum,
                            cardNo: bankNum,
                            bankNo: bankId,
                            cellphone: bankPhone,
                            smsCode: captcha,
                            acceptTos: true
                        };
                        $(this).attr("disabled", "true");
                        that.Account.bindAccountCard(data, function (responseData) {
                            that.goToComePage();
                        }, function (errorCode, errorMsg) {
                            $("#editBotton").removeAttr("disabled");
                            $("#capSuccShow").hide();
                            $("#captchaShowErr").show();
                            $("#captchaShowErr").html(errorMsg);
                        });
                    });
                }
            }, function (errorCode, errorMsg) {

            });
        },
        //验证用户真实姓名和身份证
        validateRealNameAndCard: function (realName, cardNum) {
            var isOk = true;
            if (realName.trim() == "" || realName == null) {
                $("#realNameShowErr").html("请输入您的姓名");
                $("#realName").css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#realNameShowErr").html('<span class="promptColor">提示：此姓名将作为实名认证信息</span>');
            }
            if (cardNum.trim() == "" || cardNum == null) {
                $("#cardNumShowErr").html("请输入身份证号码");
                $("#cardNum").css("border-color", "#ff0045");
                isOk = false;
            } else if (!this.validateIdCard(cardNum)) {
                $("#cardNumShowErr").html("请输入18位正确的身份证号");
                $("#cardNum").css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#cardNumShowErr").html('<span class="promptColor">提示：此身份证号将作为实名认证信息</span>');
            }
            return isOk;
        },
        //验证银行预留手机号
        validateBankPhone: function (bankPhone) {
            var bankPhoneRule = /^1[3|4|5|7|8][0-9]{9}$/; //手机号码验证规则
            if (bankPhone.trim() == "" || bankPhone == null) {
                $("#bankPhoneShowErr").html("请输入银行预留手机号");
                $("#bankPhone").css("border-color", "#ff0045");
                return false;
            } else if (!bankPhoneRule.test(bankPhone)) {
                $("#bankPhoneShowErr").html("请输入11位正确的手机号码");
                $("#bankPhone").css("border-color", "#ff0045");
                return false;
            } else {
                $("#bankPhoneShowErr").html('');
            }
            return true;
        },
        //验证银行卡号
        validateBankNum: function (bankName, bankNum) {
            var bankNumRule = /^\d{16}|\d{19}|\d{17}|\d{18}$/; //银行卡号验证规则
            var isOk = true;
            if (bankName.trim() == "" || bankName == null) {
                $("#bankNameShowErr").html("请选择银行");
                $("#bankName").css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#bankNameShowErr").html('');
            }
            if (bankNum.trim() == "" || bankNum == null) {
                $("#bankNumShowErr").html("请输入银行卡号");
                $("#bankNum").css("border-color", "#ff0045");
                isOk = false;
            } else if (!bankNumRule.test(bankNum)) {
                $("#bankNumShowErr").html("请输入16-19位数字正确的银行卡号");
                $("#bankNum").css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#bankNumShowErr").html('');
            }
            return isOk;
        },
        //验证验证码
        validateCaptcha: function (captcha) {
            var captchaRule = /^\d{6}$/; //验证码验证规则
            $("#capSuccShow").hide();
            $("#captchaShowErr").show();
            if (captcha.trim() == "" || captcha == null) {
                $("#captchaShowErr").html("请输入验证码");
                $("#captcha").css("border-color", "#ff0045");
                return false;
            } else if (!captchaRule.test(captcha)) {
                $("#captchaShowErr").html("请输入6位数字的验证码");
                $("#captcha").css("border-color", "#ff0045");
                return false;
            } else {
                $("#captchaShowErr").html('');
            }
            return true;
        },
        //验证身份证
        validateIdCard: function (idCard) {
            //15位和18位身份证号码的正则表达式
            var regIdCard = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$/;
            //如果通过该验证，说明身份证格式正确，但准确性还需计算
            if (regIdCard.test(idCard)) {
                //判断前2位合法性
                var aCity = {
                    11: "北京",
                    12: "天津",
                    13: "河北",
                    14: "山西",
                    15: "内蒙古",
                    21: "辽宁",
                    22: "吉林",
                    23: "黑龙江 ",
                    31: "上海",
                    32: "江苏",
                    33: "浙江",
                    34: "安徽",
                    35: "福建",
                    36: "江西",
                    37: "山东",
                    41: "河南",
                    42: "湖北 ",
                    43: "湖南",
                    44: "广东",
                    45: "广西",
                    46: "海南",
                    50: "重庆",
                    51: "四川",
                    52: "贵州",
                    53: "云南",
                    54: "西藏 ",
                    61: "陕西",
                    62: "甘肃",
                    63: "青海",
                    64: "宁夏",
                    65: "新疆",
                    71: "台湾",
                    81: "香港",
                    82: "澳门",
                    91: "国外"
                };
                if (aCity[parseInt(idCard.substr(0, 2))] == null) return false;

                var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
                var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
                for (var i = 0; i < 17; i++) {
                    idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
                }
                var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
                var idCardLast = idCard.substring(17); //得到最后一位身份证号码
                //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                if (idCardMod == 2) {
                    if (idCardLast == "X" || idCardLast == "x") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                    if (idCardLast == idCardY[idCardMod]) {
                        return true;
                    } else {
                        return false;
                    }
                }

            } else {
                return false;
            }
        },
        //初始化银行列表
        inintBankList: function () {
            this.Account.getAllBanks(function (list) {
                if (list != null) {
                    var listLen = list.length;
                    var i = 1;
                    var listStr = "";
                    var isBgc = false;
                    var bgc = "";
                    for (var key in list) {
                        if (isBgc) {
                            bgc = "bgcf9";
                            isBgc = false;
                        } else {
                            bgc = "";
                            isBgc = true;
                        }
                        if (i == listLen) {
                            listStr += "<div class='last ucUBBCBankOne " + bgc + "' tag='" + list[key].bankNo + "'>" + list[key].bankName + "</div>";
                            break;
                        } else {
                            i++;
                            listStr += "<div class='ucUBBCBankOne " + bgc + "' tag='" + list[key].bankNo + "'>" + list[key].bankName + "</div>";
                        }
                    }
                    $("#bankList").html(listStr);
                    $(".ucUBBCBankOne").hover(
                        function () {
                            $(this).css("background-color", "#d2d2d2");
                        },
                        function () {
                            $(this).css("background-color", "");
                        });
                    $(".ucUBBCBankOne").click(function () {
                        $("#bankId").val($(this).attr("tag"));
                        $("#bankName").val($(this).html());
                        $("#bankList").hide(500);
                    });
                }
            }, function (errorCode, errorMsg) {});
        },
        goToComePage: function () {
            if (app.route.oldHash == 'userRefer') {
                window.location.href = '/myCenter_userRefer';
            } else {
                window.location.href = '/myCenter_deposit';//account
            }
        }
    }, {})
})($)
