(function ($, window) {
    'use strict'
    var THAT;
    DLC.Home = DLC.derive(null, {
        create: function () {
            this.IE8 = false;
            THAT = this;
            this.ListProduct = [];
            this.ListProductUp = [];
            var token = DLC.Util.getUrlParam('token');
            var utm_source = DLC.Util.getUrlParam('utm_source');
            var cookStr = $.cookie('referrerUrl');
            if (token != '') {
                $.cookie('refereeToken', token, {
                    expires: 365
                });
            }
            if (cookStr == "baidu" || cookStr == "sogou") {
                utm_source = cookStr;
                cookStr = "";
                $.cookie('referrerUrl', "");
            }
            if (utm_source != '') {
                app.currentUser.getReferToken(utm_source, function (response) {
                    $.cookie('refereeToken', response, {
                        expires: 365
                    });
                }, function () {})
            }
            this.user = app.currentUser;
            this.currentUser = this.user;
            this.product = app.product;
            this.initPage();
            DLC.Util.initPage();
            window.app.initHeader(1);
        },
        //新手专区
        initNewProduc: function () {
            this.product.getPromNew(function (newhandProduct) {
                $('.newIndexSMHead').text(newhandProduct.prodName);
                $('.exp_day').text(newhandProduct.prodPeriod);
                $('.exp_money').text(newhandProduct.expectYearReturn);
                $('.expectYearReturn2').text("+"+newhandProduct.invest1IncReturn);
                $('.exp_count').text(parseInt(newhandProduct.maxRaisedAmount/10000));
                $('.newIndexSMC5A').attr("href", '/experienceProduct_' + newhandProduct.prodCodeId);
            }, function () {

            })
        },
        //鑫盈精选
        initRecommendProduct: function () {
            var that = this;
            this.product.getRecommendsAll('1', function (dataList) {
                var l = 0;
                for (var i = 0; i < dataList.length; i++) {
                    if (dataList[i].name.indexOf('LF') > -1 && dataList[i].prodStatus != "1") {
                        dataList[i].id = "";
                    }
                    switch (dataList[i].prodStatus) {
                    case "1":
                        ;
                        break;
                    case "2":
                        dataList[i]['showText'] = "已售罄";
                        break;
                    case "3":
                        dataList[i]['showText'] = "还款中";
                        break;
                    case "4":
                        dataList[i]['showText'] = "已流标";
                        break;
                    case "7":
                        dataList[i]['showText'] = "已兑付";
                        break;
                    default:
                        dataList[i]['showText'] = "停止";
                        break;
                    }
                    if (l < 4) {
                        that.ListProduct.push(dataList[i]);
                        l++;
                    } else {
                        break;
                    }
                }
                var dataProduct = {
                    list: []
                }
                dataProduct.list = that.ListProduct;
                var htmlProduct = template('listProducts', dataProduct);
                $('#list_content_product').html(htmlProduct);
            }, function () {}, 4);
        },
        //节节升息
        initRecommendProductUp: function () {
            this.upFun(0);
        },
        upFun: function (j) {
            var that = this;
            var arrMinList = ['1', '31', '91', '181'];
            var arrList = ['30', '90', '180', '360'];
            var nullText = ['理财计划1个月-J2017001', '理财计划3个月-J2017001', '理财计划6个月-J2017001', '理财计划12个月-J2017001'];
            this.product.getRecommendsAllByTime('2', arrMinList[j], arrList[j], function (dataList) {
                var newData = [];
                if (dataList.length > 0) {
                    newData['id'] = dataList[0].id;
                    newData['name'] = dataList[0].name;
                    newData['expectYearReturn'] = dataList[0].expectYearReturn;
                    newData['invest2YearReturn'] = dataList[0].invest2YearReturn;
                    newData['quotaProgress'] = dataList[0].quotaProgress;
                    newData['prodPeriod'] = dataList[0].prodPeriod;
                    newData['maxRaisedAmount'] = dataList[0].maxRaisedAmount;
                    newData['prodStatus'] = dataList[0].prodStatus;
                    that.ListProductUp.push(newData);
                } else {
                    newData['id'] = '';
                    newData['name'] = nullText[j];
                    newData['expectYearReturn'] = '？';
                    newData['invest2YearReturn'] = '？';
                    newData['quotaProgress'] = 0;
                    newData['prodPeriod'] = arrList[j];
                    newData['maxRaisedAmount'] = '？';
                    newData['prodStatus'] = '-1';
                    that.ListProductUp.push(newData);
                }
                if (j == (arrList.length - 1)) {
                    var getDataList = that.ListProductUp;
                    for (var i = 0; i < getDataList.length; i++) {
                        switch (getDataList[i].prodStatus) {
                        case "1":
                            ;
                            break;
                        case "2":
                            getDataList[i]['showText'] = "已售罄";
                            break;
                        case "3":
                            getDataList[i]['showText'] = "还款中";
                            break;
                        case "4":
                            getDataList[i]['showText'] = "已流标";
                            break;
                        case "7":
                            getDataList[i]['showText'] = "已兑付";
                            break;
                        case "-1":
                            getDataList[i]['showText'] = "敬请期待";
                            break;
                        default:
                            getDataList[i]['showText'] = "停止";
                            break;
                        }
                    }
                    var dataProduct = {
                        list: []
                    }
                    dataProduct.list = getDataList;
                    var htmlProduct = template('listProductsUp', dataProduct);
                    $('#list_content_product_up').html(htmlProduct);
                    return;
                }
                j++;
                that.upFun(j);
            }, function () {}, 1);

        },
        //其他方法
        initFun: function () {
            //判断用户是否登录，切换页面的方法
            if (this.user.hasLogin) {
                $(".newIndexBannerRAccount").show();
                $(".newIndexBannerRDiv").hide();
                app.account.getBizAccountInfo(function () {
                    var data = app.account.accountInfo;
                    $('.newIndexUserName').html(data.cellphone);
                    $('.newIndexAccount').html(data.balance.available);
                }, function (errorCode, errorMsg) {

                });
            }
            //获取统计数据
            app.account.getStats(function (data) {
                var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
                $('.newIndexDRRUser').animateNumber({
                    number: data.registerCount,
                    numberStep: comma_separator_number_step
                });
                $('.newIndexDRRInvest').animateNumber({
                    number: data.investAmount,
                    numberStep: comma_separator_number_step
                });
                $('.newIndexDRRComm').animateNumber({
                    number: data.profitAmount,
                    numberStep: comma_separator_number_step
                });
            }, function (errorCode, errorMsg) {

            });

            //返回顶部
            $(".hometop").click(function () {
                document.documentElement.scrollTop = document.body.scrollTop = 0;
            });

            $(".newIndexNLMSpan1").click(function () {
                if ($(this).hasClass("newIndexNLMSYes")) {
                    return;
                } else {
                    $(this).addClass("newIndexNLMSYes");
                    $(".newIndexNLMSpan2").removeClass("newIndexNLMSYes");
                    $(".newIndexNMA").attr("href", "/aboutNotice?type=2&pageSize=10&page=1");
                    $(".newIndexNCom").show();
                    $(".newIndexNTrade").hide();
                }
            });
            $(".newIndexNLMSpan2").click(function () {
                if ($(this).hasClass("newIndexNLMSYes")) {
                    return;
                } else {
                    $(this).addClass("newIndexNLMSYes");
                    $(".newIndexNLMSpan1").removeClass("newIndexNLMSYes");
                    $(".newIndexNMA").attr("href", "/aboutNotice?type=1&pageSize=10&page=1");
                    $(".newIndexNCom").hide();
                    $(".newIndexNTrade").show();
                }
            });
            $(".newIndexBannerRDShowLogin").click(function () {
                $(".newIndexBannerRDiv").hide();
                $(".newIndexBannerRLogin").show();
            });
            $(".saveUser").click(function () {
                if ($(this).hasClass("saveUserOn")) {
                    $(this).removeClass("saveUserOn");
                } else {
                    $(this).addClass("saveUserOn");
                }
            });
        },
        //banner提供的方法
        initBanner: function () {
            //这里填写banner信息
            var bannerList = new Array();
            bannerList.push(["", "newIndexImgXy", "/activity170510"]);            
            bannerList.push(["", "newIndexImg88", "/activity170410"]);
            bannerList.push(["", "newIndexImgYq", "/activity161228"]);
            bannerList.push(["", "newIndexImgXs", "/activity170316"]);
            bannerList.push(["", "newIndexImgYxd", "/noticeContent/2017022800000001?page=1"]); 
            bannerList.push(["", "newIndexImgWx", ""]);
            bannerList.push(["", "newIndexImgBx", "/noticeContent/2016081500000009"]);
            var atNum = 0;
            var lastNum = 0;
            var isCan = true;
            var newIndexBannerUlHtml = "<ul>";
            for (var i = 0; i < bannerList.length; i++) {
                newIndexBannerUlHtml += "<li></li>";
            }
            newIndexBannerUlHtml += "</ul>";
            $(".newIndexBannerUl").html(newIndexBannerUlHtml);
            $(".newIndexBannerUl").css("margin-left", "-" + (bannerList.length * 55 / 2 + 175) + "px");
            var rollingFun = function () {
                if (!isCan) {
                    return;
                }
                isCan = false;
                $(".newIndexBanner").removeClass(bannerList[lastNum][0]);
                $("#newIndexBannerA").removeAttr("href");
                $(".newIndexBannerI").fadeOut(300, function () {
                    $($(".newIndexBannerUl ul").children()[lastNum]).removeClass("on");
                    $(this).removeClass(bannerList[lastNum][1]);
                    $(".newIndexBanner").addClass(bannerList[atNum][0]);
                    if (bannerList[atNum][2] != "") {
                        $("#newIndexBannerA").attr("href", bannerList[atNum][2]);
                    }
                    $($(".newIndexBannerUl ul").children()[atNum]).addClass("on");
                    $(this).addClass(bannerList[atNum][1]);
                    $(this).fadeIn(200);
                    lastNum = atNum;
                    atNum++;
                    if (atNum >= bannerList.length) {
                        atNum = 0;
                    }
                    isCan = true;
                });
            }
            $(".newIndexBannerUl ul").children().click(function () {
                atNum = $(this).index();
                rollingFun();
            });
            rollingFun();
            var setRolling = setInterval(rollingFun, 4000);
            $(".newIndexBannerIII").mousemove(function () {
                clearInterval(setRolling);
            }).mouseout(function () {
                setRolling = setInterval(rollingFun, 4000);
            });
            $(".newIndexBanner").mousemove(function () {
                $(".newIndexButtonL").show();
                $(".newIndexButtonR").show();
            }).mouseout(function () {
                $(".newIndexButtonL").hide();
                $(".newIndexButtonR").hide();
            });
            $(".newIndexButtonL").click(function () {
                atNum = lastNum - 1;
                if (atNum < 0) {
                    atNum = bannerList.length - 1;
                }
                rollingFun();
            });
            $(".newIndexButtonR").click(function () {
                rollingFun();
            });
        },
        userNameFun: function (userName) {
            var userNameRule = /^1[3|4|5|7|8][0-9][A-Za-z0-9]{4}[0-9]{4}$/; //手机号码验证规则
            var isOk = true;
            if (userName.trim() == "" || userName == null) {
                $("#loginShowError").html("请输入用户名/手机号");
                isOk = false;
            } else if (!userNameRule.test(userName)) {
                $("#loginShowError").html("请输入11位正确的手机号码");
                isOk = false;
            } else {
                $("#loginShowError").html('');
            }
            return isOk;
        },
        passwordFun: function (password) {
            var passwordRule = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/; //密码验证规则
            var isOk = true;
            if (password.trim() == "" || password == null) {
                $("#loginShowError").html("请输入密码");
                isOk = false;
            } else if (!passwordRule.test(password)) {
                $("#loginShowError").html("请输入8-16位数字和字母组合的密码");
                isOk = false;
            } else {
                $("#loginShowError").html('');
            }
            return isOk;
        },
        initLogin: function () {
            var that = this;
            $('#userName').blur(function () {
                that.userNameFun($(this).val());
            });
            $('#loginPassword').blur(function () {
                that.passwordFun($(this).val());
            });
            $('#loginBtn').bind("click", function () {
                var userName = $('#userName').val();
                var password = $('#loginPassword').val();
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
                $('#loginBtn').attr("disabled", "true");
                $('#loginBtn').val("登录中...");
                that.user.loginNoCap(userName, password, function () {
                    app.initHeader(1);
                    $(".newIndexBannerRAccount").show();
                    $(".newIndexBannerRDiv").hide();
                    $(".newIndexBannerRLogin").hide();
                    app.currentUser.getUserInfo(function () {
                        var data = app.currentUser.userInfo;
                        $('.newIndexUserImg').attr("src", data.avatar);
                    });
                    app.account.getBizAccountInfo(function () {
                        var data = app.account.accountInfo;
                        $('.newIndexUserName').html(data.cellphone);
                        $('.newIndexAccount').html(data.balance.available);
                    }, function (errorCode, errorMsg) {

                    });
                }, function (errorMsg) {
                    $("#loginShowError").html(errorMsg);
                    $('#loginBtn').removeAttr("disabled");
                    $('#loginBtn').val("登 录");
                });
            });
        },
        initPage: function () {
            this.initBanner();
            this.initFun();
            this.initNewProduc();
            this.initRecommendProduct();
            //this.initRecommendProductUp();
            this.initLogin();
        },
    }, {})
})($, window)