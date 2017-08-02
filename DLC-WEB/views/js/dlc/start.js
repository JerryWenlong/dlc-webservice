$('document').ready(function(){
	window.app = window.app || new DLC.App();
	app.route = new DLC.Route();
	app.route.init();
	var dict = new DLC.DlcDict(app);
	// window.app = new DLC.App(dict.dictData);
	// dict.initProductDict(function(){
	// 	//success
	// 	//create dlc obj
				
	// }, function(){
	// 	// falied
	// })

})