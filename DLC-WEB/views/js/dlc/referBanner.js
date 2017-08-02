(function ($) {
    'use strict';
    var that = null;
    DLC.ReferBanner = DLC.derive(DLC.DLC, {
        create: function () {
            this.account = app.account;
            that = this;
            window.app.initHeader(1);
            $('#mainContent').load('/pages/bannerPages/referBannerPage.html', function () {
                that.init();
            })
        },
        init: function () {
            $(".rbp2A1").mousemove(function(){
                $(this).addClass("btn");
            }).mouseout(function(){
                $(this).removeClass("btn");
            });
            that.account.getReferRanks("", function (list, pages) {
                var num = 8;
                var html = "";
                for(var i = 0;i < list.length && i < num;i++){
                    var divClass = "rbp3dcK" + (i+1);
                    var prizeText = "加油中...";
                    if(i == 0){
                        prizeText = "一等奖";
                    }else if(i == 1){
                        prizeText = "二等奖";
                    }else if(i == 2){
                        prizeText = "三等奖";
                    }
                    html += '<div class="'+divClass+'"><span class="rbp3dhs rbpdw1px">'+list[i].cellphone+'</span><span class="rbp3dhs rbpdw2px">'+list[i].referCount+'人</span><span class="rbp3dhs rbpdw3px">'+prizeText+'</span><span class="rbp3dhs rbpdw4px">'+list[i].referAt.replace("T"," ")+'</span></div>';
                }
                $("#rbp3Div3Content").html(html);
            }, function (errorCode, errorMsg) {

            });
        },
    }, {})
})($)
