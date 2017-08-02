(function ($) {
    'use strict';
    DLC.ArticleDetail = DLC.derive(DLC.DLC, {
        create: function (articleId) {
            this.bulletinId = articleId;
            this.bulletin = app.bulletin;
            //this.initProduct();
        },
        init: function () {
            var that = this;
            that.bulletin.getAboutContentId(this.bulletinId, function (artDetail) {
                window.scrollTo(0, 0);
                $('#artTitle').html(artDetail.title);
                $('#showTime').html(artDetail.createdAt);
                if (artDetail.content != "") {
                    $('#content').html(artDetail.content);
                }

                $('#goBack').bind('click', function () {
                    if (artDetail.bulletinType == 0) {
                        window.location.href = '/aboutNotice/' + artDetail.bulletinType;
                    } else {
                        window.location.href = '/aboutNotice/1,2';
                    }
                });

            }, function () {
                //error
            });
        },


    }, {});
})($)
