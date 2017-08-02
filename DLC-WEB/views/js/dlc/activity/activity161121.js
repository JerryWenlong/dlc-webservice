(function ($) {
    'use strict';
    var that = null;
    DLC.Activity161121 = DLC.derive(DLC.DLC, {
        create: function () {
            DLC.Util.initPage();
            this.user = app.currentUser;
            this.account = app.account;
            this.points = 0;
            this.actId = "1904745907";
            this.startNum = 0;
            this.isDo = false;
            that = this;
            this.init();
            window.app.initHeader(1);
        },
        init: function () {
            $(".a161121CLDiv" + this.startNum).addClass("a161121CLDiv" + this.startNum + "H");
            this.showSumList();
            //判断是否登录
            if (that.user.hasLogin == true) {
                $(".a161121CRD2Login").hide();
                $(".a161121CRLLogin").hide();
                this.showMyList();
                this.showWitchButton();
                $(".a161121CRDSRule").mousemove(function () {
                    $(".a161121CRDSRShow").show();
                }).mouseout(function () {
                    $(".a161121CRDSRShow").hide();
                });
                $(".a161121CRDSpan").show();

                $(".a161121CLDLButton").mousemove(function () {
                    $(this).addClass("a161121CLDLButtonBgH");
                }).mouseout(function () {
                    $(this).removeClass("a161121CLDLButtonBgH");
                }).click(function () {
                    $(this).attr("disabled", "true");
                    that.lotteryDraw();
                });
                $(".doRaffle").mousemove(function () {
                    $(this).addClass("bgColor8b57ef");
                }).mouseout(function () {
                    $(this).removeClass("bgColor8b57ef");
                }).click(function () {
                    DLC.Util.hideOverlay();
                    DLC.Util.hideAdjust(".getPrize");
                    $(".a161121CLDLButton").attr("disabled", "true");
                    that.lotteryDraw();
                });
                $(".showHowGetPoints").click(function () {
                    $(".getPrize").hide();
                    DLC.Util.showOverlay();
                    DLC.Util.showAdjust(".howGetPoints");
                });
                $("#aHGPClose").click(function () {
                    DLC.Util.hideOverlay();
                    DLC.Util.hideAdjust(".howGetPoints");
                });
                $("#aGPClose").click(function () {
                    DLC.Util.hideOverlay();
                    DLC.Util.hideAdjust(".getPrize");
                });
            } else {
                $(".a161121CRD2LButton").mousemove(function () {
                    $(this).addClass("a161121CRD2LButtonBgH");
                }).mouseout(function () {
                    $(this).removeClass("a161121CRD2LButtonBgH");
                }).click(function () {
                    window.location.href = "/login";
                });

                $(".a161121CLDLButton").mousemove(function () {
                    $(this).addClass("a161121CLDLButtonBgH");
                }).mouseout(function () {
                    $(this).removeClass("a161121CLDLButtonBgH");
                }).click(function () {
                    window.location.href = "/login";
                });
            }
        },
        showMyList: function () {
            //获取个人抽奖记录
            that.account.getAccountPrizes(that.actId, "", 1, 10, function (list, pading) {
                if (list.length > 0) {
                    $(".a161121CRD2NoList").hide();
                    $(".a161121CRD2List").show();
                    var html = "";
                    for (var i = 0; i < list.length; i++) {
                        html += list[i].prizeName + '<span class="a161121CRDSpan">' + list[i].createdAt.substring(0, 16).replace("T", " ") + '</span>';
                        if (i < (list.length - 1)) {
                            html += '<br>';
                        }
                    }
                    $(".a161121CRD2List").html(html);
                } else {
                    $(".a161121CRD2NoList").show();
                }
            });
        },
        showWitchButton: function () {
            //获取点币金额
            that.account.getBizAccountInfo(function () {
                var data = that.account.accountInfo;
                //获取点币数额
                that.points = data.asset.availablePoint;
                if (that.points >= 100) {
                    $(".doRaffle").removeClass("doRaffleNo").removeAttr("disabled");
                    $(".a161121CRLYes").show();
                    $(".a161121CRLNo").hide();
                    $(".a161121CRLYSum").html(that.points);
                    $(".a161121CRLYCount").html(Math.floor(that.points / 100));
                } else {
                    $(".doRaffle").addClass("doRaffleNo").attr("disabled", "true");
                    $(".doRaffleNoShow").show();
                    $(".a161121CRLYes").hide();
                    $(".a161121CRLNo").show();
                }
            });
        },
        showSumList: function () {
            //获取所有抽奖记录
            that.account.getAccountsPrizesJourByType(that.actId, "", 1, 1, 10, function (list, pading) {
                var html = "";
                for (var i = 0; i < list.length; i++) {
                    html += '恭喜<span class="colored577e">' + list[i].cellphone + '</span>抽中<span class="colored577e">' + list[i].prizeName + '</span><span class="a161121CRDSpan">' + list[i].createdAt.substring(0, 16).replace("T", " ") + '</span>';
                    if (i < (list.length - 1)) {
                        html += '<br>';
                    }
                }
                $(".a161121CRD3List").html(html);
            });
        },
        lotteryDraw: function (tag) {
            that.account.getAccountDoRaffle(that.actId, "1", "", function (data) {
                var showBlack = that.startNum;
                var oldBlack = that.startNum;
                if (oldBlack < 0) {
                    oldBlack = 7;
                }
                var loopTime = 300;
                var minLoopTime = 100;
                var loop = 0;
                var num = 0;
                var isAt = 0;
                if (data.prizeName == "8元现金红包") {
                    isAt = 3;
                } else if (data.prizeName == "888元现金红包") {
                    isAt = 7;
                } else if (data.prizeName == "50元返现券") {
                    isAt = 1;
                } else if (data.prizeName == "2%加息券") {
                    isAt = 6;
                } else if (data.prizeName == "谢谢参与") {
                    isAt = 0;
                } else if (data.prizeName == "1%加息券") {
                    isAt = 5;
                } else if (data.prizeName == "0.2%加息券") {
                    isAt = 2;
                } else if (data.prizeName == "100点币") {
                    isAt = 4;
                }
                var zzBlack = function zzBlack() {
                    num++;
                    loop = Math.ceil(num / 8);
                    showBlack++;
                    $(".a161121CLDiv" + showBlack).addClass("a161121CLDiv" + showBlack + "H");
                    $(".a161121CLDiv" + oldBlack).removeClass("a161121CLDiv" + oldBlack + "H");
                    oldBlack = showBlack;
                    if (loop < 2) {
                        if (loopTime > 50) {
                            loopTime -= 50;
                        }
                    }
                    if (loop > 7) {
                        if (loopTime < 500) {
                            loopTime += 100;
                        }
                    }
                    if (showBlack == 7) {
                        showBlack = -1;
                    }
                    if (loop > 8 && isAt == oldBlack) {
                        $('.a161121CLDLButton').removeAttr("disabled");
                        that.startNum = showBlack;
                        that.showMyList();
                        that.showWitchButton();
                        that.showSumList();
                        $(".prizeNameShow").html(data.prizeName);
                        if (isAt > 0) {
                            DLC.Util.showOverlay();
                            DLC.Util.showAdjust(".getPrize");
                        } else {
                            DLC.Util.showErrorAdjust("谢谢参与");
                        }
                        return;
                    } else {
                        setTimeout(zzBlack, loopTime);
                    }
                }
                setTimeout(zzBlack, loopTime);
            }, function (errorCode, errorMsg) {
                $('.a161121CLDLButton').removeAttr("disabled");
                DLC.Util.showErrorAdjust(errorMsg);
            });
        }
    }, {})
})($)