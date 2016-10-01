// *** Flat Scene *** //
function Scene_Inputs() {

	// Set Camera attributes
	var posterMaterial,
		view_angle = 45,
		aspect_ratio = window.threeWidth / window.threeHeight,
	    near = 1,
	    far = 10000;

	var analogValue, digitalValue, hueA, hueD;
	
	this.camera = new THREE.PerspectiveCamera(view_angle, aspect_ratio, near, far );
	this.camera.position.z = 30;

	// Setup scene
	this.scene = new THREE.Scene();
	this.scene.label = "Inputs Preview";
	this.scene.name = "inputsPrev";

	// DOM canvas for Input details e.t.c
	var overlayCanvas = document.createElement('canvas');
	var overlayContext = overlayCanvas.getContext('2d');
	overlayCanvas.width  = 320; //window.threeWidth;
	overlayCanvas.height = 240; //window.threeHeight;

	var overlayTexture = new THREE.Texture(overlayCanvas) 
	overlayTexture.needsUpdate = true;
      
    var overlayMaterial = new THREE.MeshBasicMaterial( {map: overlayTexture, side:THREE.DoubleSide } );
    overlayMaterial.map.minFilter = THREE.LinearFilter;	
    overlayMaterial.transparent = true;
    
	// Main Screen	
	var overlayGeometry = new THREE.CubeGeometry( 44.3, 24.9, 0.1 );	
	var overlayPlane = new THREE.Mesh( overlayGeometry, overlayMaterial );	
	this.scene.add( overlayPlane );
		
	// Create a point light
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;	
	this.scene.add( pointLight );
	
	// On Input Update
	this.onInputUpdate = function(data){
		
		// Clear & save Canvas
		overlayContext.save();		

		switch (data.type) {

		case "DEVICEMOTION":
						
			overlayContext.fillStyle = "#000";
			overlayContext.fillRect(0, 0, 100, 125);
			//overlayContext.clearRect(0, 0, 100, 125);
			
			var motion = data.input;			
			overlayContext.fillStyle = '#bc9cc0';
			overlayContext.font = '10px sans-serif';
			
			overlayContext.fillText("Velocity:", 5, 10);
			overlayContext.fillStyle = '#facdff';
			overlayContext.fillText("X: " + motion.acceleration.x.toFixed(6), 5, 20);
			overlayContext.fillText("Y: " + motion.acceleration.y.toFixed(6), 5, 30);
			overlayContext.fillText("Z: " + motion.acceleration.z.toFixed(6), 5, 40);
			
			overlayContext.fillStyle = '#bc9cc0';
			overlayContext.fillText("Velo+Grav:", 5, 50);
			overlayContext.fillStyle = '#facdff';
			overlayContext.fillText("X: " + motion.accelerationGravity.x, 5, 60);
			overlayContext.fillText("Y: " + motion.accelerationGravity.y, 5, 70);
			overlayContext.fillText("Z: " + motion.accelerationGravity.z, 5, 80);

			overlayContext.fillStyle = '#bc9cc0';
			overlayContext.fillText("RotationRate:", 5, 90);
			overlayContext.fillStyle = '#facdff';
			overlayContext.fillText("X: " + motion.rotationRate.x, 5, 100);
			overlayContext.fillText("Y: " + motion.rotationRate.y, 5, 110);
			overlayContext.fillText("Z: " + motion.rotationRate.z, 5, 120);
			
			break;
			
		case "GYROSCOPE":

			overlayContext.fillStyle = "#000";
			overlayContext.fillRect(0, 130, 100, 45);
			//overlayContext.clearRect(0, 130, 100, 45);

			var gyro = data.input;
			overlayContext.fillStyle = '#bc9cc0';
			overlayContext.font = '10px sans-serif';
			overlayContext.fillText("Gyroscope:", 5, 140);
			overlayContext.fillStyle = '#facdff';
			overlayContext.fillText("X: " + gyro.x, 5, 150);
			overlayContext.fillText("Y: " + gyro.y, 5, 160);
			overlayContext.fillText("Z: " + gyro.z, 5, 170);

			break;

		case "BATTERY":

			overlayContext.fillStyle = "#000";
			overlayContext.fillRect(0, 180, 100, 45);
			//overlayContext.clearRect(0, 180, 100, 45);

			var battery = data.input;
			overlayContext.fillStyle = '#bc9cc0';
			overlayContext.font = '10px sans-serif';
			overlayContext.fillText("BATTERY:", 5, 190);
			overlayContext.fillStyle = '#facdff';
			overlayContext.fillText("Level: " + battery.level, 5, 200);
			overlayContext.fillText("Event: " + battery.event, 5, 210);
			overlayContext.fillText("Status: " + battery.time, 5, 220);

			break;

		case "GEOLOCATION":
			
			overlayContext.fillStyle = "#000";
			overlayContext.fillRect(105, 0, 100, 45);
			//overlayContext.clearRect(105, 0, 100, 45);
			
			var geo = data.input;			
			overlayContext.fillStyle = '#bc9cc0';
			overlayContext.font = '10px sans-serif';
			overlayContext.fillText("GEOLOCAT:", 110, 10);
			overlayContext.fillStyle = '#facdff';
			overlayContext.fillText("Lat: " + geo.coords.latitude.toFixed(6), 110, 20);
			overlayContext.fillText("Lon:" + geo.coords.longitude.toFixed(6), 110, 30);
			overlayContext.fillText("Accuracy:" + geo.coords.accuracy, 110, 40);
			
			break;

		case "LIGHTSENSOR":
			
			overlayContext.fillStyle = "#000";
			overlayContext.fillRect(105, 50, 100, 35);
			//overlayContext.clearRect(105, 50, 100, 35);

			var lightSens = data.input;
			overlayContext.fillStyle = '#bc9cc0';
			overlayContext.font = '10px sans-serif';
			overlayContext.fillText("LIGHTSENSOR:", 110, 60);
			overlayContext.fillStyle = '#facdff';
			overlayContext.fillText("Value: " + lightSens.value, 110, 70);
			overlayContext.fillText("State: " + lightSens.state, 110, 80);
			
			break;
			
		case "MIDI":

			overlayContext.fillStyle = "#000";
			overlayContext.fillRect(105, 90, 100, 45);
			//overlayContext.clearRect(105, 90, 100, 45);

			var midi = data.input;
			overlayContext.fillStyle = '#bc9cc0';
			overlayContext.font = '10px sans-serif';
			overlayContext.fillText("MIDI: " + midi.index, 110, 100);
			overlayContext.fillStyle = '#facdff';
			overlayContext.fillText("Type: " + midi.type, 110, 110);
			overlayContext.fillText("Data: " + midi.data1, 110, 120);
			overlayContext.fillText("Value: " + midi.data2, 110, 130);
			
			break;
			
		case "GAMEPAD":

			overlayContext.fillStyle = "#000";
			overlayContext.fillRect(105, 140, 100, 55);
			//overlayContext.clearRect(105, 90, 100, 45);
			
			var gamepad = data.input;
			overlayContext.fillStyle = '#bc9cc0';
			overlayContext.font = '10px sans-serif';
			overlayContext.fillText("GAMEPAD: " + gamepad.index, 110, 150);
			overlayContext.fillStyle = '#facdff';
			overlayContext.fillText("Type: " + gamepad.type, 110, 160);
			overlayContext.fillText("Data: " + gamepad.data.substring(0, 10), 110, 170);
			overlayContext.fillText("Value: " + gamepad.value.toString().substring(0, 10), 110, 180);
			overlayContext.fillText("Action: " + gamepad.action, 110, 190);	
			
			break;

		case "SERIAL":

			overlayContext.fillStyle = "#000";
			overlayContext.fillRect(205, 0, 100, 65);
			//overlayContext.clearRect(105, 90, 100, 45);

			var serial = data.input;
			overlayContext.fillStyle = '#bc9cc0';
			overlayContext.font = '10px sans-serif';
			overlayContext.fillText("SERIAL: " + serial.id, 210, 10);
			//overlayContext.fillStyle = '#facdff';
			//overlayContext.fillText("Port: " + serial.port, 210, 20);
			//overlayContext.fillText("Conn: " + serial.conn, 210, 30);
			
			if(serial.type === 'A'){
				hueA = 'rgb(' + (Math.floor(Math.random() * 256)+100) + ',' + (Math.floor(Math.random() * 256)+100) + ',' + (Math.floor(Math.random() * 256)+100) + ')';				
				analogValue = "Pin: " + serial.type + ":" + serial.pin + ">" + serial.value;
			} else {				
				hueD = 'rgb(' + (Math.floor(Math.random() * 256)+100) + ',' + (Math.floor(Math.random() * 256)+100) + ',' + (Math.floor(Math.random() * 256)+100) + ')';
				digitalValue = "Pin: " + serial.type + ":" + serial.pin + ">" + serial.value; 
			}

			overlayContext.fillStyle = hueA;
			overlayContext.fillText(analogValue, 210, 40);
			overlayContext.fillStyle = hueD;
			overlayContext.fillText(digitalValue, 210, 50);

			break;

		}
		
		// Restore & update Material
		overlayContext.restore();		    
		overlayPlane.material.map.needsUpdate = true;

		//console.log(data);
		
	}
	
	// Rendering Settings
	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

	this.render = function( delta, rtt ) {
		
		if ( rtt )
			renderer.render( this.scene, this.camera, this.fbo, true );
		else
			renderer.render( this.scene, this.camera );

	};	
	
}
