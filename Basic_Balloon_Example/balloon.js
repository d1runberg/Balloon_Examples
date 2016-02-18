//require johnny five
var five = require('johnny-five');

//create a new general board
var board = new five.Board()

//when the board recieves ready....
board.on('ready',function(){
   //create a new altimeter object with a controller of MPL3115A2
   var alt = new five.Multi({
      controller: 'MPL3115A2',
      elevation: 64
   });
   //on altimeter data 'change'
   alt.on('change', function(){
    // log temperature values
    console.log("temperature");
    console.log("  celsius      : ", this.temperature.celsius);
    console.log("  fahrenheit   : ", this.temperature.fahrenheit);
    console.log("  kelvin       : ", this.temperature.kelvin);
    console.log("--------------------------------------");
    //log atmos pressure values
    console.log("barometer");
    console.log("  pressure     : ", this.barometer.pressure);
    console.log("--------------------------------------");
    //log elevation
     console.log("altimeter");
     console.log("  feet         : ", this.altimeter.feet);
     console.log("  meters       : ", this.altimeter.meters);
     console.log("--------------------------------------");
   });
});
