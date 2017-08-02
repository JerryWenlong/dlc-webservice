(function ($) {
    'use strict';
    var that = null;
    DLC.Activity161129 = DLC.derive(DLC.DLC, {
        create: function () {
            DLC.Util.initPage();
            this.User = app.currentUser;
            this.account = app.account;
            this.actId = "1816497439";
            that = this;
            this.init();
            window.app.initHeader(1);
        },
        init: function () {
            $('.a161129DA').mousemove(function () {
                $(this).addClass("a161129DAH");
            }).mouseout(function () {
                $(this).removeClass("a161129DAH");
            });
            $(".a161129DAShowRule").click(function () {
                DLC.Util.showOverlay();
                DLC.Util.showAdjustTwoId(".a161129ShowRule", ".a161129SRImg", 1175);
            });
            $(".a161129ShowRuleClose").click(function () {
                DLC.Util.hideOverlay();
                DLC.Util.hideAdjust(".a161129ShowRule");
            });
            //判断是否登录
            if (that.User.hasLogin == true) {
                $(".a161129LPan").hide();
                $(".a161129MyPan").show();
                //获取个人抽奖记录
                that.account.getAccountPrizes(that.actId, "", 1, 1000, function (list, pading) {
                    if (list.length > 0) {
                        var newList = new Array();
                        for (var i = 0; i < list.length; i++) {
                            var phaseId = list[i].phaseId;
                            if (typeof (newList[phaseId]) == "undefined" || newList[phaseId] == null) {
                                newList[phaseId] = new Array();
                                newList[phaseId][0] = phaseId;
                                newList[phaseId][1] = "";
                                newList[phaseId][2] = "";
                                newList[phaseId][3] = new Array();
                            }
                            if (newList[phaseId][1] != "") {
                                newList[phaseId][1] += "，";
                            }
                            newList[phaseId][1] += list[i].prizeName;
                            if (list[i].prizeStatus == 1) {
                                if (newList[phaseId][2] != "" && newList[phaseId][3][list[i].prizeLevel] == null) {
                                    newList[phaseId][2] += "，";
                                    newList[phaseId][3][list[i].prizeLevel] = 1;
                                } else if (newList[phaseId][3][list[i].prizeLevel] == null) {
                                    newList[phaseId][3][list[i].prizeLevel] = 1;
                                } else if (newList[phaseId][3][list[i].prizeLevel] == 1) {
                                    continue;
                                }
                                if (list[i].prizeLevel == "1") {
                                    newList[phaseId][2] += "一等奖";
                                } else if (list[i].prizeLevel == "2") {
                                    newList[phaseId][2] += "二等奖";
                                } else if (list[i].prizeLevel == "3") {
                                    newList[phaseId][2] += "三等奖";
                                } else {
                                    newList[phaseId][2] += "参与奖";
                                }
                            } else {
                                newList[phaseId][2] = "暂未开奖";
                            }
                        }
                        newList.reverse();
                        var html = "";
                        for (var i in newList) {
                            if (i == 'find' || i == 'forEach') {
                                break;
                            }
                            html += "<span>第" + newList[i][0] + "期</span><span class='a161129Info red'>" + newList[i][1] + "</span><span class='a161129Info'>" + newList[i][2] + "</span>";
                        }
                        $(".a161129MLContent").html(html);
                        $(".a161129Info").mousemove(function () {
                            var html = $(this).html();
                            var css = {
                                width: "200px",
                                height: "100px",
                                position: "absolute",
                                backgroundColor: "#ffffff",
                                padding: "20px",
                                textAlign: "center",
                                border: "1px solid #888888",
                                lineHeight: "30px",
                            };
                            if ($(this).hasClass("red")) {
                                css.color = "red";
                            } else {
                                css.color = "#888888";
                            }
                            that.showText(this, ".a161129ShowText", css, html);
                        }).mouseout(function () {
                            $(".a161129ShowText").hide();
                        });
                    }
                }, function () {});
            } else {
                DLC.Util.initPage();
                $('input').placeholder({
                    isUseSpan: true
                });
                that.getCaptcha();
                $('#userName').focus(function () {
                    $(this).css("border-color", "#398be1");
                }).blur(function () {
                    $(this).css("border-color", "");
                    that.userNameFun($(this).val());
                });
                $('#loginPassword').focus(function () {
                    $(this).css("border-color", "#398be1");
                }).blur(function () {
                    $(this).css("border-color", "");
                    that.passwordFun($(this).val());
                });
                $('#captcha').focus(function () {
                    $(this).css("border-color", "#398be1");
                }).blur(function () {
                    $(this).css("border-color", "");
                    that.captchaFun($(this).val());
                });
                $('#captchaImg').click(function () {
                    that.getCaptcha();
                    $('#captcha').val("");
                });
                $('#loginBtn').mousemove(function () {
                    $(this).addClass("a161129LButtonH");
                }).mouseout(function () {
                    $(this).removeClass("a161129LButtonH");
                }).bind("click", function () {
                    var userName = $('#userName').val();
                    var password = $('#loginPassword').val();
                    var captcha = $('#captcha').val();
                    var isOk = true;
                    if (!that.userNameFun(userName)) {
                        isOk = false;
                    }
                    if (!isOk) {
                        return;
                    }
                    if (!that.passwordFun(password)) {
                        isOk = false;
                    }
                    if (!isOk) {
                        return;
                    }
                    if (!that.captchaFun(captcha)) {
                        isOk = false;
                    }
                    if (!isOk) {
                        return;
                    }
                    $('#loginBtn').attr("disabled", "true");
                    $('#loginBtn').val("登 录 中 . . .");
                    that.User.login(userName, password, captcha, that.captchaToken, function () {
                        //刷新头部
                        app.initHeader();
                        //跳转至来源页
                        that.goToComePage();
                    }, function (errorMsg) {
                        that.getCaptcha();
                        $('#captcha').val("");
                        if (!(errorMsg == '验证码出错' || errorMsg == '验证码过期')) {
                            $('#loginPassword').val("");
                        }
                        $("#loginShowError").html(errorMsg);
                        $("#loginShowError").show();
                        $('#loginBtn').removeAttr("disabled");
                        $('#loginBtn').val("登 录");
                    });
                });
            }
            $("body").keydown(function () {
                if (event.keyCode == "13") { //keyCode=13是回车键
                    $('#loginBtn').click();
                }
            });
            that.account.getAccountsPrizesStats(that.actId, 1, 1, function (list, pading) {
                if (list.length > 0) {
                    var prizeStatus = list[0].prizeStatus;
                    var phaseId = list[0].phaseId;
                    if (prizeStatus === 0) {
                        $(".a161129Div3").html("第" + phaseId + "期 进行中...");
                    } else {
                        $(".a161129Div3").html("第" + phaseId + "期 已开奖");
                    }
                    that.account.getAccountsPrizesJourByPhaseId(that.actId, phaseId, prizeStatus, 1, 20, function (lists, pading) {
                        var html = "";
                        var sumCount = 0;
                        if (lists.length > 0) {
                            if (prizeStatus == 1) {
                                for (var i = 0; i < lists.length; i++) {
                                    var prizeLevelText = "参与奖";
                                    if (lists[i].prizeLevel == "1") {
                                        prizeLevelText = "一等奖";
                                    } else if (lists[i].prizeLevel == "2") {
                                        prizeLevelText = "二等奖";
                                    } else if (lists[i].prizeLevel == "3") {
                                        prizeLevelText = "三等奖";
                                    }
                                    html += lists[i].cellphone + ' 购买' + lists[i].entrustAmount + ' 元 <a href="/product_' + lists[i].prodCodeId + '" target="_blank" style="text-decoration:underline;">' + lists[i].prodName + '</a> 获得幸运号码：' + lists[i].prizeName + '  <span class="a161129D4Span">' + prizeLevelText + '</span>';
                                    if (i < (lists.length - 1)) {
                                        html += '<br>';
                                    }
                                }
                                var pondTitle = lists[0].pondTitle;
                                $(".a161129Div4Head").html(pondTitle.split(",")[1]);
                            } else {
                                for (var i = 0; i < lists.length; i++) {
                                    sumCount += parseInt(lists[i].prizeName);
                                    html += lists[i].cellphone + ' 购买' + lists[i].entrustAmount + ' 元 <a href="/product_' + lists[i].prodCodeId + '" target="_blank" style="text-decoration:underline;">' + lists[i].prodName + '</a> 获得了 ' + lists[i].prizeName + ' 个幸运号 <span class="a161129D4Span">' + lists[i].createdAt.substring(0, 16).replace("T", " ") + '</span>';
                                    if (i < (lists.length - 1)) {
                                        html += '<br>';
                                    }
                                }
                            }
                        }
                        $(".a161129Div4").html(html);
                        if (prizeStatus === 0) {
                            $(".a161129Div4Head").html(sumCount + "/20");
                        }
                    }, function () {});
                } else {

                }

            }, function () {});
        },
        userNameFun: function (userName) {
            var userNameRule = /^1[3|4|5|7|8][0-9][A-Za-z0-9]{4}[0-9]{4}$/; //手机号码验证规则
            var isOk = true;
            if (userName.trim() == "" || userName == null) {
                $("#loginShowError").html("请输入用户名/手机号");
                $('#userName').css("border-color", "#ff0045");
                isOk = false;
            } else if (!userNameRule.test(userName)) {
                $("#loginShowError").html("请输入11位正确的手机号码");
                $('#userName').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#loginShowError").html('');
            }
            if (!isOk) {
                $("#loginShowError").show();
            } else {
                $("#loginShowError").hide();
            }
            return isOk;
        },
        passwordFun: function (password) {
            var passwordRule = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/; //密码验证规则
            var isOk = true;
            if (password.trim() == "" || password == null) {
                $("#loginShowError").html("请输入密码");
                $('#loginPassword').css("border-color", "#ff0045");
                isOk = false;
            } else if (!passwordRule.test(password)) {
                $("#loginShowError").html("请输入8-16位数字和字母组合的密码");
                $('#loginPassword').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#loginShowError").html('');
            }
            if (!isOk) {
                $("#loginShowError").show();
            } else {
                $("#loginShowError").hide();
            }
            return isOk;
        },
        captchaFun: function (captcha) {
            var captchaRule = /^.{4}$/; //验证码规则
            var isOk = true;
            if (captcha.trim() == "" || captcha == null) {
                $("#loginShowError").html("请输入图片验证码");
                $('#captcha').css("border-color", "#ff0045");
                isOk = false;
            } else if (!captchaRule.test(captcha)) {
                $("#loginShowError").html("请输入4位验证码");
                $('#captcha').css("border-color", "#ff0045");
                isOk = false;
            } else {
                $("#loginShowError").html('');
            }
            if (!isOk) {
                $("#loginShowError").show();
            } else {
                $("#loginShowError").hide();
            }
            return isOk;
        },
        goToComePage: function () {
            //获取来源页面
            window.location.reload();
        },
        //生成图片验证码
        getCaptcha: function () {
            this.User.getCaptcha(function (url, token) {
                that.captchaToken = token;
                $('#captchaImg').removeAttr('src');
                $('#captchaImg').attr('src', url);
            }, function () {})
        },
        showText: function (moveName, showName, css, text) {
            var write = $(moveName);
            var X = write.offset().top;
            var Y = write.offset().left;
            var H = write.outerHeight();
            var W = write.outerWidth();
            var top = X + H + 3;
            var left = Y;
            css.top = top;
            css.left = left;
            $(showName).css(css);
            $(showName).html(text);
            $(showName).show();
        }
    }, {})
})($)
