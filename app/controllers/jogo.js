module.exports.jogo = function(application, req, res){
  if (!req.session.autorizado) {
    let erro = [{
      param: 'autenticação',
      msg: 'Usuário não autorizado'
    }];
    res.render('index', {validacao: erro});
    return;
  }

  let msg = '';
  if (req.query.msg != '') {
    msg = req.query.msg;
  }

  let connection = application.config.dbConnection;
  let jogoDAO = new application.app.models.jogoDAO(connection);
  let casa = req.session.casa;
  let usuario = req.session.usuario;
  jogoDAO.iniciaJogo(res, usuario, casa, msg);
}

module.exports.sair = function(application, req, res){
  req.session.destroy(function(err){
    res.render('index', {validacao: {}});
  });
}

module.exports.suditos = function(application, req, res){
  if (!req.session.autorizado) {
    let erro = [{
      param: 'autenticação',
      msg: 'Usuário não autorizado'
    }];
    res.render('index', {validacao: erro});
    return;
  }
  res.render('aldeoes');
}

module.exports.pergaminhos = function(application, req, res){
  if (!req.session.autorizado) {
    let erro = [{
      param: 'autenticação',
      msg: 'Usuário não autorizado'
    }];
    res.render('index', {validacao: erro});
    return;
  }

  let connection = application.config.dbConnection;
  let jogoDAO = new application.app.models.jogoDAO(connection);
  let usuario = req.session.usuario;
  jogoDAO.getAcoes(usuario, res);
}

module.exports.ordenar_acao_sudito = function(application, req, res){
  if (!req.session.autorizado) {
    let erro = [{
      param: 'autenticação',
      msg: 'Usuário não autorizado'
    }];
    res.render('index', {validacao: erro});
    return;
  }

  let dadosForm = req.body;

  req.assert('acao','Uma ação deve ser escolhida').notEmpty();
  req.assert('quantidade','Uma quantidade deve ser escolhida').notEmpty();

  let erros = req.validationErrors();

  if (erros) {
    res.redirect('jogo?msg=A');
    return;
  }
  let connection = application.config.dbConnection;
  let jogoDAO = new application.app.models.jogoDAO(connection);
  dadosForm.usuario = req.session.usuario;
  jogoDAO.acao(dadosForm);
  res.redirect('jogo?msg=B');
}

module.exports.revogar_acao = function(application, req, res){

  let urlQuery = req.query;
  let connection = application.config.dbConnection;
  let jogoDAO = new application.app.models.jogoDAO(connection);
  let _id = urlQuery.id_acao;
  jogoDAO.revogarAcao(_id, res);

}
