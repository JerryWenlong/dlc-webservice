(function ($) {
    'use strict'
    var bulletinDetail = function (responseData) {
        var obj = {};
        obj.bulletinId = responseData.bulletinId;
        obj.bulletinType = responseData.bulletinType; //类型 0：公告  1：新闻  2：动态
        obj.top = responseData.top; //置顶
        obj.publish = responseData.publish; //
        obj.important = responseData.important; //
        obj.title = (responseData.title == null || responseData.title == "") ? "" : responseData.title; //标题
        obj.source = (responseData.source == null || responseData.source == "") ? "" : responseData.source; //来源
        obj.summery = (responseData.summery == null || responseData.summery == "") ? "" : responseData.summery; //
        obj.content = (responseData.content == null || responseData.content == "") ? "" : responseData.content; //
        obj.thumbnailUrl = (responseData.thumbnailUrl == null || responseData.thumbnailUrl == "") ? "" : responseData.thumbnailUrl; // 购买的最小单位
        obj.fileUrl = (responseData.fileUrl == null || responseData.fileUrl == "") ? "" : responseData.fileUrl; //
        obj.createdAt = responseData.createdAt.replace('T', '  ').replace(new RegExp(/-/g), '/');
        return obj;
    }

    DLC.Bulletin = DLC.derive(DLC.DLC, {
        create: function (user) {
            this.user = user;
        },

        getBulletinList: function (param, success, failed) {            
            var that = this;
            var queryData = {};
            var type = '0,1';
            if (param.hasOwnProperty('type') && param['type'] != "") {
                queryData.type = param['type']; //类型
            }
            if (param.hasOwnProperty('pageSize')) {
                queryData.pageSize = param.pageSize;
            }
            if (param.hasOwnProperty('page')) {
                queryData.page = param.page;
            }
            this.promise({
                service: 'utilService',
                api: 'newsNotice',
                type: 'get',
                header: {
                    'Content-Type': 'application/json',
                },
                data: queryData
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var prodList = [];
                    for (var i = 0; i < dataList.length; i++) {
                        var item = bulletinDetail(dataList[i]);
                        prodList.push(item);
                    }
                    var paging = {
                        page: response['paging'].page,
                        pageSize: response['paging'].pageSize,
                        total: response['paging'].total
                    };
                    success(prodList, paging);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },

        getAboutContentId: function (proID, success, failed) {
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'utilService',
                api: 'articleId',
                urlParam: [proID],
                type: 'get',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                }

            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var data = response['data'];
                    success(bulletinDetail(data));
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },


    }, {});
})($)