function Transition ( sceneA, sceneB, transitionParams ) {
	
	this.WIDTH = window.threeWidth;
	this.HEIGHT = window.threeHeight;
	
	this.scene = new THREE.Scene();

	this.trans = false;
	
	this.toSceneA = false;
	this.toSceneB = false;
	
	this.changeValue = 0;
	this.changeSpeed = 0.01;
	
	this.cameraOrtho = new THREE.OrthographicCamera( this.WIDTH / - 2, this.WIDTH / 2, this.HEIGHT / 2, this.HEIGHT / - 2, - 10, 10 );

	this.textures = [];
	for ( var i = 0; i < 6; i ++ )
		this.textures[ i ] = new THREE.TextureLoader().load( 'assets/js/threejs/crossfade/transition/transition' + ( i + 1 ) + '.png' );
				
	this.quadmaterial = new THREE.ShaderMaterial( {

		uniforms: {

			tDiffuse1: {
				type: "t",
				value: null
			},
			tDiffuse2: {
				type: "t",
				value: null
			},
			mixRatio: {
				type: "f",
				value: 0.0
			},
			threshold: {
				type: "f",
				value: 0.1
			},
			useTexture: {
				type: "i",
				value: 1,
			},
			tMixTexture: {
				type: "t",
				value: this.textures[ 0 ]
			}
		},
		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

			"vUv = vec2( uv.x, uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join( "\n" ),
		fragmentShader: [

			"uniform float mixRatio;",

			"uniform sampler2D tDiffuse1;",
			"uniform sampler2D tDiffuse2;",
			"uniform sampler2D tMixTexture;",

			"uniform int useTexture;",
			"uniform float threshold;",

			"varying vec2 vUv;",

			"void main() {",

			"vec4 texel1 = texture2D( tDiffuse1, vUv );",
			"vec4 texel2 = texture2D( tDiffuse2, vUv );",

			"if (useTexture==1) {",

				"vec4 transitionTexel = texture2D( tMixTexture, vUv );",
				"float r = mixRatio * (1.0 + threshold * 2.0) - threshold;",
				"float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);",

				"gl_FragColor = mix( texel1, texel2, mixf );",
			"} else {",

				"gl_FragColor = mix( texel2, texel1, mixRatio );",

			"}",
		"}"

		].join( "\n" )

	} );

	quadgeometry = new THREE.PlaneBufferGeometry( this.WIDTH, this.HEIGHT );

	this.quad = new THREE.Mesh( quadgeometry, this.quadmaterial );
	this.scene.add( this.quad );

	// Link both scenes and their FBOs
	this.sceneA = sceneA;
	this.sceneB = sceneB;

	this.quadmaterial.uniforms.tDiffuse1.value = sceneA.fbo;
	this.quadmaterial.uniforms.tDiffuse2.value = sceneB.fbo;

	this.setTextureThreshold = function ( value ) {
		this.quadmaterial.uniforms.threshold.value = value;
	};

	this.useTexture = function ( value ) {
		this.quadmaterial.uniforms.useTexture.value = value ? 1 : 0;
	};

	this.setTexture = function ( i ) {
		this.quadmaterial.uniforms.tMixTexture.value = this.textures[ i ];
	};

	this.render = function( delta ) {

		if(this.toSceneA){

			if(this.changeValue <= 0){
				this.toSceneA = false;
				transitionParams.transition = 0;
			} else {
				this.changeValue -= transitionParams.transitionSpeed;	
			}
			
		} else if(this.toSceneB){

			if(this.changeValue >= 1){
				this.toSceneB = false;
				transitionParams.transition = 1;
			} else {
				this.changeValue += transitionParams.transitionSpeed;
			}

		}
		
		transitionParams.transition = THREE.Math.smoothstep( this.changeValue, 0, 1 );
		
		this.quadmaterial.uniforms.mixRatio.value = transitionParams.transition;

		// Prevent render both scenes when it's not necessary
		if ( transitionParams.transition == 0 ) {
			
			this.sceneB.render( delta, false );

		} else if ( transitionParams.transition == 1 ) {

			this.sceneA.render( delta, false );

		} else {
			
			// When 0<transition<1 render transition between two scenes

			this.sceneA.render( delta, true );
			this.sceneB.render( delta, true );
			renderer.render( this.scene, this.cameraOrtho, null, true );

		}

	}

	this.change = function( scene, speed ) {
		
		if(scene == "sceneA"){
			this.toSceneA = true;
			this.toSceneB = false;
		} else {
			this.toSceneB = true;
			this.toSceneA = false;
		}

		this.changeSpeed = speed;

	}

	
}
