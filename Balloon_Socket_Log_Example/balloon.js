//require express for website framework
var app = require('express')();
//require http
var http = require('http').Server(app);
//require socket.io
var io = require('socket.io')(http);
//require fs (fileSystem)
var fileSys = require('fs');
//require johnny five
var five = require('johnny-five');

//create a new generic board
var board = new five.Board();

//create global variables
var temp;
var altitude;
var headString = 'Time Stamp,Temperature(F),Altitude(Ft)'+'\n';
var logString;

//append log.csv with header string
fileSys.appendFile('log.csv', headString,function(err){
   if(err){
      console.log(err);
   }
} );

//when the board recieves "ready"
board.on('ready', function(){
//create sensor object with contoller of MPL3115A2
   var alt = new five.Multi({
      controller: 'MPL3115A2',
// base elevation of cornellius, OR
      elevation: 64
   });
   //when altimeter recieves new 'data'....
   alt.on('data', function(){
   //create a new date object
      var date = new Date();
   //capture temperature
      temp = this.temperature.fahrenheit;
   //capture altitude
      altitude = this.altimeter.feet;
   //build the log string
      logString = date.toString() + ',' + temp + ',' + altitude +'\n';
   });
});
// log data every 5 seconds
setInterval(function(){
//append log.csv with new log
   fileSys.appendFile('log.csv', logString, function(err){
//if error, log to console
      if(err){
         console.log(err);
      }
      logString = '';
   });
},5000);

//routing for the server to index.html page
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//when client connects trigger timed emitters. 1 the time stamp and 2 the light value
//on the digital sandbox
io.on('connection', function(socket){
    //send date to client every 1000ms
    setInterval(function(){
            socket.emit('info', {'temp': temp, 'alt': altitude});
            }, 1000);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
