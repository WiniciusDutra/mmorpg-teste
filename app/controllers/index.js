module.exports.index = function(application, req, res){
  res.render('index', {validacao: {}, dadosForm: {}});
}

module.exports.autenticar = function(application, req, res){
  let dadosForm = req.body;

  req.assert('usuario','Usuário não pode ser vazio').notEmpty();
  req.assert('senha','Senha não pode ser vazio').notEmpty();


  let erros = req.validationErrors();

  if (erros) {
    res.render('index', {validacao: erros, dadosForm: {}});
    return;
  }
  let connection = application.config.dbConnection;
  let usuariosDAO = new application.app.models.usuariosDAO(connection);
  usuariosDAO.autenticar(dadosForm, req, res);
}
