var keywords='点理财,点理财官网,点理财PPP,点理财财富,点理财论坛,投资,理财,金融,p2p理财,理财类网站,利息,年化收益,利率,余额,收益,平台';

exports.help={
	guidePro:function(app,http,req,response){
		this.helpHtml(app,http,req,response,'guide','',keywords);
	},
	questionUser:function(app,http,req,response){
		this.helpHtml(app,http,req,response,'questionCenter','questionUser',keywords);
	},
	questionPwd:function(app,http,req,response){
		this.helpHtml(app,http,req,response,'questionCenter','questionPwd',keywords);
	},
	questionBank:function(app,http,req,response){
		this.helpHtml(app,http,req,response,'questionCenter','questionBank',keywords);
	},
	questionRecharge:function(app,http,req,response){
		this.helpHtml(app,http,req,response,'questionCenter','questionRecharge',keywords);
	},
	questionCash:function(app,http,req,response){
		this.helpHtml(app,http,req,response,'questionCenter','questionCash',keywords);
	},
	questionInvest:function(app,http,req,response){
		this.helpHtml(app,http,req,response,'questionCenter','questionInvest',keywords);
	},
	questionIncomeAndRedeem:function(app,http,req,response){
		this.helpHtml(app,http,req,response,'questionCenter','questionIncomeAndRedeem',keywords);
	},
	helpHtml:function(app,http,req,response,defalt,htmlFiles,keyword){
		
		var questionUser=[];
		var questionPwd=[];
		var questionBank=[];
		var questionRecharge=[];
		var questionCash=[];
		var questionInvest=[];
		var questionIncomeAndRedeem=[];
		
		questionUser.menu='';
		questionUser.icon='questionCenterA';
		
		questionPwd.menu='';
		questionPwd.icon='questionCenterB';
		
		questionBank.menu='';
		questionBank.icon='questionCenterC';
		
		questionRecharge.menu='';
		questionRecharge.icon='questionCenterD';
		
		questionCash.menu='';
		questionCash.icon='questionCenterE';
		
		questionInvest.menu='';
		questionInvest.icon='questionCenterF';
		
		questionIncomeAndRedeem.menu='';
		questionIncomeAndRedeem.icon='questionCenterG';
		
		switch (htmlFiles) {
            case "questionUser":
                questionUser.menu='menuChoose';
				questionUser.icon='questionCenterA1';
                break;
            case "questionPwd":
                questionPwd.menu='menuChoose';
				questionPwd.icon='questionCenterB1';
                break;
            case "questionBank":
                questionBank.menu='menuChoose';
				questionBank.icon='questionCenterC1';
                break;
            case "questionRecharge":
                questionRecharge.menu='menuChoose';
				questionRecharge.icon='questionCenterD1';
                break;
            case "questionCash":
                questionCash.menu='menuChoose';
				questionCash.icon='questionCenterE1';
                break;
            case "questionInvest":
                questionInvest.menu='menuChoose';
				questionInvest.icon='questionCenterF1';
                break;
            case "questionIncomeAndRedeem":
                questionIncomeAndRedeem.menu='menuChoose';
				questionIncomeAndRedeem.icon='questionCenterG1';
                break;
            default:
                questionUser.menu='menuChoose';
				questionUser.icon='questionCenterA1';
                break;
            }
		
		
		response.render(defalt,{
			keywords:keyword,
			onnav:'',
			twnav:'',
			thnav:'',
			fonav:'',
			loadHtml:htmlFiles,
			leftNav:{
				questionUser:questionUser,
				questionPwd:questionPwd,
				questionBank:questionBank,
				questionRecharge:questionRecharge,
				questionCash:questionCash,
				questionInvest:questionInvest,
				questionIncomeAndRedeem:questionIncomeAndRedeem
			}
		});
		
	},
	
	
};