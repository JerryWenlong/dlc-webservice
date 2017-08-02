(function ($) {
    'use strict';
    var that = null;
    DLC.SignupSuccess = DLC.derive(DLC.DLC, {
        create: function () {
            this.user = app.currentUser;
            this.account = app.account;
            that = this;
            this.init();
        },
        init: function () {
            // this.getExperiences();
            DLC.Util.initPage();
            //刷新头部
            window.app.initHeader(1);
            this.initNewProduc();
            this.initHotProduc();
        },
        //新手福利
        initNewProduc: function () {
            app.product.getPromNew(function (newhandProduct) {
                $('.exp_day').text(newhandProduct.prodPeriod);
                $('.exp_money').text(newhandProduct.expectYearReturn);
                $('.expectYearReturn2').text("+" + newhandProduct.invest1IncReturn);
                $('.exp_count').text(parseInt(newhandProduct.maxRaisedAmount / 10000));
                $('.newIndexSMC5A').attr("href", '/experienceProduct_' + newhandProduct.prodCodeId);
            }, function () {

            })
        },
        //热门推荐
        initHotProduc: function () {
            var that = this;
            app.product.getRecommendsAll('1', function (dataList) {
                if (dataList.length > 0) {
                    var productObj = dataList[0];
                    $('.exp_day2').text(productObj.prodPeriod);
                    $('.exp_money2').text(productObj.expectYearReturn);
                    $('.exp_count2').text(productObj.maxRaisedAmount);                    
                    if (productObj.invest1IncReturn > 0) {
                        $('.isJX').html('<div style="margin-top:-65px;margin-left:35px;font-size:12px;color:#fff;border-radius:3px;text-align: center;width:78px;background-color: #ff7800;height:20px;line-height: 20px;">已加息' + productObj.invest1IncReturn + '%</div>');
                    }
                    $('.newIndexYXPBarS2').text(productObj.quotaProgress + '%');
                    $('.newIndexYXPBarS').css("width",productObj.quotaProgress + '%');
                    var showText = "立即投资";
                    switch (productObj.prodStatus) {
                    case "1":
                        $('.newIndexSMC5A2').removeClass("bgcddd");    
                        $('.newIndexSMC5A2').attr("href", '/product_' + productObj.id);
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
            }, function () {}, 4);
        }
    }, {})
})($)