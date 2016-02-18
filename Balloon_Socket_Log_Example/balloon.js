var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fileSys = require('fs');

var five = require('johnny-five');
var board = new five.Board();

var temp;
var altitude;
var headString = 'Time Stamp,Temperature(F),Altitude(Ft)'+'\n';
var logString;


fileSys.appendFile('log.csv', headString,function(err){
   if(err){
      console.log(err);
   }
} );

board.on('ready', function(){
//create sensor object
   var alt = new five.Multi({
      controller: 'MPL3115A2',
      elevation: 64
   });
   //update the lightVal variable with the sensor value
   alt.on('data', function(){
      var date = new Date();
      temp = this.temperature.fahrenheit;
      altitude = this.altimeter.feet;
      logString = date.toString() + ',' + temp + ',' + altitude +'\n';
   });
});
// log data every 5 seconds
setInterval(function(){
   fileSys.appendFile('log.csv', logString, function(err){
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
