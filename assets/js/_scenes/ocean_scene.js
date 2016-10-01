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