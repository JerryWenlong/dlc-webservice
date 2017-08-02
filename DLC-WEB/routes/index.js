var insurance = require('../controllers/insurance');
var aboutCompany = require('../controllers/aboutCompany');
var helpCenter = require('../controllers/helpCenter');
var register = require('../controllers/register');
var reg = require('../controllers/reg');
var indexCon = require('../controllers/indexCon');
var userCenter = require('../controllers/userCenter');
var signupSuccess = require('../controllers/signupSuccess');
var banners = require('../controllers/banners');
var signup = require('../controllers/signup');
var login = require('../controllers/login');
var refer = require('../controllers/refer');
var signupAgreement = require('../controllers/signupAgreement');
var moreActivity = require('../controllers/moreActivity');
var experienceProduct = require('../controllers/experienceProduct');
var siteMap = require('../controllers/siteMap');
var investCalcu = require('../controllers/investCalcu');

module.exports = function (app, http) {
    //首页
    app.get('/', function (req, response) {
        indexCon.indexCon.inint(app, http, req, response);
    });

    //404
    app.get('/404', function (req, response) {
        indexCon.indexCon.error404(app, http, req, response);
    });

    //我要投资
    app.get('/productList', function (req, response) {
        indexCon.indexCon.productList(app, http, req, response);
    });
    app.get('/product_:id', function (req, response) {
        indexCon.indexCon.product(app, http, req, response);
    });
    
    //支付
    app.get('/pay_:id', function (req, response) {
        indexCon.indexCon.pay(app, http, req, response);
    });
    
    //我的账户
    app.get('/myCenter_:name', function (req, response) {
        userCenter.userCenter.init(app, http, req, response);
    });

    //信息披露
    app.get('/webCount', function (req, response) {
        indexCon.indexCon.webCount(app, http, req, response);
    });

    //公司介绍
    app.get('/aboutCompany', function (req, response) {
        aboutCompany.company.aboutCompany(app, http, req, response);
    });

    app.get('/aboutMAdvantage', function (req, response) {
        aboutCompany.company.aboutMAdvantage(app, http, req, response);
    });

    app.get('/aboutNotice', function (req, response) {
        aboutCompany.company.aboutNotice(app, http, req, response);
    });

    app.get('/noticeContent/:id', function (req, response) {
        aboutCompany.company.noticeDataContent(app, http, req, response);
    });

    app.get('/aboutMedia', function (req, response) {
        aboutCompany.company.aboutMedia(app, http, req, response);
    });

    app.get('/aboutContact', function (req, response) {
        aboutCompany.company.aboutContact(app, http, req, response);
    });

    //投资保障
    app.get('/insurancePro', function (req, response) {
        insurance.insurance.insurancePro(app, http, req, response)
    });

    app.get('/insuranceMoney', function (req, response) {
        insurance.insurance.insuranceMoney(app, http, req, response)
    });

    //帮助中心
    app.get('/guide', function (req, response) {
        helpCenter.help.guidePro(app, http, req, response)
    });

    app.get('/questionUser', function (req, response) {
        helpCenter.help.questionUser(app, http, req, response)
    });

    app.get('/questionPwd', function (req, response) {
        helpCenter.help.questionPwd(app, http, req, response)
    });

    app.get('/questionBank', function (req, response) {
        helpCenter.help.questionBank(app, http, req, response)
    });

    app.get('/questionRecharge', function (req, response) {
        helpCenter.help.questionRecharge(app, http, req, response)
    });

    app.get('/questionCash', function (req, response) {
        helpCenter.help.questionCash(app, http, req, response)
    });

    app.get('/questionInvest', function (req, response) {
        helpCenter.help.questionInvest(app, http, req, response)
    });

    app.get('/questionIncomeAndRedeem', function (req, response) {
        helpCenter.help.questionIncomeAndRedeem(app, http, req, response)
    });

    //注册
    app.get('/register', function (req, response) {
        register.renderPages.pageRender(app, http, req, response);
    });
    app.get('/regActivity', function (req, response) {
        reg.registerData.products(app, http, req, response);
    });

    app.get('/signupSuccess', function (req, response) {
        signupSuccess.renderPages.pageRender(app, http, req, response);
    });

    app.get('/signupAgreement', function (req, response) {
        signupAgreement.renderPages.pageRender(app, http, req, response);
    });

    app.get('/signup', function (req, response) {
        signup.renderPages.pageRender(app, http, req, response);
    });

    app.get('/refer', function (req, response) {
        refer.renderPages.pageRender(app, http, req, response);
    });

    app.get('/login', function (req, response) {
        login.renderPages.pageRender(app, http, req, response);
    });

    app.get('/siteMap', function (req, response) {
        siteMap.renderPages.pageRender(app, http, req, response);
    });

    app.get('/investCalcu', function (req, response) {
        investCalcu.renderPages.pageRender(app, http, req, response);
    });

    app.get('/experienceProduct_:id', function (req, response) {
        experienceProduct.renderPages.pageRender(app, http, req, response);
    });
    //活动板块
    //邀请好礼161027版
    app.get('/banners/refer2', function (req, response) {
        banners.banners.refer2(app, http, req, response);
    });
    //红包补贴活动161031版
    app.get('/banners/redpacket161101', function (req, response) {
        banners.banners.redpacket161101(app, http, req, response);
    });
    //点币返利活动161107版
    app.get('/banners/rebate161107', function (req, response) {
        banners.banners.rebate161107(app, http, req, response);
    });
    //点币抽奖活动161121版
    app.get('/activity161121', function (req, response) {
        banners.banners.activity161121(app, http, req, response);
    });
    //红包活动161124版
    app.get('/activity161124', function (req, response) {
        banners.banners.activity161124(app, http, req, response);
    });
    //邀请有礼活动161128版
    app.get('/activity161128', function (req, response) {
        banners.banners.activity161128(app, http, req, response);
    });
    //投资抽奖活动161129版
    app.get('/activity161129', function (req, response) {
        banners.banners.activity161129(app, http, req, response);
    });
    //邀请有礼活动161228版
    app.get('/activity161228', function (req, response) {
        banners.banners.activity161228(app, http, req, response);
    });
    //逢万返百活动161230版
    app.get('/activity161230', function (req, response) {
        banners.banners.activity161230(app, http, req, response);
    });
    //新手标活动170316版
    app.get('/activity170316', function (req, response) {
        banners.banners.activity170316(app, http, req, response);
    });
    //2%加息+888现金活动
    app.get('/activity170410', function (req, response) {
        banners.banners.activity170410(app, http, req, response);
    });
    //鑫盈精选
    app.get('/activity170510', function (req, response) {
        banners.banners.activity170510(app, http, req, response);
    });
    //更多活动
    app.get('/moreActivity', function (req, response) {
        moreActivity.renderPages.pageRender(app, http, req, response);
    });
}