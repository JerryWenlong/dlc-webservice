(function($) {
    'use strict';
    var that;
    DLC.MoreActivity = DLC.derive(null, {
        create: function() {
            this.product = app.product;
            this.account = app.account;
            this.actId = "1816497439";
            this.hasPaging = false;
            DLC.Util.initPage();
            window.app.initHeader(1);
            that = this;
            this.getRecordList(1, 3);
        },
        getRecordList: function(page, pageSize) {
            if (page !== 1) {
                window.scrollTo(0, 800);
            }else{
								window.scrollTo(0, 0);
						}
            $('#recordList').html('');
            that.account.getAccountsPrizesStats(that.actId, page, pageSize, function(list, paging) {
                var length = list.length;
                if (length > 0) {
                    var html = '';
                    for (var i = 0; i < length; i++) {
                        if (list[i].prizeStatus === 0) {
                            html += that.createFrameViewI(list[i], i);
                        } else if (list[i].prizeStatus === 1) {
                            html += that.createFrameViewII(list[i], i);
                        }
                        html += '<div style="height:24px"></div>';
                    }
                    $('#recordList').html(html);
                    var mainHeight = $('#recordList').height();
                    var setHeight = mainHeight + 850;
                    $('.more-activity-banner').css('height',setHeight+'px');
                }
                if (that.hasPaging == false) {
                    that.initPagination(paging);
                    that.hasPaging = true;
                }
            }, function() {});
        },
        createFrameViewI: function(recordDetail, info) {
            var returnHtml = '<div class="frame-1"><div style="height:18px"></div>';
            returnHtml += '<div style="padding-left: 25px;font-size:18px;height:18px;line-height:18px;color:#dc3b43">';
            returnHtml += '第' + recordDetail.phaseId + "期 进行中</div>";
            returnHtml += '<div style="height:26px"></div><div style="font-size:48px;height:48px;line-height:48px;color:#fff;text-align:center">';
            returnHtml += recordDetail.prizeCount + '/20</div>';
            if (recordDetail.prizeCount === 20) {
                returnHtml += '<div style="height:42px"></div>';
                returnHtml += '<div style="font-size:16px;height:16px;line-height:16px;color:#575757;text-align:center">满额时间：' + recordDetail.createdAt.substring(0, 16).replace("T", " ") + '</div>';
                returnHtml += '<div style="height:54px"></div>';
            } else {
                returnHtml += '<div style="height:26px"></div>';
                returnHtml += '<div style="font-size:16px;height:16px;line-height:16px;color:#575757;text-align:center">工作日15点前满额，以当日上证收盘指数开奖，</div>';
                returnHtml += '<div style="height:12px"></div>';
                returnHtml += '<div style="font-size:16px;height:16px;line-height:16px;color:#575757;text-align:center">非工作日、工作日15点后满额，以下个交易日上证收盘指数开奖</div>';
                returnHtml += '<div style="height:42px"></div>';
            }
            returnHtml += '<div style="padding-left: 25px;font-size:14px;height:14px;line-height:14px;color:#888;height:174px;" clsss="is-going">';
            returnHtml += '<ul style="width:900px;height:174px;overflow-y:auto;" id="recordList' + info + '">';
            returnHtml += '</ul></div></div>';
            that.createFrameListViewI(recordDetail, info);
            return returnHtml;
        },
        createFrameListViewI: function(recordDetail, info) {
            that.account.getAccountsPrizesJourByPhaseId(that.actId, recordDetail.phaseId, recordDetail.prizeStatus, 1, 20, function(lists, pading) {
                var listHtml = "";
                for (var i = 0; i < lists.length; i++) {
                    listHtml += '<li style="margin-bottom:23px;">' + lists[i].cellphone + ' 购买了' + lists[i].entrustAmount + '元 <a href="/product_' + lists[i]['prodCodeId'] + '" style="text-decoration:underline;">' + lists[i].prodName + '</a> 获得了 ' + lists[i].prizeName + '个幸运号 <span style="float:right;padding-right:100px">' + lists[i].createdAt.substring(0, 16).replace("T", " ") + '</span></li>';
                }
                $('#recordList' + info).html(listHtml);
            }, function() {});
        },
        createFrameViewII: function(recordDetail, info) {
            var returnHtml = '<div class="frame-2"><div style="height:18px"></div>';
            returnHtml += '<div style="padding-left: 25px;font-size:18px;height:18px;line-height:18px;color:#dc3b43">';
            returnHtml += '第' + recordDetail.phaseId + "期 已开奖</div>";
            returnHtml += '<div style="height:26px"></div>';
            returnHtml += '<div style="font-size:48px;height:48px;line-height:48px;color:#fff;text-align:center">' + recordDetail.pondTitle.split(',')[1] + '</div>';
            returnHtml += '<div style="height:42px"></div>';
            returnHtml += '<div style="font-size:16px;height:16px;line-height:16px;color:#575757;text-align:center">' + recordDetail.pondTitle.split(',')[0] + ' 上证收盘指数</div>';
            returnHtml += '<div style="height:58px"></div>';
            returnHtml += '<div style="padding-left: 25px;font-size:14px;height:14px;line-height:14px;color:#888;height:376px;" id="recordList' + info + '">';
            returnHtml += '</div></div>';
            that.createFrameListViewII(recordDetail, info);
            return returnHtml;
        },
        createFrameListViewII: function(recordDetail, info) {
            that.account.getAccountsPrizesJourByPhaseId(that.actId, recordDetail.phaseId, recordDetail.prizeStatus, 1, 20, function(lists, pading) {
                var listHtml = "";
                var bounsList1 = [];
                var bounsList2 = [];
                var bounsList3 = [];
                var bounsList4 = [];
                var numList1 = [];
                var numList2 = [];
                var numList3 = [];
                var numList4 = [];

                for (var i = 0; i < lists.length; i++) {
                    var level = lists[i]['prizeLevel'];
                    switch (level) {
                        case 1:
                        case '1':
                            bounsList1.push(lists[i]['cellphone']);
                            numList1.push(lists[i]['prizeName']);
                            break;
                        case 2:
                        case '2':
                            bounsList2.push(lists[i]['cellphone']);
                            numList2.push(lists[i]['prizeName']);
                            break;
                        case 3:
                        case '3':
                            bounsList3.push(lists[i]['cellphone']);
                            numList3.push(lists[i]['prizeName']);
                            break;
                        case 4:
                        case '4':
                            bounsList4.push(lists[i]['cellphone']);
                            numList4.push(lists[i]['prizeName']);
                            break;
                        default:
                            break;
                    }
                }
                numList1 = DLC.Util.array_diff(numList1);
                numList2 = DLC.Util.array_diff(numList2);
                numList3 = DLC.Util.array_diff(numList3);
                numList4 = DLC.Util.array_diff(numList4);
								bounsList1 = DLC.Util.array_diff(bounsList1);
                bounsList2 = DLC.Util.array_diff(bounsList2);
                bounsList3 = DLC.Util.array_diff(bounsList3);
                bounsList4 = DLC.Util.array_diff(bounsList4);
                listHtml += '<div>一等奖1000元</div>';
                listHtml += '<div style="height:8px"></div>';
                listHtml += '<div>获奖号：<span style="color:#dc3b43;padding-right:20px;">' + numList1.join('、') + '</span> 获奖人：' + bounsList1.join('、') + '</div>';
                listHtml += '<div style="height:42px"></div>';
                listHtml += '<div>二等奖300元</div>';
                listHtml += '<div style="height:8px"></div>';
                listHtml += '<div>获奖号：<span style="color:#dc3b43;padding-right:20px;">' + numList2.join('、') + '</span> 获奖人：' + bounsList2.join('、') + '</div>';
                listHtml += '<div style="height:42px"></div>';
                listHtml += '<div>三等奖100元</div>';
                listHtml += '<div style="height:8px"></div>';
                listHtml += '<div>获奖号：<span style="color:#dc3b43;padding-right:20px;">' + numList3.join('、') + '</span> 获奖人：' + bounsList3.join('、') + '</div>';
                listHtml += '<div style="height:42px"></div>';
                listHtml += '<div>参与奖10元</div>';
                listHtml += '<div style="height:8px"></div>';
                listHtml += '<div>获奖号：<span style="color:#dc3b43;">' + numList4.join('、') + '</span></div>';
                listHtml += '<div style="height:5px"></div>';
                listHtml += '<div style="line-height:20px;width:900px;">获奖人：' + bounsList4.join('、') + '</div>';
                $('#recordList' + info).html(listHtml);
            }, function() {});
        },

        initPagination: function(paging) {
            $('#recordListPagination').pagination(paging.total * paging.pageSize, {
                num_edge_entries: 1,
                num_display_entries: 3,
                callback: function(page) {
                    that.getRecordList(page, 3)
                },
                items_per_page: paging.pageSize,
            });
        },
    }, {})
})($)
