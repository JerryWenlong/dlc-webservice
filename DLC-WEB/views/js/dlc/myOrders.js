/**
 * Created by chenwei on 2016/6/6.
 */
(function ($) {
    'use strict'
    var that = null;
    var sort = 'createdAt';
    var status = ""
    var asc = false;
    var item_action = 0;
    var arrayA = new Array(false, false);
    var status_action = 0;
    var dataList = null;
    DLC.Orders = DLC.derive(DLC.DLC, {

        create: function () {
            DLC.Util.initPage();
            window.app.initHeader(4);
            this.User = app.currentUser;
            this.account = app.account;
            this.trade = app.trade;

            sort = 'createdAt';
            status = ""
            asc = false;
            item_action = 0;
            arrayA = new Array(false, false);
            status_action = 0;
            dataList = null;

            that = this;
        },

        getPage: function (index, id, hightFun) {
            var param = {};
            param.page = index;
            param.sort = sort;
            param.asc = arrayA[id];
            param.pageSize = 10;
            if (status != "") {
                param.bizStatus = status;
            }
            that.trade.getOrderList(param, function (orderList, paging) {
                //  if(orderList.length > 0)
                {
                    var data = {
                        list: []
                    }
                    data.list = orderList;
                    dataList = orderList;
                    var html = template('listOrders', data);
                    document.getElementById('list_contentO').innerHTML = html;
                    var box = $(' .page-r');
                    $(window).myPaging({
                        total: paging.total,
                        currentPage: paging.page,
                        box: box,
                        fun: that.getPage
                    });
                    if (hightFun != null) {
                        hightFun();
                    }

                    for (var i = 0; i < orderList.length; i++) {
                        var src = document.getElementById("button" + i);
                        if (orderList[i].action == "未支付") {
                            src.style.backgroundColor = "#398be1";
                            src.style.color = "#ffffff";
                        } else {
                            src.style.backgroundColor = "#ffffff";
                            src.style.color = "#398be1";
                            if ((i + 1) % 2 == 1) {
                                $("#button" + i).addClass("backgroundColorFf");
                            } else {
                                $("#button" + i).addClass("backgroundColorFc");
                            }
                        }
                        $("#productName" + i).click(function () {
                            var id = $(this).attr('id');
                            var index = id.substr(11, id.length - 11);
                            window.location.href = "/product_" + dataList[index].productId;
                            // if (dataList[index].freeTrial) {
                            //     window.location.href = "/experienceProduct_" + dataList[index].productId;
                            // } else {
                            //     window.location.href = "/product_" + dataList[index].productId;
                            // }
                        });
                    }

                    for (var i = 0; i < orderList.length; i++) {
                        if (orderList[i].action == "未支付") {
                            $("#button" + i).addClass("cursor_pointer");
                            $("#button" + i).click(function () {
                                var id = $(this).attr('id');
                                var index = id.substr(6, id.length - 6);
                                if (dataList[index].freeTrial) {
                                    window.location.href = "/experienceProduct_" + dataList[index].productId;
                                } else {
                                    window.location.href = "//" + dataList[index].orderNo;
                                }
                            });
                        }
                        if (orderList[i].contractRequired && orderList[i].contractFile != null) {
                            $("#contract" + i).addClass("cursor_pointer");
                            $("#contract" + i).click(function () {
                                var id = $(this).attr('id');
                                var index = id.substr(8, id.length - 8);
                                window.open(orderList[index].contractFile);
                            });
                        }
                        if ((i + 1) % 2 == 1) {
                            $("#li" + i + 1).addClass("backgroundColorFf");
                        } else {
                            $("#li" + i + 1).addClass("backgroundColorFc");
                        }
                    }

                }
            }, function (errorCode, errorMsg) {

            })
        },
        init: function () {
            $(".notes_help").hover(function () {
                    $(".notes").show();
                },
                function () {
                    $(".notes").hide();
                })
            that.getPage(1, status_action, null);

            for (var i = 0; i < 2; i++) {
                $("#" + i).click(function () {
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
                        sort = 'createdAt';
                        break;
                    case "1":
                        sort = 'entrustAmount';
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
            //            $('#item_action1').bind("click", function () {
            //                if(that.item_action!=1)
            //                {
            //                    $('#item_action'+item_action).removeClass("actionH");
            //                    $('#item_action'+item_action).addClass("actionN");
            //                }
            //                $('#item_action1').removeClass("actionN");
            //                $('#item_action1').addClass("actionH");
            //                status="0" ;
            //                item_action=1;
            //                that.getPage(1,status_action,null);
            //            });
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
            //            $('#item_action3').bind("click", function () {
            //                if(item_action!=3)
            //                {
            //                    $('#item_action'+item_action).removeClass("actionH");
            //                    $('#item_action'+item_action).addClass("actionN");
            //                }
            //                $('#item_action3').removeClass("actionN");
            //                $('#item_action3').addClass("actionH");
            //                item_action=3;
            //                status="3" ;
            //                that.getPage(1,status_action,null);
            //            });
            $('#item_action4').bind("click", function () {
                if (item_action != 4) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action4').removeClass("actionN");
                $('#item_action4').addClass("actionH");
                item_action = 4;
                status = "2";
                that.getPage(1, status_action, null);
            });
            $('#item_action11').bind("click", function () {
                if (item_action != 11) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action11').removeClass("actionN");
                $('#item_action11').addClass("actionH");
                item_action = 11;
                status = "11";
                that.getPage(1, status_action, null);
            });


        }
    }, {})
})($)
