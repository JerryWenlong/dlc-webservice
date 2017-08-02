(function($) {
    var debug = true;
    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    // Reference: http://es5.github.io/#x15.4.4.18
    if (!Array.prototype.forEach) {

        Array.prototype.forEach = function(callback, thisArg) {

            var T, k;

            if (this == null) {
                throw new TypeError(' this is null or not defined');
            }

            // 1. Let O be the result of calling toObject() passing the
            // |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get() internal
            // method of O with the argument "length".
            // 3. Let len be toUint32(lenValue).
            var len = O.length >>> 0;

            // 4. If isCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if (typeof callback !== "function") {
                throw new TypeError(callback + ' is not a function');
            }

            // 5. If thisArg was supplied, let T be thisArg; else let
            // T be undefined.
            if (arguments.length > 1) {
                T = thisArg;
            }

            // 6. Let k be 0
            k = 0;

            // 7. Repeat, while k < len
            while (k < len) {

                var kValue;

                // a. Let Pk be ToString(k).
                //    This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty
                //    internal method of O with argument Pk.
                //    This step can be combined with c
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal
                    // method of O with argument Pk.
                    kValue = O[k];

                    // ii. Call the Call internal method of callback with T as
                    // the this value and argument list containing kValue, k, and O.
                    callback.call(T, kValue, k, O);
                }
                // d. Increase k by 1.
                k++;
            }
            // 8. return undefined
        };
    }


    if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
            if (this === null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        };
    }
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
    }

    Date.prototype.format = function(format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }

    DLC.Util = {
        stringFormat: function(str, args) {
            return str.replace(/\{(\d+)\}/g,
                function(m, i) {
                    return args[i];
                });
        },
        isArray: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        encrypt: {
            // encrypt for bscript, RSA,MD5
            _round: 10, // set salt round
            //encrypt password
            //params:
            //  pw: user password.
            //  callback: encrypt success function.
            //  progress: progress function(optional)
            cryptPasswordSync: function(pw, salt) {
                if (!salt || salt == "") {
                    var salt = jBcrypt.genSaltSync(this._round);
                }
                var hash_str = jBcrypt.hashSync(pw, salt);
                return [hash_str, salt];
            },
            generateMD5Sync: function(pw, salt, random_key) {
                var hash_str = this.cryptPasswordSync(pw, salt)[0];
                var md5_result = MD5(hash_str + random_key);
                return md5_result;
            },
            encryptRSA: function(publicKey) {
                var encrypt = new JSEncrypt();
                encrypt.setPublicKey(publicKey);
                return encrypt.encrypt(publicKey);
            },
        },
        getApiUrl: function(serverName, apiName, urlStr) {
            var service = MIS.Config[serverName];
            var s = urlStr ? urlStr : "{0}/{1}";
            var url = this.stringFormat(s, [service.host, service[apiName]]);
            return url;
        },
        addClass: function(obj, claN) {
            var reg = new RegExp('(^|\\s)' + claN + '(\\s|$)');
            if (!reg.test(obj.className)) {
                obj.className += ' ' + claN;
            }
        },
        removeClass: function(obj, claN) {
            var cla = obj.className,
                reg = "/\\s*" + claN + "\\b/g";
            obj.className = cla ? cla.replace(eval(reg), '') : ''
        },
        fRandomBy: function(under, over) {
            switch (arguments.length) {
                case 1:
                    return parseInt(Math.random() * under + 1);
                case 2:
                    return parseInt(Math.random() * (over - under + 1) + under);
                default:
                    return 0;
            }
        },
        // 两个浮点数求和
        accAdd: function(num1, num2) {
            var r1, r2, m;
            try {
                r1 = num1.toString().split('.')[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = num2.toString().split(".")[1].length;
            } catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            // return (num1*m+num2*m)/m;
            return Math.round(num1 * m + num2 * m) / m;
        },
        // 两个浮点数相减
        accSub: function(num1, num2) {
            var r1, r2, m;
            try {
                r1 = num1.toString().split('.')[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = num2.toString().split(".")[1].length;
            } catch (e) {
                r2 = 0;
            }
            m = Math.pow(10, Math.max(r1, r2));
            n = (r1 >= r2) ? r1 : r2;
            return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
        },
        bind: function(target, type, listener) {
            if (target.addEventListener) {
                target.addEventListener(type, listener, false)
            } else if (target.attachEvent) {
                target.attachEvent('on' + type, listener)
            } else {
                target["on" + type] = listener;
            }
        },
        unbind: function(target, type, listener) {
            if (target.removeEventListener) {
                target.removeEventListener(type, listener, false)
            } else if (target.detachEvent) {
                target.detachEvent("on" + type, listener);
            } else {
                target["on" + type] = null;
            }
        },
        dateFormat: function(timeString, formatStr) {
            // var formatStr = formatStr || "yyyy-mm-dd";
            // var date = new Date();
            // date.setTime(timeStamp);
            // return date.format(formatStr);
            var timeString = timeString.split('T');
            return timeString[0];
        },
        dateFormat_1: function(timeString) {
            var timeString = timeString.split('T');
            var result = timeString[0].replace(new RegExp('-', 'gm'), '/');
            return result;
        },
        toPercent: function(num) {
            var numStr = num.toString()
            var dotIndex = numStr.indexOf('.')
            var numWithoutDotStr = numStr.replace('.', '')
            var numStrList = numStr.split('')
            var result = ''
            if (dotIndex == 1) {
                result = '0.0' + numWithoutDotStr
            } else if (dotIndex == 2) {
                result = '0.' + numWithoutDotStr
            } else if (dotIndex == -1) {
                if (numStr.length == 1) {
                    result = '0.0' + numStr
                } else if (numStr.length == 2) {
                    result = '0.' + numStr
                } else if (numStr.length > 2) {
                    var numStrListLen = numStrList.length
                    var intergerPartList = numStrList.splice(0, numStrListLen - 2)
                    var intergerPart = intergerPartList.join('')
                    var decimalPartList = numStrList
                    var decimalPart = decimalPartList.join('')
                    result = intergerPart + '.' + decimalPart
                }
            } else {
                intergerPart = numStrList.splice(0, dotIndex - 2).join('')
                for (var i = 0; i < numStrList.length; i++) {
                    if (numStrList[i] == '.') {
                        numStrList.splice(i, 1)
                    }
                }
                decimalPart = numStrList.join('')
                result = intergerPart + '.' + decimalPart
            }

            if (/^[1-9]\d*\.[1-9]+0+$/.test(result)) {
                result = result.replace(/0+$/, '')
            } else if (/^[1-9]\d*\.0+$/.test(result)) {
                result = result.replace(/\.0+$/, '')
            }
            return result
        },
        parsePercent: function(num) {
            var numStr = num.toString()
            var dotIndex = numStr.indexOf('.')
            var numWithoutDotStr = numStr.replace('.', '')
            var numStrList = numStr.split('')
            var result = ''
            if (dotIndex == -1) {
                result = parseInt(numStr * 100).toString()
            } else {
                var newDotIndex = dotIndex + 2
                oldDecimalPartList = numStrList.slice(dotIndex + 1, numStrList.length)
                if (oldDecimalPartList.length == 1) {
                    numStrList.push('0')
                }
                numStrList.splice(dotIndex, 1)
                numStrList.splice(newDotIndex, 0, '.')
                if (numStrList[numStrList.length - 1] == '.') {
                    numStrList.splice(numStrList.length - 1, 1)
                }
                result = numStrList.join('')
            }
            if (/^[1-9]\d*\.[1-9]+0+$/.test(result)) {
                result = result.replace(/0+$/, '')
            } else if (/^[1-9]\d*\.0+$/.test(result)) {
                result = result.replace(/\.0+$/, '')
            }
            return result
        },
        strToTimestamp: function(str) {
            formatedStr = str.replace(/^\s+/, '')
            formatedStr = str.replace(/\s+$/, '')
            result = 0;
            if (formatedStr == '') {
                return
            }
            if (formatedStr.indexOf(' ') != -1) {
                mainList = formatedStr.split(' ')
                dateList = mainList[0].split('-')
                timeList = mainList[1].split(':')
            }
            if (formatedStr.indexOf('T') != -1) {
                mainList = formatedStr.split('T')
                dateList = mainList[0].split('')
                timeList = mainList[1].split(':')
            }
            result = Date.UTC(parseInt(dateList[0]), parseInt(dateList[1]), parseInt(dateList[2]), parseInt(timeList[0]), parseInt(timeList[1]), parseInt(timeList[2]), 0)
            return result
        },
        initPage: function() {
            // hide all
            this.hideOverlay();
            this.hideAdjust('#adjust');
        },
        showOverlay: function() {
            if (!$("#overlay").get(0)) {
                $('body').append('<div id="overlay"></div>');
            }
            var pageHeight = document.body.scrollHeight;
            var pageWidth = document.body.scrollWidth;
            $("#overlay").height(pageHeight);
            $("#overlay").width(pageWidth);

            $("#overlay").fadeTo(200, 0.5);
        },
        hideOverlay: function() {
            $("#overlay").fadeOut(200);
        },
        showAdjust: function(id) {
            var w = $(id).width();
            var h = $(id).height();
            // var t = this.scrollY() + (this.windowHeight()/2) - (h/2);
            // if(t < 0) t = 0;
            // var l = this.scrollX() + (this.windowWidth()/2) - (w/2);
            // if(l < 0) l = 0;
            // $(id).css({left: l+'px', top: t+'px'});
            var marginL = w / 2;
            var marginT = h / 2;
            $(id).css({
                zIndex: '1001',
                left: '50%',
                top: '50%',
                marginLeft: '-' + marginL + 'px',
                marginTop: '-' + marginT + 'px',
                position: 'fixed'
            })
            $(id).fadeIn(200);
        },
        showAdjustTwoId: function(id, id2, maxH) {
            var id2H = $(window).height() - 40;
            if (id2H > maxH) {
                id2H = maxH;
            }
            $(id2).css({
                height: id2H + 'px'
            });
            var w = $(id).width();
            var h = $(id).height();
            var marginL = w / 2;
            var marginT = h / 2;
            $(id).css({
                zIndex: '1001',
                left: '50%',
                top: '50%',
                marginLeft: '-' + marginL + 'px',
                marginTop: '-' + marginT + 'px',
                position: 'fixed'
            });
            $(id).fadeIn(200);
        },
        showAdjust2: function(id) {
            var w = $(window).width();
            var h = $(window).height();
            var marginL = (w - 1200) / 2;
            var marginT = (h - 650) / 4 > 0 ? (h - 650) / 4 : 0;
            $(id).css({
                zIndex: '1001',
                marginLeft: marginL + 'px',
                top: marginT + 'px',
                position: 'fixed'
            })
            $(id).fadeIn(200);
        },
        showErrorAdjust: function(msg, fn) {
            var that = this;
            $('#adjust').load('../pages/error.html', function() {
                DLC.Util.showOverlay();
                if (msg == "Unauthorized") msg = "登录已失效，请重新登录";
                $('#adjustErrorMsg').text(msg);
                $('#adjustErrorBtn').bind('click', function() {
                    that.hideAdjust('#adjust');
                    that.hideOverlay();
                    if (fn) {
                        fn();
                    }
                })
                DLC.Util.showAdjust('#adjust');
            })
        },
        hideAdjust: function(id) {
            $(id).hide();
        },
        //浏览器视口的高度
        windowHeight: function() {
            var de = document.documentElement;
            return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
        },

        //浏览器视口的宽度
        windowWidth: function() {
            var de = document.documentElement;
            return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth
        },

        /* 浏览器垂直滚动位置 */
        scrollY: function() {
            var de = document.documentElement;
            return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
        },

        /* 浏览器水平滚动位置 */
        scrollX: function() {
            var de = document.documentElement;
            return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft;
        },
        timeToSec: function(milliseconds) {
            var str = milliseconds.toString();
            var secStr = str.substr(0, (str.length - 3));
            return parseInt(secStr);
        },

        setBankIcon: function(bankNo, iconSrc) {
            var icon = $('#' + iconSrc);
            var bankIconClass = 'bank_icon_' + bankNo;
            icon.addClass(bankIconClass);
        },
        /**
         * 将数值四舍五入(保留2位小数)后格式化成金额形式
         *
         * @param num 数值(Number或者String)
         * @precision 精度
         * @return 金额格式的字符串,如'1,234,567.45'
         * @type String
         */
        formatCurrency: function(num, precision, keep0cents) {
            var precision = precision == 0 ? 0 : 2;
            var pre = Math.pow(10, precision);
            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num))
                num = "0";
            sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * pre + 0.50000000001);
            cents = num % pre;
            num = Math.floor(num / pre).toString();
            if (cents == 0) {
                cents = keep0cents ? ".00" : "";
            } else if (cents < 10) {
                cents = ".0" + cents;
            } else {
                cents = "." + cents;
            }
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                num.substring(num.length - (4 * i + 3));
            return (((sign) ? '' : '-') + num + cents);
        },
        /**
         * 将金额形式转换成数字形式
         *
         * @param num 数值(Number或者String)
         * @return 金额格式的字符串,如'4,567.45'转换成4567.45
         * @type String
         */
        formatNormalNumber: function(currency) {
            return parseFloat(currency.replace(/[^\d\.-]/g, ""));
        },
        //金额正则
        testCurrencyAmount: function(amount) {
            var amount = amount.toString();
            var reg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;
            var result = reg.test(amount);
            return result;
        },
        //最低购买金额倍数
        testMinAddAmount: function(amount, minAddAmount) {
            var result = false;
            if (parseFloat(amount) % parseFloat(minAddAmount) == 0) {
                result = true;
            }
            return result;
        },

        testBankPhone: function(phoneNo) {
            var phoneNo = phoneNo.toString();
            var reg = /^1[3|4|5|7|8][0-9]{9}$/;
            var result = reg.test(phoneNo);
            return result;
        },

        testUserName: function(userName) {
            var userName = userName.toString();
            var reg = /^[A-Za-z0-9_\-\u4e00-\u9fa5]{1,20}$/;
            var result = reg.test(userName);
            return result;
        },

        testOtpCode: function(otpNo) {
            var otpNo = otpNo.toString();
            var reg = /^[0-9]{6}$/;
            var result = reg.test(otpNo);
            return result;
        },

        testTradePassword: function(tradePw) {
            var tradePw = tradePw.toString();
            var reg = /(((?=.*[a-zA-Z])(?=.*[0-9]))|((?=.*?[@!#$%^&*()_+\.\-\?<>'|=])(?=.*[0-9]))|((?=.*?[@!#$%^&*()_+\.\-\?<>'|=])(?=.*[a-zA-Z]))).{8,16}$/;
            var result = reg.test(tradePw);
            return result;
        },
        validateIdCard: function(idCard) {
            //15位和18位身份证号码的正则表达式
            var regIdCard = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$/;
            //如果通过该验证，说明身份证格式正确，但准确性还需计算
            if (regIdCard.test(idCard)) {
                //判断前2位合法性
                var aCity = {
                    11: "北京",
                    12: "天津",
                    13: "河北",
                    14: "山西",
                    15: "内蒙古",
                    21: "辽宁",
                    22: "吉林",
                    23: "黑龙江 ",
                    31: "上海",
                    32: "江苏",
                    33: "浙江",
                    34: "安徽",
                    35: "福建",
                    36: "江西",
                    37: "山东",
                    41: "河南",
                    42: "湖北 ",
                    43: "湖南",
                    44: "广东",
                    45: "广西",
                    46: "海南",
                    50: "重庆",
                    51: "四川",
                    52: "贵州",
                    53: "云南",
                    54: "西藏 ",
                    61: "陕西",
                    62: "甘肃",
                    63: "青海",
                    64: "宁夏",
                    65: "新疆",
                    71: "台湾",
                    81: "香港",
                    82: "澳门",
                    91: "国外"
                };
                if (aCity[parseInt(idCard.substr(0, 2))] == null) return false;

                var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
                var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
                for (var i = 0; i < 17; i++) {
                    idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
                }
                var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
                var idCardLast = idCard.substring(17); //得到最后一位身份证号码
                //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                if (idCardMod == 2) {
                    if (idCardLast == "X" || idCardLast == "x") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                    if (idCardLast == idCardY[idCardMod]) {
                        return true;
                    } else {
                        return false;
                    }
                }

            } else {
                return false;
            }
        },
        //验证银行卡号
        validateBankNum: function(bankName, bankNum) {
            var bankNumRule = /^\d{16}|\d{19}|\d{17}|\d{18}$/; //银行卡号验证规则
            if ($.trim(bankNum) == "" || bankNum == null) {
                return false;
            } else if (!bankNumRule.test(bankNum)) {
                return false;
            }
            return true;
        },

        //div居主屏幕中
        letDivCenter: function(div) {
            var top = ($(window).height() - $(div).height()) / 2;
            var left = ($(window).width() - $(div).width()) / 2;
            var scrollTop = $(document).scrollTop();
            var scrollLeft = $(document).scrollLeft();
            $(div).css({
                position: 'absolute',
                'top': top + scrollTop,
                left: left + scrollLeft
            }).show();

            // var w = $(id).width();
            // var h = $(id).height();
            // var marginL = w / 2;
            // var marginT = h / 2;
            // $(id).css({
            //     zIndex: '1001',
            //     left: '50%',
            //     top: '50%',
            //     marginLeft: '-' + marginL + 'px',
            //     marginTop: '-' + marginT + 'px',
            //     position: 'fixed'
            // })
            // $(id).fadeIn(200);
        },
        //获取url参数
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return '';
        },
        //获取当前时间N分钟后的时间
        getExpiresDate: function(minute) {
            var date = new Date();
            date.setTime(date.getTime() + minute * 60 * 1000); //保留10分钟
            return date;
        },
        //数组去重
        array_diff: function(arr) {
            var ret = [];
            var hash = {};
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                var key = typeof(item) + item;
                if (hash[key] !== 1) {
                    ret.push(item);
                    hash[key] = 1;
                }
            }
            return ret;
        },
    }
})($)
