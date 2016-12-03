var express = require('express');
var app = express();
app.use(express.static('public'));

var mysum = add(2,3);

var myvar = {};
myvar.mynumber = 3;

app.get('/myroute', function (req,res){
  res.send("hi Ibrahim!")
});
/*app.get('/', function (req, res) {
  console.log("index requested!")
  res.sendFile("public/index.html', { root: __dirname }");

});
app.get('/strategy', function (req, res) {
  console.log("Strategy Requested");
  res.sendFile('public/strategy.html', { root: __dirname });
});

app.get('/test', function(req, res){
  console.log("Test Requested")
  res.send(mycircle.toString())
});*/
var port = 80;
app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
  //console.log('Example app listening on port #{port}!');
});

function add(arg1, arg2){
  return arg1+arg2;
}


function double(arg1){
  return arg1*2;
}
