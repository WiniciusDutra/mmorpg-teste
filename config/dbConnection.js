// importando modulo do mongodb
let mongo = require('mongodb');

let connMongoDb = function(){ 
  let db = new mongo.Db(
    'got',
    new mongo.Server(
      'localhost',//string com endereço do server
      27017,//porta de conexão. Neste caso é a padrão
      {}
    ),
    {}
  );

  return db;
}

module.exports = function(){
  return connMongoDb;
}
