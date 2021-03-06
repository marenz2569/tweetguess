//Hungarian quality software

var mongo = require('mongodb');
var alasql = require('alasql');

var getRanked = function(callback){

  var mongoClient = mongo.MongoClient;

  var url = "mongodb://localhost:27017/local";

  mongoClient.connect(url, function(error, db){
    if(error){
      console.log("Unable to connect to database, error: ", error);
    }else {

        db.collection('tweets').find({}).toArray(function(error, result){
          if(error){
            console.log("Unable to access collection!");
          }else if (result.length) {

            getSources(function(sources){
              console.log(sources);
            });

            var res1 = alasql('SELECT * FROM ? ORDER BY retweet_count',[result]).reverse().slice(0,36);

            var random = Math.floor(Math.random() * 35) + 1;

            var res2 = res1[random];

						var whatToSend = {
							'tweet': res2.text,
							'id': res2.tweetId
						};

            callback(whatToSend);

          }else {
            console.log("No documents found!");
          }

          db.close();
        });

    }
  });
}

var getSources = function(callback){
  var mongoClient = mongo.MongoClient;

  var url = "mongodb://localhost:27017/local";

  var sources = [];

  mongoClient.connect(url, function(error, db){
    if(error){
      console.log("Unable to connect to database, error: ", error);
    }else {

      db.collection('sources').find({}).toArray(function(error, result){
        if(error){
          console.log("Unable to access collection!");
        }else if (result.length) {
          for (var i = 0; i < ((result.length > 4)?4:result.length); i += 1){
            sources[i] = result[i].name;
          }
          callback(sources);

        }else {
          console.log("No documents found!");
        }

        db.close();
      });
    }
  });
}

module.exports = {
  getRanked: getRanked,
  getSources: getSources
}
