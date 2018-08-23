var tessel = require('tessel');
var ambientlib = require('ambient-attx4');

var ambient = ambientlib.use(tessel.port['A']);
var array= (new Array(20)).fill(0);
var pin = tessel.port.B.pin[7]; // Select pin 7 on port B

function avg(arr) {
	var sum = 0;
	for (var i = arr.length - 1; i >= 0; i--) {
		sum += arr[i]
	}
	return sum / arr.length
}

ambient.on('ready', function () {
 // Get points of light and sound data.
  setInterval( function () {
    ambient.getLightLevel( function(err, lightdata) {
      if (err) throw err;
      ambient.getSoundLevel( function(err, sounddata) {
        if (err) throw err;
        var sounds=parseFloat(sounddata.toFixed(8));

        var avg_cached = avg(array);
        console.log("Sound Level:", sounds, "\tAverage: " , avg_cached);
        if (sounds > avg_cached * 1.2){
        	tessel.led[2].on();
			pin.high();
        }
        else{
        	tessel.led[2].off();
        	pin.low();
        }
        array.push(sounds);
        array.splice(0, 1);
      });
    });
  }, 150); // The readings will happen every .5 seconds
});

ambient.on('error', function (err) {
  console.log(err);
});
