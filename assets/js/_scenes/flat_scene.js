// *** Flat Scene *** //
function Scene_Flat() {
	
	// Set Camera attributes
	var posterMaterial,
		view_angle = 45,
		aspect_ratio = window.threeWidth / window.threeHeight,
	    near = 1,
	    far = 10000;

	this.camera = new THREE.PerspectiveCamera(view_angle, aspect_ratio, near, far );
	this.camera.position.z = 30;

	// Setup scene
	this.scene = new THREE.Scene();
	this.scene.label = "Flat Stream";
	this.scene.name = "flatstream";

	this.streamTextures = []; this.extraStreams = [];
	this.screenMesh = []; this.screenAudio = []; this.streams = [];
	
	// Main Screen	
	var screenMaterial = new THREE.MeshBasicMaterial({ color: 0x8000ff });	
	var screenGeo = new THREE.CubeGeometry( 33.2, 24.9, 0.1 );	
	var screenMesh = new THREE.Mesh( screenGeo, screenMaterial );

	var audioMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.BackSide, opacity: 0.0, transparent: true } );
	var audioMesh = new THREE.Mesh( screenGeo, audioMaterial );
	audioMesh.position = screenMesh.position;
	audioMesh.scale.multiplyScalar(1.01);
	
	this.screenAudio.push(audioMesh);
	this.scene.add( this.screenAudio[0] );
	
	this.screenMesh.push(screenMesh);	
	this.scene.add( this.screenMesh[0] );
		
	// Create a point light
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;	
	this.scene.add( pointLight );
		
	// Scene Dynamic Parameters
	var camPos = { "x": 150, "y": 20, "z": 150 };
	var text = "RTCsense", pText = text;
	
	this.parameters = {
		camera : {
			name : "Camera Position",
			type : "slider",
			set : {
				"x": { "value" : camPos.x, "min" : 0, "max" : 1000, "step" : 1, "name": "Factor X" }, 
				"y": { "value" : camPos.y, "min" : 0, "max" : 1000, "step" : 1, "name": "Factor Y" },
				"z": { "value" : camPos.z, "min" : 0, "max" : 1000, "step" : 1, "name": "Factor Z" } 
			},
			reset : function(){
				this.set.x.value = camPos.x;
				this.set.y.value = camPos.y;
				this.set.z.value = camPos.z;
			}
		},
		addBall : {
			name : "ADD BALL",
			type : "button",
			action : function(){
				console.log("adding Ball!");
			}
		},
		ground : {
			name : "Ground Visibility",
			type : "checkbox",
			set : { "value": false, "init" : false },
			action : function(checked){
				this.set.value = checked;
				console.log(checked);
			}
		},
		text : {
			name : "Title Update",
			type : "input",
			set : { "value" : text },
			reset : function(){
				this.set.value = text;
			},
			update : function(newText, event){
				if(newText != pText){
					text = newText;					
					pText = text;
					console.log(text);
				}
			}
		},
		colorPick: {
			name : "Global Color",
			type : "color",
			set : { "value": "#fff", "init": "#e53935" },
			update : function(color){
				this.set.value = color;
				console.log(color);
			}
		},
		colorPalette: {
			name : "Color Palette",
			type : "palette",
			set : { "value": "#fff", "init": "#e53935" },
			colors: [
				"#e53935", "#d81b60", "#8e24aa", "#5e35b1", "#3949ab",
				"#1e88e5", "#039be5", "#00acc1", "#00897b", "#43a047",
				"#7cb342", "#c0ca33", "#fdd835", "#ffb300", "#fb8c00",
				"#f4511e", "#6d4c41", "#757575", "#546e7a", "#000000"
			],
			update : function(color){
				this.set.value = color;
				console.log(color);
			}
		}		
	};
	
	// Removing Stream
	this.onStreamRemove = function(streamid){
				
		var streamsCount = this.streams.length;
		var stream2remove;
		
		for (i = 0; i < streamsCount; i++){			
			if(this.streams[i].stream.streamid == streamid){
				stream2remove = i;
				break;
			}
		}
		
		console.log(streamid + " - " + stream2remove);
		
		// Replacing the Video
		if(stream2remove === 0 & streamsCount === 1){
			
			this.screenMesh[0].material = posterMaterial;
			this.screenMesh[0].material.map.needsUpdate = true;
			console.log("It's first");
			
		} else {
			
			if(stream2remove === 0){

				// Video
				var texture = this.streams[stream2remove + 1].stream.texture;
				var streamMaterial = new THREE.MeshBasicMaterial({
					map: texture, side: THREE.DoubleSide
				});				
				this.screenMesh[0].material = streamMaterial;				
				
				
				
				// Splicing it IF first clicked!
				this.screenMesh.splice(stream2remove + 1, 1);
				this.screenAudio.splice(stream2remove + 1, 1);
				this.scene.remove( this.streams[stream2remove + 1].screen );
				
			} else {
				
				console.log(this.streams[stream2remove]);
				
				
				// Splicing it IF not the first clicked!
				this.screenMesh.splice(stream2remove, 1);
				this.screenAudio.splice(stream2remove, 1);
				this.scene.remove( this.streams[stream2remove].screen );
			}
		}
		
		this.streams[stream2remove].stream.texture.dispose();
		
		// Splice from Stream
		this.streams.splice(stream2remove, 1);
		
		// Updating Positions
		var streamsCount = this.streams.length;		
		for (i = 1; i < streamsCount; i++){			
			scrPos = { x: 15.8 - ((i - 1) * 6.8), y: -8, z: 3.5 };
			this.screenMesh[i].position.set(scrPos.x, scrPos.y, scrPos.z); 			
			this.screenAudio[i].position.set(scrPos.x, scrPos.y, scrPos.z);
		}
		
	}
	
	// Update Poster
	this.onUpatePoster = function(poster){
		
		var screenMesh = this.screenMesh;
		
		var loader = new THREE.TextureLoader();
		loader.load(poster, function ( texture ) {

			posterMaterial = new THREE.MeshBasicMaterial( { 
			    map: texture,
			    side: THREE.DoubleSide
			});			
			posterMaterial.map.minFilter = THREE.LinearFilter;			
			screenMesh[0].material = posterMaterial;
				
		});

	};
	
	// Update Scene Texture / Audio
	this.onNewMediaElement = function(mediaElement){

		console.log("In Scene");
		console.log(mediaElement);
		
		var audioMesh = '',
			screenMesh = '',
			scrPos = {};
		
		var streamsCount = this.streams.length;
		
		var gotVideoStream = isOBJnotEmpty(mediaElement.texture);
		var gotAudioStream = isOBJnotEmpty(mediaElement.audio);
				
		if(gotVideoStream){
			
			var streamMaterial = new THREE.MeshBasicMaterial({
				map: mediaElement.texture, side: THREE.DoubleSide
			});
				
			if(streamsCount == 0){

				this.screenMesh[0].material = streamMaterial;
				this.screenMesh[0].material.map.needsUpdate = true;
				this.gotVideoStream = true;

				screenMesh = this.screenMesh[0];

			} else {
				
				scrPos = { x: 15.8 - ((streamsCount - 1) * 6.8), y: -8, z: 3.5 }; 

				var screenMaterial = new THREE.MeshBasicMaterial({ color: 0x8000ff });	
				var screenGeo = new THREE.CubeGeometry( 6, 4.5, 0.1 );	
				var screenMesh = new THREE.Mesh( screenGeo, streamMaterial );
				screenMesh.position.set(scrPos.x, scrPos.y, scrPos.z); //set(15.8 - ((streamsCount - 1) * 6.8), -8, 3.5);
				screenMesh.name = mediaElement.streamid;
				
				this.screenMesh.push(screenMesh);	
				this.scene.add( this.screenMesh[streamsCount] );

			}
			
		}
		
		if(gotAudioStream){
			
			if(streamsCount == 0){
				audioMesh = this.screenAudio[0];	
			} else {
				var audioMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.BackSide, opacity: 0.5, transparent: true } );
				audioMesh = new THREE.Mesh( screenGeo, audioMaterial );
				audioMesh.position.set(scrPos.x, scrPos.y, scrPos.z); //set(15.8 - ((streamsCount - 1) * 6.8), -8, 3.5); //= screenMesh.position;
				audioMesh.scale.multiplyScalar(1.05);
				this.screenAudio.push(audioMesh);				
				this.scene.add( audioMesh );
			}			
		}
		
		this.streams.push({
			"stream" : mediaElement,
			"screen" : screenMesh,
			"audio"  : audioMesh
		});
		
	};

	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

	this.render = function( delta, rtt ) {
					
		for (i = 0; i < this.streams.length; i++){

			this.streams[i].screen.material.map.needsUpdate = true;

			if(this.streams[i].stream.gotAudio){
				
				var analyser = this.streams[i].stream.audio.analyser;
	    		var audioPlane = this.screenAudio[i]; //this.streams[i].audio;
	    			
	            var array = new Uint8Array(analyser.frequencyBinCount);
	            analyser.getByteFrequencyData(array);
	            var step = Math.round(array.length / 4);            	
                var value = (array[1 * step]) * 0.01;
                value = value > 1 ? 1 : value;
                
                audioPlane.material.opacity = value;

			}
		}
		
		if ( rtt )
			renderer.render( this.scene, this.camera, this.fbo, true );
		else
			renderer.render( this.scene, this.camera );

	};

}