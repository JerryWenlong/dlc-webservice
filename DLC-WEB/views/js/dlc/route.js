(function(crossroads, hasher) {
    var debug = true;
    var _hmt = _hmt || [];
    DLC.Route = DLC.derive(null, {
        // initBar: function(index) {
        //     $('.link-sel').removeClass("link-sel");
        //     $('#bar_h' + index).addClass("link-sel");
        // },
        init: function() {
            var that = this;
            this.oldHash = '';
            this.oldHashSwitch = false;
            //            var routeIndex = crossroads.addRoute('/')
            //            var routeHome = crossroads.addRoute('/');
            //            var homeLoad = function() {
            //                //document.title = "点理财-上市公司全资控股平台，专注市政PPP项目";
            //                var meta = document.getElementsByTagName("meta");
            //                meta[4].content = "点理财是一家专业从事智慧城市和市政基础设施建设等PPP项目的互联网金融信息平台，于2016年正式上线运营，是上市公司智城控股（股票代码 08130-HK）旗下互联网金融信息平台，股东包括中国支付通（08325-HK)和国投瑞银基金。 智城控股与大型央企和国企强强联合，合作伙伴包含北控、华电、中铁等。";
            //                meta[5].content = "点理财 点理财官网 点理财PPP 点理财财富 点理财论坛 投资 理财 金融 p2p理财 理财类网站 利息 年化收益 利率 余额 收益 平台";
            //                _hmt.push(['_trackPageview', '/']);
            //                $('#nothing').load('/pages/nothing.html', function() {
            //                    if(window.location.href === window.location.protocol + '//' + window.location.host + '/'){
            //                        new DLC.Home();
            //                    }
            //                    if (app.route.oldHash != '') {
            //                        $('#main_header').show();
            //                        $("#mainContent,#index_footer").hide();
            //                        window.location.reload();
            //                    }
            //                    // that.initBar(1);
            //                });
            //            }
            //            routeIndex.matched.add(homeLoad);
            //            routeHome.matched.add(homeLoad);

            var productDetail = crossroads.addRoute('/product/{productId}');
            productDetail.matched.add(function(productId) {
                document.title = "点理财产品列表";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财产品列表";
                meta[5].content = "点理财产品列表";
                _hmt.push(['_trackPageview', '/product_' + productId]);
                $('#main_header').show();
                $('#mainContent').load('/pages/productDetail.html', function() {
                    var productDetail = new DLC.ProductDetail(productId);
                })
            })

            // var experienceProduct = crossroads.addRoute('/experienceProduct_{prodCodeId}');
            // experienceProduct.matched.add(function(prodCodeId) {
            //     document.title = "点理财体验金";
            //     var meta = document.getElementsByTagName("meta");
            //     meta[4].content = "点理财体验金";
            //     meta[5].content = "点理财体验金";
            //     // if not login , goto login
            //     if (that.userIsLogin(false, '/login')) {
            //         app.account.getBizAccountInfo(function() {
            //             $('#main_header').show();
            //             $('#mainContent').load('/pages/experienceProduct.html', function() {
            //                 var experienceProductDetail = new DLC.ExperienceProduct(prodCodeId);
            //             })
            //         }, function() {
            //             console.log('get user getBizAccountInfo error')
            //         })
            //     }
            // })

            var payExperience = crossroads.addRoute('/payExperience/{prodCodeId}');
            payExperience.matched.add(function(prodCodeId) {
                document.title = "点理财体验金支付";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财体验金支付";
                meta[5].content = "点理财体验金支付";
                _hmt.push(['_trackPageview', '/#/payExperience/' + prodCodeId]);
                app.account.getBizAccountInfo(function() {
                    _hmt.push(['_trackPageview', '/#/payExperience']);
                    $('#mainContent').load('/pages/payExperience.html', function() {
                        var payExperiencePage = new DLC.PayExperience(prodCodeId);
                    })
                }, function() {
                    console.log('get user getBizAccountInfo error')
                })
            })

            var pay = crossroads.addRoute('/pay/{orderNo}');
            pay.matched.add(function(orderNo) {
                document.title = "点理财产品支付";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财产品支付";
                meta[5].content = "点理财产品支付";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/pay/' + orderNo]);
                app.account.getBizAccountInfo(function() {
                    var hasCard = app.account.accountInfo.hasCard;
                    if (hasCard) {
                        // _hmt.push(['_trackPageview', '/#/payBind']);
                        // $('#mainContent').load('/pages/payBind.html', function() {
                        //     var payBind = new DLC.PayBind(orderNo);
                        // })
                        if ($.cookie('prodType') == 2) {
                            _hmt.push(['_trackPageview', '/#/payJJOrder']);
                            $('#mainContent').load('/pages/payJJOrder.html', function() {
                                new DLC.PayJJOrder(orderNo);
                            })
                        } else {
                            _hmt.push(['_trackPageview', '/#/payOrder']);
                            $('#mainContent').load('/pages/payOrder.html', function() {
                                new DLC.PayOrder(orderNo);
                            })
                        }
                    } else {
                        _hmt.push(['_trackPageview', '/#/userBindBankCard']);
                        $('#mainContent').load('/pages/userCenter.html', function() {
                            var userBindBankCardPage = new DLC.UserBindBankCard();
                            var userCenterPage = new DLC.UserCenter('/pages/userBindBankCard.html', userBindBankCardPage);
                            userCenterPage.init("A");
                        });
                        // _hmt.push(['_trackPageview', '/#/payUnbind']);
                        // $('#mainContent').load('/pages/payUnbind.html', function() {
                        //     var payUnbind = new DLC.PayUnbind(orderNo);
                        // })
                    }
                }, function() {
                    console.log('get user getBizAccountInfo error')
                })

            })

            var payBindCard = crossroads.addRoute('/payBindCard/{orderNo}');
            payBindCard.matched.add(function(orderNo) {
                document.title = "点理财绑卡";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财绑卡";
                meta[5].content = "点理财绑卡";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/payBindCard/' + orderNo]);
                app.account.getBizAccountInfo(function() {
                    var hasAuthed = app.account.accountInfo.authed;
                    var hasCard = app.account.accountInfo.hasCard;
                    if (hasCard) {
                        _hmt.push(['_trackPageview', '/#/payOrder']);
                        $('#mainContent').load('/pages/payOrder.html', function() {
                                var payOrder = new DLC.PayOrder(orderNo);
                            })
                            // _hmt.push(['_trackPageview', '/#/payBind']);
                            // $('#mainContent').load('/pages/payBind.html', function() {
                            //     var payBind = new DLC.PayBind(orderNo);
                            // })
                    } else {
                        _hmt.push(['_trackPageview', '/#/userBindBankCard']);
                        $('#mainContent').load('/pages/userCenter.html', function() {
                            var userBindBankCardPage = new DLC.UserBindBankCard();
                            var userCenterPage = new DLC.UserCenter('/pages/userBindBankCard.html', userBindBankCardPage);
                            userCenterPage.init("A");
                        });
                        //已实名
                        // if (hasAuthed) {
                        //     _hmt.push(['_trackPageview', '/#/payBindCardAuthed']);
                        //     $('#mainContent').load('/pages/payBindCardAuthed.html', function() {
                        //         var payBindCardAuthedPage = new DLC.PayBindCardAuthed(orderNo);
                        //     })
                        // } else {
                        //     _hmt.push(['_trackPageview', '/#/payBindCard']);
                        //     $('#mainContent').load('/pages/payBindCard.html', function() {
                        //         var payBindCardPage = new DLC.PayBindCard(orderNo);
                        //     })
                        // }
                    }
                }, function() {
                    console.log('get user getBizAccountInfo error')
                })

            })

            var productList = crossroads.addRoute('/productList');

            productList.matched.add(function() {
                document.title = "点理财热卖产品";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财热卖产品";
                meta[5].content = "点理财热卖产品";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/productList']);
                $('#mainContent').load('/pages/productList.html', function() {
                    // that.initBar(2);
                    var prodList = new DLC.ProductList(0);
                });
            })

            var productList2 = crossroads.addRoute('/productList/{prodTypeId}');
            productList2.matched.add(function(prodTypeId) {
                document.title = "点理财热卖产品";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财热卖产品";
                meta[5].content = "点理财热卖产品";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/productList/' + prodTypeId]);
                $('#mainContent').load('/pages/productList.html', function() {
                    // that.initBar(2);
                    var prodList = new DLC.ProductList(prodTypeId);
                });
            })

            /*----------------- mf start -----------------------*/
            var routeResetPassword = crossroads.addRoute('/resetPassword');
            routeResetPassword.matched.add(function() {
                document.title = "点理财重置密码";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财重置密码";
                meta[5].content = "点理财重置密码";
                if (that.userIsLogin(true, '/myCenter_account')) {

                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/resetPassword']);
                    $('#mainContent').load('/pages/resetPassword.html', function() {
                        var resetPassword = new DLC.ResetPassword();
                        resetPassword.init();
                    })
                }
            });

            var routeUserChangePhone = crossroads.addRoute('/userChangePhone');
            routeUserChangePhone.matched.add(function() {
                document.title = "点理财重置手机号";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财重置手机号";
                meta[5].content = "点理财重置手机号";
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/userChangePhone']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var changePhone = new DLC.ChangePhone();
                        var userCenterPage = new DLC.UserCenter('/pages/userChangePhone.html', changePhone);
                        userCenterPage.init("A");
                    });
                }
            });

            var routeModifyTransactionPassword = crossroads.addRoute('/modifyTstPwd');
            routeModifyTransactionPassword.matched.add(function() {
                document.title = "点理财重置交易密码";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财重置交易密码";
                meta[5].content = "点理财重置交易密码";
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/modifyTstPwd']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var modifyTP = new DLC.ModifyTstPwd();
                        var userCenterPage = new DLC.UserCenter('/pages/modifyTstPwd.html', modifyTP);
                        userCenterPage.init("A");
                    });
                }
            });

            var routeNoCardTstPwd = crossroads.addRoute('/noCardTstPwd');
            routeNoCardTstPwd.matched.add(function() {

                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/noCardTstPwd']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var NCTP = new DLC.NoCardTstPwd();
                        var userCenterPage = new DLC.UserCenter('/pages/noCardTstPwd.html', NCTP);
                        userCenterPage.init("A");
                    });
                }
            });

            var routeCardTstPwd = crossroads.addRoute('/cardTstPwd');
            routeCardTstPwd.matched.add(function() {

                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/cardTstPwd']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var CTP = new DLC.CardTstPwd();
                        var userCenterPage = new DLC.UserCenter('/pages/cardTstPwd.html', CTP);
                        userCenterPage.init("A");
                    });
                }
            });
            /*----------------- mf end -----------------------*/



            /*----------------- peijk start -----------------------*/
            // signup
            var routeSignup = crossroads.addRoute('/signup');
            routeSignup.matched.add(function() {
                document.title = "点理财注册";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财注册";
                meta[5].content = "点理财注册";
                if (that.userIsLogin(true, '/')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/signup']);
                    $('#mainContent').load('/pages/signup.html', function() {
                        var signupPage = new DLC.SignupOld('', '');
                        signupPage.init();
                    })
                }
            });
            var routeSignup2 = crossroads.addRoute('/signup?token={token}');
            routeSignup2.matched.add(function(token) {
                document.title = "点理财注册";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财注册";
                meta[5].content = "点理财注册";
                if (that.userIsLogin(true, '/')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/signup?token=' + token]);
                    $('#mainContent').load('/pages/signup.html', function() {
                        var signupPage2 = new DLC.SignupOld(token, '');
                        signupPage2.init();
                    })
                }
            });
            var routeSignup2 = crossroads.addRoute('/signup?utm_source={utm_source}');
            routeSignup2.matched.add(function(utm_source) {
                document.title = "点理财注册";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财注册";
                meta[5].content = "点理财注册";
                if (that.userIsLogin(true, '/')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/signup?utm_source=' + utm_source]);
                    $('#mainContent').load('/pages/signup.html', function() {
                        var signupPage2 = new DLC.SignupOld('', utm_source);
                        signupPage2.init();
                    })
                }
            });
            // var routeSignupSuccess = crossroads.addRoute('/signupSuccess');
            // routeSignupSuccess.matched.add(function() {
            //
            //     if (that.userIsLogin(false, '/')) {
            //         $('#main_header').show();
            //         _hmt.push(['_trackPageview', '/#/signupSuccess']);
            //         $('#mainContent').load('/pages/signupSuccess.html', function() {
            //             var signupSuccessPage = new DLC.SignupSuccess();
            //             signupSuccessPage.init();
            //         })
            //     }
            // });
            // var routeSignupAgreement = crossroads.addRoute('/signupAgreement');
            // routeSignupAgreement.matched.add(function() {
            //     document.title = "点理财注册条款";
            //     var meta = document.getElementsByTagName("meta");
            //     meta[4].content = "点理财注册条款";
            //     meta[5].content = "点理财注册条款";
            //     $('#main_header').show();
            //     _hmt.push(['_trackPageview', '/#/signupAgreement']);
            //     $('#mainContent').load('/pages/signupAgreement.html', function() {
            //         var signupAgreementPage = new DLC.SignupAgreement();
            //         signupAgreementPage.init();
            //     })
            // });
            var routeRefer = crossroads.addRoute('/refer?token={token}');
            routeRefer.matched.add(function(token) {
                document.title = "点理财推荐人";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财推荐人";
                meta[5].content = "点理财推荐人";
                if (that.userIsLogin(true, '/')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/refer?token=' + token]);
                    $('#mainContent').load('/pages/refer.html', function() {
                        var referPage = new DLC.ReferOld(token, '');
                        referPage.init();
                    })
                }
            });
            var routeRefer = crossroads.addRoute('/refer?utm_source={utm_source}');
            routeRefer.matched.add(function(utm_source) {
                document.title = "点理财推荐人";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财推荐人";
                meta[5].content = "点理财推荐人";
                if (that.userIsLogin(true, '/')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/refer?utm_source=' + utm_source]);
                    $('#mainContent').load('/pages/refer.html', function() {
                        var referPage = new DLC.ReferOld('', utm_source);
                        referPage.init();
                    })
                }
            });
            //guide
            var routeGuide = crossroads.addRoute('/guide');
            routeGuide.matched.add(function() {
                document.title = "点理财用户向导";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财用户向导";
                meta[5].content = "点理财用户向导";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/guide']);
                $('#mainContent').load('/pages/guide.html', function() {
                    var guidePage = new DLC.Guide();
                    guidePage.init();
                })
            });
            //bindEmail
            var routeBindEmail = crossroads.addRoute('/bindEmail');
            routeBindEmail.matched.add(function() {
                document.title = "点理财绑定邮箱";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财绑定邮箱";
                meta[5].content = "点理财绑定邮箱";
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/bindEmail']);
                    $('#mainContent').load('/pages/bindEmail.html', function() {
                        var bindEmailPage = new DLC.BindEmail();
                        bindEmailPage.init();
                    })
                }
            });
            //editEmail
            var routeEditEmail = crossroads.addRoute('/editEmail');
            routeEditEmail.matched.add(function() {

                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/editEmail']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var editEmailPage = new DLC.EditEmail();
                        var userCenterPage = new DLC.UserCenter('/pages/editEmail.html', editEmailPage);
                        userCenterPage.init("A");
                    });
                }
            });
            //auth
            var routeAuth = crossroads.addRoute('/auth');
            routeAuth.matched.add(function() {
                document.title = "点理财认证";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财认证";
                meta[5].content = "点理财认证";
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/auth']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var authPage = new DLC.Auth();
                        var userCenterPage = new DLC.UserCenter('/pages/auth.html', authPage);
                        userCenterPage.init("A");
                    });
                }
            });
            //userInfo
            var routeUserInfo = crossroads.addRoute('/userInfo');
            routeUserInfo.matched.add(function() {
                document.title = "点理财用户详细信息";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财用户详细信息";
                meta[5].content = "点理财用户详细信息";
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/userInfo']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var userInfoPage = new DLC.UserInfo();
                        var userCenterPage = new DLC.UserCenter('/pages/userInfo.html', userInfoPage);
                        userCenterPage.init("A");
                    });
                }
            });
            /*----------------- peijk end -----------------------*/

            //安全保障页面
            var routeInsurance = crossroads.addRoute('/insurance');
            routeInsurance.matched.add(function() {
                document.title = "安全保障页面";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "安全保障页面";
                meta[5].content = "安全保障页面";
                $('#main_header').show();
                // that.initBar(3);
                _hmt.push(['_trackPageview', '/#/insurance']);
                $('#mainContent').load('/pages/insurance.html', function() {
                    window.scroll(0, 0)
                });
            });

            //安全保障-项目安全
            var routeInsurancePro = crossroads.addRoute('/insurancePro');
            routeInsurancePro.matched.add(function() {
                document.title = "安全保障-项目安全";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "安全保障-项目安全";
                meta[5].content = "安全保障-项目安全";
                $('#main_header').show();
                // that.initBar(3);
                _hmt.push(['_trackPageview', '/#/insurancePro']);
                $('#mainContent').load('/pages/insurance/insuranceCenter.html', function() {
                    var insuranceCenter = new DLC.InsuranceCenter('/pages/insurance/insurancePro.html');
                    insuranceCenter.init("A");
                });
            });

            //安全保障-资金安全
            var routeInsuranceMoney = crossroads.addRoute('/insuranceMoney');
            routeInsuranceMoney.matched.add(function() {
                document.title = "安全保障-资金安全";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "安全保障-资金安全";
                meta[5].content = "安全保障-资金安全";
                $('#main_header').show();
                // that.initBar(3);
                _hmt.push(['_trackPageview', '/#/insuranceMoney']);
                $('#mainContent').load('/pages/insurance/insuranceCenter.html', function() {
                    var insuranceCenter = new DLC.InsuranceCenter('/pages/insurance/insuranceMoney.html');
                    insuranceCenter.init("B");
                });
            });

            that.snakeFun();

            that.questionCenter();

            that.bannerPages();

            that.aboutUs();

            function handleChanges(newHash, oldHash) {
                // if(that.oldHashSwitch){
                that.oldHash = oldHash;
                // }
                that.oldHashSwitch = true;
                crossroads.parse(newHash)
            }

            function handleInitialized(newHash) {
                crossroads.parse(newHash)
            }
            hasher.changed.add(handleChanges);
            hasher.initialized.add(handleInitialized);
            hasher.init();
        },
        /*----------------- Snake sta-----------------------*/
        snakeFun: function() {
            var that = this;
            //登录页面
            // var routeLogin = crossroads.addRoute('/login');
            // routeLogin.matched.add(function() {
            //     document.title = "登录页面";
            //     var meta = document.getElementsByTagName("meta");
            //     meta[4].content = "登录页面";
            //     meta[5].content = "登录页面";
            //     //判断用户是否登录，登录则跳转首页
            //     if (that.userIsLogin(true, '/')) {
            //         $('#main_header').show();
            //         _hmt.push(['_trackPageview', '//login']);
            //         $('#mainContent').load('/pages/login.html', function() {
            //             var loginPage = new DLC.Login();
            //             loginPage.init();
            //         });
            //     }
            // });
            //修改登录密码页面
            var routeEditLoginPwd = crossroads.addRoute('/editLoginPwd');
            routeEditLoginPwd.matched.add(function() {
                document.title = "修改登录密码页面";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "修改登录密码页面";
                meta[5].content = "修改登录密码页面";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/editLoginPwd']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var editLoginPwdPage = new DLC.EditLoginPwd();
                        var userCenterPage = new DLC.UserCenter('/pages/editLoginPwd.html', editLoginPwdPage);
                        userCenterPage.init("A");
                    });
                }
            });
            //绑卡页面
            var routeUserBindBankCard = crossroads.addRoute('/userBindBankCard');
            routeUserBindBankCard.matched.add(function() {
                document.title = "绑卡页面";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "绑卡页面";
                meta[5].content = "绑卡页面";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/userBindBankCard']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var userBindBankCardPage = new DLC.UserBindBankCard();
                        var userCenterPage = new DLC.UserCenter('/pages/userBindBankCard.html', userBindBankCardPage);
                        userCenterPage.init("A");
                    });
                }
            });
            //我的体验金
            var routeExperience = crossroads.addRoute('/experience');
            routeExperience.matched.add(function() {
                document.title = "我的体验金";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "我的体验金";
                meta[5].content = "我的体验金";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/experience']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var experience = new DLC.Experience();
                        var userCenterPage = new DLC.UserCenter('/pages/experience.html', experience);
                        userCenterPage.init("E");
                    });
                }
            });

            //我的优惠券
            var routeRedPacket = crossroads.addRoute('/userRedPacket');
            routeRedPacket.matched.add(function() {
                document.title = "我的优惠券";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "我的优惠券";
                meta[5].content = "我的优惠券";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/userRedPacket']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var redPacket = new DLC.RedPacket();
                        var userCenterPage = new DLC.UserCenter('/pages/redPacket.html', redPacket);
                        userCenterPage.init("H");
                    });
                }
            });

            //我的升息令牌
            var routeInterestToken = crossroads.addRoute('/userInterestToken');
            routeInterestToken.matched.add(function() {
                document.title = "我的升息令牌";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "我的升息令牌";
                meta[5].content = "我的升息令牌";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/userInterestToken']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var interestToken = new DLC.InterestToken();
                        var userCenterPage = new DLC.UserCenter('/pages/interestToken.html', interestToken);
                        userCenterPage.init("J");
                    });
                }
            });

            //我的点币
            var routePointCoin = crossroads.addRoute('/pointCoin');
            routePointCoin.matched.add(function() {
                document.title = "我的点币";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "我的点币";
                meta[5].content = "我的点币";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var pointCoin = new DLC.PointCoin();
                        var userCenterPage = new DLC.UserCenter('/pages/pointCoin.html', pointCoin);
                        userCenterPage.init("F");
                    });
                }
            });

            //邀请有礼
            var routeUserRefer = crossroads.addRoute('/userRefer');
            routeUserRefer.matched.add(function() {
                document.title = "邀请有礼";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "邀请有礼";
                meta[5].content = "邀请有礼";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var UserRefer = new DLC.UserRefer("");
                        var userCenterPage = new DLC.UserCenter('/pages/userRefer.html', UserRefer);
                        userCenterPage.init("G");
                    });
                }
            });

            //邀请有礼2
            var routeUserRefer2 = crossroads.addRoute('/userRefer/{para}');
            routeUserRefer2.matched.add(function(para) {
                document.title = "邀请有礼";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "邀请有礼";
                meta[5].content = "邀请有礼";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var UserRefer = new DLC.UserRefer(para);
                        var userCenterPage = new DLC.UserCenter('/pages/userRefer.html', UserRefer);
                        userCenterPage.init("G");
                    });
                }
            });

            var routeOrders = crossroads.addRoute('/orders');
            routeOrders.matched.add(function() {
                document.title = "我的订单";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "我的订单";
                meta[5].content = "我的订单";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/orders']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var Orders = new DLC.Orders();
                        var userCenterPage = new DLC.UserCenter('/pages/orders.html', Orders);
                        userCenterPage.init("B");
                    });
                }
            });
            var routeFinancial = crossroads.addRoute('/financial');
            routeFinancial.matched.add(function() {
                document.title = "我的理财";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "我的理财";
                meta[5].content = "我的理财";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/financial']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var Financial = new DLC.Financial();
                        var userCenterPage = new DLC.UserCenter('/pages/financial.html', Financial);
                        userCenterPage.init("C");
                    });
                }
            });

            var routeBills = crossroads.addRoute('/bills');
            routeBills.matched.add(function() {
                document.title = "我的账单";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "我的账单";
                meta[5].content = "我的账单";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/#/bills']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var Bills = new DLC.Bills();
                        var userCenterPage = new DLC.UserCenter('/pages/bills.html', Bills);
                        userCenterPage.init("D");
                    });
                }
            });
            var routeAccount = crossroads.addRoute('/account');
            routeAccount.matched.add(function() {
                document.title = "点理财账户";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "点理财用户信息";
                meta[5].content = "点理财 用户信息";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {

                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/myCenter_account']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        // that.initBar(4);
                        var Account = new DLC.myAccount("");
                        var userCenterPage = new DLC.UserCenter('/pages/myAccount.html', Account);
                        userCenterPage.init("A");
                    });
                }
            });
            var routeWithdraw = crossroads.addRoute('/withdraw');
            routeWithdraw.matched.add(function() {
                document.title = "提现";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "提现";
                meta[5].content = "提现";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/withdraw']);

                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var withdraw = new DLC.withdraw();
                        var userCenterPage = new DLC.UserCenter('/pages/withdraw.html', withdraw);
                        userCenterPage.init("A");
                    });
                }
            });
            var routeDeposit = crossroads.addRoute('/deposit');
            routeDeposit.matched.add(function() {
                document.title = "充值";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "充值";
                meta[5].content = "充值";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/deposit']);
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var withdraw = new DLC.withdraw();
                        var userCenterPage = new DLC.UserCenter('/pages/deposit.html', withdraw);
                        userCenterPage.init("A");
                    });
                }
            });

            var routeDepositO = crossroads.addRoute('/deposito');
            routeDepositO.matched.add(function() {
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/deposito']);
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        var DepositO = new DLC.DepositO();
                        var userCenterPage = new DLC.UserCenter('/pages/deposito.html', DepositO);
                        userCenterPage.init("A");
                    });
                }
            });
        },
        /*------------------ Snake end----------------------*/
        questionCenter: function() {
            //常见问题-用户
            var routeEditQuestionUser = crossroads.addRoute('/questionUser');
            routeEditQuestionUser.matched.add(function() {
                document.title = "常见问题-用户";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "常见问题-用户";
                meta[5].content = "常见问题-用户";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/questionUser']);
                $('#mainContent').load('/pages/question/questionCenter.html', function() {
                    var questionCenterPage = new DLC.QuestionCenter('/pages/question/questionUser.html');
                    questionCenterPage.init("A");
                });
            });

            //常见问题-密码
            var routeEditQuestionPwd = crossroads.addRoute('/questionPwd');
            routeEditQuestionPwd.matched.add(function() {
                document.title = "常见问题-密码";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "常见问题-密码";
                meta[5].content = "常见问题-密码";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/questionPwd']);
                $('#mainContent').load('/pages/question/questionCenter.html', function() {
                    var questionCenterPage = new DLC.QuestionCenter('/pages/question/questionPwd.html');
                    questionCenterPage.init("B");
                });
            });

            //常见问题-银行卡
            var routeEditQuestionBank = crossroads.addRoute('/questionBank');
            routeEditQuestionBank.matched.add(function() {
                document.title = "常见问题-银行卡";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "常见问题-银行卡";
                meta[5].content = "常见问题-银行卡";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/questionBank']);
                $('#mainContent').load('/pages/question/questionCenter.html', function() {
                    var questionCenterPage = new DLC.QuestionCenter('/pages/question/questionBank.html');
                    questionCenterPage.init("C");
                });
            });

            //常见问题-充值
            var routeEditQuestionRecharge = crossroads.addRoute('/questionRecharge');
            routeEditQuestionRecharge.matched.add(function() {
                document.title = "常见问题-充值";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "常见问题-充值";
                meta[5].content = "常见问题-充值";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/questionRecharge']);
                $('#mainContent').load('/pages/question/questionCenter.html', function() {
                    var questionCenterPage = new DLC.QuestionCenter('/pages/question/questionRecharge.html');
                    questionCenterPage.init("D");
                });
            });

            //常见问题-提现
            var routeEditQuestionCash = crossroads.addRoute('/questionCash');
            routeEditQuestionCash.matched.add(function() {
                document.title = "常见问题-提现";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "常见问题-提现";
                meta[5].content = "常见问题-提现";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/questionCash']);
                $('#mainContent').load('/pages/question/questionCenter.html', function() {
                    var questionCenterPage = new DLC.QuestionCenter('/pages/question/questionCash.html');
                    questionCenterPage.init("E");
                });
            });

            //常见问题-投资
            var routeEditQuestionInvest = crossroads.addRoute('/questionInvest');
            routeEditQuestionInvest.matched.add(function() {
                document.title = "常见问题-投资";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "常见问题-投资";
                meta[5].content = "常见问题-投资";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/questionInvest']);
                $('#mainContent').load('/pages/question/questionCenter.html', function() {
                    var questionCenterPage = new DLC.QuestionCenter('/pages/question/questionInvest.html');
                    questionCenterPage.init("F");
                });
            });

            //常见问题-收益与赎回
            var routeEditQuestionIncomeAndRedeem = crossroads.addRoute('/questionIncomeAndRedeem');
            routeEditQuestionIncomeAndRedeem.matched.add(function() {
                document.title = "常见问题-收益与赎回";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "常见问题-收益与赎回";
                meta[5].content = "常见问题-收益与赎回";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/questionIncomeAndRedeem']);
                $('#mainContent').load('/pages/question/questionCenter.html', function() {
                    var questionCenterPage = new DLC.QuestionCenter('/pages/question/questionIncomeAndRedeem.html');
                    questionCenterPage.init("G");
                });
            });
        },

        aboutUs: function() {
            var that = this;
            //关于我们-公司简介
            var routeEditAboutCompany = crossroads.addRoute('/aboutCompany');
            routeEditAboutCompany.matched.add(function() {
                document.title = "关于我们-公司简介";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "关于我们-公司简介";
                meta[5].content = "关于我们-公司简介";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/aboutCompany']);
                $('#mainContent').load('/pages/aboutUs/aboutCenter.html', function() {
                    var aboutCenterPage = new DLC.AboutCenter('/pages/aboutUs/aboutCompany.html', null, '.aboutUsBg');
                    aboutCenterPage.init("A");
                });
            });

            //关于我们-母公司简介
            var routeEditAboutCompany = crossroads.addRoute('/aboutMCompany');
            routeEditAboutCompany.matched.add(function() {
                document.title = "关于我们-母公司简介";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "关于我们-母公司简介";
                meta[5].content = "关于我们-母公司简介";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/aboutMCompany']);
                $('#mainContent').load('/pages/aboutUs/aboutCenter.html', function() {
                    var aboutCenterPage = new DLC.AboutCenter('/pages/aboutUs/aboutMCompany.html', null);
                    aboutCenterPage.init("B");
                });
            });

            //关于我们-股东介绍
            var routeEditAboutShareholder = crossroads.addRoute('/aboutShareholder');
            routeEditAboutShareholder.matched.add(function() {
                document.title = "关于我们-股东介绍";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "关于我们-股东介绍";
                meta[5].content = "关于我们-股东介绍";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/aboutShareholder']);
                $('#mainContent').load('/pages/aboutUs/aboutCenter.html', function() {
                    var aboutCenterPage = new DLC.AboutCenter('/pages/aboutUs/aboutShareholder.html', null, '.aboutUsBg');
                    aboutCenterPage.init("C");
                });
            });

            //关于我们-平台优势
            var routeEditAboutMAdvantage = crossroads.addRoute('/aboutMAdvantage');
            routeEditAboutMAdvantage.matched.add(function() {
                document.title = "关于我们-平台优势";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "关于我们-平台优势";
                meta[5].content = "关于我们-平台优势";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/aboutMAdvantage']);
                $('#mainContent').load('/pages/aboutUs/aboutCenter.html', function() {
                    var aboutCenterPage = new DLC.AboutCenter('/pages/aboutUs/aboutMAdvantage.html', null, '.aboutUsBg');
                    aboutCenterPage.init("H");
                });
            });

            //关于我们-媒体报道
            var routeEditAboutMedia = crossroads.addRoute('/aboutMedia');
            routeEditAboutMedia.matched.add(function() {
                document.title = "关于我们-媒体报道";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "关于我们-媒体报道";
                meta[5].content = "关于我们-媒体报道";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/aboutMedia']);
                $('#mainContent').load('/pages/aboutUs/aboutCenter.html', function() {
                    var aboutCenterPage = new DLC.AboutCenter('/pages/aboutUs/aboutMedia.html', null, '');
                    aboutCenterPage.init("D");
                });
            });

            //关于我们-联系我们
            var routeEditAboutContact = crossroads.addRoute('/aboutContact');
            routeEditAboutContact.matched.add(function() {
                document.title = "关于我们-联系我们";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "关于我们-联系我们";
                meta[5].content = "关于我们-联系我们";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/aboutContact']);
                $('#mainContent').load('/pages/aboutUs/aboutCenter.html', function() {
                    var aboutCenterPage = new DLC.AboutCenter('/pages/aboutUs/aboutContact.html', null, '.aboutUsBg');
                    aboutCenterPage.init("E");
                });
            });

            //关于我们-文章列表
            var routeEditAboutNotice = crossroads.addRoute('/aboutNotice/{type}');
            routeEditAboutNotice.matched.add(function(type) {
                document.title = "关于我们-文章列表";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "关于我们-文章列表";
                meta[5].content = "关于我们-文章列表";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/aboutNotice/' + type]);
                $('#mainContent').load('/pages/aboutUs/aboutCenter.html', function() {
                    var aboutNoticePage = new DLC.AboutNotice(type);
                    var aboutCenterPage = new DLC.AboutCenter('/pages/aboutUs/aboutNotice.html', aboutNoticePage, '');
                    if (type == 0) {
                        aboutCenterPage.init("F");
                    } else {
                        aboutCenterPage.init("G");
                    }

                });
            });

            //关于我们-文章内容
            var routeEditAboutContent = crossroads.addRoute('/aboutContent/{articleId}/{type}');
            routeEditAboutContent.matched.add(function(articleId, type) {
                document.title = "关于我们-文章内容";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "关于我们-文章内容";
                meta[5].content = "关于我们-文章内容";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/aboutContent/' + articleId + '/' + type]);
                $('#mainContent').load('/pages/aboutUs/aboutCenter.html', function() {
                    var articlePage = new DLC.ArticleDetail(articleId);
                    var aboutCenterPage = new DLC.AboutCenter('/pages/aboutUs/aboutContent.html', articlePage, '');
                    if (type == 0) {
                        aboutCenterPage.init("F");
                    } else {
                        aboutCenterPage.init("G");
                    }
                });
            });


            //宝付回调
            var routeBfBack = crossroads.addRoute('/bfBack?{paras}');
            routeBfBack.matched.add(function(paras) {
                document.title = "关于我们-宝付回调";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "关于我们-宝付回调";
                meta[5].content = "关于我们-宝付回调";
                //判断用户是否登录，不是则跳转登录
                if (that.userIsLogin(false, '/login')) {
                    $('#main_header').show();
                    _hmt.push(['_trackPageview', '/myCenter_account']);
                    $('#mainContent').load('/pages/userCenter.html', function() {
                        // that.initBar(4);
                        var Account = new DLC.myAccount(paras);
                        var userCenterPage = new DLC.UserCenter('/pages/myAccount.html', Account);
                        userCenterPage.init("A");
                    });
                }
            });
        },

        bannerPages: function() {
            //体验金活动页面
            var routeExpBanner = crossroads.addRoute('/expBanner');
            routeExpBanner.matched.add(function() {
                document.title = "体验金活动页面";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "体验金活动页面";
                meta[5].content = "体验金活动页面";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/expBanner']);
                $('#mainContent').load('/pages/bannerPages/expBannerPage.html');
            });

            //邀请有礼活动页面
            var routeReferBanner = crossroads.addRoute('/referBanner');
            routeReferBanner.matched.add(function() {
                document.title = "邀请有礼活动页面";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "邀请有礼活动页面";
                meta[5].content = "邀请有礼活动页面";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/referBanner']);
                new DLC.ReferBanner();
            });

            //投资活动页面
            var routeInvestBanner = crossroads.addRoute('/investBanner');
            routeInvestBanner.matched.add(function() {
                document.title = "投资抽奖活动页面";
                var meta = document.getElementsByTagName("meta");
                meta[4].content = "投资抽奖活动页面";
                meta[5].content = "投资抽奖活动页面";
                $('#main_header').show();
                _hmt.push(['_trackPageview', '/#/investBanner']);
                $('#mainContent').load('/pages/bannerPages/investBannerPage.html', function() {
                    var investBanner = new DLC.InvestBanner();
                    investBanner.init();
                });
            });
        },

        userIsLogin: function(isLogin, toUrl) {
            window.app = window.app || new DLC.App();
            if (app.currentUser.hasLogin == isLogin) {
                window.location.href = toUrl;
                return false;
            }
            return true;
        },
        // getPageUrl: function () {
        //     var nowUrl = window.location.href;
        //     //如果来源页是登录页或者注册页则不记录
        //     if (nowUrl.indexOf("/login") != -1 || nowUrl.indexOf("/reg") != -1) {
        //         return;
        //     }
        //     //此js框架使用js的获取来源页（document.referrer）无效，所以使用了此笨办法
        //     $.cookie("nowStayPageUrl", nowUrl, {
        //         expires: 365
        //     });
        // }
    }, {})
})(crossroads, hasher)
