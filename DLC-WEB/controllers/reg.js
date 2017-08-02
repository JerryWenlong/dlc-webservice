var config = require('../base/config');
var notice = require('../service/notice');

// var jsdom = require("jsdom");
// var $ = require("../views/js/lib/jquery-1.12.3")(jsdom.jsdom().defaultView);

var keywords = '点理财,点理财官网,点理财PPP,点理财财富,点理财论坛,投资,理财,金融,p2p理财,理财类网站,利息,年化收益,利率,余额,收益,平台';

exports.registerData = {
    products: function(app, http, req, response) {
        this.productsGetData(app, http, req, response);
    },
    productsGetData: function(app, http, req, response) {
        response.render('reg', {
            keywords: keywords,
            thnav: '',
            about_1: 'auCMOLine',
            about_2: '',
            about_3: '',
            about_4: '',
            about_5: '',
            about_6: ''
        });
    },

};
