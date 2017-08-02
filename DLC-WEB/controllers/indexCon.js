var config = require('../base/config');
var notice = require('../service/notice');
var keywords = '点理财,点理财官网,点理财PPP,点理财财富,点理财论坛,投资,理财,金融,p2p理财,理财类网站,利息,年化收益,利率,余额,收益,平台';

exports.indexCon = {
    inint: function (app, http, req, response) {
        this.aboutNotice(app, http, req, response);
    },
    error404: function (app, http, req, response) {
        response.render('404', {
            keywords: keywords,
            thnav: ""
        });
    },
    aboutNotice: function (app, http, req, response) {
        var that = this;
        var utilService = config.config.utilService.host;
        var noticeList = [];
        that.noticeDataList(app, http, req, response, 1, 0, 6, utilService, noticeList);
    },
    noticeDataList: function (app, http, req, response, page, type, pageSize, utilService, noticeList) {
        var that = this;
        var aboutNotice = '/' + config.config.utilService.getBulletin + '?type=' + type + '&pageSize=' + pageSize + '&page=' + page;
        notice.notice.newsList(http, utilService, aboutNotice, '').then(function (data, arr) {
            noticeList[type] = data.data;
            if (type == 2) {
                response.render('newIndex', {
                    keywords: keywords,
                    noticeData: noticeList,
                    thnav: ""
                });
                return;
            } else {
                type++;
                that.noticeDataList(app, http, req, response, page, type, pageSize, utilService, noticeList);
            }
        })
    },
    webCount: function (app, http, req, response) {
        response.render('webCount', {
            keywords: keywords,
            thnav: ""
        });
    },
    productList: function (app, http, req, response) {
        response.render('productList', {
            keywords: keywords,
            thnav: ""
        });
    },
    product: function (app, http, req, response) {
        var productId = req.params.id;
        response.render('productDetail', {
            keywords: keywords,
            thnav: "",
            productId: productId
        });
    },
    pay: function (app, http, req, response) {
        var orderNo = req.params.id;        
        response.render('pay', {
            keywords: keywords,
            thnav: "",
            orderNo: orderNo
        });
    }
};