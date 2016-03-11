var
  express = require('express'),
  bodyParser = require('body-parser');

  //allows us to use environment variables in .env.
  //Silent will not throw an error if and when .env doesn't exist
  require('dotenv').config({silent: true});
  console.log(process.env);
  //var bootStrap = require("bootstrap")

  var app = express();

  //make json objects available in request
  //let's setup the bodyParser as middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:false}));

  //setup the static files folder
  app.use(express.static('public'));
  var http = require('http');
  var server = http.createServer(app);

  //listen on port 3000
  server.listen(3000, function(){
    console.log('listening on port 3000');
  });

  app.get('/', function (request, response){
    response.sendFile(__dirname+'/index.html');
  });

app.post('/',function(request,response){

  /* WATSON CONFIG*/
  var watson = require('watson-developer-cloud');
  var concept_expansion = watson.concept_expansion({
    username: process.env.WATSON_USR,
    password: process.env.WATSON_PWD,
    version:'v1-beta'
  });
  var seeds = request.body['concept[]'];

  var params ={
    seeds:seeds,
    dataset:'mtsamples',
    label:'medications'
  }

  concept_expansion.expand(params,function(err,result){
    if(err) return console.log(err);

 console.log(JSON.stringify(result,null,2));
      response.send(result);

  });
});
