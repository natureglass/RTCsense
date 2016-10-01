// *** 3D Text ***//
function Scene_Text() {

/*
 
	// Streams
	this.gotStreamData = false;
	this.gotVideoStream = false;
	this.gotAudioStream = false;

*/
	
	// Setup scene
	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
	this.scene.label = "3D Text";
	this.scene.name = "3dtext";

	var settings = {
			camX: 0,
			camY: 400,
			camZ: 700,
			intensity: 1.5,
			text: "RTCsense",
			textColor: Math.random(),
			turning: true,
			
		}
	
	// Lights
	var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
	dirLight.position.set( 0, 0, 1 ).normalize();
	this.scene.add( dirLight );

	var pointLight = new THREE.PointLight( 0xffffff, settings.intensity );
	pointLight.position.set( 0, 100, 90 );
	this.scene.add( pointLight );

	pointLight.color.setHSL( settings.textColor, 1, 0.5 );
	hex = decimalToHex( pointLight.color.getHex() );

	// Camera
	this.camera = new THREE.PerspectiveCamera( 30, window.threeWidth / window.threeHeight, 1, 1500 );
	this.camera.aspect = window.threeWidth / window.threeHeight;
	this.camera.position.set( settings.camX, settings.camY, settings.camZ );
	this.cameraTarget = new THREE.Vector3( 0, 150, 0 );

	var sceneCamera = this.camera, 
		text = settings.text;
		
	// Scene Dynamic Parameters
	this.parameters = {
		camera : {
			name : "World Settings",
			type : "slider",
			set : {
				"y": { "value" : settings.camY, "min" : 110, "max" : 500, "step" : 1, "name": "Camera height" },
				"z": { "value" : settings.camZ, "min" : 500, "max" : 1200, "step" : 1, "name": "Camera distance" },
				"intensity": { "value" : settings.intensity, "min" : 0, "max" : 10, "step" : 0.1, "name": "Light intensity" }
			},
			reset : function(){
				this.set.y.value = settings.camY;
				this.set.z.value = settings.camZ;
				this.set.intensity.value = settings.intensity;
				sceneCamera.position.set( settings.camX, settings.camY, settings.camZ );
				pointLight.intensity = settings.intensity;
			},
			update : function(name, value){

				if(name == "y"){
					sceneCamera.position.setY(value);
				} else if(name == "z"){
					sceneCamera.position.setZ(value);
				} else if(name == "intensity"){
					pointLight.intensity = value;
				}
				
			}			
		},
		turning : {
			name : "Turning text",
			type : "checkbox",
			set : { "value": settings.turning, "init" : settings.turning},
			action : function(checked){
				this.set.value = checked;
				console.log(checked);
			}
		},
		text : {
			name : "3D Text",
			type : "input",
			set : { "value" : settings.text },
			update : function(newText, event){				
				if ( text != newText ) {			
					text = newText;
					refreshText();
				}
			}
		},
		colorPick: {
			name : "Text Color",
			type : "color",
			set : { "value": "#fff", "init": "#" + hex },
			update : function(color){
				this.set.value = color;
				var thisColor = color.substring(1); 
				pointLight.color.setHex( '0x' + thisColor );
			}
		}
	};
	
	// Scene Variables
	var group, textMesh1, textMesh2, textGeo, material, hex, color, camera;
	var height = 20,
		size = 70,
		hover = 30,
		curveSegments = 4,
		bevelThickness = 2,
		bevelSize = 1.5,
		bevelSegments = 3,
		bevelEnabled = true,
		font = undefined,
		fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
		fontWeight = "bold"; // normal bold
	var mirror = true;

	var fontMap = {
		"helvetiker": 0,
		"optimer": 1,
		"gentilis": 2,
		"droid/droid_sans": 3,
		"droid/droid_serif": 4
	};

	var weightMap = {
		"regular": 0,
		"bold": 1
	};

	var reverseFontMap = [];
	var reverseWeightMap = [];

	for ( var i in fontMap ) reverseFontMap[ fontMap[i] ] = i;
	for ( var i in weightMap ) reverseWeightMap[ weightMap[i] ] = i;

	var targetRotation = 0;
	var targetRotationOnMouseDown = 0;

	var mouseX = 0;
	var mouseXOnMouseDown = 0;

	var windowHalfX = window.threeWidth / 2;
	var windowHalfY = window.threeHeight / 2;	

	var fontIndex = 1;	

/*
 
	// Audio Spectrum	
    this.METERNUM = 8; // Meter bars
    this.audioHeight = 0.3; // Audio height
	var GAP = 5, // Meter bars distance
    	MWIDTH = 5, // Meter bar width
    	MTHICKNESS = 5; // Meter bar thickness

	var cubeGeometry = new THREE.CubeGeometry(MWIDTH, MWIDTH, MTHICKNESS);
	var cubeMaterial = new THREE.MeshPhongMaterial({
	    color: 0x01FF00,
	    specular: 0x01FF00,
	    shininess: 20,
	    reflectivity: 5.5
	});

	for (var i = this.METERNUM - 1; i >= 0; i--) {
	    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	    cube.position.x = -175 + (MWIDTH + GAP) * i;
	    cube.position.y = 100;
	    cube.position.z = 200; //500;
	    cube.castShadow = true;
	    cube.rotation.y = Math.PI * 90;
	    cube.name = 'cube' + i;
	    this.scene.add(cube);
	    cube.visible = false;
	};
	
*/
	


/*
 

	// Main Texture
	this.streamTextures = []; this.extraStreams = [];
	var parameters = { color: 0x8000ff };
	var mainScreenMaterial = new THREE.MeshBasicMaterial( parameters );
	
	// Main Screen
	var ScreenGeo = new THREE.PlaneBufferGeometry( 100 , 80 );
	this.screenMesh = new THREE.Mesh( ScreenGeo, mainScreenMaterial );
	this.screenMesh.position.y = 290;
	this.screenMesh.position.x = 180;
	this.screenMesh.rotation.x = -0.3;
	this.scene.add( this.screenMesh );
	this.screenMesh.visible = false;

*/
	
	// Plane
	var plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 10000, 10000 ),
		new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
	);
	plane.position.y = 100;
	plane.rotation.x = - Math.PI / 2;
	this.scene.add( plane );	
	
	// fonts Material
	material = new THREE.MultiMaterial( [
 		new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
 		new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
 	]);
	
 	group = new THREE.Group();
 	group.position.y = 100;
 	this.scene.add( group );

 	// Load Fonts
	var loader = new THREE.FontLoader();
	loader.load( 'assets/js/threejs/fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {
		console.log(response);
		font = response;
		refreshText();
	});
		
	function decimalToHex( d ) {
		var hex = Number( d ).toString( 16 );
		hex = "000000".substr( 0, 6 - hex.length ) + hex;
		return hex.toUpperCase();
	}
	
	function createText() {
		textGeo = new THREE.TextGeometry( text, {
			font: font,
			size: size,
			height: height,
			curveSegments: curveSegments,
			bevelThickness: bevelThickness,
			bevelSize: bevelSize,
			bevelEnabled: bevelEnabled,
			material: 0,
			extrudeMaterial: 1
		});

		textGeo.computeBoundingBox();
		textGeo.computeVertexNormals();

		// "fix" side normals by removing z-component of normals for side faces
		// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

		if ( ! bevelEnabled ) {
			var triangleAreaHeuristics = 0.1 * ( height * size );
			for ( var i = 0; i < textGeo.faces.length; i ++ ) {
				var face = textGeo.faces[ i ];
				if ( face.materialIndex == 1 ) {
					for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
						face.vertexNormals[ j ].z = 0;
						face.vertexNormals[ j ].normalize();
					}
					
					var va = textGeo.vertices[ face.a ];
					var vb = textGeo.vertices[ face.b ];
					var vc = textGeo.vertices[ face.c ];
					var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

					if ( s > triangleAreaHeuristics ) {
						for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
							face.vertexNormals[ j ].copy( face.normal );
						}
					}
				}
			}
		}

		var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

		textMesh1 = new THREE.Mesh( textGeo, material );
		textMesh1.position.x = centerOffset;
		textMesh1.position.y = hover;
		textMesh1.position.z = 0;
		textMesh1.rotation.x = 0;
		textMesh1.rotation.y = Math.PI * 2;
		group.add( textMesh1 );

		if ( mirror ) {
			textMesh2 = new THREE.Mesh( textGeo, material );
			textMesh2.position.x = centerOffset;
			textMesh2.position.y = -hover;
			textMesh2.position.z = height;
			textMesh2.rotation.x = Math.PI;
			textMesh2.rotation.y = Math.PI * 2;
			group.add( textMesh2 );
		}
	}
	
	function refreshText() {
		group.remove( textMesh1 );
		if ( mirror ) group.remove( textMesh2 );
		if ( !text ) return;
		createText();
	}
	
	// Mouse Interactions
	window.threeJS_canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
	
	function onDocumentMouseDown( event ) {
		event.preventDefault();
		window.threeJS_canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
		window.threeJS_canvas.addEventListener( 'mouseup', onDocumentMouseUp, false );
		window.threeJS_canvas.addEventListener( 'mouseout', onDocumentMouseOut, false );
		mouseXOnMouseDown = event.clientX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;
	}

	function onDocumentMouseMove( event ) {
		mouseX = event.clientX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
	}

	function onDocumentMouseUp( event ) {
		window.threeJS_canvas.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		window.threeJS_canvas.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		window.threeJS_canvas.removeEventListener( 'mouseout', onDocumentMouseOut, false );
	}

	function onDocumentMouseOut( event ) {
		window.threeJS_canvas.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		window.threeJS_canvas.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		window.threeJS_canvas.removeEventListener( 'mouseout', onDocumentMouseOut, false );
	}
	
	// Update Scene Texture / Audio
