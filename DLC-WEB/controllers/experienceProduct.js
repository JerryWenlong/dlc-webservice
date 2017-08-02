var config = require('../base/config');
var notice = require('../service/notice');

var keywords = '点理财,点理财官网,点理财PPP,点理财财富,点理财论坛,投资,理财,金融,p2p理财,理财类网站,利息,年化收益,利率,余额,收益,平台';

exports.renderPages = {
    pageRender: function(app, http, req, response) {
        this.initGetData(app, http, req, response);
    },
    initGetData: function(app, http, req, response) {
        response.render('experienceProduct', {
            keywords: keywords,
            thnav: '',
            about_1: 'auCMOLine',
            about_2: '',
            about_3: '',
            about_4: '',
            about_5: '',
            about_6: '',
            pid: req.params.id
        });
    },

};
