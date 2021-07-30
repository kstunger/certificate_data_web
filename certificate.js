var https = require('https');
var express = require('express');
var app = express();
var fs = require("fs");

app.get('/fingerprint/:host', function (request, response) {
	console.log(request.params);
	var host = request.params.host;

	var options = {
	    host: host,
	    port: 443,
	    method: 'GET',
			agent: false
	};

	var req = https.request(options, function(res) {
		var certificate = res.connection.getPeerCertificate();
		console.log("Certificate:")
		console.log(certificate);

		var fingerprint = certificate.fingerprint;
		console.log("Returning fingerprint for " + host + ": " + fingerprint);

		response.end(fingerprint);
	});

	req.on('error', (e) => {
		console.error(e);
	});

	req.end();
})

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Listening at http://%s:%s", host, port)
})