/*	this.updateScene = function(feedData){
		
		this.inputData = feedData;
		
		// Input Data
		this.gotStreamData = isOBJnotEmpty(feedData);
		this.inputData = feedData;	
		
		console.log(this.gotStreamData);
		
		if(this.gotStreamData){
			
			this.gotVideoStream = this.inputData.textures.length ? true : false; //isOBJnotEmpty(this.inputData.textures); //this.inputData.textures.length ? true : false;
			this.gotAudioStream = isOBJnotEmpty(this.inputData.audio);
			
			console.log(this.gotVideoStream);
			
			if(this.gotVideoStream){
				
				// Main inputStream
				this.screenMesh.material = this.inputData.textures;
				console.log(this.screenMesh.material);
				//this.screenMesh.material = new THREE.MeshBasicMaterial({
				//	map: this.streamTextures[0], side: THREE.DoubleSide
				//});

				this.screenMesh.material = this.streamTextures[0];
				
				// Extra inputStreams
				for (i = 1; i < this.streamTextures.length; i++){
					var newScreenMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100 , 80 ), new THREE.MeshBasicMaterial({ map: this.streamTextures[i], side: THREE.DoubleSide }) );
					newScreenMesh.position.set(180 - (i * 120), 290, 0);
					newScreenMesh.rotation.x = -0.3;
					//newScreenMesh.sink = Math.random() * (0.002 - 0.001) + 0.001; // Math.floor(Math.random() * 0.007) + 0.002; //   0.004;
					//newScreenMesh.shake = Math.random() * (0.0007 - 0.0008) + 0.0008; //Math.floor(Math.random() * 0.0007) + 0.0001; //  0.0008;
					this.extraStreams.push(newScreenMesh);
					this.scene.add( newScreenMesh );
				}
				
				this.screenMesh.visible = true;
			}
			
			if(this.gotAudioStream){
				var audioSource = this.inputData.audio;				
				var audioContext = audioSource.audioContext;
				var audioStream = audioSource.audioStream;
				var gain_node = audioSource.audioGain;
				
		        script_processor_node = audioContext.createScriptProcessor(16384, 1, 1);
	
		        audioStream.connect(script_processor_node);
		        script_processor_analysis_node = audioContext.createScriptProcessor(2048, 1, 1);
		        script_processor_analysis_node.connect(gain_node);
	
		        this.analyser = audioContext.createAnalyser();
		        this.analyser.smoothingTimeConstant = 0;
		        this.analyser.fftSize = 2048;
				
		        audioStream.connect(this.analyser);
		        this.analyser.connect(script_processor_analysis_node);
			}
		}
	};
	
	*/

	// Update Poster
	this.onUpatePoster = function(poster){
		//console.log(" - onUpatePoster - ");
		//console.log(poster);
	}

	// Removing Stream
	this.onStreamRemove = function(streamid){
		console.log(" - onStreamRemove - ");
		console.log(streamid);
	}

	// Update Scene Texture / Audio
	this.onNewMediaElement = function(mediaElement){
		console.log(" - onNewMediaElement - ");
		console.log(mediaElement);
	}
	
	this.onOrderUpdate = function(orderList){
		console.log(" - onOrderUpdate - ");
		console.log(orderList);
	}
	
	this.onMidiUpdate = function(data){
		//console.log(" - onMidiUpdate - ");
		//console.log(data);		
	}
	
	// Rendering the Scene
	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

	this.render = function( delta, rtt ) {
		
		if(this.parameters.turning.set.value){
			targetRotation += 0.005;			
		}
		
		group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
		this.camera.lookAt( this.cameraTarget );
		
/*
		if(this.gotVideoStream){			
			this.screenMesh.material.map.needsUpdate = true;
			
			// Extra Streams floating
			for (i = 1; i < this.streamTextures.length; i++){			
				this.extraStreams[i - 1].material.map.needsUpdate = true;
			}
		}
		
		// Spectrum Movement
        if (this.gotAudioStream) {    		
        	var meterTimeY = performance.now() * 0.002;
    		var meterTimeZ = performance.now() * 0.0007;
            var array = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(array);
            var step = Math.round(array.length / this.METERNUM);
            for (var i = 0; i < this.METERNUM; i++) {
                var value = (array[i * step] / 4) * this.audioHeight;                
                value = value < 1 ? 1 : value;
                var meter = this.scene.getObjectByName('cube' + i, true);                                
                meter.scale.y = value;
                meter.visible = true;
            }
        };
*/
		if ( rtt )
			renderer.render( this.scene, this.camera, this.fbo, true );
		else
			renderer.render( this.scene, this.camera );

	};
}




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




















