var config = require('../base/config');
var notice = require('../service/notice');
var keywords = '点理财,点理财官网,点理财PPP,点理财财富,点理财论坛,投资,理财,金融,p2p理财,理财类网站,利息,年化收益,利率,余额,收益,平台';
var description = "点理财是一家专业从事智慧城市和市政基础设施建设等PPP项目的互联网金融信息平台，于2016年正式上线运营，是上市公司智城控股（股票代码 08130-HK）旗下互联网金融信息平台，股东包括中国支付通（08325-HK)和国投瑞银基金。 智城控股与大型央企和国企强强联合，合作伙伴包含北控、华电、中铁等。";
var showTitle = "点理财-上市公司全资控股平台，专注市政PPP项目";

exports.company = {
    aboutCompany: function (app, http, req, response) {
        this.aboutCompanyGetData(app, http, req, response);
    },
    aboutCompanyGetData: function (app, http, req, response) {
        response.render('aboutCompany', {
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
    aboutMAdvantage: function (app, http, req, response) {
        this.aboutMAdvantageGetData(app, http, req, response);
    },
    aboutMAdvantageGetData: function (app, http, req, response) {
        response.render('aboutMAdvantage', {
            keywords: keywords,
            thnav: '',
            about_1: '',
            about_2: 'auCMOLine',
            about_3: '',
            about_4: '',
            about_5: '',
            about_6: ''
        });

    },
    aboutNotice: function (app, http, req, response) {
        var that = this;
        this.aboutNoticeGetData(app, http, req, response, that.noticeDataList);
    },
    aboutNoticeGetData: function (app, http, req, response, callback) {

        var page = (req.query.page == '' || req.query.page == null) ? 1 : req.query.page;
        var type = (req.query.type == '' || req.query.type == null) ? 0 : req.query.type;
        var pageSize = (req.query.pageSize == '' || req.query.pageSize == null) ? 10 : req.query.pageSize;
        var utilService = config.config.utilService.host;

        callback(app, http, req, response, page, type, pageSize, utilService);

    },
    noticeDataList: function (app, http, req, response, page, type, pageSize, utilService) {
        var aboutNotice = '/' + config.config.utilService.getBulletin + '?type=' + type + '&pageSize=' + pageSize + '&page=' + page;
        notice.notice.newsList(http, utilService, aboutNotice, '').then(function (data, arr) {
            var pageTotal = data.paging.total;

            var nextPage = page == pageTotal ? pageTotal : parseInt(page) + 1;
            var prevPage = page == 1 ? 1 : parseInt(page) - 1;
            var noticeTitle = '';
            var currnotice = '';
            var currnews = '';
            if (type == 0) {
                noticeTitle = '最新公告';
                currnotice = 'auCMOLine';
            } else {
                noticeTitle = '新闻动态';
                currnews = 'auCMOLine';
            };

            page = parseInt(page);
            pageTotal = parseInt(pageTotal);

            var startPage = page - 1 > 2 ? page - 2 : 1;
            var endPage = pageTotal - page > 2 ? page + 2 : pageTotal;

            response.render('aboutNotice', {
                keywords: keywords,
                thnav: '',
                about_1: '',
                about_2: '',
                about_3: currnotice,
                about_4: currnews,
                about_5: '',
                about_6: '',
                noticeTitle: noticeTitle,
                noList: data.data,
                pageAll: {
                    page: page,
                    pageTotal: pageTotal,
                    nextPage: nextPage,
                    prevPage: prevPage,
                    pageSize: pageSize,
                    type: type,
                    startPage: startPage,
                    endPage: endPage
                }

            });


        })

    },
    noticeDataContent: function (app, http, req, response) {
        var that = this;
        this.aboutNoticeGetData(app, http, req, response, that.newsDetails);

    },
    newsDetails: function (app, http, req, response, page, type, pageSize, utilService) {
        var page = (req.query.page == '' || req.query.page == null) ? 1 : req.query.page;
        var aboutNotice = '/' + config.config.utilService.getBulletin + '/' + req.params.id;
        notice.notice.newsList(http, utilService, aboutNotice, '').then(function (data, arr) {
            aboutNotice += "?preNext=true&type=" + data.data.bulletinType;
            notice.notice.newsList(http, utilService, aboutNotice, '').then(function (data, arr) {
                var previousUrl = "javascript:void(0)";
                var previousColor = "575757";
                var nextUrl = "javascript:void(0)";
                var nextColor = "575757";
                if (data.data.previous != null) {
                    previousUrl = "/noticeContent/" + data.data.previous.bulletinId;
                    previousColor = "398de1";
                }
                if (data.data.next != null) {
                    nextUrl = "/noticeContent/" + data.data.next.bulletinId;
                    nextColor = "398de1";
                }
                var content = data.data.current.content;
                var title = data.data.current.title;
                var noticeActive = '';
                var newsActive = '';
                var bulletinType = data.data.current.bulletinType;
                if (data.data.current.bulletinType == 0) {
                    noticeActive = 'auCMOLine';
                } else {
                    newsActive = 'auCMOLine';
                }
                if (data.data.current.summery != "") {
                    description = data.data.current.summery;
                }
                if (data.data.current.keyWord != "") {
                    keywords = data.data.current.keyWord;
                }
                if (data.data.current.title != "") {
                    showTitle = data.data.current.title;
                }
                response.render('aboutContent', {
                    keywords: keywords,
                    description: description,
                    previousColor: previousColor,
                    showTitle: showTitle,
                    previousUrl: previousUrl,
                    nextUrl: nextUrl,
                    nextColor: nextColor,
                    thnav: '',
                    about_1: '',
                    about_2: '',
                    about_3: noticeActive,
                    about_4: newsActive,
                    about_5: '',
                    about_6: '',
                    noticeContent: content,
                    noticeTile: title,
                    bulletinType: bulletinType,
                    page: page

                });
            })
        })
    },
    aboutMedia: function (app, http, req, response) {
        this.aboutMediaGetData(app, http, req, response);
    },
    aboutMediaGetData: function (app, http, req, response) {
        response.render('aboutMedia', {
            keywords: keywords,
            thnav: '',
            about_1: '',
            about_2: '',
            about_3: '',
            about_4: '',
            about_5: 'auCMOLine',
            about_6: ''
        });

    },
    aboutContact: function (app, http, req, response) {
        this.aboutContactGetData(app, http, req, response);
    },
    aboutContactGetData: function (app, http, req, response) {
        response.render('aboutContact', {
            keywords: keywords,
            thnav: '',
            about_1: '',
            about_2: '',
            about_3: '',
            about_4: '',
            about_5: '',
            about_6: 'auCMOLine'
        });

    }

};