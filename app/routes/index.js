module.exports = function(application){

	application.get(['/','/index','/home'], function(req, res){
		application.app.controllers.index.index(application, req, res);
	});

	application.post('/autenticar', function(req, res){
		application.app.controllers.index.autenticar(application, req, res);
	});

}