// *** --- Ocean Scene --- *** //
function Scene_Ocean() {
	
	// Streams
	this.gotStreamData = false;
	this.streams = [];
	//this.gotVideoStream = false;
	//this.gotAudioStream = false;
	
	// Setup scene
	this.scene = new THREE.Scene();
	this.scene.label = "Ocean";
	this.scene.name = "ocean";
	
	// Scene variables
	var mouseX = 640;
	var mouseY = -480;
	var windowHalfX = window.threeWidth / 2;
	var windowHalfY = window.threeHeight / 2;	
	
	// Audio Spectrum	
    this.METERNUM = 35; // Meter bars
    this.audioHeight = 0.1; // Audio height
	var GAP = 10, // Meter bars distance
    	MWIDTH = 50, // Meter bar width
    	MTHICKNESS = 100; // Meter bar thickness

	var cubeGeometry = new THREE.CubeGeometry(MWIDTH, MWIDTH, MTHICKNESS);
	var cubeMaterial = new THREE.MeshPhongMaterial({
	    color: 0x01FF00,
	    specular: 0x01FF00,
	    shininess: 20,
	    reflectivity: 5.5
	});

	for (var i = this.METERNUM - 1; i >= 0; i--) {
	    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	    cube.position.x = -1000 + (MWIDTH + GAP) * i;
	    cube.position.y = 0;
	    cube.position.z = 1200;
	    cube.castShadow = true;
	    cube.rotation.y = Math.PI * 90;
	    cube.name = 'cube' + i;
	    this.scene.add(cube);
	};
	
	// Set Camera
	this.camera = new THREE.PerspectiveCamera( 55, window.threeWidth / window.threeHeight, 100, 3000000 );
	this.camera.position.set( 2000, 1750, 3000 );
		
	// Main Texture
	this.streamTextures = []; //this.extraStreams = [];
	var parameters = { color: 0x8000ff };
	var mainScreenMaterial = new THREE.MeshBasicMaterial( parameters );
	
	// Main Screen
	this.screenMesh = [];
	var ScreenGeo = new THREE.PlaneBufferGeometry( 1920 , 1485 );
	this.screenMesh.push(new THREE.Mesh( ScreenGeo, mainScreenMaterial ));
	this.screenMesh[0].position.y = 700;
	this.screenMesh[0].sink = Math.random() * 0.001;
	this.screenMesh[0].shake = Math.random() * 0.0008;
	this.screenMesh[0].deep = 600;
	this.screenMesh[0].depth = 50;
	this.scene.add( this.screenMesh[0] );

	// Creating Ocean
	this.scene.add( new THREE.AmbientLight( 0x444444 ) );
	var light = new THREE.DirectionalLight( 0xffffbb, 1 );
	light.position.set( - 1, 1, - 1 );
	this.scene.add( light );
	
	var waterNormals = new THREE.TextureLoader().load( 'assets/js/threejs/textures/waternormals.jpg' );
	waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

	this.water = new THREE.Water( renderer, this.camera, this.scene, {
		textureWidth: 512,
		textureHeight: 512,
		waterNormals: waterNormals,
		alpha: 	1.0,
		sunDirection: light.position.clone().normalize(),
		sunColor: 0xffffff,
		waterColor: 0x001e0f,
		distortionScale: 50.0,
	});
	
	var oceanSize = 2000;
	var mirrorMesh = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( oceanSize * 500, oceanSize * 500 ),
		this.water.material
	);

	mirrorMesh.add( this.water );
	mirrorMesh.rotation.x = - Math.PI * 0.5;
	this.scene.add( mirrorMesh );
	
	// Adding Skybox
	var cubeMap = new THREE.CubeTexture( [] );
	cubeMap.format = THREE.RGBFormat;

	var loader = new THREE.ImageLoader();
	loader.load( 'assets/js/threejs/textures/skyboxsun25degtest.png', function ( image ) {
		var getSide = function ( x, y ) {
			var size = 1024;
			var canvas = document.createElement( 'canvas' );
			canvas.width = size;
			canvas.height = size;
			var context = canvas.getContext( '2d' );
			context.drawImage( image, - x * size, - y * size );
			return canvas;
		};

		cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
		cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
		cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
		cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
		cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
		cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
		cubeMap.needsUpdate = true;

	} );

	var cubeShader = THREE.ShaderLib[ 'cube' ];
	cubeShader.uniforms[ 'tCube' ].value = cubeMap;

	var skyBoxMaterial = new THREE.ShaderMaterial( {
		fragmentShader: cubeShader.fragmentShader,
		vertexShader: cubeShader.vertexShader,
		uniforms: cubeShader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	} );

	var skyBox = new THREE.Mesh( new THREE.BoxGeometry( 1000000, 100000, 1000000 ), skyBoxMaterial );
	this.scene.add( skyBox );
	
	// Mouse Movement
	window.threeJS_canvas.addEventListener( 'mousemove', function( event ){
		mouseX = (( event.clientX - windowHalfX ) * 3);
		mouseY = (( event.clientY - windowHalfY ) * 3) - 1500;		
	}, false );
	
	// Update Poster
	this.updatePoster = function(poster){
		var thisScreenMesh = this.screenMesh[0];		
		var texLoader = new THREE.TextureLoader();
		texLoader.load(poster, function(tex) {
			var posterMaterial = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
			posterMaterial.map.minFilter = THREE.LinearFilter;
			posterMaterial.map.magFilter = THREE.LinearFilter;
			posterMaterial.map.format = THREE.RGBFormat;									
			thisScreenMesh.material = posterMaterial;
			thisScreenMesh.material.map.needsUpdate = true;
		});
	};
	
	// Update Scene Texture / Audio
	this.updateScene = function(stream){
		
		var gotVideoStream = isOBJnotEmpty(stream.texture);
		var gotAudioStream = isOBJnotEmpty(stream.audio);
		
		if(gotVideoStream){
			stream.material = new THREE.MeshBasicMaterial({
				map: stream.texture, side: THREE.DoubleSide
			});
		}
		
		if(this.streams.length == 0){
			
			this.screenMesh[0].material = stream.material;
			this.screenMesh[0].material.map.needsUpdate = true;
			
			if(gotAudioStream){
				
				var audioSource = stream.audio;				
				var audioContext = audioSource.audioContext;
				var audioStream = audioSource.audioStream;
				var gain_node = audioSource.audioGain;
				
		        script_processor_node = audioContext.createScriptProcessor(16384, 1, 1);
	
		        audioStream.connect(script_processor_node);
		        script_processor_analysis_node = audioContext.createScriptProcessor(2048, 1, 1);
		        //script_processor_analysis_node.connect(gain_node);
	
		        this.analyser = audioContext.createAnalyser();
		        this.analyser.smoothingTimeConstant = 0;
		        this.analyser.fftSize = 2048;
				
		        audioStream.connect(this.analyser);
		        this.analyser.connect(script_processor_analysis_node);					
				
				stream.analyser = this.analyser;
				stream.gotAnalyser = true;
			}
			
		} else {
			
			var parameters = { color: 0x8000ff };
			var mainScreenMaterial = new THREE.MeshBasicMaterial( parameters );
			
			var newScreenMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 480 , 360 ), mainScreenMaterial );
			
			newScreenMesh.position.set(-500 + (i * 600), 200, 600);
			newScreenMesh.sink = Math.random() * (0.002 - 0.001) + 0.001;
			newScreenMesh.shake = Math.random() * (0.0007 - 0.0008) + 0.0008;
			newScreenMesh.deep = 150;
			newScreenMesh.depth = 30;
			newScreenMesh.material = stream.material;
			newScreenMesh.material.map.needsUpdate = true;
			
			this.screenMesh.push(newScreenMesh);			
			this.scene.add( newScreenMesh );

		}
		
		this.streams.push(stream);

	};
	
	// Rendering
	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );	
	
	this.render = function( delta, rtt ) {

		// Camera Rotation
		this.camera.position.x += ( mouseX - this.camera.position.x ) *  0.05;
		this.camera.position.y += ( - mouseY - this.camera.position.y ) * 0.05;		
		this.camera.lookAt( this.scene.position );
		
		// Screans floating
		if(this.streams.length){
			
			for (i = 0; i < this.screenMesh.length; i++){
				
				this.screenMesh[i].material.map.needsUpdate = true;

				var extraStreamY = performance.now() * this.screenMesh[i].sink;
				var extraStreamZ = performance.now() * this.screenMesh[i].shake;
				this.screenMesh[i].position.y = (Math.sin( extraStreamY ) * this.screenMesh[i].depth) + this.screenMesh[i].deep;// 30 + 150;
				this.screenMesh[i].rotation.z = Math.sin( extraStreamZ ) * 0.05;
						
				// Spectrum Movement only for Main Screen
		        if(this.streams[i].gotAnalyser) {    		
		        	var meterTimeY = performance.now() * 0.002;
		    		var meterTimeZ = performance.now() * 0.0007;
		            var array = new Uint8Array(this.analyser.frequencyBinCount);
		            this.streams[i].analyser.getByteFrequencyData(array);
		            var step = Math.round(array.length / this.METERNUM);
		            for (var s = 0; s < this.METERNUM; s++) {		            	
		                var value = (array[s * step] / 4) * this.audioHeight;                
		                value = value < 1 ? 1 : value;
		                var meter = this.scene.getObjectByName('cube' + s, true);                                
		                meter.scale.z = value;
		                meter.position.y = Math.sin( meterTimeY ) * 10 + 10;
		                meter.rotation.z = Math.sin( meterTimeZ ) * 0.1;
		            }
		        };
			}
		}

		// Water Uniforms / Render	
		this.water.material.uniforms.time.value += 1.0 / 60.0;
		this.water.render();
		
		if ( rtt )
			renderer.render( this.scene, this.camera, this.fbo, true );
		else
			renderer.render( this.scene, this.camera );
	};	
}







