var config = require('../base/config');
var account = require('../service/account');
var keywords = '点理财,点理财官网,点理财PPP,点理财财富,点理财论坛,投资,理财,金融,p2p理财,理财类网站,利息,年化收益,利率,余额,收益,平台';

exports.banners = {
    refer2: function (app, http, req, response) {
        var utilService = config.config.utilService.host;
        var paras = '/' + config.config.utilService.referRanks + '?referFrom=20161101';
        account.account.getReferRanks(http, utilService, paras, '').then(function (data, arr) {
            response.render('banners/refer2', {
                keywords: keywords,
                thnav: '',
                ranksList: data.data
            });
        })
    },
    redpacket161101: function (app, http, req, response) {
        response.render('banners/redpacket161101', {
            keywords: keywords,
            thnav: ''
        });
    },
    rebate161107: function (app, http, req, response) {
        response.render('banners/rebate161107', {
            keywords: keywords,
            thnav: ''
        });
    },
    activity161121: function (app, http, req, response) {
        response.render('banners/activity161121', {
            keywords: keywords,
            thnav: ''
        });
    },
    activity161124: function (app, http, req, response) {
        response.render('banners/activity161124', {
            keywords: keywords,
            thnav: ''
        });
    },
    activity161128: function (app, http, req, response) {
        var utilService = config.config.utilService.host;
        var paras = '/' + config.config.utilService.referRanks + '?referFrom=20161201';
        account.account.getReferRanks(http, utilService, paras, '').then(function (data, arr) {
            response.render('banners/activity161128', {
                keywords: keywords,
                thnav: '',
                ranksList: data.data
            });
        })
    },
    activity161129: function (app, http, req, response) {
        response.render('banners/activity161129', {
            keywords: keywords,
            thnav: ''
        });
    },
    activity161228: function (app, http, req, response) {
        var utilService = config.config.utilService.host;
        var paras = '/' + config.config.utilService.referRanks + '?referFrom=20170106&investLimit=5000';
        account.account.getReferRanks(http, utilService, paras, '').then(function (data, arr) {
            response.render('banners/activity161228', {
                keywords: keywords,
                thnav: '',
                ranksList: data.data
            });
        })
    },
    activity161230: function (app, http, req, response) {
        response.render('banners/activity161230', {
            keywords: keywords,
            thnav: ''
        });
    },
    activity170316: function (app, http, req, response) {
        response.render('banners/activity170316', {
            keywords: keywords,
            thnav: ''
        });
    },
    activity170410: function (app, http, req, response) {
        response.render('banners/activity170410', {
            keywords: keywords,
            thnav: '',
        });
    },
    activity170510: function (app, http, req, response) {
        response.render('banners/activity170510', {
            keywords: keywords,
            thnav: '',
        });
    },
};