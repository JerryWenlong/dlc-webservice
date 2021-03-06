exports.account = {
    getReferRanks: function (http, url, path, arr) {
        var options = {
            host: url,
            method: 'GET',
            path: path,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return new Promise(function (resolve) {
            try {
                http.get(options, function (res) {
                    res.setEncoding('utf8');
                    var statusCode = res.statusCode;
                    var getData = '';
                    if (statusCode == 200) {
                        res.on('data', function (chunk) {
                            getData += chunk;
                        }).on('end', function () {
                            var obj = JSON.parse(getData);
                            resolve(obj, arr);
                        });
                    } else {
                        console.log(statusCode);
                    }

                }).on('error', function (e) {});
            } catch (e) {
                console.log(e.message + e.description);
            }

        });
    }
};