(function($){
	DLC.DLC = DLC.derive(null, {
		promise: function(properties, callback, error){
			// properties:
			//   --service The service name in DLC.Config.
			//   --api The api name in DLC.Config.
			//   --type The request method.
			//   --data The request data.
			//   --header The head of request.
			// callback:
			//   --The success function while request successfully.
			// error:
			//   --The error function while request failed.
			if(!properties.hasOwnProperty('service')){
				throw 'The request has no service.';
				return;
			}
			if(!properties.hasOwnProperty('api')){
				throw 'The request has no api.';
				return;
			}

			var settings = {};
			settings.cache = false;
			var service = DLC.Config[properties['service']];
			var str = properties['urlStr']?properties['urlStr']:"{0}/{1}";
			var api = properties['api'];
			var apiStr = service[api];
			if(properties.hasOwnProperty('urlParam')){
				apiStr = DLC.Util.stringFormat(apiStr, properties['urlParam']);
			}
			var url = DLC.Util.stringFormat(str, [service.host, apiStr]);
			url = encodeURI(url);
			settings.url = url;

			if(properties['header']){
				settings.headers = properties['header'];
			}
			if(properties.hasOwnProperty('cache')){
				settings.cache = properties['cache'];
			}
			if(properties.hasOwnProperty('global') && properties['global'] == false){
				settings.global = false;
			}
			if(properties.hasOwnProperty('timeout')){
				settings.timeout = properties['timeout'];
			}
			var method = properties['type'] || 'get';
			settings.type = method;

			var data = properties['data'] || null;

			if(properties.hasOwnProperty('uploadFile') && properties['uploadFile']){
				settings.processData = false;// because data is form data no need process
				settings.contentType = false;// because data is form data
				settings.data = data;
			}else if(data && method != 'get'){
				dataJson = JSON.stringify(data);
				settings.processData = false;
				settings.data = dataJson;
			}else if(data && method == 'get'){
				settings.data = data;
			}
            
			$.ajax(settings).done(callback).fail(error);
		},
		callApiError: function(error, failed){
			if(error.readStatus == 4){
				if(error.responseText != ""){
	        		var response = $.parseJSON(error.responseText);
	        		var errorMsg = DLC.Config.errorMessage(response['error']);
					if(response['message']){
						errorMsg = response['message'];
					}
					failed(response['error'], errorMsg);
	        	}else{
	        		failed(error.status, error.statusText);
	        	}
			}else{
				failed('504', '系统繁忙，请稍后再试！');
			}
		},
		processError: function(errorCode, failed, response){
			var errorMsg = DLC.Config.errorMessage(errorCode);
    		if(response['message']){
    			errorMsg = response['message'];
    		}
    		failed(errorCode, errorMsg, response)
		}
	},{})
})($)
