(function($) {
    var sStorage = {
        getItem: function(c_name) {
            var result = $.cookie(c_name);
            return result == 'null' ? null : result;
        },
        setItem: function(c_name, value, expireDays) {
            if (expireDays) {
                $.cookie(c_name, value, {
                    expires: expireDays,
                    path: '/'
                });
            } else {
                $.cookie(c_name, value);
            }
        },
        removeItem: function(c_name) {
            $.cookie(c_name, null, {
                expires: -1,
                path: '/' 
            });
        }
    };

    var storeUserTemp = function(userName, token) {
        sStorage.setItem('userName', userName);
        sStorage.setItem('token', token);
    };
    var getUserTemp = function() {
        var userName = sStorage.getItem('userName');
        var token = sStorage.getItem('token');
        return {
            userName: userName,
            token: token
        }
    };
    var generateUserInfo = function(responseData) {
        var obj = {};
        obj.cellphone = responseData.cellphone;
        obj.email = responseData.email;
        obj.bindId = responseData.bindId;
        obj.roleIds = responseData.roleIds;
        obj.name = responseData.name;
        obj.nickName = responseData.nickName;
        obj.age = responseData.age;
        obj.avatar = responseData.avatar;
        obj.bizCard = responseData.bizCard;
        obj.idNo = responseData.idNo;
        obj.gender = responseData.gender;
        obj.education = responseData.education;
        obj.marriage = responseData.marriage;
        obj.profession = responseData.profession;
        obj.asset = responseData.asset;
        obj.province = responseData.province;
        obj.city = responseData.city;
        obj.town = responseData.town;
        obj.address = responseData.address;
        obj.zipcode = responseData.zipcode;
        obj.companyName = responseData.companyName;
        obj.departmentName = responseData.departmentName;
        obj.contactName = responseData.contactName;
        obj.contactPhone = responseData.contactPhone;
        obj.remark = responseData.remark;
        return obj;
    }

    var _round = 10;

    DLC.User = DLC.derive(DLC.DLC, {
        create: function() {
            this.userName = '';
            this.token = '';
            this.hasLogin = false;

            var user = this.getUser();
            if (user) {
                this.userName = user.userName;
                this.token = user.token;
                this.hasLogin = true;
            }
            this.userInfo = null;
        },
        storeUser: function(remember, userInfo) {
            this.userName = userInfo.userName;
            this.token = userInfo.token;
            if (remember)
                storeUserTemp(userInfo.userName, userInfo.token);
            this.hasLogin = true;
        },
        getUser: function() {
            //get user info
            //return object {userName:'', token:''}
            var userInfoTemp = getUserTemp();
            var info = null;
            if (userInfoTemp.token && userInfoTemp.token != '') {
                info = userInfoTemp;
            }
            // if info == null, need login
            return info;
        },
        getUserName: function() {
            //get user name
            //return string userName
            var info = this.getUser();
            if (info != null) {
                return info.userName
            } else {
                return null;
            }
        },
        getUserSalt: function(loginId, successFn) {
            var urlStr = "{0}/{1}/" + loginId;
            return this.promise({
                service: 'userService',
                api: 'salt',
                type: 'get',
                urlStr: urlStr
            }, successFn)
        },
        login: function(userName, userPassword, captcha, captchaToken, successFn, failedFn) {
            var that = this;
            this.getUserSalt(userName, function(response) {
                var errorCode = response['error'];
                if (errorCode == '0') {
                    var salt = response['data'].salt;
                    that.generateMD5SyncAddCaptcha(userPassword, salt, captcha, null, function(encryptPassword) {
                        that.promise({
                            service: 'userService',
                            api: 'signin',
                            type: 'post',
                            header: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                userName: userName,
                                password: encryptPassword,
                                captcha: captcha,
                                captchaToken: captchaToken
                            }
                        }, function(response) {
                            //login success
                            var errorCode = response['error'];
                            if (errorCode == 0) {
                                var data = response['data'];
                                var token = data['accessToken'];
                                var cellphone = data['cellphone'];
                                var userName = data['userName'];
                                that.storeUser(true, {
                                    userName: userName,
                                    token: token
                                });
                                successFn();
                            } else {
                                var errorMsg = DLC.Config.errorMessage(errorCode, response['message']);
                                failedFn(errorMsg);
                            }
                        })
                    });

                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode, response['message']);
                    failedFn(errorMsg);
                }
            })
        },
        loginNoCap: function(userName, userPassword, successFn, failedFn) {
            var that = this;
            this.getUserSalt(userName, function(response) {
                var errorCode = response['error'];
                if (errorCode == '0') {
                    var salt = response['data'].salt;
                    that.generateMD5Sync(userPassword, salt, null, function(encryptPassword) {
                        that.promise({
                            service: 'userService',
                            api: 'signin',
                            type: 'post',
                            header: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                userName: userName,
                                password: encryptPassword
                            }
                        }, function(response) {
                            //login success
                            var errorCode = response['error'];
                            if (errorCode == 0) {
                                var data = response['data'];
                                var token = data['accessToken'];
                                var cellphone = data['cellphone'];
                                var userName = data['userName'];
                                that.storeUser(true, {
                                    userName: userName,
                                    token: token
                                });
                                successFn();
                            } else {
                                var errorMsg = DLC.Config.errorMessage(errorCode, response['message']);
                                failedFn(errorMsg);
                            }
                        })
                    });
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode, response['message']);
                    failedFn(errorMsg);
                }
            })
        },
        passwordValidate: function(userPassword, successFn, failedFn) {
            var that = this;
            this.getUserSalt(that.getUserName(), function(response) {
                var errorCode = response['error'];
                if (errorCode == '0') {
                    var salt = response['data'].salt;
                    that.cryptPasswordSync(userPassword, salt, function(error, encryptPassword) {
                        that.promise({
                            service: 'userService',
                            api: 'passwordValidate',
                            type: 'post',
                            header: {
                                'Content-Type': 'application/json',
                                'Authorization': that.getAuth()
                            },
                            data: {
                                oldPassword: encryptPassword
                            }
                        }, function(response) {
                            //login success
                            var errorCode = response['error'];
                            if (errorCode == 0) {

                                successFn();
                            } else {
                                var errorMsg = DLC.Config.errorMessage(errorCode);
                                failedFn(errorCode, response['message']);
                            }
                        })
                    });

                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        passwordChange: function(userPassword, successFn, failedFn) {
            var that = this;
            this.getUserSalt(that.getUserName(), function(response) {
                var errorCode = response['error'];
                if (errorCode == '0') {
                    var salt = response['data'].salt;
                    that.cryptPasswordSync(userPassword, salt, function(error, encryptPassword) {
                        that.promise({
                            service: 'userService',
                            api: 'password',
                            type: 'put',
                            header: {
                                'Content-Type': 'application/json',
                                'Authorization': that.getAuth()
                            },
                            data: {
                                password: encryptPassword,
                                confirmPassword: encryptPassword
                            }
                        }, function(response) {
                            //login success
                            var errorCode = response['error'];
                            if (errorCode == 0) {

                                successFn();
                            } else {
                                var errorMsg = DLC.Config.errorMessage(errorCode);
                                failedFn(errorCode, response['message']);
                            }
                        })
                    });

                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },

        setTradePw: function(userPassword, successFn, failedFn) {
            var that = this;
            this.getUserSalt(that.getUserName(), function(response) {
                var errorCode = response['error'];
                if (errorCode == '0') {
                    var salt = response['data'].salt;
                    that.cryptPasswordSync(userPassword, salt, function(error, encryptPassword) {
                        that.promise({
                            service: 'accountService',
                            api: 'setTradePw',
                            type: 'put',
                            header: {
                                'Content-Type': 'application/json',
                                'Authorization': that.getAuth()
                            },
                            data: {
                                password: encryptPassword,
                                confirmPassword: encryptPassword
                            }
                        }, function(response) {
                            //login success
                            var errorCode = response['error'];
                            if (errorCode == 0) {

                                successFn();
                            } else {
                                var errorMsg = DLC.Config.errorMessage(errorCode);
                                failedFn(errorCode, response['message']);
                            }
                        })
                    });

                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        setTradePwValidate: function(userPassword, successFn, failedFn) {
            var that = this;
            this.getUserSalt(that.getUserName(), function(response) {
                var errorCode = response['error'];
                if (errorCode == '0') {
                    var salt = response['data'].salt;
                    that.cryptPasswordSync(userPassword, salt, function(error, encryptPassword) {
                        that.promise({
                            service: 'accountService',
                            api: 'setTradePwValidate',
                            type: 'post',
                            header: {
                                'Content-Type': 'application/json',
                                'Authorization': that.getAuth()
                            },
                            data: {
                                oldPassword: encryptPassword
                            }
                        }, function(response) {
                            //login success
                            var errorCode = response['error'];
                            if (errorCode == 0) {

                                successFn();
                            } else {
                                var errorMsg = DLC.Config.errorMessage(errorCode);
                                failedFn(errorCode, response['message']);
                            }
                        })
                    });

                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        passwordRest: function(UserName, userPassword, restToken, successFn, failedFn) {
            var that = this;
            this.getUserSalt(UserName, function(response) {
                var errorCode = response['error'];
                if (errorCode == '0') {
                    var salt = response['data'].salt;
                    that.cryptPasswordSync(userPassword, salt, function(error, encryptPassword) {
                        that.promise({
                            service: 'userService',
                            api: 'passwordReset',
                            type: 'put',
                            header: {
                                'Content-Type': 'application/json',

                            },
                            data: {
                                password: encryptPassword,
                                confirmPassword: encryptPassword,
                                resetToken: restToken
                            }
                        }, function(response) {
                            //login success
                            var errorCode = response['error'];
                            if (errorCode == 0) {

                                successFn();
                            } else {
                                var errorMsg = DLC.Config.errorMessage(errorCode);
                                failedFn(errorCode, response['message']);
                            }
                        })
                    });

                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        getRestOTP: function(resetToken, successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'otpReset',
                type: 'post',
                header: {
                    'Content-Type': 'application/json',

                },
                data: {
                    resetToken: resetToken
                }
            }, function(response) {
                //login success
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var otp = "";
                    var data = response['data'];
                    if (data != null) {
                        otp = data['otp'];
                    }
                    successFn(otp);
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },

        getRestToken: function(phone, Captcha, captchaToken, successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'otpResetToken',
                type: 'post',
                header: {
                    'Content-Type': 'application/json'

                },
                data: {
                    loginId: phone,
                    captcha: Captcha,
                    captchaToken: captchaToken

                }
            }, function(response) {
                //login success
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var data = response['data'];
                    var resetToken = data['resetToken'];
                    successFn(resetToken);
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        otpRestValidate: function(smscode, resetToken, successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'otp_Validate',
                type: 'post',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': that.getAuth()
                },
                data: {

                    smsCode: smscode,
                    resetToken: resetToken
                }
            }, function(response) {
                //login success
                var errorCode = response['error'];
                if (errorCode == 0) {
                    successFn();
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        getOtpCellphone: function(successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'otpCellphone',
                type: 'get',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': that.getAuth()
                }

            }, function(response) {
                //login success
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var otp = "";
                    var data = response['data'];
                    if (data != null) {
                        otp = data['otp'];
                    }
                    successFn(otp);
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        otpCellphoneValidate: function(smscode, successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'otpCellphoneValidate',
                type: 'post',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': that.getAuth()
                },
                data: {

                    smsCode: smscode

                }
            }, function(response) {
                //login success
                var errorCode = response['error'];
                if (errorCode == 0) {
                    successFn();
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        getOtpCellphoneNew: function(cellphone, successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'otpCellphonenew',
                type: 'post',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': that.getAuth()
                },
                data: {
                    cellphone: cellphone

                }
            }, function(response) {
                //login success
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var otp = "";
                    var data = response['data'];
                    if (data != null) {
                        otp = data['otp'];
                    }
                    successFn(otp);
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        setCellphoneNew: function(cellphone, smscode, successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'setCellphonenew',
                type: 'put',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': that.getAuth()
                },
                data: {
                    cellphone: cellphone,
                    smsCode: smscode
                }
            }, function(response) {
                //login success
                var errorCode = response['error'];
                if (errorCode == 0) {
                    successFn();
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        getOtpSignup: function(cellphone, token, successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'otpSignup',
                type: 'get',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': that.getAuth()
                },
                data: {
                    cellphone: cellphone,
                    token: token
                }

            }, function(response) {
                //login success
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var otp = "";
                    var data = response['data'];
                    if (data != null) {
                        otp = data['otp'];
                    }
                    successFn(otp);
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        fastsignup: function(password, cellphone, smsCode, acceptTos, captcha, captchaToken, refereePhone, refereeToken, successFn, failedFn) {
            var that = this;
            that.cryptPasswordSync(password, null, function(error, encryptPassword) {
                var data = {
                    password: encryptPassword,
                    cellphone: cellphone,
                    smsCode: smsCode,
                    acceptTos: acceptTos,
                    captcha: captcha,
                    captchaToken: captchaToken,
                };
                if (refereePhone != '') {
                    data['refereePhone'] = refereePhone;
                }
                if (refereeToken != '') {//no tips and twice quick
                    data['refereeToken'] = refereeToken;
                } else if ($.cookie('refereeToken') != null) {//tips and one quick
                    data['refereeToken'] = $.cookie('refereeToken');
                }
                that.password = password;
                that.cellphone = cellphone;
                that.smsCode = smsCode;
                that.acceptTos = acceptTos;
                that.captcha = captcha;
                that.captchaToken = captchaToken;
                that.successFn = successFn;
                that.failedFn = failedFn;
                that.promise({
                    service: 'userService',
                    api: 'quicksignup',
                    type: 'post',
                    header: {
                        'Content-Type': 'application/json',
                    },
                    data: data
                }, function(response) {
                    //login success
                    var errorCode = response['error'];
                    if (errorCode == 0) {
                        var data = response['data'];
                        var token = data['accessToken'];
                        var cellphone = data['cellphone'];
                        var userName = data['userName'];
                        that.storeUser(true, {
                            userName: userName,
                            token: token
                        });
                        $.cookie('refereeToken', null, {
                            expires: -1
                        });
                        successFn();
                    } else {
                        if (errorCode == '610' || errorCode == '609' || errorCode == '608') {
                            $.cookie('refereeToken', null, {
                                expires: -1
                            });
                            if (refereeToken != '') {
                                that.fastsignup(that.password, that.cellphone, that.smsCode, that.acceptTos, that.captcha, that.captchaToken, '', '', that.successFn, that.failedFn);
                            } else {
                                var errorMsg = DLC.Config.errorMessage(errorCode);
                                failedFn(errorCode, response['message']);
                            }
                        } else {
                            var errorMsg = DLC.Config.errorMessage(errorCode);
                            failedFn(errorCode, response['message']);
                        }
                    }
                })
            });

        },
        // signup: function(username, password, confirmPassword, cellphone, smsCode, captcha, captchaToken, successFn, failedFn) {
        //     var that = this;
        //     this.getUserSalt(that.getUserName(), function(response) {
        //         var errorCode = response['error'];
        //         if (errorCode == '0') {
        //             var salt = response['data'].salt;
        //             var encryptPassword = that.cryptPasswordSync(userPassword, salt, func);
        //             var encryptPasswordconfirm = that.cryptPasswordSync(confirmPassword, salt);
        //             that.promise({
        //                 service: 'userService',
        //                 api: 'signup',
        //                 type: 'post',
        //                 header: {
        //                     'Content-Type': 'application/json',
        //                     'Authorization': that.getAuth()
        //                 },
        //                 data: {
        //                     username: username,
        //                     password: encryptPassword[0],
        //                     confirmPassword: encryptPasswordconfirm[0],
        //                     cellphone: cellphone,
        //                     smsCode: smsCode,
        //                     captcha: captcha,
        //                     captchaToken: captchaToken,
        //                     acceptTos: 1

        //                 }
        //             }, function(response) {
        //                 //login success
        //                 var errorCode = response['error'];
        //                 if (errorCode == 0) {
        //                     var data = response['data'];
        //                     var token = data['accessToken'];
        //                     var cellphone = data['cellphone'];
        //                     var userName = data['userName'];
        //                     that.storeUser(true, {
        //                         userName: userName,
        //                         token: token
        //                     });
        //                     successFn();
        //                 } else {
        //                     var errorMsg = DLC.Config.errorMessage(errorCode);
        //                     failedFn(errorCode, response['message']);
        //                 }
        //             })
        //         } else {
        //             var errorMsg = DLC.Config.errorMessage(errorCode);
        //             failedFn(errorCode, response['message']);
        //         }
        //     })
        // },
        getCaptcha: function(successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'captcha',
                type: 'get',
                cache: false,
                header: {
                    'Content-Type': 'application/json',

                }
            }, function(response) {
                //login success
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var data = response['data'];
                    var url = data['url'];
                    var token = data['token'];
                    successFn(url, token);
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        getCaptchaJPG: function(token, successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'captchaJPG' + token + ".jpg",
                type: 'get',
                header: {
                    'Content-Type': 'application/json',

                }
            }, function(response) {
                //login success
                successFn(response);
            })
        },
        getCaptchaValidate: function(token, value, successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'captchaValidate',
                type: 'post',
                header: {
                    'Content-Type': 'application/json',

                },
                data: {
                    value: value,
                    token: token
                }

            }, function(response) {
                //login success
                var errorCode = response['error'];
                if (errorCode == 0) {
                    successFn();
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }

            })
        },
        cryptPasswordSync: function(pw, salt, callback) {
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
        generateMD5Sync: function(pw, salt, random_key, callback) {
            if (callback) {
                this.cryptPasswordSync(pw, salt, function(error, hash) {
                    var hash_str = hash;
                    var str = random_key ? (hash_str + random_key) : hash_str;
                    var md5_result = md5(str);
                    callback(md5_result);
                })
            } else {
                var hash_str = this.cryptPasswordSync(pw, salt)[0];
                var str = random_key ? (hash_str + random_key) : hash_str;
                var md5_result = md5(str);
                return md5_result;
            }

        },
        generateMD5SyncAddCaptcha: function(pw, salt, Captcha, random_key, callback) {
            if (callback) {
                var time1 = new Date();
                this.cryptPasswordSync(pw, salt, function(error, hash) {
                    var time2 = Date.now();
                    var hash_str = hash;
                    var str = random_key ? (hash_str + random_key) : hash_str;
                    var md5_result = md5(str + Captcha);
                    callback(md5_result);
                })
            } else {
                var hash_str = this.cryptPasswordSync(pw, salt)[0];
                var str = random_key ? (hash_str + random_key) : hash_str;
                var md5_result = md5(str + Captcha);
                return md5_result;
            }
        },
        getToken: function() {
            var userInfo = this.getUser();
            if (userInfo != null) {
                return userInfo.token;
            } else {
                return null;
            }
        },
        getAuth: function() {
            //retuen token string for request auth.
            return 'Bearer ' + this.getToken();
        },
        clearUserTemp: function() {
            this.hasLogin = false;
            sStorage.removeItem('userName');
            sStorage.removeItem('token');

        },
        logout: function(successFn, failedFn) {
            var that = this;
            var authStr = this.getAuth();
            that.clearUserTemp();
            this.promise({
                service: 'userService',
                api: 'signout',
                type: 'get',
                global: false,
                header: {
                    'Authorization': authStr
                }
            }, function(response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    that.clearUserTemp();
                    successFn();
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorMsg);
                }
            }, function(error) {
                that.clearUserTemp();
                failedFn()
            });
        },
        uploadPortrait: function(file, success, failed) {
            var that = this;
            var fData = new FormData();
            fData.append('uploadFile', file);
            var userName = this.userName;
            var authStr = this.getAuth();
            this.promise({
                service: 'fileService',
                api: 'uploadPortrait',
                type: 'post',
                uploadFile: true, // because data is form data no need process
                header: {
                    'Authorization': authStr
                },
                data: fData
            }, function(response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var data = response['data'];
                    var portrait = {
                        fileName: data['fileName'],
                        fileUrl: data['fileUrl'],
                        thumbnail: data['thumbnailUrl']
                    }
                    success(data['thumbnailUrl']);
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function(error) {
                that.callApiError(error, failed);
            });
        },
        updateUserInfo: function(param, success, failed) {
            var authStr = this.getAuth();
            var that = this;
            this.promise({
                service: 'userService',
                api: 'userInfo',
                type: 'put',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                },
                data: param
            }, function(response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var data = response['data'];
                    success();
                } else {
                    that.processError(errorCode, failed, response)
                }
            }, function(error) {
                that.callApiError(error, failed);
            });
        },
        getUserInfo: function(success, failed) {
            var authStr = this.getAuth();
            var that = this;
            this.promise({
                service: 'userService',
                api: 'userInfo',
                type: 'get',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': authStr
                }
            }, function(response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var data = response['data'];
                    that.userInfo = generateUserInfo(data);
                    success();
                } else {
                    that.processError(errorCode, failed, response);
                }
            }, function(error) {
                that.callApiError(error, failed);
            })
        },
        getOtpEmail: function(email, successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'otpEmail',
                type: 'post',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': that.getAuth()
                },
                data: {
                    email: email
                }

            }, function(response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var otp = "";
                    var data = response['data'];
                    if (data != null) {
                        otp = data['otp'];
                    }
                    successFn(otp);
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        setMail: function(email, otpCode, successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'setEmail',
                type: 'put',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': that.getAuth()
                },
                data: {
                    email: email,
                    otpCode: otpCode
                }
            }, function(response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    successFn();
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode);
                    failedFn(errorCode, response['message']);
                }
            })
        },
        getReferInfo: function(userId, success, failed) {
            var that = this;
            var urlParam = [userId];
            this.promise({
                service: 'userService',
                api: 'referInfo',
                type: 'get',
                header: {
                    'Content-Type': 'application/json'
                },
                urlParam: urlParam,
            }, function(response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var data = response['data'];
                    that.userInfo = generateUserInfo(data);
                    success(that.userInfo);
                } else {
                    that.processError(errorCode, failed, response);
                }
            }, function(error) {
                that.callApiError(error, failed);
            })
        },
        getRefer: function(successFn, failedFn) {
            var that = this;
            that.promise({
                service: 'userService',
                api: 'userRefer',
                type: 'get',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': that.getAuth()
                }
            }, function(response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var data = response['data'];

                    if (data != null) {
                        successFn(data);
                    }
                } else {
                    var errorMsg = DLC.Config.errorMessage(errorCode, response['message']);
                    failedFn(errorMsg);
                }
            }, function(error) {
                that.callApiError(error, failedFn);
            })
        },
        getReferToken: function(userId, success, failed) {
            var that = this;
            var urlParam = [userId];
            this.promise({
                service: 'userService',
                api: 'referToken',
                type: 'get',
                header: {
                    'Content-Type': 'application/json'
                },
                urlParam: urlParam,
            }, function(response) {
                var errorCode = response['error'];
                if (errorCode == 0) {
                    var data = response['data'];
                    success(data.token);
                } else {
                    that.processError(errorCode, failed, response);
                }
            }, function(error) {
                that.callApiError(error, failed);
            })
        },
    }, {})
})($)
