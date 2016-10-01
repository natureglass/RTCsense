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
/*
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
*/
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
		console.log(" - onUpatePoster - ");
		console.log(poster);
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