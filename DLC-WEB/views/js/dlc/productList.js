(function ($) {
    'use strict'
    DLC.ProductList = DLC.derive(null, {
        create: function (ptId) {
            this.product = app.product;
            this.hasPaging = false;
            DLC.Util.initPage();
            window.app.initHeader(2);
            this.initSearch(ptId);
            this.getProductList(1);
        },
        initSearch: function (ptId) {
            var that = this;
            this.searchList_1 = [{
                periodMin: "",
                periodMax: "",
                id: "q11"
            }, {
                periodMin: "0",
                periodMax: "90",
                id: "q12"
            }, {
                periodMin: "91",
                periodMax: "180",
                id: "q13"
            }, {
                periodMin: "181",
                periodMax: "",
                id: "q14"
            }];
            this.searchList_2 = [{
                status: "",
                id: 'q21'
            }, {
                status: "1",
                id: 'q22'
            }, {
                status: "2",
                id: 'q23'
            }, {
                status: "3",
                id: 'q24'
            }, {
                status: "7",
                id: 'q25'
            }, {
                status: "4",
                id: 'q26'
            }];
            this.searchList_3 = [{
                prodType: "1,2",
                id: 'q31'
            }, {
                prodType: "1",
                id: 'q32'
            }, {
                prodType: "2",
                id: 'q33'
            }];
            this.selectChange_1(0); //default select
            this.selectChange_2(0); //default select
            this.selectChange_3(ptId); //default select

            for (var i = 0; i < this.searchList_1.length; i++) {
                var item_1 = this.searchList_1[i];
                (function (index, item) {
                    $('#' + item.id).bind('click', function () {
                        that.selectChange_1(index);
                        that.hasPaging = false;
                        that.getProductList(1);
                    })
                })(i, item_1)
            }

            for (var i = 0; i < this.searchList_2.length; i++) {
                var item_2 = this.searchList_2[i];
                (function (index, item) {
                    $('#' + item.id).bind('click', function () {
                        that.selectChange_2(index);
                        that.hasPaging = false;
                        that.getProductList(1);
                    })
                })(i, item_2)
            }

            for (var i = 0; i < this.searchList_3.length; i++) {
                var item_3 = this.searchList_3[i];
                (function (index, item) {
                    $('#' + item.id).bind('click', function () {
                        that.selectChange_3(index);
                        that.hasPaging = false;
                        that.getProductList(1);
                    })
                })(i, item_3)
            }
        },
        selectChange_1: function (index) {
            index = parseInt(index);
            if (index >= this.searchList_1.length || index < 0) {
                index = 0;
            }
            var searchPeriod = this.searchList_1[index];
            var node = $('#' + searchPeriod.id);
            if (this.currentSearchPeriod) {
                this.currentSearchPeriod.removeClass('selected');
            }
            this.currentSearchPeriod = node;
            node.addClass('selected');
            this.searchPeriod = searchPeriod;
        },
        selectChange_2: function (index) {
            index = parseInt(index);
            if (index >= this.searchList_2.length || index < 0) {
                index = 0;
            }
            var searchStatus = this.searchList_2[index];
            var node = $('#' + searchStatus.id);
            if (this.currentSearchStatus) {
                this.currentSearchStatus.removeClass('selected');
            }
            this.currentSearchStatus = node;
            node.addClass('selected');
            this.searchStatus = searchStatus;
        },
        selectChange_3: function (index) {
            index = parseInt(index);
            if (index >= this.searchList_3.length || index < 0) {
                index = 0;
            }
            var searchProdType = this.searchList_3[index];
            var node = $('#' + searchProdType.id);
            if (this.currentSearchProdType) {
                this.currentSearchProdType.removeClass('selected');
            }
            this.currentSearchProdType = node;
            node.addClass('selected');
            this.searchProdType = searchProdType;
        },
        getProductList: function (page) {
            var that = this;
            var param = {};
            if (this.searchStatus) param.prodStatus = this.searchStatus.status;
            if (this.searchPeriod) {
                param.periodMin = this.searchPeriod.periodMin;
                param.periodMax = this.searchPeriod.periodMax;
            }
            if (this.searchProdType) param.prodType = this.searchProdType.prodType;
            param.page = page;
            param.pageSize = 7;
            this.product.getProductList(param, function (prodList, paging) {
                that.initProductListView(prodList, paging);
                if (that.hasPaging == false) {
                    that.initPagination(paging);
                    that.hasPaging = true;
                }
            }, function () {

            })
        },
        initProductListView: function (prodList, paging) {
            var that = this;
            var rootNode = $('#productList');
            rootNode.text("");
            rootNode.hide();

            for (var i = 0; i < prodList.length; i++) {
                this.createProductDom(prodList[i]);
            }
            rootNode.fadeIn(200);
            window.scrollTo(0, 0);
        },
        createProductDom: function (product) {
            var rootNode = $('#productList');
            var progressWidth = (140 * product.quotaProgress * 0.01) + 'px';
            var detailSrc = 'onclick=window.location.href="/product_' + product.id + '"';
            var buyBtnClass = "buy";
            var buyBtnClassC = "buyC";
            var buyDisabled = false;
            var buyBtnLabel = "立即投资";
            switch (product.prodStatus) {
                case '1':
                    ;
                    break;
                case '2':
                    buyDisabled = true;
                    buyBtnLabel = "已售罄";
                    break;
                case '3':
                    buyDisabled = true;
                    buyBtnLabel = "还款中";
                    break;
                case '4':
                    buyDisabled = true;
                    buyBtnLabel = "已流标";
                    break;
                case '7':
                    buyDisabled = true;
                    buyBtnLabel = "已兑付";
                    break;
                default:
                    buyDisabled = true;
                    buyBtnLabel = "停止";
                    break;
            }
            var type = (product.prodType == "2") ? "节" : "优";
            var issuedAtYear = product.issuedAt.substr(0, 4);
            var date = new Date;
            var year = date.getFullYear();
            if (issuedAtYear != year && buyDisabled) {
                detailSrc = "";
            } else if (product.name.indexOf('LF') > -1 && buyDisabled) {
                detailSrc = "";
            }
            var htmlStr =
                '<div class="item">' +
                '<p class="item-title">' +
//                '<span class="item-icon">' + type + '</span>' +
                '<span ' + detailSrc + '  class="name cursor_pointer">' + product.name;
            if (product.coupons) {
                for (var i = 0; i < product.coupons.length; i++) {
                    switch (product.coupons[i]) {
                        case "2":
                            htmlStr += '<span class="prod-coupons prod-coupons-fx">返现券</span>';
                            break;
                        case "3":
                            htmlStr += '<span class="prod-coupons prod-coupons-mj">满减券</span>';
                            break;
                        case "4":
                            htmlStr += '<span class="prod-coupons prod-coupons-jx">加息券</span>';
                            break;
                        case "5":
                            htmlStr += '<span class="prod-coupons prod-coupons-jj">投资送升息令牌</span>';
                            break;
                        default:

                    }
                }
            }
            var expectYearReturn = product.expectYearReturn;
            if (product.invest2YearReturn != '0.0') {
                expectYearReturn += '~' + product.invest2YearReturn;
            }
            expectYearReturn += '<span class="s">%</span>';
            htmlStr += '</span><span class="item-repayment">' + product.returnMethodStr_1 +
                '</span></p><div id="couponTips"></div>' +
                '<div class="context">' +
                '<div class="b1">' +
                '<div class="w">' +
                '<div class="num-item" style="width:180px;margin-right:0px;">' +
                '<p class="num"><span style="color:#ff7800;">' + expectYearReturn + '</span></p>' +
                '<p class="label"></p>' +
                '</div>' +
                '<div class="num-item">' +
                '<p class="num"><span>' + product.prodPeriod + '</span><span class="s">天</span></p>' +
                '<p class="label">投资期限</p>' +
                '</div>' +
                '<div class="num-item">' +
                '<p class="num"><span>' + product.maxRaisedAmount + '</span><span class="s">万</span></p>' +
                '<p class="label">项目金额</p>' +
                '</div>' +
                '<div class="num-item last">' +
                '<p><span class="progressNo">' + product.quotaProgress + '%</span></p>' +
                '<p style="text-align: center;"><span class="canInvest">可投:' + product.availableAmount + '元</span></p>' +
                '<div class="progress-bar-bg">' +
                '<p style="width:' + progressWidth + '" class="progress-bar"></p>' +
                '</div>' +
                '</div>' +
                '<button class="btn ' + (buyDisabled ? buyBtnClassC : buyBtnClass) + '" ' + detailSrc + (buyDisabled ? '' : "") + ' >' + buyBtnLabel + '</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            rootNode.append(htmlStr);
        },
        initPagination: function (paging) {
            var that = this;
            $('#productListPagination').pagination(paging.total * paging.pageSize, {
                num_edge_entries: 1,
                num_display_entries: 4,
                callback: function (page) {
                    that.getProductList(page)
                },
                items_per_page: paging.pageSize,
            });

            $('.prod-coupons-fx').bind('mouseenter', function () {
                var top = $(this).offset().top + 30;
                var left = $(this).offset().left;
                var html = "<div style='left:" + left + "px;top:" + top + "px;' class='coupon-tips-div'>该项目可使用返现券</div>";
                $('#couponTips').html(html);
            });
            $('.prod-coupons-mj').bind('mouseenter', function () {
                var top = $(this).offset().top + 30;
                var left = $(this).offset().left;
                var html = "<div style='left:" + left + "px;top:" + top + "px;' class='coupon-tips-div'>该项目可使用满减券</div>";
                $('#couponTips').html(html);
            });
            $('.prod-coupons-jx').bind('mouseenter', function () {
                var top = $(this).offset().top + 30;
                var left = $(this).offset().left;
                var html = "<div style='left:" + left + "px;top:" + top + "px;' class='coupon-tips-div'>该项目可使用加息券</div>";
                $('#couponTips').html(html);
            });
            $('.prod-coupons-jj').bind('mouseenter', function () {
                var top = $(this).offset().top + 30;
                var left = $(this).offset().left;
                var html = "<div style='left:" + left + "px;top:" + top + "px;' class='token-tips-div'>使用升息令牌后，可提升年化收益</div>";
                $('#couponTips').html(html);
            });
            $('.prod-coupons').bind('mouseleave', function () {
                $('#couponTips').html('');
            });
        },
    }, {})
})($)