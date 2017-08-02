var debug = true;

exports.config={
	ProductService:{
		host: debug ? 'unstable.dianlc.com' : '{{www}}.{{dns_name}}',
		products:''
	},
	userService:{
		host: debug ? 'unstable.dianlc.com' : '{{www}}.{{dns_name}}',
		products:''
	},
	accountService:{
		host: debug ? 'unstable.dianlc.com' : '{{www}}.{{dns_name}}',
		products:''
	},
	utilService: {
            host: debug ? 'unstable.dianlc.com' : '{{www}}.{{dns_name}}',
            getApk: 'utils/apps/{appName}/latest',
            getBulletin: 'utils/bulletin',
            newsNotice: 'utils/bulletin',
            articleId: 'utils/bulletin/{0}',
            referRanks: 'accounts/refer/ranks',
        },
};
