(function ($) {
    'use strict'

    var productDetail = function (responseData) {
        var obj = {};
        obj.id = responseData.prodCodeId;
        obj.name = responseData.prodName; //产品名
        obj.investCount = (responseData.investCount == null || responseData.investCount == "") ? 0 : responseData.investCount; // 项目期限responseData.investCount; //产品名
        obj.expectYearReturn = (responseData.expectYearReturn == null || responseData.expectYearReturn == "") ? "" : responseData.expectYearReturn; //年化率
        obj.prodPeriod = (responseData.prodPeriod == null || responseData.prodPeriod == "") ? "" : responseData.prodPeriod; // 项目期限
        obj.maxRaisedAmount = (responseData.maxRaisedAmount == null || responseData.maxRaisedAmount == "") ? "" : (parseInt(responseData.maxRaisedAmount) / 10000).toFixed(0); //项目金额 -> 万
        // obj.availableAmount = parseInt(responseData.availableAmount); //可投金额
        obj.availableAmount = (responseData.availableAmount == null || responseData.availableAmount == "") ? "" : DLC.Util.formatCurrency(parseFloat(responseData.availableAmount), 0); //可投金额
        obj.maxApplyAmount = (responseData.availableAmount == null || responseData.availableAmount == "") ? "" : parseFloat(responseData.availableAmount); //用户最大购买金额 = 可投金额
        obj.returnMethodStr = (responseData.interestType == null || responseData.interestType == "") ? "" : app.getDictName(app.dict.interestTypeList, responseData.interestType); // 还款方式
        obj.minApplyAmountStr = (responseData.minApplyAmount == null || responseData.minApplyAmount == "") ? "" : parseFloat(responseData.minApplyAmount) + '元起投，' + parseFloat(responseData.minAddAmount) + '元递增';
        obj.quotaProgress = (responseData.quotaProgress == null || responseData.quotaProgress == "") ? "" : responseData.quotaProgress; // 进度
        obj.reviewedAt = (responseData.reviewedAt == null || responseData.reviewedAt == "") ? "" : responseData.reviewedAt.replace('T', '  ').replace(new RegExp(/-/g), '/'); //发标日期
        obj.issuedAt = (responseData.issuedAt == null || responseData.issuedAt == "") ? "" : responseData.issuedAt.replace('T', '  ').replace(new RegExp(/-/g), '/'); //新发标日期

        obj.returnMethodStr_1 = (responseData.interestType == null || responseData.interestType == "") ? "" : app.getDictName(app.dict.interestTypeList_1, responseData.interestType); //收益方式
        // var endTimestamp = (responseData.raiseEndDate == null || responseData.raiseEndDate== "")? "" : new Date(responseData.raiseEndDate.replace(/-/g,'/')).getTime();
        // obj.leftTimeSeconds = (responseData.currentTimeMillis == null || responseData.currentTimeMillis== "")? "" : DLC.Util.timeToSec(endTimestamp - responseData.currentTimeMillis); // 剩余时间
        obj.minAddAmount = (responseData.minAddAmount == null || responseData.minAddAmount == "") ? "" : parseFloat(responseData.minAddAmount); // 购买的最小单位
        obj.minApplyAmount = (responseData.minApplyAmount == null || responseData.minApplyAmount == "") ? "" : parseFloat(responseData.minApplyAmount); // 最低起购金额
        obj.yearDays = (responseData.yearDays == null || responseData.yearDays == "") ? "" : parseInt(responseData.yearDays); // 收益天数

        if (responseData.raiseEndDate != null) {
            var endTimestamp = new Date(responseData.raiseEndDate.replace(/-/g, '/')).getTime();
            obj.leftTimeSeconds = responseData.ttl / 1000; // DLC.Util.timeToSec(endTimestamp - responseData.currentTimeMillis); // 剩余时间
        } else {
            obj.leftTimeSeconds = 0;
        }
        obj.details = responseData.details;
        obj.prodStatus = responseData.prodStatus;
        obj.coupons = responseData.coupons;
        obj.prodType = responseData.prodType;
        obj.invest2YearReturn = responseData.invest2YearReturn;
        obj.invest1IncReturn = responseData.invest1IncReturn;
        return obj;
    }

    DLC.Product = DLC.derive(DLC.DLC, {
        create: function (user) {
            this.user = user;
        },
        getRecommendsAll: function (prodType, success, failed, prodNum) {
            //http://wiki.allinmoney.com/pages/viewpage.action?pageId=2392066
            var authStr = this.user.getAuth();
            var that = this;
            var data = {
                page: 1,
                pageSize: 5
            };
            if (prodType !== "" && prodType != null) {
                data.prodType = prodType;
            } else {
                data.prodType = "1,2";
            }
            this.promise({
                service: 'mgtProductService',
                api: 'recommendsAll',
                type: 'get',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                },
                data: data
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var recommendList = [];
                    for (var i = 0; i < dataList.length; i++) {
                        var item = productDetail(dataList[i]);
                        recommendList.push(item);
                    }
                    var paging = {
                        page: response['paging'].page,
                        pageSize: response['paging'].pageSize,
                        total: response['paging'].total
                    };
                    success(recommendList, paging);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getRecommendsAllByTime: function (prodType, periodMin, periodMax, success, failed, prodNum) {
            //http://wiki.allinmoney.com/pages/viewpage.action?pageId=2392066
            var authStr = this.user.getAuth();
            var that = this;
            var data = {
                page: 1,
                pageSize: 5
            };
            if (prodType !== "" && prodType != null) {
                data.prodType = prodType;
            } else {
                data.prodType = "1,2";
            }
            if (periodMin !== "" && periodMin != null) {
                data.periodMin = periodMin;
            }
            if (periodMax !== "" && periodMax != null) {
                data.periodMax = periodMax;
            }
            this.promise({
                service: 'mgtProductService',
                api: 'recommendsAll',
                type: 'get',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                },
                data: data
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var recommendList = [];
                    for (var i = 0; i < dataList.length; i++) {
                        var item = productDetail(dataList[i]);
                        recommendList.push(item);
                    }
                    var paging = {
                        page: response['paging'].page,
                        pageSize: response['paging'].pageSize,
                        total: response['paging'].total
                    };
                    success(recommendList, paging);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getPromNew: function (success, failed) {
            //http://wiki.allinmoney.com/pages/viewpage.action?pageId=5541263
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'mgtProductService',
                api: 'promNew',
                type: 'get',
                data: {
                    tag: 'newbie'
                },
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                }

            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    success(dataList[0]);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getDlc: function (success, failed) {
            //http://wiki.allinmoney.com/pages/viewpage.action?pageId=5540763
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'mgtProductService',
                api: 'dlc',
                type: 'get',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                }

            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];

                    success(dataList);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getDlcByProductId: function (proID, success, failed) {
            //http://wiki.allinmoney.com/pages/viewpage.action?pageId=5540763
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'mgtProductService',
                api: 'dlcProductId',
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
                    success(productDetail(data));
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getProductList: function (param, success, failed) {
            var that = this;
            var queryData = {};
            if (param.hasOwnProperty('prodStatus') && param['prodStatus'] != "") {
                queryData.prodStatus = param['prodStatus']; //产品状态
            }
            if (param.hasOwnProperty('periodMin') && param['periodMin'] != "") {
                queryData.periodMin = param['periodMin']; //最小期限
            }
            if (param.hasOwnProperty('periodMax') && param['periodMax'] != "") {
                queryData.periodMax = param['periodMax']; //最大期限
            }
            if (param.hasOwnProperty('pageSize')) {
                queryData.pageSize = param.pageSize;
            }
            if (param.hasOwnProperty('page')) {
                queryData.page = param.page;
            }
            if (param.hasOwnProperty('prodType') && param['prodType'] !== "") {
                queryData.prodType = param.prodType;
            }

            this.promise({
                service: 'mgtProductService',
                api: 'recommendsAll',
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
                        var item = productDetail(dataList[i]);
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
        getAndroidApk: function (proID, success, failed) {
            //http://wiki.allinmoney.com/pages/viewpage.action?title=AppVersion+API&spaceKey=apidocs

            var that = this;
            this.promise({
                service: 'utilService',
                api: 'getApk',
                urlParam: ["dlc"],
                type: 'get',
                header: {
                    'Content-Type': 'application/json'
                }

            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var data = response['data'];
                    success((data));
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getBulletinAll: function (param, success, failed) {
            var that = this;
            var queryData = {};
            if (param.hasOwnProperty('type') && param['type'] != "") {
                queryData.type = param['type'];
            }

            if (param.hasOwnProperty('title') && param['title'] != "") {
                queryData.title = param['title'];
            }
            if (param.hasOwnProperty('pageSize')) {
                queryData.pageSize = param.pageSize;
            }
            if (param.hasOwnProperty('page')) {
                queryData.page = param.page;
            }

            this.promise({
                service: 'utilService',
                api: 'getBulletin',
                type: 'get',
                header: {
                    'Content-Type': 'application/json'
                },
                data: param
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var prodList = [];
                    for (var i = 0; i < dataList.length; i++) {
                        var item = dataList[i];
                        if (item.createdAt != "") {
                            var index = item.createdAt.indexOf("T", 0);
                            item.createdAt = item.createdAt.substr(0, index);
                            item.createdAt = item.createdAt.replace(/-/g, "/");
                        }
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
    }, {});
})($)
