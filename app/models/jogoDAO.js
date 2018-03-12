let ObjectID = require('mongodb').ObjectId;

function jogoDAO(connection){
  this._connection = connection();
}

jogoDAO.prototype.gerarParametros = function(usuario){
  this._connection.open(function(erro, mongoClient){
    mongoClient.collection('jogo', function(err, collection){
      collection.insert({
        usuario: usuario,
        moeda: 15,
        suditos: 10,
        temor: Math.floor(Math.random() * 1000),
        sabedoria: Math.floor(Math.random() * 1000),
        comercio: Math.floor(Math.random() * 1000),
        magia: Math.floor(Math.random() * 1000)
      });

      mongoClient.close();
    })
  });
}

jogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){
  this._connection.open(function(erro, mongoClient){
    mongoClient.collection('jogo', function(err, collection){
      collection.find({usuario: usuario}).toArray(function(err, result){
        res.render('jogo', {img_casa: casa, usuario: usuario, jogo: result[0], msg: msg});
        mongoClient.close();
      });
    })
  })
}

jogoDAO.prototype.acao = function(acao){
  this._connection.open(function(erro, mongoClient){
    mongoClient.collection('acao', function(err, collection){

      let date = new Date();
      let tempo = null;
      switch (parseInt(acao.acao)) {
        case 1: tempo = 1 * 60 * 60000; break;
        case 2: tempo = 2 * 60 * 60000; break;
        case 3: tempo = 5 * 60 * 60000; break;
        case 4: tempo = 5 * 60 * 60000; break;
        default: tempo = 1 * 60 * 60000;
      }

      acao.acao_termina_em = date.getTime() + tempo;
      collection.insert(acao);
    })
    mongoClient.collection('jogo', function(err, collection){

      let moedas = null;

      switch (parseInt(acao.acao)) {
        case 1: moedas = -2; break;
        case 2: moedas = -3; break;
        case 3: moedas = -1; break;
        case 4: moedas = -1; break;
      }

      moedas = moedas * acao.quantidade;

      collection.update(
        {usuario: acao.usuario}
        ,{$inc:{moeda: moedas }}
      );
      mongoClient.close();
    });
  });
}

jogoDAO.prototype.getAcoes = function(usuario, res){
  this._connection.open(function(erro, mongoClient){
    mongoClient.collection('acao', function(err, collection){
      let date = new Date();
      let momento_atual = date.getTime();
      collection.find({usuario: usuario, acao_termina_em: {$gt: momento_atual}}).toArray(function(err, result){
        res.render('pergaminhos', {acoes: result});
        mongoClient.close();
      });
    })
  })
}

jogoDAO.prototype.revogarAcao = function(_id, res){
  this._connection.open(function(erro, mongoClient){
    mongoClient.collection('acao', function(err, collection){
      collection.remove(
        {_id: ObjectID(_id)}
        ,function(err, result){
          res.redirect('jogo?msg=D');
          mongoClient.close();
        }
      );
    })
  })
}

module.exports = function(){
  return jogoDAO;
}
