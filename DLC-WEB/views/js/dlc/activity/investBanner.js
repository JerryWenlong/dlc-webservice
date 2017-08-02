(function ($) {
    'use strict';
    var that = null;
    DLC.InvestBanner = DLC.derive(DLC.DLC, {
        create: function () {
            this.user = app.currentUser;
            this.account = app.account;
            that = this;
            that.actId = "1701658640";
            window.app.initHeader(1);
        },
        init: function () {
            $(".ibA1").mousemove(function () {
                $(this).addClass("btn");
            }).mouseout(function () {
                $(this).removeClass("btn");
            });
            $(".ibd3db").mousemove(function () {
                $(this).addClass("btn");
            }).mouseout(function () {
                $(this).removeClass("btn");
            }).click(function () {
                if (that.user.hasLogin == false) {
                    window.location.href = "/login";
                    return;
                }
                var tag = $(this).attr("tag");
                if (that.alList.length == 0 || $(".ib3ddss" + (tag)).html() == '0' || typeof that.alList[tag] == 'undefined' || that.alList[tag].availableLottery == 0) {
                    DLC.Util.showErrorAdjust("无抽奖机会");
                    return;
                }
                if (that.alList[tag].availableLottery == 0) {
                    DLC.Util.showErrorAdjust("无抽奖机会");
                    return;
                }
                that.alList[tag].availableLottery = that.alList[tag].availableLottery - 1;
                $(".ib3ddss" + (tag)).html(that.alList[tag].availableLottery);
                that.lotteryDraw(tag);
            });
            $(".ib4d2dA1").mousemove(function () {
                $(this).addClass("btn");
            }).mouseout(function () {
                $(this).removeClass("btn");
            });
            if (that.user.hasLogin == true) {
                that.account.getAccountPrizes(that.actId, "", 1, 2, function (list, pading) {
                    var listStr = "";
                    for (var i = 0; i < list.length; i++) {
                        var remark = "客服电话联系";
                        if (list[i].prizeType == "3") {
                            remark = "我的账户-我的点币 <a href='/myCenter_pointCoin'>点击查看</a>";
                        } else if (list[i].prizeType == "4") {
                            remark = "我的账户-我的体验金 <a href='/myCenter_experience'>点击查看</a>";
                        }
                        listStr += '<span class="ib4d2d2s1">' + (list[i].createdAt).replace("T", " ") + '</span><span class="ib4d2d2s2">' + list[i].prizeName + '</span><span class="ib4d2d2s2">' + remark + '</span>';
                    }
                    if (listStr != "") {
                        $(".ib4d2MyYes").show();
                        $(".ib4d2Yes").show();
                        $(".ib4dd").show();
                        $(".ib4d2MyNo").hide();
                    }
                    $(".ib4d2MyYes").html(listStr);
                }, function (errorCode, errorMsg) {

                });

                that.account.getAccountRaffle(that.actId, "get", "", function (data) {
                    that.alList = [];
                    for (var i = 0; i < data.length; i++) {
                        var indexId = 0;
                        if (data[i].pondTitle == '一级奖池') {
                            indexId = 1;
                        } else if (data[i].pondTitle == '二级奖池') {
                            indexId = 2;
                        } else if (data[i].pondTitle == '三级奖池') {
                            indexId = 3;
                        } else if (data[i].pondTitle == '四级奖池') {
                            indexId = 4;
                        } else if (data[i].pondTitle == '五级奖池') {
                            indexId = 5;
                        }
                        $(".ib3ddss" + indexId).html(data[i].availableLottery);
                        that.alList[indexId] = data[i];
                    }
                }, function (errorCode, errorMsg) {});
            }
            that.account.getAccountsPrizesJour(that.actId, "", 1, 20, function (list, pading) {
                var listStr = "";
                for (var i = 0; i < list.length; i++) {
                    listStr += '<div id="ib4ListID' + i + '"><span class="ib4d2d2s1">' + (list[i].createdAt).replace("T", " ") + '</span><span class="ib4d2d2s2">' + list[i].cellphone + '</span><span class="ib4d2d2s2">' + list[i].prizeName + '</span></div>';
                }
                $(".ib4d2List2").html(listStr);
                var j = 0;
                var h = 10;
                if (list.length > 2) {
                    var divListShow = setInterval(function () {
                        var top = j * 60;
                        var divAction = setInterval(function () {
                            $(".ib4d2List2").css("top", "-" + (top + h) + "px");
                            if (h == 60) {
                                clearInterval(divAction);
                                h = 10
                                if (j == list.length) {
                                    $(".ib4d2List2").css("top", "-0px");
                                    $(".ib4d2List2").html(listStr);
                                    j = 0;
                                }
                            } else {
                                h += 10
                            }
                        }, 100);
                        j++;
                        if (j == (list.length - 2)) {
                            $(".ib4d2List2").append(listStr);
                        }
                    }, 1500);
                }
            }, function (errorCode, errorMsg) {

            });

        },
        lotteryDraw: function (tag) {
            $("#lotteryDraw").html('<div class="ibLDNum ibLDNum5"></div><div class="ibLDDivContent"><div class="ibLDDCCID ibLDDCCID1 hide"><div class="ibLDDCCBlack ibLDDCCBlack1"></div></div><div class="ibLDDCCID ibLDDCCID2 hide"><div class="ibLDDCCBlack ibLDDCCBlack2 hide"></div></div><div class="ibLDDCCID ibLDDCCID3 hide"><div class="ibLDDCCBlack ibLDDCCBlack3 hide"></div></div></div>');
            $("#lotteryDraw2").html('<div class="ibLD2Text"></div><div class="ibLD2Div"></div>');
            DLC.Util.showOverlay();
            that.account.getAccountRaffle(that.actId, "post", that.alList[tag].pondId, function (data) {
                var isOk = true;
                var isZjId = 0;
                var paizeName = data.prizeName;
                if (paizeName == "10元话费" || paizeName == "创意抱枕" || paizeName == "小田蒸汽拖把" || paizeName == "碧然德即热水壶" || paizeName == "科沃斯朵朵S扫地机器人") {
                    isZjId = 1;
                } else if (paizeName == "500点币" || paizeName == "鹅卵石足底按摩垫" || paizeName == "Ocim全身按摩垫" || paizeName == "小米空气净化器" || paizeName == "美的智能台式洗碗机") {
                    isZjId = 2;
                } else if (paizeName == "5000元体验金" || paizeName == "颈椎肩按摩器" || paizeName == "碧然德净水壶" || paizeName == "科沃斯灵犀扫地机器人") {
                    isZjId = 3;
                } else {
                    isOk = false;
                }
                if (isOk) {
                    var pNum = 3;
                    if (tag == 5) {
                        pNum = 2;
                    }
                    for (var i = 1; i <= pNum; i++) {
                        $(".ibLDDCCID" + i).addClass("ibLDDCC" + pNum);
                        $(".ibLDDCCID" + i).addClass(("ibLDDCC" + tag) + i);
                        $(".ibLDDCCID" + i).show();
                    }
                    DLC.Util.showAdjust("#lotteryDraw");
                    var bgNum = 1;
                    var ibLotteryDraw = setInterval(function () {
                        if (bgNum == 1) {
                            bgNum = 2;
                            $(".ibLotteryDraw").addClass("ibldBg1");
                            $(".ibLotteryDraw").removeClass("ibldBg2");
                        } else {
                            bgNum = 1;
                            $(".ibLotteryDraw").addClass("ibldBg2");
                            $(".ibLotteryDraw").removeClass("ibldBg1");
                        }
                    }, 300);
                    var showBlack = 1;
                    var loopTime = 500;
                    var minLoopTime = 100;
                    var loop = 15;
                    var isUp = true;
                    var isAt = false;
                    var zzBlack = function zzBlack() {
                        if (!isAt) {
                            showBlack++;
                        }
                        $(".ibLDDCCBlack").hide();
                        $(".ibLDDCCBlack" + showBlack).show();
                        if (isUp && loop == 15) {
                            loopTime -= 100;
                        }
                        if (!isUp && loop == 1) {
                            loopTime += 100;
                        }
                        if (!isUp && loop > 1) {
                            loop--;
                        }
                        if (loopTime == 100 && isUp) {
                            isUp = false;
                        } else if (loopTime >= 600 && isZjId == showBlack && isAt) {
                            $(".ibLD2Div").addClass(("ibLDDCC" + tag) + isZjId);
                            clearInterval(ibLotteryDraw);
                            DLC.Util.hideAdjust("#lotteryDraw");
                            DLC.Util.showAdjust("#lotteryDraw2");
                            $(".ibLD2Text").html(paizeName);
                            var bgZjNum = 1;
                            var timeClose = 20;
                            var ibLotteryDraw2 = setInterval(function () {
                                if (bgZjNum == 1) {
                                    bgZjNum = 2;
                                    $(".ibLotteryDraw2").addClass("ibldBgZj1");
                                    $(".ibLotteryDraw2").removeClass("ibldBgZj2");
                                } else {
                                    bgZjNum = 1;
                                    $(".ibLotteryDraw2").addClass("ibldBgZj2");
                                    $(".ibLotteryDraw2").removeClass("ibldBgZj1");
                                }
                                timeClose--;
                                if (timeClose == 0) {
                                    clearInterval(ibLotteryDraw2);
                                    DLC.Util.hideAdjust("#lotteryDraw2");
                                    DLC.Util.hideOverlay();
                                    window.location.reload();
                                }
                            }, 100);
                            return;
                        }
                        if (loopTime >= 600 && isZjId == showBlack) {
                            isAt = true;
                        } else if (showBlack == pNum) {
                            showBlack = 0;
                        }
                        setTimeout(zzBlack, loopTime);
                    }
                    setTimeout(zzBlack, loopTime);
                    var num = 4;
                    var ibNum = setInterval(function () {
                        $(".ibLDNum").removeClass("ibLDNum" + (num + 1));
                        $(".ibLDNum").addClass("ibLDNum" + num);
                        num--;
                        if (num == 0) {
                            clearInterval(ibNum);
                        }
                    }, 1000);
                } else {
                    DLC.Util.showErrorAdjust("恭喜您抽中：" + paizeName);
                }
            }, function (errorCode, errorMsg) {
                DLC.Util.showErrorAdjust(errorMsg);
            });
        }
    }, {})
})($)
