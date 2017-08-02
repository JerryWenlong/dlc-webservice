/**
 * Created by chenwei on 2016/6/7.
 */

(function ($) {
    'use strict'
    var that = null;
    var sort = 'amount';
    var tradeType = "";
    var asc = false;
    var item_action = 0;
    DLC.Bills = DLC.derive(DLC.DLC, {
        create: function () {
            DLC.Util.initPage();
            window.app.initHeader(4);
            this.User = app.currentUser;
            this.account = app.account;
            this.trade = app.trade;
            sort = 'amount';
            tradeType = "";
            asc = false;
            item_action = 0;
            that = this;
        },
        getPage: function (index, hightFun) {

            //     param.sort=sort;

            var param = {
                page: index,
                pageSize: 10
            };
            param.asc = asc;
            if (tradeType != "") {
                param.tradeType = tradeType;
            }
            that.trade.getJournalList(param, function (List, paging) {
                //   if(List.length > 0)
                {
                    var data = {
                        list: []
                    }
                    data.list = List;
                    var html = template('listBill', data);
                    document.getElementById('listBill_content').innerHTML = html;
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
                    for (var i = 0; i < List.length; i++) {
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
            that.getPage(1, null);


            $('#timeID').bind("click", function () {
                if (!asc) {
                    $('#ArrowN').removeClass("ArrowD");
                    $('#ArrowN').addClass("ArrowU");
                    asc = true;
                } else {
                    $('#ArrowN').removeClass("ArrowU");
                    $('#ArrowN').addClass("ArrowD");
                    asc = false;
                }
                //    tradeType="" ;
                //      item_action=0;
                that.getPage(1, null);
            });
            $('#item_action0').bind("click", function () {
                if (item_action != 0) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action0').removeClass("actionN");
                $('#item_action0').addClass("actionH");
                tradeType = "";
                item_action = 0;
                that.getPage(1, null);
            });
            $('#item_action1').bind("click", function () {
                if (that.item_action != 1) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action1').removeClass("actionN");
                $('#item_action1').addClass("actionH");
                tradeType = "5";
                item_action = 1;
                that.getPage(1, null);
            });
            $('#item_action2').bind("click", function () {
                if (item_action != 2) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action2').removeClass("actionN");
                $('#item_action2').addClass("actionH");
                item_action = 2;
                tradeType = "0";
                that.getPage(1, null);
            });
            $('#item_action3').bind("click", function () {
                if (item_action != 3) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action3').removeClass("actionN");
                $('#item_action3').addClass("actionH");
                item_action = 3;
                tradeType = "1";
                that.getPage(1, null);
            });
            $('#item_action4').bind("click", function () {
                if (item_action != 4) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action4').removeClass("actionN");
                $('#item_action4').addClass("actionH");
                item_action = 4;
                tradeType = "2";
                that.getPage(1, null);
            });
            $('#item_action5').bind("click", function () {
                if (item_action != 5) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action5').removeClass("actionN");
                $('#item_action5').addClass("actionH");
                item_action = 5;
                tradeType = "15";
                that.getPage(1, null);
            });
            $('#item_action6').bind("click", function () {
                if (item_action != 6) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action6').removeClass("actionN");
                $('#item_action6').addClass("actionH");
                item_action = 6;
                tradeType = "3";
                that.getPage(1, null);
            });
            $('#item_action7').bind("click", function () {
                if (item_action != 7) {
                    $('#item_action' + item_action).removeClass("actionH");
                    $('#item_action' + item_action).addClass("actionN");
                }
                $('#item_action7').removeClass("actionN");
                $('#item_action7').addClass("actionH");
                item_action = 7;
                tradeType = "16";
                that.getPage(1, null);
            });
        }
    }, {})
})($)