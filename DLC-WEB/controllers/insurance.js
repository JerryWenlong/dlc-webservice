var keywords='点理财,点理财官网,点理财PPP,点理财财富,点理财论坛,投资,理财,金融,p2p理财,理财类网站,利息,年化收益,利率,余额,收益,平台';

exports.insurance={
	insurancePro:function(app,http,req,response){
		this.proGetData(app,http,req,response);
	},
	proGetData:function(app,http,req,response){
		response.render('insurancePro',{
			keywords:keywords,
			onnav:'',
			twnav:'',
			thnav:'link-sel',
			fonav:''
		});

	},
	insuranceMoney:function(app,http,req,response){
		this.moneyGetData(app,http,req,response);
	},
	moneyGetData:function(app,http,req,response){
		response.render('insuranceMoney',{
			keywords:keywords,
			onnav:'',
			twnav:'',
			thnav:'fontTitleNH fontTitleN ',
			fonav:''
		});

	}

};
