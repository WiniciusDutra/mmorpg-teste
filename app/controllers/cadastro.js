module.exports.cadastro = function(application, req, res){
  res.render('cadastro', {validacao: {}, dadosForm: {}});
}

module.exports.cadastrar = function(application, req, res){
  let dadosForm = req.body;

  req.assert('nome','Nome não pode ser vazio').notEmpty();
  req.assert('usuario','Usuario não pode ser vazio').notEmpty();
  req.assert('senha','Senha não pode ser vazio').notEmpty();
  req.assert('casa','Casa não pode ser vazio').notEmpty();

  let erros = req.validationErrors();
  if (erros) {
    res.render('cadastro', {validacao: erros, dadosForm: req.body});
    return;
  }

  let connection = application.config.dbConnection;

  let usuariosDAO = new application.app.models.usuariosDAO(connection);
  let jogoDAO = new application.app.models.jogoDAO(connection);
  usuariosDAO.inserirUsuario(dadosForm);
  jogoDAO.gerarParametros(dadosForm.usuario);
}
