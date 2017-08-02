var config = require('../base/config');
var notice = require('../service/notice');
var keywords = '点理财,点理财官网,点理财PPP,点理财财富,点理财论坛,投资,理财,金融,p2p理财,理财类网站,利息,年化收益,利率,余额,收益,平台';

exports.userCenter = {
    init: function (app, http, req, response) {
        var name = req.params.name;
        response.render('userCenter', {
            keywords: keywords,
            thnav: "",
            typeName: name
        });
    },
    initDefault: function (app, http, req, response) {
        response.render('userCenter', {
            keywords: keywords,
            thnav: "",
            typeName: "account"
        });
    },
};