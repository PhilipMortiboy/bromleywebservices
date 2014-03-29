var mongo = require('mongodb');
var express = require('express');
var monk = require('monk');

//set up connection to MongoDb running on seperate instance
var config = {       
	"USER"    : "",                 
	"PASS"    : "",       
	"HOST"    : "ec2-54-72-153-192.eu-west-1.compute.amazonaws.com",    "PORT"    : "27017",        
	"DATABASE" : "test"     
};
var dbPath  = "mongodb://"+config.USER + ":"+     config.PASS + "@"+     config.HOST + ":"+    config.PORT + "/"+     config.DATABASE;

//connect to database
var db =  monk(dbPath);

var app = new express();
var collectionName = 'twitches';

//test function
app.get('/hello.txt', function(req, res){
  res.send('Hello World');
});

//another test function. Returns the number you send it
app.get('/return/:num', function(req, res){
	var id = req.params.num;
	res.send(id);
});

app.get('/allTwitches', function(req,res){
	var collection = db.get(collectionName);
	collection.find({},{},function(e,docs){
		res.json(docs);
	})
});

app.get('/twitchBySpecies/:name', function(req,res){
	var collection = db.get(collectionName);
	//find all items in the collection that contain the queried name
	collection.find({ "twitch.species" : {$regex : ".*" + req.params.name + ".*"} },{limit:20},function(e,docs){
		//return the results as a JSON object
		res.json(docs);
	})
});

app.get('/twitchByLocation/:name', function(req,res){
	var collection = db.get(collectionName);
	//find all items in the collection that contain the queried name
	collection.find({ "address.location" : {$regex : ".*" + req.params.name + ".*"} },{limit:20},function(e,docs){
		//return the results as a JSON object
		res.json(docs);
	})
});

//example queries from: http://webapplog.com/intro-to-express-js-simple-rest-api-app-with-monk-and-mongodb/
//get all databases
app.get('/',function(req,res){
  db.driver.admin.listDatabases(function(e,dbs){
      res.json(dbs);
  });
});

//get all collections
app.get('/collections',function(req,res){
  db.driver.collectionNames(function(e,names){
    res.json(names);
  })
});

//get 20 items in the collection specified
app.get('/collections/:name',function(req,res){
  var collection = db.get(req.params.name);
  collection.find({},{limit:20},function(e,docs){
	res.json(docs);
  })
});

var server = app.listen(3000, '193.60.79.168', function() {
    console.log('Listening on port %d', server.address().port);
});