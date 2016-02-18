var five = require('johnny-five');


var board = new five.Board()

board.on('ready',function(){

   var alt = new five.Multi({
      controller: 'MPL3115A2',
      elevation: 64
   });

   alt.on('change', function(){
    console.log("temperature");
    console.log("  celsius      : ", this.temperature.celsius);
    console.log("  fahrenheit   : ", this.temperature.fahrenheit);
    console.log("  kelvin       : ", this.temperature.kelvin);
    console.log("--------------------------------------");

    console.log("barometer");
    console.log("  pressure     : ", this.barometer.pressure);
    console.log("--------------------------------------");

     console.log("altimeter");
     console.log("  feet         : ", this.altimeter.feet);
     console.log("  meters       : ", this.altimeter.meters);
     console.log("--------------------------------------");
   });
});
