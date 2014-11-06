
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// ENDPOINTS
// ------------------------------------------------------------------------------------------------

module.exports = function(app) {

	// --------------------------------------------------------------------------------------------
	// paramenters
	// --------------------------------------------------------------------------------------------

	app.param('name', function(req, res, next, name) {
		req.name = name;
		next();
	});

	// --------------------------------------------------------------------------------------------

	app.param('token', function(req, res, next, token) {
		req.token = token;
		next();
	});

	// --------------------------------------------------------------------------------------------
	// endpoints
	// --------------------------------------------------------------------------------------------

	app.post('/user/register/:name', function(req, res) {
		console.log('POST /user/register/:name ' + req.name);
		res.send({post:'post'});
	});

	// --------------------------------------------------------------------------------------------

	app.post('/user/greet/:token', function(req, res) {
		console.log('POST /user/greet/:token ' + req.token);
		res.send({post:'post'});
	});

	// --------------------------------------------------------------------------------------------

	app.post('/user/ping', function(req, res) {
		console.log('POST /user/ping');
		res.send({pong:'pong'});
	});

	// --------------------------------------------------------------------------------------------

	// app.get('/handshake/:msg', function(req, res) {
	// 	console.log('/message/:msg');
	// 	res.send('get');
	// });

	// --------------------------------------------------------------------------------------------

	// app.put('/message/:msg', function(req, res) {
	// 	res.send('put');
	// });

	// --------------------------------------------------------------------------------------------

	// app.delete('/message/:msg', function(req, res) {
	// 	res.send('delete');
	// });

};//module.export

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------