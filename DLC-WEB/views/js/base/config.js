(function () {
    var debug = true;

    var ErrorMessageList = {
        '401': '请登录',
        '429': '获取otp密码次数过多',
        '600': '验证码出错',
        '601': '验证码过期',
        '602': 'Otp验证出错',
        '603': '用户名已经存在',
        '604': '手机号已经存在',
        '605': '邮箱已经存在',
        '606': '认证失败',
        '607': '注册失败',
        '608': '无效的密码修改token',
        '609': '密码修改出错',
        '610': '认证token无效',
        //        '700': '用户和密码不匹配',
        //        '701': '密码输错超出次数限制',
        '702': '用户不存在',
        '703': '用户已注销',
        '704': '用户已锁定',
        '41000': '产品未找到',
        '41002': '用户未绑卡',
        '41001': '产品已下架',
        '41005': '产品已售罄',
        '41004': '已达用户最大购买限额',
        '41003': '已达用户单日最大购买限额',
        '41006': '小于起购金额',
        '41008': '已购买过新手产品,暂不能购买',
        '41010': '购买新手产品未实名认证',
        '41011': '订单已经过期',
        '41012': '订单已支付',
    };

    DLC.Config = {
        accountService: {
            host: debug ? 'https://unstable.dianlc.com' : 'https://{{www}}.{{dns_name}}',
            finance: 'trades/list',
            accountInfo: 'account',
            certification: 'account/auth',
            bindCard: 'account/cards',
            bindCardOtp: 'account/cards/otp',
            bindCardOtpValidate: 'account/cards/otp/validate?cellphone={0}&smsCode={1}',
            setTradePwOtp: 'account/password/otp',
            setTradePw: 'account/password',
            resetTradePwOtp: 'account/password/reset/otp',
            resetTradePwValidate: 'account/password/reset/validate',
            setTradePwValidate: 'account/password/validate',
            resetTradePw: 'account/password/reset',
            payTrade: 'trades/pay',
            deposit: 'account/deposit',
            depositOtp: 'account/deposit/otp',
            withdraw: 'account/withdraw',
            withdrawOtp: 'account/withdraw/otp',
            journal: 'trades/jour',
            coupons: 'account/coupons',
            couponsCount: 'account/coupons/count',
            payOtp: 'account/{0}/otp',
            otpValidate: 'account/{0}/otp/validate?smsCode={1}',
            pointsJour: 'account/points/jour',
            pointsRefer: 'account/points/refer',
            pointsCount: 'account/points',
            referRanks: 'accounts/refer/ranks',
            accountRaffle: 'account/raffle',
            accountPrizes: 'account/prizes',
            accountsPrizesJour: 'accounts/prizes/jour',
            accountsPrizesStats: 'accounts/prizes/stats',
            accountsStats: 'accounts/stats',
            productsStats: 'products/stats',
            //获取couponToken
            couponToken: 'accounts/coupons',
            couponTokenValidate: 'accounts/{0}/coupons',
        },
        paymentService: {
            host: debug ? 'https://unstable.dianlc.com' : 'https://{{www}}.{{dns_name}}',
            paymentFee: 'payments/settle/fees',
            provinces: 'payments/banks/provinces',
            cardbins: 'payments/banks/cardbins',
            banks: 'payments/banks',
        },
        userService: {
            host: debug ? 'https://unstable.dianlc.com' : 'https://{{www}}.{{dns_name}}',
            // host:'http://192.168.1.192',
            permission: 'permissions',
            role: 'roles',
            user: 'users',
            salt: 'user/signin/salt',
            signin: 'user/signin',
            signupValidate: 'user/signup/validate',
            signout: 'user/signout',
            passwordValidate: 'user/password/validate',
            password: 'user/password',
            passwordReset: 'user/password/reset',
            otpReset: 'user/password/reset/otp',
            otpResetToken: 'user/password/reset/token',
            otp_Validate: 'user/password/reset/otp/validate',
            otpCellphone: 'user/cellphone/otp',
            otpCellphoneValidate: 'user/cellphone/otp/validate',
            otpCellphonenew: 'user/cellphone/otp/new',
            setCellphonenew: 'user/cellphone',
            otpSignup: 'user/signup/quick/otp',
            signup: 'user/signup',
            quicksignup: 'user/signup/quick',
            captcha: 'user/captcha',
            captchaJPG: 'user/captcha/',
            captchaValidate: 'user/captcha/validate',
            userInfo: 'user',
            otpEmail: 'user/email/otp',
            setEmail: 'user/email',
            referInfo: 'users/{0}/refer',
            userRefer: 'user/refer',
            referToken: 'users/{0}/token',
        },
        bizAccountService: {
            host: debug ? 'https://unstable.dianlc.com' : 'https://{{www}}.{{dns_name}}',
            productShare: 'biz/accounts/share',
            productShareDetail: 'biz/accounts/share/{0}',
            referralCredit: 'biz/accounts/referralCredit'
        },
        bizTradeService: {
            host: debug ? 'https://unstable.dianlc.com' : 'https://{{www}}.{{dns_name}}',
            cradeOrder: 'biz/orders',
            cradeOrderTrade: 'biz/orders/{0}/trade',
            orderDetail: 'biz/orders/{0}',
            orderList: 'biz/orders',
            tradeList: 'biz/orders/userTrades',
            productTradeList: 'biz/orders/productTrades',
            contract: 'biz/orders/{0}/contract',
            tradesInvestList: 'trades/invest/list'
        },
        mgtProductService: {
            host: debug ? 'https://unstable.dianlc.com' : 'https://{{www}}.{{dns_name}}',
            // host:'http://192.168.1.192:8060',
            prodDictList: 'mgt/products/dict/list',
            productCode: 'mgt/products/code',
            productQuota: 'mgt/products/quota',
            taAllowBusiness: 'mgt/products/allowbusiness',
            taTrade: 'mgt/products/ta',
            productList: 'mgt/products/code/all',
            upload: 'mgt/products/fastdfs/upload',
            recommendsAll: 'products',
            promNew: 'products',
            dlc: 'products/dlc',
            dlcProductId: 'products/{0}'
        },
        fileService: {
            host: debug ? 'https://unstable.dianlc.com' : 'https://{{www}}.{{dns_name}}',
            uploadPortrait: 'utils/fastdfs?width=150&height=150',
        },
        utilService: {
            host: debug ? 'https://unstable.dianlc.com' : 'https://{{www}}.{{dns_name}}',
            getApk: 'utils/apps/{appName}/latest',
            getBulletin: 'utils/bulletin',
            newsNotice: 'utils/bulletin',
            articleId: 'utils/bulletin/{0}',
        },
        errorMessage: function (errorCode, errorMsg) {
            var errorCode = errorCode.toString();
            if (ErrorMessageList.hasOwnProperty(errorCode)) {
                return ErrorMessageList[errorCode];
            } else {
                return errorMsg;
            }
        },
        //检测是否移动手机访问，如果是跳转移动端首页
        checkIsMobile: function () {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {

                if (window.location.href.indexOf('/login') !== -1) {
                    window.location.href = debug ? 'https://unstable-m.dianlc.com/login' : 'https://{{mobile}}.{{dns_name}}/login';
                } else if (window.location.href.indexOf('/signup?token=') !== -1) {
                    window.location.href = debug ? 'https://unstable-m.dianlc.com/signup?token=' + window.location.href.split('signup?token=')[1] : 'https://{{mobile}}.{{dns_name}}/signup?token=' + window.location.href.split('signup?token=')[1];
                } else if (window.location.href.indexOf('/signup?utm_source=') !== -1) {
                    window.location.href = debug ? 'https://unstable-m.dianlc.com/signup?utm_source=' + window.location.href.split('signup?utm_source=')[1] : 'https://{{mobile}}.{{dns_name}}/signup?utm_source=' + window.location.href.split('signup?utm_source=')[1];
                } else if (window.location.href.indexOf('/signup') !== -1) {
                    window.location.href = debug ? 'https://unstable-m.dianlc.com/signup' : 'https://{{mobile}}.{{dns_name}}/signup';
                } else if (window.location.href.indexOf('/register?token=') !== -1) {
                    window.location.href = debug ? 'https://unstable-m.dianlc.com/register?token=' + window.location.href.split('register?token=')[1] : 'https://{{mobile}}.{{dns_name}}/register?token=' + window.location.href.split('register?token=')[1];
                } else if (window.location.href.indexOf('/register?utm_source=') !== -1) {
                    window.location.href = debug ? 'https://unstable-m.dianlc.com/register?utm_source=' + window.location.href.split('register?utm_source=')[1] : 'https://{{mobile}}.{{dns_name}}/register?utm_source=' + window.location.href.split('register?utm_source=')[1];
                } else if (window.location.href.indexOf('/register') !== -1) {
                    window.location.href = debug ? 'https://unstable-m.dianlc.com/register' : 'https://{{mobile}}.{{dns_name}}/register';
                } else if (window.location.href.indexOf('/refer?token=') !== -1) {
                    window.location.href = debug ? 'https://unstable-m.dianlc.com/refer?token=' + window.location.href.split('refer?token=')[1] : 'https://{{mobile}}.{{dns_name}}/refer?token=' + window.location.href.split('refer?token=')[1];
                } else if (window.location.href.indexOf('/refer?utm_source=') !== -1) {
                    window.location.href = debug ? 'https://unstable-m.dianlc.com/refer?utm_source=' + window.location.href.split('refer?utm_source=')[1] : 'https://{{mobile}}.{{dns_name}}/refer?utm_source=' + window.location.href.split('refer?utm_source=')[1];
                } else {
                    var ref = "";
                    if (document.referrer.length > 0) {
                        ref = document.referrer;
                    } else if (opener.location.href.length > 0) {
                        ref = opener.location.href;
                    }
                    if (ref) {
                        if (ref.indexOf("sogou") > -1) {
                            ref = "sogou";
                        } else if (ref.indexOf("baidu") > -1) {
                            ref = "baidu";
                        } else if (ref.indexOf(".so.") > -1) {
                            ref = "so";
                        } else if (ref.indexOf("sm-tc") > -1) {
                            ref = "sm";
                        }
                    }
                    var nHtml = "";
                    if (ref != "") {
                        nHtml = "/?utm_source=" + ref;
                    }
                    window.location.href = debug ? 'https://unstable-m.dianlc.com' + nHtml : 'https://{{mobile}}.{{dns_name}}' + nHtml;
                }
            }
        }
    }
    DLC.Config.checkIsMobile();
})()