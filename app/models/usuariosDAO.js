function usuariosDAO(connection){
  this._connection = connection();

}

usuariosDAO.prototype.inserirUsuario = function(usuario){
  this._connection.open(function(erro, mongoClient){
    mongoClient.collection('usuarios', function(err, collection){
      collection.insert(usuario);

      mongoClient.close();
    })
  });
}

usuariosDAO.prototype.autenticar = function(usuarioeSenha, req, res){
  this._connection.open(function(erro, mongoClient){
    mongoClient.collection('usuarios', function(err, collection){
      collection.find(usuarioeSenha).toArray(function(err, result){
        if (result[0] != undefined) {
          req.session.autorizado = true;
          req.session.usuario = result[0].usuario;
          req.session.casa = result[0].casa;
        }
        if (req.session.autorizado) {
          res.redirect('jogo');
        }
        else {
          let erro = [
            {
              param: 'autenticação',
              msg: 'Usuário não autorizado'}
          ];
          res.render('index', {validacao: erro, dadosForm: req.body});
        }
      });

      mongoClient.close();
    })
  });
}

module.exports = function(){
  return usuariosDAO;
}
