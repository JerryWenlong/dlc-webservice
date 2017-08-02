(function ($) {
    'use strict'
    var generateOrderDetail = function (responseData) {
        var obj = {};
        obj.productId = responseData.productId;
        obj.productTaNo = responseData.productTaNo;
        obj.productCode = responseData.productCode;
        obj.productName = responseData.productName;
        obj.productType = responseData.productType;
        obj.productCompany = responseData.productCompany;
        obj.productPeriod = responseData.productPeriod;
        obj.productRiskLevel = app.getDictName(app.dict.riskLevelList, responseData.productRiskLevel.toString());
        obj.productBeginAt = responseData.productBeginAt == null ? "" : DLC.Util.dateFormat(responseData.productBeginAt);
        obj.productEndAt = responseData.productEndAt == null ? "" : DLC.Util.dateFormat(responseData.productEndAt);
        obj.status = app.getDictName(app.dict.orderStatus, responseData.status);
        obj.orderStatus = responseData.status;
        obj.bizStatus = responseData.bizStatus;
        obj.total = responseData.total; // 订单金额
        obj.createdAt = responseData.createdAt.replace('T', ' ').replace(/-/g, "/");
        obj.expectedProfit = responseData.expectedProfit; //
        obj.productRate = responseData.productRate; //预期年化率
        obj.orderNo = responseData.orderNo;
        obj.tradeSerialNo = responseData.tradeSerialNo; // 交易号
        obj.entrustAmount = responseData.entrustAmount; // 投资金额
        obj.entrustPrice = responseData.entrustPrice;
        obj.commissionFee = responseData.commissionFee; //手续费
        obj.taFee = responseData.taFee; //管理费
        obj.subFee = responseData.subFee; //申购费
        obj.productRaiseAmount = (responseData.productRaiseAmount == null || responseData.productRaiseAmount == "") ? "" : DLC.Util.formatCurrency((parseInt(responseData.productRaiseAmount) / 10000).toFixed(0), 0); //项目金额 -> 万
        obj.leftTimeSeconds = DLC.Util.timeToSec(responseData.ttl); // 剩余时间;
        return obj
    };
    var generateOrderForList = function (responseData) {
        var obj = {};
        obj.createdAt = responseData.createdAt.replace('T', ' ').replace(/-/g, "/");
        obj.entrustAmount = responseData.entrustAmount;
        obj.entrustPrice = responseData.entrustPrice;
        obj.orderNo = responseData.orderNo;
        obj.productId = responseData.productId;
        obj.productName = responseData.productName;
        obj.productRiskLevel = app.getDictName(app.dict.prodRiskLevel, responseData.productRiskLevel.toString());
        obj.status = app.getDictName(app.dict.orderStatus, responseData.status);
        obj.action = app.getDictName(app.dict.orderStatusV, responseData.status);
        obj.productStatus = app.getDictName(app.dict.productStatus, responseData.productStatus);
        obj.total = responseData.total;
        obj.freeTrial = responseData.freeTrial;
        obj.tradeSerialNo = responseData.tradeSerialNo;
        obj.contractRequired = responseData.contractRequired;
        obj.contractFile = responseData.contractFile;

        if (obj.contractRequired && obj.contractFile != null) {
            obj.contract = "查看";
        } else {
            obj.contract = "- -";
        }

        return obj
    }
    var generateTradeForList = function (responseData) {
        var obj = {};
        obj.entrustAmount = responseData.entrustAmount;
        obj.createdAt = responseData.createdAt.replace('T', ' ').replace(/-/g, "/");
        return obj
    };
    var generateTradeListForProduct = function (responseData) {
        var obj = {};
        obj.entrustAmount = responseData.entrustAmount;
        obj.createdAt = responseData.createdAt.replace('T', ' ').replace(/-/g, "/");
        obj.userName = responseData.maskedUsername;
        return obj
    };
    var generateNewTradeListForProduct = function (responseData) {
        var obj = {};
        obj.entrustAmount = responseData.amount;
        obj.createdAt = responseData.investedAt.replace('T', ' ').replace(/-/g, "/");
        obj.userName = responseData.cellphone;
        obj.investFrom = responseData.investFrom;
        return obj
    };
    var generateJournal = function (responseData) {
        var obj = {};
        obj.tradeSerialNo = responseData.tradeSerialNo;
        obj.createdAt = responseData.createdAt.replace('T', ' ').replace(/-/g, "/");
        obj.amount = responseData.amount;
        obj.transType = app.getDictName(app.dict.financeTransType, responseData.transType);
        obj.tradeType = app.getDictName(app.dict.financeTradeType, responseData.tradeType);
        obj.tradeStatus = app.getDictName(app.dict.tradeStatus, responseData.tradeStatus);
        obj.tradeSubject = responseData.tradeSubject;
        obj.assetType = responseData.assetType;
        obj.tradeRemark = responseData.tradeRemark;

        return obj;
    }

    DLC.Trade = DLC.derive(DLC.DLC, {
        create: function (user) {
            this.user = user;
        },
        createOrder: function (productId, amount, success, failed) {
            //http://wiki.allinmoney.com/pages/viewpage.action?pageId=5538035
            var authStr = this.user.getAuth();
            var that = this;
            var data = {
                productId: productId,
                amount: amount
            }
            this.promise({
                service: 'bizTradeService',
                api: 'cradeOrder',
                type: 'post',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                },
                data: data
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data']);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        createOrderTrade: function (orderNo, success, failed) {
            //http://wiki.allinmoney.com/pages/viewpage.action?pageId=5540809
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'bizTradeService',
                api: 'cradeOrderTrade',
                urlParam: [orderNo],
                type: 'post',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                },
                timeout: 10000,
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data']);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getOrderDetail: function (orderNo, success, failed) {
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'bizTradeService',
                api: 'orderDetail',
                urlParam: [orderNo],
                type: 'get',
                header: {
                    'Authorization': authStr
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(generateOrderDetail(response['data']));
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getOrderList: function (param, success, failed) {
            var authStr = this.user.getAuth();
            var that = this;
            var data = {};
            if (param['pageSize']) data.pageSize = param.pageSize || 10;
            if (param['page']) data.page = param.page || 1;
            if (param.hasOwnProperty('sort')) data.sort = param['sort'];
            if (param.hasOwnProperty('asc')) data.asc = param['asc'];
            if (param.hasOwnProperty('bizStatus')) data.bizStatus = param['bizStatus'];
            if (param.hasOwnProperty('fromDate')) data.fromDate = param['fromDate'];
            if (param.hasOwnProperty('toDate')) data.toDate = param['toDate'];

            this.promise({
                service: 'bizTradeService',
                api: 'orderList',
                type: 'get',
                data: data,
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr,
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var orderList = [];
                    for (var i = 0; i < dataList.length; i++) {
                        var order = generateOrderForList(dataList[i]);
                        orderList.push(order);
                    }
                    var paging = {
                        page: response['paging'].page,
                        pageSize: response['paging'].pageSize,
                        total: response['paging'].total
                    };
                    success(orderList, paging);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getContract: function (orderNo, success, failed) {
            // tradeLis is bizShare list.
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'bizTradeService',
                api: 'contract',
                method: 'get',
                urlParam: [orderNo],
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var contract = response['data']["contract"];
                    success(contract);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getTradeRecordList: function (param, success, failed) {
            // tradeLis is bizShare list. For user
            var authStr = this.user.getAuth();
            var that = this;
            var data = {};
            if (!param.hasOwnProperty('productId')) {
                throw 'productId should be required'
            }
            data.productId = param.productId;
            data.pageSize = param.pageSize || 10;
            data.page = param.page || 1;
            this.promise({
                service: 'bizTradeService',
                api: 'tradeList',
                method: 'get',
                data: data,
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr,
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var tradeList = [];
                    for (var i = 0; i < dataList.length; i++) {
                        var trade = generateTradeForList(dataList[i]);
                        tradeList.push(trade);
                    }
                    var paging = {
                        page: response['paging'].page,
                        pageSize: response['paging'].pageSize,
                        total: response['paging'].total
                    };
                    success(tradeList, paging);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getProductTradeList: function (param, success, failed) {
            // get product trade list
            var that = this;
            var data = {};
            if (!param.hasOwnProperty('productId')) {
                throw 'productId should be required'
            }
            data.productId = param.productId;
            data.pageSize = param.pageSize || 10;
            data.page = param.page || 1;
            this.promise({
                service: 'bizTradeService',
                api: 'productTradeList',
                method: 'get',
                data: data,
                header: {
                    'Content-Type': 'application/json',
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var tradeList = [];
                    for (var i = 0; i < dataList.length; i++) {
                        var trade = generateTradeListForProduct(dataList[i]);
                        tradeList.push(trade);
                    }
                    var paging = {
                        page: response['paging'].page,
                        pageSize: response['paging'].pageSize,
                        total: response['paging'].total
                    };
                    success(tradeList, paging);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getNewProductTradeList: function (param, success, failed) {
            // get product trade list
            var that = this;
            var data = {};
            if (!param.hasOwnProperty('productId')) {
                throw 'productId should be required'
            }
            data.prodCodeId = param.productId;
            data.pageSize = param.pageSize || 10;
            data.page = param.page || 1;
            this.promise({
                service: 'bizTradeService',
                api: 'tradesInvestList',
                method: 'get',
                data: data,
                header: {
                    'Content-Type': 'application/json',
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var tradeList = [];
                    for (var i = 0; i < dataList.length; i++) {
                        var trade = generateNewTradeListForProduct(dataList[i]);
                        tradeList.push(trade);
                    }
                    var paging = {
                        page: response['paging'].page,
                        pageSize: response['paging'].pageSize,
                        total: response['paging'].total
                    };
                    success(tradeList, paging);
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        tradePay: function (param, success, failed) {
            // http://wiki.allinmoney.com/pages/viewpage.action?pageId=5538100
            var authStr = this.user.getAuth();
            var that = this;
            var data = {};

            if (param.hasOwnProperty('smsCode')) {
                data.smsCode = param['smsCode'];
            }

            if (!param.hasOwnProperty('tradeSerialNo')) {
                throw 'tradeSerialNo should be required'
            }
            data.tradeSerialNo = param.tradeSerialNo;
            if (!param.hasOwnProperty('tradePassword')) {
                throw 'tradePassword should be required'
            }
            var tradePassword = param.tradePassword;
            if (!param.hasOwnProperty('acceptTos') || param['acceptTos'] != true) {
                throw 'acceptTos need be choosen'
            }
            data.acceptTos = param['acceptTos'];

            if (!param.hasOwnProperty('items') || param.items.length <= 0) {
                throw 'should choose pay asset type'
            }
            var itemsList = [];
            for (var i = 0; i < param.items.length; i++) {
                var item = param.items[i];
                var obj = {};
                if (!item.hasOwnProperty('assetType')) {
                    throw 'assetType should be required'
                }
                obj.assetType = item.assetType;
                if (!item.hasOwnProperty('amount')) {
                    throw 'amount should be required'
                }
                obj.amount = item.amount;
                if (item.hasOwnProperty('payChannel')) {
                    obj.payChannel = item.payChannel;
                }
                if (item.hasOwnProperty('assetId')) {
                    obj.assetId = item['assetId']
                }
                itemsList.push(obj);
            }
            data.items = itemsList;
            this.user.getUserSalt(that.user.userName, function (response) {
                var errorCode = response['error'];
                if (errorCode == '0') {
                    var salt = response['data'].salt;
                    that.user.cryptPasswordSync(tradePassword, salt, function (error, encryptPassword) {
                        data.password = encryptPassword;
                        that.promise({
                            service: 'accountService',
                            api: 'payTrade',
                            type: 'post',
                            data: data,
                            header: {
                                'Content-Type': 'application/json',
                                'Authorization': authStr,
                            }
                        }, function (response) {
                            var errorCode = response['error'];
                            if (errorCode == '0') {
                                success(response['data']);
                            } else {
                                that.processError(errorCode, failed, response)
                            }
                        }, function (error) {
                            that.callApiError(error, failed);
                        })
                    });
                } else {
                    //get salt failed
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                // get salt error
                that.callApiError(error, failed);
            })

        },

        deposit: function (param, success, failed) {
            //http://wiki.allinmoney.com/pages/viewpage.action?pageId=5540866
            var authStr = this.user.getAuth();
            var that = this;
            if (!param.hasOwnProperty('tradePassword')) {
                throw 'tradePassword should be required'
            }
            var tradePassword = param.tradePassword;
            if (!param.hasOwnProperty('acceptTos') || param['acceptTos'] != true) {
                throw 'acceptTos need be choosen'
            }
            var acceptTos = param['acceptTos'];
            if (!param.hasOwnProperty('amount')) {
                throw 'amount should be required'
            }
            var amount = param['amount'];
            this.user.getUserSalt(that.user.userName, function (response) {
                var errorCode = response['error'];
                if (errorCode == '0') {
                    var salt = response['data'].salt;
                    that.user.cryptPasswordSync(tradePassword, salt, function (error, encryptPassword) {
                        var data = {
                            password: encryptPassword,
                            acceptTos: acceptTos,
                            totalAmount: amount
                        };
                        if (param.hasOwnProperty('smsCode')) {
                            data.smsCode = param['smsCode'];
                        }
                        if (param.hasOwnProperty('payChannel')) {
                            data.payChannel = param['payChannel'];
                        }
                        if (param.hasOwnProperty('notifyUrl')) {
                            data.notifyUrl = param['notifyUrl'];
                        }
                        if (param.hasOwnProperty('bankNo')) {
                            data.bankNo = param['bankNo'];
                        }
                        that.promise({
                            service: 'accountService',
                            api: 'deposit',
                            type: 'post',
                            data: data,
                            header: {
                                'Content-Type': 'application/json',
                                'Authorization': authStr
                            }
                        }, function (response) {
                            var errorCode = response['error'];
                            if (errorCode == 0) {
                                success(response.data);
                            } else {
                                that.processError(errorCode, failed, response)
                            }
                        }, function (error) {
                            that.callApiError(error, failed);
                        })
                    });

                } else {
                    //get salt failed
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                // get salt error
                that.callApiError(error, failed);
            })
        },
        withdraw: function (param, success, failed) {
            //http://wiki.allinmoney.com/pages/viewpage.action?pageId=5540868
            var authStr = this.user.getAuth();
            var that = this;
            if (!param.hasOwnProperty('tradePassword')) {
                throw 'tradePassword should be required'
            }
            var tradePassword = param.tradePassword;
            if (!param.hasOwnProperty('acceptTos') || param['acceptTos'] != true) {
                throw 'acceptTos need be choosen'
            }
            var acceptTos = param['acceptTos'];
            if (!param.hasOwnProperty('amount')) {
                throw 'amount should be required'
            }
            var amount = param['amount'];
            var data = {
                acceptTos: acceptTos,
                totalAmount: amount
            }
            if (param.hasOwnProperty('smsCode')) {
                data.smsCode = param['smsCode'];
            }
            this.user.getUserSalt(that.user.userName, function (response) {
                var errorCode = response['error'];
                if (errorCode == '0') {
                    var salt = response['data'].salt;
                    that.user.cryptPasswordSync(tradePassword, salt, function (error, encryptPassword) {
                        data.password = encryptPassword;
                        that.promise({
                            service: 'accountService',
                            api: 'withdraw',
                            type: 'post',
                            data: data,
                            header: {
                                'Content-Type': 'application/json',
                                'Authorization': authStr,
                            }
                        }, function (response) {
                            var errorCode = response['error'];
                            if (errorCode == 0) {
                                success();
                            } else {
                                that.processError(errorCode, failed, response)
                            }
                        }, function (error) {
                            that.callApiError(error, failed);
                        })
                    });

                } else {
                    //get salt failed
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                // get salt error
                that.callApiError(error, failed);
            })
        },
        getJournalList: function (param, success, failed) {
            //http://wiki.allinmoney.com/pages/viewpage.action?pageId=5538163
            var authStr = this.user.getAuth();
            var that = this;
            var data = {
                pageSize: 10,
                page: 1,
            };
            if (param.hasOwnProperty('tradeType')) {
                data.tradeType = param.tradeType;
            }
            if (param.hasOwnProperty('page')) {
                data.page = param.page;
            }
            if (param.hasOwnProperty('pageSize')) {
                data.pageSize = param.pageSize;
            }
            if (param.hasOwnProperty('asc')) data.asc = param['asc'];
            this.promise({
                service: 'accountService',
                api: 'journal',
                type: 'get',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr,
                },
                data: data
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var responseDataList = response['data'];
                    var list = [];
                    for (var i = 0; i < responseDataList.length; i++) {
                        list.push(generateJournal(responseDataList[i]));
                    }
                    var paging = {
                        page: response['paging'].page,
                        pageSize: response['paging'].pageSize,
                        total: response['paging'].total
                    };
                    success(list, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            });
        },
    }, {});
})($)