/**
 * Created by chenwei on 2016/6/7.
 */
/**
 * Created by chenwei on 2016/6/6.
 */
(function ($) {
    'use strict'
    var that = null;
    var sort = '';
    var status = ""
    var asc = false;
    var item_action = 0;
    var arrayA = new Array(false, false, false, false, false);
    var status_action = 0;
    var dataList;
    var currentPage = 0;
    var itemDetail = 100;
    var isShowDetail = false;
    var item = null;
    DLC.Financial = DLC.derive(DLC.DLC, {
        create: function () {
            DLC.Util.initPage();
            window.app.initHeader(4);
            this.User = app.currentUser;
            this.account = app.account;
            this.trade = app.trade;
            sort = 'created_at';
            status = ""
            asc = false;
            item_action = 0;
            arrayA = new Array(false, false, false, false, false);
            status_action = 0;
            dataList = null;
            currentPage = 0;
            itemDetail = 100;
            isShowDetail = false;
            item = null;
            that = this;
        },
        getPage: function (index, id, hightFun) {
            if (item != null) {
                if (item.text() == "收起") {
                    $("#div_float1").removeClass("div_float1_display");
                    $("#div_float1").addClass("div_float1_none");
                    isShowDetail = false;
                } else {
                    $("#div_float1").removeClass("div_float1_none");
                    $("#div_float1").addClass("div_float1_display");
                    isShowDetail = true;
                }
            }
            var param = {};
            param.page = index;
            param.sort = sort;
            param.pageSize = 10;
            if (id != 10) {
                param.asc = arrayA[id];
            }
            if (status != "") {
                param.status = status;
            }

            that.account.getBizShare(param, function (productShare, paging) {
                //
                //      if(productShare.length > 0)
                {
                    var data = {
                        list: []
                    }
                    for (var i = 0; i < productShare.length; i++) {
                        if (productShare[i].status == "募集中" || productShare[i].status == "已售罄" || productShare[i].status == "已流标") {
                            productShare[i].productEndAt = "";
                        } else {
                            productShare[i].productEndAt = productShare[i].cashInAt;
                        }
                    }
                    data.list = productShare;
                    dataList = productShare;
                    var html = template('listFinancial', data);
                    document.getElementById('listFinancial_content').innerHTML = html;
                    var box = $(' .page-r');
                    $(window).myPaging({
                        total: paging.total,
                        currentPage: paging.page,
                        box: box,
                        fun: that.getPage
                    });
                    currentPage = paging.page;
                    if (hightFun != null) {
                        hightFun();
                    }
                    for (var i = 0; i < productShare.length; i++) {
                        $("#productName" + i).click(function () {
                            var id = $(this).attr('id');
                            var index = id.substr(11, id.length - 11);
                            window.location.href = "/product_" + dataList[index].productId;
                        });

                        $("#detail" + i).click(function () {
                            var id = $(this).attr('id');
                            var index = id.substr(6, id.length - 6);
                            item = $(this);
                            if ($(this).text() == "收起") {
                                $("#div_float1").removeClass("div_float1_display");
                                $("#div_float1").addClass("div_float1_none");
                                isShowDetail = false;
                                item = null;
                            } else {
                                $("#div_float1").removeClass("div_float1_none");
                                $("#div_float1").addClass("div_float1_display");
                                isShowDetail = true;
                            }


                            if (itemDetail == index && isShowDetail == false) {
                                $("#detail" + index).html("查看");
                                return;
                            } else {
                                if (itemDetail != 100) {
                                    $("#detail" + itemDetail).html("查看");
                                }

                                $("#detail" + index).html("收起");

                            }

                            itemDetail = index;
                            that.account.getBizShareDetail(dataList[index].id, function (productShareDetail, paging) {
                                var data = {
                                    list: []
                                }
                                data.list = productShareDetail;
                                var html = template('listFinancialDetail', data);
                                document.getElementById('listFinancialDetail_content').innerHTML = html;
                            }, function (errorCode, errorMsg) {

                            });
                        });
                        if ((i + 1) % 2 == 1) {
                            $("#li" + i + 1).addClass("backgroundColorFf");
                        } else {
                            $("#li" + i + 1).addClass("backgroundColorFc");
                        }
                    }
                }
            }, function (errorCode, errorMsg) {

            });


        },
        init: function () {
            $(".notes_help").hover(function () {
                    $(".notes").show();
                },
                function () {
                    $(".notes").hide();
                })
            that.account.getBizAccountInfo(function () {
                var data = that.account.accountInfo;
                if (data == null) return

                $('#invest').html(data["asset"]["totalCapital"]);
                $('#mayProfit').html(data["asset"]["expectProfit"]);
                $('#totalProfit').html(data["asset"]["totalProfit"]);;
            });
            that.getPage(1, status_action, null);

            for (var i = 0; i < 5; i++) {
                $("#" + i).click(function () {
                    if (item != null) {
                        if (item.text() == "收起") {
                            $("#div_float1").removeClass("div_float1_display");
                            $("#div_float1").addClass("div_float1_none");
                            isShowDetail = false;
                        } else {
                            $("#div_float1").removeClass("div_float1_none");
                            $("#div_float1").addClass("div_float1_display");
                            isShowDetail = true;
                        }
                    }
                    var id = $(this).attr('id');
                    if (status_action == id) {
                        arrayA[id] = !arrayA[id];

                        if (!arrayA[id]) {
                            $("#Arrow" + id).removeClass("ArrowU");
                            $("#Arrow" + id).addClass("ArrowD");
                        } else {
                            $("#Arrow" + id).removeClass("ArrowD");
                            $("#Arrow" + id).addClass("ArrowU");
                        }

                    }

                    status_action = id;
                    switch (status_action) {
                    case "0":
                        sort = 'product_rate';
                        break;
                    case "1":
                        sort = 'created_at';
                        break;
                    case "2":
                        sort = 'product_end_at';
                        break;
                    case "3":
                        sort = 'period';
                        break;
                    case "4":
                        sort = 'profit';
                        break;

                    }


                    that.getPage(1, status_action, null);
                });
            }




            $('#item_action0').bind("click", function () {
                if (item_action != 0) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action0').removeClass("actionN");
                $('#item_action0').addClass("actionH");
                status = "";
                item_action = 0;
                that.getPage(1, status_action, null);

            });
            $('#item_action1').bind("click", function () {
                if (that.item_action != 1) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action1').removeClass("actionN");
                $('#item_action1').addClass("actionH");
                status = "0";
                item_action = 1;
                that.getPage(1, status_action, null);
            });
            $('#item_action2').bind("click", function () {
                if (item_action != 2) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action2').removeClass("actionN");
                $('#item_action2').addClass("actionH");
                item_action = 2;
                status = "1";
                that.getPage(1, status_action, null);
            });
            $('#item_action3').bind("click", function () {
                if (item_action != 3) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action3').removeClass("actionN");
                $('#item_action3').addClass("actionH");
                item_action = 3;
                status = "2";
                that.getPage(1, status_action, null);
            });
            $('#item_action4').bind("click", function () {
                if (item_action != 4) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action4').removeClass("actionN");
                $('#item_action4').addClass("actionH");
                item_action = 4;
                status = "3";
                that.getPage(1, status_action, null);
            });
            $('#item_action5').bind("click", function () {
                if (item_action != 5) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action5').removeClass("actionN");
                $('#item_action5').addClass("actionH");
                item_action = 5;
                status = "4";
                that.getPage(1, status_action, null);
            });
        }
    }, {})
})($)