function Scene_Mirror(inputData) {

	// Get our Input Data
	var streamTextures = inputData.textures;
	var audioSource = inputData.audio;
	
	// Setup scene
	this.scene = new THREE.Scene();
	this.scene.label = "Mirror Ground";
	this.scene.name = "mirror";

	// Set Camera attributes
	var view_angle = 45,
		aspect_ratio = window.threeWidth / window.threeHeight,
	    near = 1,
	    far = 10000,
	    groundVisibility = true,
		camPos = { "x": 150, "y": 20, "z": 150 };
	
	// Scene Dynamic Parameters
	this.parameters = {
		camera : {
			name : "Camera Position",
			type : "slider",
			set : {
				"x": { "value" : camPos.x, "min" : 0, "max" : 1000, "step" : 1 }, 
				"y": { "value" : camPos.y, "min" : 0, "max" : 1000, "step" : 1 },
				"z": { "value" : camPos.z, "min" : 0, "max" : 1000, "step" : 1 } 
			},
			reset : function(){
				this.set.x.value = camPos.x;
				this.set.y.value = camPos.y;
				this.set.z.value = camPos.z;
			}
		},
		angle : {
			name : "Camera Angle",			
			type : "slider",
			set : {"amount": { "value" : view_angle, "min" : -120, "max" : 120, "step" : 1 }},
			reset : function(){
				this.set.amount.value = view_angle;
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
			set : { "value" : groundVisibility, "init" : groundVisibility },
			action : function(checked){
				this.set.value = checked;
			}
		}
	};
		
	// Set Camera
	this.camera = new THREE.PerspectiveCamera(view_angle, aspect_ratio, near, far );
	this.camera.position.z = this.parameters.camera.set.z.value;
	this.camera.position.y = this.parameters.camera.set.y.value;
	this.camera.lookAt( this.scene.position );

	// Stream Material
	var textParam = { map: streamTextures[0] }
	var mainScreenMaterial = new THREE.MeshBasicMaterial( textParam );
	
	// Screen
	var ScreenGeo = new THREE.PlaneBufferGeometry( 80, 60 );
	//var screenMaterial = new THREE.MeshLambertMaterial( { color: 'rgb(0,190,0)' } );
	this.screenMesh = new THREE.Mesh( ScreenGeo, mainScreenMaterial );
	//this.groundMesh.position.y = -30;
	this.screenMesh.rotateY( 0.3 );
	this.scene.add( this.screenMesh );

	// Floor
	//var decalNormal = new THREE.TextureLoader().load( 'js/textures/decal/decal-plastic.jpg' );
	//var decalDiffuse = new THREE.TextureLoader().load( 'js/textures/decal/decal-plastic-diffuse.jpg' );
	//decalDiffuse.wrapS = decalDiffuse.wrapT = THREE.RepeatWrapping;
	
	this.groundMirror = new THREE.Mirror( renderer, this.camera, { clipBias: 0.003, textureWidth: window.threeWidth, textureHeight: window.threeHeight, color:0x889999 } );
	var groundMirrorMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), this.groundMirror.material );
	groundMirrorMesh.add( this.groundMirror );
	groundMirrorMesh.position.y = -30;
	groundMirrorMesh.rotateX( - Math.PI / 2 );
	this.scene.add( groundMirrorMesh );
	
	// load skybox
	var cubeMap = new THREE.CubeTexture( [] );
	cubeMap.format = THREE.RGBFormat;

	var loader = new THREE.ImageLoader();
	loader.load( 'assets/js/threejs/textures/skyboxsun25degtest.png', function ( image ) {

		var getSide = function ( x, y ) {

			var size = 1024;

			var canvas = document.createElement( 'canvas' );
			canvas.width = size;
			canvas.height = size;

			var context = canvas.getContext( '2d' );
			context.drawImage( image, - x * size, - y * size );

			return canvas;

		};

		cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
		cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
		cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
		cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
		cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
		cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
		cubeMap.needsUpdate = true;

	} );

	var cubeShader = THREE.ShaderLib[ 'cube' ];
	cubeShader.uniforms[ 'tCube' ].value = cubeMap;

	var skyBoxMaterial = new THREE.ShaderMaterial( {
		fragmentShader: cubeShader.fragmentShader,
		vertexShader: cubeShader.vertexShader,
		uniforms: cubeShader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	} );

	var skyBox = new THREE.Mesh(
		new THREE.BoxGeometry( 1000, 1000, 1000 ),
		skyBoxMaterial
	);

	this.scene.add( skyBox );
	
	// Spot Light
	this.light = new THREE.SpotLight( 0xffffff, 1.5 );
	this.light.position.set( 0, 500, 2000 );
	this.scene.add( this.light );
	
	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
	
	renderer.setClearColor( 0x00bfff );
	
	this.render = function( delta, rtt ) {
		
		// Ground Visibility
		this.groundMirror.material.visible = this.parameters.ground.set.value;
		
		// Dynamic update of the Camera
		this.camera.position.set(
			this.parameters.camera.set.x.value,
			this.parameters.camera.set.y.value,
			this.parameters.camera.set.z.value
		);
		
		this.camera.lookAt( this.scene.position );

		this.camera.fov = this.parameters.angle.set.amount.value;
		this.camera.updateProjectionMatrix();
		
		// Rendering Scene
		this.screenMesh.material.map.needsUpdate = true;		
		this.groundMirror.render();
		
		if ( rtt )
			renderer.render( this.scene, this.camera, this.fbo, true );
		else
			renderer.render( this.scene, this.camera );

	};
}





