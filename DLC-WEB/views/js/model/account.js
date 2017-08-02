(function ($) {
    'use strict'
    var accountInfo = {
        asset: {
            totalBrokerage: '',
            totalCapital: '',
            totalPoint: '',
            totalProfit: '',
            yesterProfit: '',
        },
        authed: '',
        balance: {
            available: '',
            total: '',
        },
        cards: [],
        cellphone: '',
        hasCard: '',
        hasPassword: '',
        inNo: '',
        level: '',
        lockExpire: '',
        name: '',
        riskLevel: '',
        status: '',
        totalAsset: ''
    }

    var generateProductShare = function (responseDataList) {
        var list = [];
        for (var i = 0; i < responseDataList.length; i++) {
            var obj = {};
            var item = responseDataList[i];
            obj.id = item.id;
            obj.expectedProfit = item.expectedProfit;
            obj.cashInAt = DLC.Util.dateFormat(item.cashInAt);
            obj.productBeginAt = DLC.Util.dateFormat(item.productBeginAt);
            obj.productCode = item.productCode;
            obj.couponCategory = item.couponCategory;
            obj.categoryType = item.categoryType;
            obj.rateSteps = item.rateSteps;
            obj.productCompany = item.productCompany;
            obj.productEndAt = DLC.Util.dateFormat(item.productEndAt);
            obj.productId = item.productId;
            obj.productName = item.productName;
            obj.productPeriod = item.productPeriod;
            obj.productRate = item.productRate;
            obj.addedRate = item.addedRate;
            obj.productTaNo = item.productTaNo;
            obj.status = app.getDictName(app.dict.share, item.status);
            obj.sumExpectedProfit = item.sumExpectedProfit;
            obj.sumSettled = item.sumSettled;
            obj.updatedAt = DLC.Util.dateFormat(item.updatedAt)
            list.push(obj);
        }
        return list
    }

    var couponsList = function (responseDataList) {
        var list = [];
        for (var i = 0; i < responseDataList.length; i++) {
            var one = couponDetail(responseDataList[i]);
            list.push(one);
        }
        return list
    }

    var couponDetail = function (responseData) {
        var obj = {};
        obj.couponId = responseData.couponId;
        obj.couponCode = responseData.couponCode;
        obj.couponCategory = responseData.couponCategory;
        obj.categoryType = responseData.categoryType;
        obj.rateSteps = responseData.rateSteps;
        obj.status = responseData.status;
        obj.minInvestAmount = responseData.minInvestAmount;
        obj.maxInvestAmount = responseData.maxInvestAmount;
        obj.receivedAt = responseData.receivedAt;
        obj.usedAt = responseData.usedAt;
        obj.expiredAt = responseData.expiredAt;
        obj.redeemedAt = responseData.redeemedAt;
        obj.expectProfit = responseData.expectProfit;
        obj.description = responseData.description;
        obj.products = responseData.products;
        obj.amount = responseData.amount;
        obj.validFrom = (responseData.validFrom != null && responseData.validFrom != "") ? DLC.Util.dateFormat_1(responseData.validFrom) : "";
        obj.validThru = (responseData.validThru != null && responseData.validThru != "") ? DLC.Util.dateFormat_1(responseData.validThru) : "";
        obj.prodCodeId = responseData.prodCodeId;
        obj.prodName = responseData.prodName;
        obj.prodTerm = responseData.prodTerm;
        obj.summary = (responseData.summary != null && responseData.summary != "") ? '【' + responseData.summary + '】' : "";
        return obj;
    }

    DLC.Account = DLC.derive(DLC.DLC, {
        create: function (user) {
            this.user = user;
            this.accountInfo = null;
        },
        getBizShareDetail: function (id, success, failed) {
            var authStr = this.user.getAuth();
            var urlParam = [id];
            var that = this;
            this.promise({
                service: 'bizAccountService',
                api: 'productShareDetail',
                type: 'get',
                urlParam: urlParam,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data']['trades'])
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            });
        },
        getBizShare: function (param, success, failed) {
            // Share of financial products
            // param ----
            // pageSize, page
            // status: the status of user product
            var authStr = this.user.getAuth();
            var that = this;
            var data = {};
            if (param == 'default') {
                data = {
                    pageSize: 10,
                    page: 1
                }
            } else {
                if (param['pageSize']) data.pageSize = param.pageSize;
                if (param['page']) data.page = param.page;
                if (param.hasOwnProperty('status')) data.status = param.status;
                if (param.hasOwnProperty('sort')) data.sort = param.sort;
                if (param.hasOwnProperty('asc')) data.asc = param.asc;
            }


            this.promise({
                service: 'bizAccountService',
                api: 'productShare',
                type: 'get',
                header: {
                    'Authorization': authStr
                },
                data: data
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var productShare = generateProductShare(response['data']);
                    var paging = {
                        page: response['paging'].page,
                        pageSize: response['paging'].pageSize,
                        total: response['paging'].total
                    };
                    success(productShare, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },

        getBizAccountInfo: function (success, failed, globalTag) {
            //get user biz account info
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'accountService',
                api: 'accountInfo',
                type: 'get',
                global: globalTag,
                header: {
                    'Authorization': authStr
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    that.accountInfo = response['data'];
                    success()
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            });
        },
        getBizCoupons: function (success, failed, param) {
            //get user biz account info
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'accountService',
                api: 'coupons',
                type: 'get',
                header: {
                    'Authorization': authStr
                },
                data: param
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {

                    success(response.data)
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            });
        },

        certification: function (name, idNo, success, failed) {
            // certification
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'accountService',
                api: 'certification',
                type: 'post',
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                },
                data: {
                    name: name,
                    idNo: idNo
                }
            }, function (response) {
                //
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success()
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        bindAccountCard: function (param, success, failed) {
            //http://wiki.allinmoney.com/pages/viewpage.action?pageId=5538068
            // holderName	持卡人姓名	string	no {如果已做实名认证，可以不填}
            // idNo	身份证号 string no {如果已做实名认证，可以不填}
            // cardNo	卡号	string	yes
            // bankNo	银行编号	string	yes
            // province	银行省份	string	no
            // city	银行城市	string	no
            // cellphone	开卡手机号	string	yes
            // smsCode	短信验证码	string	yes
            // acceptTos	接受用户协议	bool	yes {must be true}
            var authStr = this.user.getAuth();
            var that = this;
            var data = {};
            if (param.hasOwnProperty('holderName') && param['holderName'] != "") {
                data.holderName = param['holderName'];
            } else if (this.accountInfo && this.accountInfo.authed != true) {
                throw 'holderName is required'
                return
            }
            if (param.hasOwnProperty('idNo') && param['idNo'] != "") {
                data.idNo = param['idNo'];
            } else if (this.accountInfo && this.accountInfo.authed != true) {
                throw 'idNo is required'
                return
            }
            data.cardNo = param.cardNo;
            data.bankNo = param.bankNo;
            if (param.hasOwnProperty('province')) data.province = param.province;
            if (param.hasOwnProperty('city')) data.city = param.city;
            data.cellphone = param.cellphone;
            data.smsCode = param.smsCode;
            data.acceptTos = param.acceptTos;
            if (data.acceptTos != true) {
                throw 'acceptTos should be confirmed'
            }

            this.promise({
                service: 'accountService',
                api: 'bindCard',
                type: 'post',
                data: data,
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data'])
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            });
        },
        bindCardOtp: function (cellphone, success, failed) {
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'accountService',
                api: 'bindCardOtp',
                type: 'get',
                data: {
                    cellphone: cellphone
                },
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data'])
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            });
        },
        getBindCardOtpValidate: function (cellphone, smsCode, success, failed) {
            //action pay|deposit|withdraw|transfer
            var urlParam = [cellphone, smsCode];
            var that = this;
            var authStr = this.user.getAuth();
            this.promise({
                service: 'accountService',
                api: 'bindCardOtpValidate',
                urlParam: urlParam,
                type: 'get',
                header: {
                    'Authorization': authStr,
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    success(dataList);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },

        resetTradePasswordOtp: function (success, failed) {
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'accountService',
                api: 'resetTradePwOtp',
                type: 'get',
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data'])
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            });
        },

        validateResetTradePassword: function (param, success, failed) {
            var authStr = this.user.getAuth();
            var that = this;
            var data = {};
            if (!param.hasOwnProperty('smsCode')) {
                throw Exception('no SmsCode');
            }
            data.smsCode = param['smsCode'];
            if (param.hasOwnProperty('idNo'))
                data.idNo = param['idNo'];
            if (param.hasOwnProperty('cardNo'))
                data.cardNo = param['cardNo'];
            this.promise({
                service: 'accountService',
                api: 'resetTradePwValidate',
                type: 'post',
                data: data,
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data'])
                } else {
                    //
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        resetTradePassword: function (tradePassword, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            this.user.getUserSalt(that.user.userName, function (response) {
                var errorCode = response['error'];
                if (errorCode == '0') {
                    var salt = response['data'].salt;
                    //var encryptPassword = that.user.cryptPasswordSync(tradePassword, salt)[0];
                    that.cryptPasswordSync(tradePassword, salt, function (error, encryptPassword) {
                        that.promise({
                            service: 'accountService',
                            api: 'resetTradePw',
                            type: 'put',
                            header: {
                                'Content-Type': 'application/json',
                                'Authorization': authStr
                            },
                            data: {
                                password: encryptPassword,
                                confirmPassword: encryptPassword,
                            }
                        }, function (response) {
                            //rest password trade success
                            var errorCode = response['error'];
                            if (errorCode == 0) {
                                success(response['data'])
                            } else {
                                //
                                that.processError(errorCode, failed, response)
                            }
                        }, function (error) {
                            that.callApiError(error, failed);
                        })
                    });
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },

        getProvinceCity: function (success, failed) {
            var that = this;
            this.promise({
                service: 'paymentService',
                api: 'provinces',
                type: 'get'
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    success(dataList);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getCardbins: function (success, failed) {
            var that = this;
            this.promise({
                service: 'paymentService',
                api: 'cardbins',
                type: 'get',
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    success(dataList);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getAllBanks: function (success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            this.promise({
                service: 'paymentService',
                api: 'banks',
                type: 'get',
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    success(dataList);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getAllBfBanks: function (success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            this.promise({
                service: 'paymentService',
                api: 'banks',
                type: 'get',
                data: {
                    payChannel: 1
                },
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    success(dataList);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getBanks: function (bankNo, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            this.promise({
                service: 'paymentService',
                api: 'banks',
                type: 'get',
                data: {
                    bankNo: bankNo
                },
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    success(dataList);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getExperiences: function (status, page, pageSize, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            var datas = (status == '') ? {
                page: page,
                pageSize: pageSize
            } : {
                status: status,
                page: page,
                pageSize: pageSize
            };
            this.promise({
                service: 'accountService',
                api: 'coupons',
                type: 'get',
                data: datas,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getInterestToken: function (status, page, pageSize, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            var datas = (status == '') ? {
                page: page,
                pageSize: pageSize,
                categoryId: 3
            } : {
                status: status,
                page: page,
                pageSize: pageSize,
                categoryId: 3
            };
            this.promise({
                service: 'accountService',
                api: 'coupons',
                type: 'get',
                data: datas,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },

        getRedPacket: function (status, page, pageSize, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            var datas = (status == '') ? {
                page: page,
                pageSize: pageSize,
                categoryId: 2
            } : {
                status: status,
                page: page,
                pageSize: pageSize,
                categoryId: 2
            };
            this.promise({
                service: 'accountService',
                api: 'coupons',
                type: 'get',
                data: datas,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getExperiencesCoupon: function (prodCodeId, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            this.promise({
                service: 'accountService',
                api: 'coupons',
                type: 'get',
                data: {
                    prodCodeId: prodCodeId,
                    categoryId: 1
                },
                header: {
                    'Authorization': authStr,
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    if (dataList.length >= 1) {
                        success(couponsList(dataList));
                    } else {
                        failed('no coupon', '用户没有该优惠券')
                    }

                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getCouponsCount: function (status, categoryId, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            var datas = {
                status: status,
                categoryId: categoryId
            };
            this.promise({
                service: 'accountService',
                api: 'couponsCount',
                type: 'get',
                data: datas,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data']);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getProductCoupon: function (prodCodeId, amount, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            this.promise({
                service: 'accountService',
                api: 'coupons',
                type: 'get',
                data: {
                    prodCodeId: prodCodeId,
                    categoryId: 2,
                    amount: amount
                },
                header: {
                    'Authorization': authStr,
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    if (dataList.length >= 1) {
                        success(couponsList(dataList));
                    } else {
                        failed('no coupon', '用户没有该优惠券')
                    }

                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getProductToken: function (prodCodeId, amount, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            this.promise({
                service: 'accountService',
                api: 'coupons',
                type: 'get',
                data: {
                    prodCodeId: prodCodeId,
                    categoryId: 3,
                    amount: amount
                },
                header: {
                    'Authorization': authStr,
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    if (dataList.length >= 1) {
                        success(couponsList(dataList));
                    } else {
                        failed('no coupon', '用户没有该优惠券')
                    }

                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getPayOtp: function (action, success, failed) {
            //action pay|deposit|withdraw|transfer
            var urlParam = [action];
            var that = this;
            var authStr = this.user.getAuth();
            this.promise({
                service: 'accountService',
                api: 'payOtp',
                urlParam: urlParam,
                type: 'get',
                header: {
                    'Authorization': authStr,
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    success(dataList);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getOtpValidate: function (action, smsCode, success, failed) {
            //action pay|deposit|withdraw|transfer
            var urlParam = [action, smsCode];
            var that = this;
            var authStr = this.user.getAuth();
            this.promise({
                service: 'accountService',
                api: 'otpValidate',
                urlParam: urlParam,
                type: 'get',
                header: {
                    'Authorization': authStr,
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    success(dataList);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        cryptPasswordSync: function (pw, salt, callback) {
            if (!salt || salt == "") {
                var salt = dcodeIO.bcrypt.genSaltSync(_round);
            }
            if (callback) {
                // async method
                var hash_str = dcodeIO.bcrypt.hash(pw, salt, callback)
            } else {
                // sync method
                var hash_str = dcodeIO.bcrypt.hashSync(pw, salt);
                return [hash_str, salt];
            }

        },
        getPointsJour: function (type, page, pageSize, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            var datas = (type === '') ? {
                page: page,
                pageSize: pageSize
            } : {
                type: type,
                page: page,
                pageSize: pageSize
            };
            this.promise({
                service: 'accountService',
                api: 'pointsJour',
                type: 'get',
                data: datas,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getPointsRefer: function (page, pageSize, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            var datas = {
                page: page,
                pageSize: pageSize
            };
            this.promise({
                service: 'accountService',
                api: 'pointsRefer',
                type: 'get',
                data: datas,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getPointsCount: function (type, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            var datas = (type === '') ? {} : {
                type: type
            };
            this.promise({
                service: 'accountService',
                api: 'pointsCount',
                type: 'get',
                data: datas,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var count = response['data'].count;
                    success(count);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getReferInvests: function (page, pageSize, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            var datas = {
                page: page,
                pageSize: pageSize
            };
            this.promise({
                service: 'bizAccountService',
                api: 'referralCredit',
                type: 'get',
                data: datas,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getReferRanks: function (investLimit, success, failed) {
            var that = this;
            var datas = (investLimit === '') ? {} : {
                investLimit: investLimit
            };
            this.promise({
                service: 'accountService',
                api: 'referRanks',
                type: 'get',
                data: datas,
                header: {
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getAccountRaffle: function (actId, type, pondId, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            var datas = {
                actId: actId
            };
            if (type !== "get" && type !== "post") {
                return "type类型错误";
            }
            //get获取抽奖机会，post抽奖动作
            if (type == "get") {
                if (pondId !== "") {
                    datas.pondIds = pondId;
                }
            } else {
                if (pondId !== "") {
                    datas.pondId = pondId;
                }
            }
            this.promise({
                service: 'accountService',
                api: 'accountRaffle',
                type: type,
                data: datas,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data']);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getAccountPrizes: function (actId, pondId, page, pageSize, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            var datas = {
                page: page,
                pageSize: pageSize
            };
            if (actId !== "") {
                datas.actId = actId;
            }
            if (pondId !== "") {
                datas.pondId = pondId;
            }
            this.promise({
                service: 'accountService',
                api: 'accountPrizes',
                type: 'get',
                data: datas,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getAccountsPrizesJour: function (actId, pondId, page, pageSize, success, failed) {
            var that = this;
            var datas = {
                page: page,
                pageSize: pageSize
            };
            if (actId !== "") {
                datas.actId = actId;
            }
            if (pondId !== "") {
                datas.pondId = pondId;
            }
            this.promise({
                service: 'accountService',
                api: 'accountsPrizesJour',
                type: 'get',
                data: datas,
                header: {
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getAccountsPrizesJourByType: function (actId, pondId, type, page, pageSize, success, failed) {
            var that = this;
            var datas = {
                page: page,
                pageSize: pageSize
            };
            if (actId !== "") {
                datas.actId = actId;
            }
            if (pondId !== "") {
                datas.pondId = pondId;
            }
            if (type !== "") {
                datas.type = type;
            }
            this.promise({
                service: 'accountService',
                api: 'accountsPrizesJour',
                type: 'get',
                data: datas,
                header: {
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getAccountDoRaffle: function (actId, type, pondId, success, failed) {
            var that = this;
            var authStr = this.user.getAuth();
            var datas = {
                actId: actId
            };
            if (type !== "") {
                datas.type = type;
            }
            if (pondId !== "") {
                datas.pondId = pondId;
            }
            this.promise({
                service: 'accountService',
                api: 'accountRaffle',
                type: 'post',
                data: datas,
                header: {
                    'Authorization': authStr,
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data']);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getAccountsPrizesStats: function (actId, page, pageSize, success, failed) {
            var that = this;
            var datas = {
                actId: actId,
                page: page,
                pageSize: pageSize
            };
            this.promise({
                service: 'accountService',
                api: 'accountsPrizesStats',
                type: 'get',
                data: datas,
                header: {
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        getAccountsPrizesJourByPhaseId: function (actId, phaseId, prizeStatus, page, pageSize, success, failed) {
            var that = this;
            var datas = {
                page: page,
                pageSize: pageSize
            };
            if (actId !== "") {
                datas.actId = actId;
            }
            if (phaseId !== "") {
                datas.phaseId = phaseId;
            }
            if (prizeStatus !== "") {
                datas.prizeStatus = prizeStatus;
            }
            this.promise({
                service: 'accountService',
                api: 'accountsPrizesJour',
                type: 'get',
                data: datas,
                header: {
                    'Content-Type': 'application/json'
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var dataList = response['data'];
                    var paging = response['paging'];
                    success(dataList, paging);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            })
        },
        //获取网站整体统计数据
        getStats: function (success, failed) {
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'accountService',
                api: 'accountsStats',
                type: 'get',
                header: {
                    'Authorization': authStr
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data'])
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            });
        },
        //获取统计数据
        getProductsStats: function (success, failed) {
            var authStr = this.user.getAuth();
            var that = this;
            this.promise({
                service: 'accountService',
                api: 'productsStats',
                type: 'get',
                header: {
                    'Authorization': authStr
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response['data'])
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            });
        },
        getcouponToken: function (success, failed) {
            var that = this;
            this.promise({
                service: 'accountService',
                api: 'couponToken',
                type: 'post',
                header: {
                    'Content-Type': 'application/json'
                },
                data: {
                    'couponCategory': 5,
                    'couponType': 117
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response.data)
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            });
        },
        couponTokenValidate: function (cellphone, couponToken, success, failed) {
            var that = this;
            var urlParam = [cellphone];
            this.promise({
                service: 'accountService',
                api: 'couponTokenValidate',
                type: 'put',
                header: {
                    'Content-Type': 'application/json'
                },
                urlParam: urlParam,
                data: {
                    couponToken: couponToken
                }
            }, function (response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    success(response.data)
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function (error) {
                that.callApiError(error, failed);
            });
        },
    }, {})
})($)