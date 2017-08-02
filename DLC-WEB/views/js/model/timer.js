(function($) {
    DLC.Timer = DLC.derive(null, {
        create: function(ttl, sId, mId, hId, dId) {
            var that = this;
            this.clear();
            var intDiff = parseInt(ttl);
            this.interval = window.setInterval(function() {
                var day = 0,
                    hour = 0,
                    minute = 0,
                    second = 0; //时间默认值
                if (intDiff > 0) {
                    day = Math.floor(intDiff / (60 * 60 * 24));
                    hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                    minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                    second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                } else {
                    $(".pay-timer").attr("disabled", true);
                    var txt = $(".pay-timer").text();
                    if(txt == '立即投资' || txt == '立即支付' || txt == '立即体验'){
                        $(".pay-timer").text("已过期");
                    }
                    that.clear();
                }
                // if (minute <= 9) minute = '0' + minute;
                // if (second <= 9) second = '0' + second;
                dId ? $(dId).html(day) : '';
                hId ? $(hId).html(hour) : '';
                mId ? $(mId).html(minute) : '';
                sId ? $(sId).html(second) : '';
                intDiff--;
            }, 1000);
            DLC.currentTimer = this.interval;
        },
        clear: function() {
            window.clearInterval(DLC.currentTimer);
        }
    })
})($)