function Scene_Single3D(streamTextures) {
	
	// Set Camera attributes
	var view_angle = 45,
		aspect_ratio = window.threeWidth / window.threeHeight,
	    near = 1,
	    far = 10000;
	
	this.sunLight = new THREE.DirectionalLight( 'rgb(255,255,255)', 1 );
	this.lightPosition4D = new THREE.Vector4();
	
	this.camera = new THREE.PerspectiveCamera(view_angle, aspect_ratio, near, far );
	this.camera.position.z = 40;
	this.camera.rotateX( -0.2 );
	
	// Setup scene
	this.scene = new THREE.Scene();

	// Main Sceen Plain
	var parameters = { map: streamTextures[0] }
	var mainScreenMaterial = new THREE.MeshBasicMaterial( parameters );

	// Main Mesh
	var geometry = new THREE.BoxBufferGeometry( 10, 10, 10 );
	//var material = new THREE.MeshBasicMaterial( { map: streamTexture } );
	var material = new THREE.MeshPhongMaterial( { map: streamTexture, emissive: 0x200020 } );
	material.map.needsUpdate = true;
	
	var mainScreenBox = new THREE.Mesh( geometry, material );
	this.scene.add( mainScreenBox );

	this.boxShadow = new THREE.ShadowMesh( mainScreenBox );
	this.scene.add( this.boxShadow );
	
	// Create a Mirror
	var planeGeo = new THREE.PlaneBufferGeometry( 100, 100 );
	
	var groundMaterial = new THREE.MeshLambertMaterial( { color: 'rgb(0,130,0)' } );
	this.groundMesh = new THREE.Mesh( planeGeo, groundMaterial );
	this.groundMesh.position.z = -30;
	this.scene.add( this.groundMesh );	
	
	this.verticalMirror = new THREE.Mirror( renderer, this.camera, { clipBias: 0.003, textureWidth: window.threeWidth, textureHeight: window.threeHeight, color:0x889999 } );
	var verticalMirrorMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 60, 60 ), this.verticalMirror.material );
	verticalMirrorMesh.add( this.verticalMirror );
	verticalMirrorMesh.position.y = -9;
	verticalMirrorMesh.position.z = 0;
	verticalMirrorMesh.rotateX( 30 );
	this.scene.add( verticalMirrorMesh );
	
	// Create a point light
	this.pointLight = new THREE.PointLight( 0xFFFFFF );
	this.pointLight.position.x = 10;
	this.pointLight.position.y = 50;
	this.pointLight.position.z = 130;	
	this.scene.add( this.pointLight );

	// SunLight
	this.sunLight.position.set( 5, 7, - 1 );
	this.sunLight.lookAt( this.scene.position );
	this.scene.add( this.sunLight );
	
	this.lightPosition4D.x = this.sunLight.position.x;
	this.lightPosition4D.y = this.sunLight.position.y;
	this.lightPosition4D.z = this.sunLight.position.z;
	// amount of light-ray divergence. Ranging from:
	// 0.001 = sunlight(min divergence) to 1.0 = pointlight(max divergence)
	this.lightPosition4D.w = 0.001; // must be slightly greater than 0, due to 0 causing matrixInverse errors

	
	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

	this.render = function( delta, rtt ) {
		
		mainScreenBox.rotation.x += 0.005;
		mainScreenBox.rotation.y += 0.01;
		
		mainScreenBox.material.map.needsUpdate = true;
		
		this.verticalMirror.render();

		//this.boxShadow.update( this.verticalMirror, this.pointLight );
		this.boxShadow.update( this.verticalMirror, this.lightPosition4D );
		
		if ( rtt )
			renderer.render( this.scene, this.camera, this.fbo, true );
		else
			renderer.render( this.scene, this.camera );

	};

}
