(function ($) {
    'use strict'
    var page = '';
    DLC.AboutNotice = DLC.derive(DLC.DLC, {
        create: function (type) {
            this.bulletin = app.bulletin;
            DLC.Util.initPage();
            this.hasPaging = false;
            this.type = type;
            page = 1;
        },
        init: function (page) {
            var that = this;
            var param = {
                page: page,
                pageSize: 10,
            };
            var type = that.type;
            if (type == '0') {
                $('#styleName').html('最新公告');
            } else {
                $('#styleName').html('新闻动态');
            }
            param.type = type;
            that.bulletin.getBulletinList(param, function (prodList, paging) {
                that.initBulletinListView(prodList, paging);
                if (that.hasPaging == false) {
                    that.initPagination(paging);
                    that.hasPaging = true;
                }
            }, function (errorCode, errorMsg) {
                //console.log('shibai');
            });
        },
        initBulletinListView: function (prodList, paging) {
            var that = this;
            var rootNode = $('#articleList');
            rootNode.text("");
            rootNode.hide();
            for (var i = 0; i < prodList.length; i++) {
                this.createProductDom(prodList[i]);
            }
            rootNode.fadeIn(200);
            window.scrollTo(0, 0);
        },
        createProductDom: function (product) {
            var rootNode = $('#articleList');
            var detailSrc = '/aboutContent/' + product.bulletinId + '/' + product.bulletinType;
            var htmlStr =
                '<div class="aWdh936 aListDet">' +
                '<div class="aWid868 aFS16 tAndT" onclick=window.location.href="' + detailSrc + '">' +
                '<div class="fLeft">' + product.title + '</div>' +
                '<div class="fRight">' + product.createdAt + '</div>' +
                '</div>' +
                '<div class="aWid868 aColorAA aFS14 conBrief">' + product.summery + '</div>' +
                '</div>';

            rootNode.append(htmlStr);
        },
        initPagination: function (paging) {
            var that = this;
            $('#articleListPagination').pagination(paging.total * paging.pageSize, {
                num_edge_entries: 1,
                num_display_entries: 4,
                callback: function (page) {
                    that.init(page);
                },
                items_per_page: paging.pageSize,
            })
        },

    }, {})
})($)
