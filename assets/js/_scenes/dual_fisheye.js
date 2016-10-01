// *** Flat Scene *** //
function Scene_dualFisheye(system) {

	//$('#placeholder').html(system.browser.name);

	// ----- Setting Variables ----- //
	var isMobile = system.isMobileDevice,
		browser = system.browser.name;
	
	var renderOut = renderer,
		effectVR = new THREE.CardboardEffect( renderer ), scope = this,
		container, controls, geometry, meshSphere, videoElem,
		canvasTexture, ctxTexture, gotStream = false;
	
	var onMouseDownMouseX = 0, onMouseDownMouseY = 0,
		onPointerDownPointerX = 0, onPointerDownPointerY = 0,
		onPointerDownLon = 0, onPointerDownLat = 0, 
		lon = 0, onMouseDownLon = 0,
		lat = 0, onMouseDownLat = 0,
		phi = 0, theta = 0, distance = 10;
		
	var isEquirectangular = false,
		videoTest = false, isVideoReady = false;
		two_images = false,
		stereEffect = false,
		interactive = !isMobile;

	// ----- Scene Parameters ----- //
	this.parameters = {
		effectVR : {
			name : "VR",
			type : "VR",
			set : { "value": stereEffect },
			action : function(checked){
				
				if(stereEffect){ stereEffect = false;
				} else { stereEffect = true; }
				
				this.set.value = stereEffect;
				
				if(stereEffect){ renderOut = effectVR;
				} else { renderOut = renderer;}
				
				rtcStudio.ThreeJS.onWindowResize();
				
			}
		},
		userTouch : {
			name : "Interactive",
			type : "TOUCH_ACTIVE",
			set : { "value": interactive },
			action : function(checked){
				if(interactive){ interactive = false;
				} else { interactive = true; }
				this.set.value = interactive;
			}
		}		
	}	

	
	// ----- Setup Scene ----- //
	this.scene = new THREE.Scene();
	this.scene.label = "Dual Fisheye";
	this.scene.name = "dualfisheye";

	
	// ----- Setup Camera ----- //
	this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
	this.controls = new THREE.DeviceOrientationControls( this.camera );	

	
	// ----- Prepare Sphere Geometry ----- //		
	var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 ).toNonIndexed();
	geometry.scale( - 1, 1, 1 );

	
	if(!isEquirectangular){
	 
		// ----- Remap UVs ----- //
		var normals = geometry.attributes.normal.array;
		var uvs = geometry.attributes.uv.array;
		for ( var i = 0, l = normals.length / 3; i < l; i ++ ) {
			var x = normals[ i * 3 + 0 ];
			var y = normals[ i * 3 + 1 ];
			var z = normals[ i * 3 + 2 ];
			if ( i < l / 2 ) {
				var correction = ( x == 0 && z == 0 ) ? 1 : ( Math.acos( y ) / Math.sqrt( x * x + z * z ) ) * ( 2 / Math.PI );
				uvs[ i * 2 + 0 ] = x * ( 240 / 960 ) * correction + ( 240 / 960 );
				uvs[ i * 2 + 1 ] = z * ( 320 / 640 ) * correction + ( 320 / 640 );
			} else {
				var correction = ( x == 0 && z == 0 ) ? 1 : ( Math.acos( - y ) / Math.sqrt( x * x + z * z ) ) * ( 2 / Math.PI );
				uvs[ i * 2 + 0 ] = - x * ( 240 / 960 ) * correction + ( 720 / 960 );
				uvs[ i * 2 + 1 ] = z * ( 320 / 640 ) * correction + ( 320 / 640 );
			}
		}
		geometry.rotateZ( - Math.PI / 2 );
	}

	
	if(!videoTest){
		
		if(two_images){
			
			// ----- Texture Canvas ----- //
			canvasTexture = document.createElement('canvas');
			ctxTexture = canvasTexture.getContext('2d');	
			canvasTexture.width  = 960; canvasTexture.height = 640;
			//$('.vidPrev').append(canvasTexture);
			
			// ----- Load fishEye Images ----- //
			var img1 = document.createElement('IMG');
			img1.onload = function () {
				rotateAndPaintImage ( ctxTexture, img1, -90, 0, canvasTexture.height, 0, 0 );
				var img2 = document.createElement('IMG');
				img2.onload = function () {
					rotateAndPaintImage ( ctxTexture, img2, 90, canvasTexture.width, 0, 0, 0 );
					sphereTexture.needsUpdate = true;
				}
				img2.src = 'assets/img/fish2.jpg';
			}	
			img1.src = 'assets/img/fish1.jpg';
			
			// ----- Map Texture to Sphere ----- //
			sphereTexture = new THREE.Texture(canvasTexture) 
			sphereTexture.needsUpdate = true;
			
		} else {
			
			sphereTexture = new THREE.TextureLoader().load( 'assets/img/panorama.jpg' );
			sphereTexture.format = THREE.RGBFormat;
			
		}

	} else {

		// ----- Video Texture to Sphere ----- //		
		if(isMobile & browser === 'Safari'){ // --- IPhone Hack --- //
			
			$('#placeholder').html("Loading Video...");
			
			$('body').append('<video id="testVideo" autoplay loop muted webkit-playsinline src="assets/img/pano.mp4" style="display:none"></video>');
			videoElem = document.getElementById( 'testVideo' );
			window.makeVideoPlayableInline(videoElem, !videoElem.hasAttribute('muted'), false);
			
		} else {
		
			$('#placeholder').html("Loading Video...");
			
			videoElem = document.createElement('video');
			videoElem.width  = 960; videoElem.height = 640;
		    videoElem.src = "assets/img/pano.mp4"; videoElem.autoplay = true;
		    videoElem.muted = true; videoElem.loop = true; videoElem.play();    
		    videoElem.onloadedmetadata = function(e) {
		    	$('#placeholder').html("Tap Screen to play!!!");
		    	videoElem.play();
		    };
		    
		}
	    
	    videoElem.ontimeupdate = function(){
	    	if(this.currentTime > 0){
	    		$('#placeholder').html("");
	    		$('#sticky-toolbar').fadeOut(200);
	    	}
	    };
	    
		// ----- Set Texture to Sphere ----- //
		var sphereTexture = new THREE.VideoTexture( videoElem );
		sphereTexture.minFilter = THREE.LinearFilter;
		sphereTexture.format = THREE.RGBFormat;
		
	}	
	
	// ---- Setting SphereTexture & adding in Scene ---- //
    sphereMaterial = new THREE.MeshBasicMaterial( {map: sphereTexture } );
    sphereMaterial.map.minFilter = THREE.LinearFilter;	
    sphereMaterial.map.format = THREE.RGBFormat;

    var meshSphere = new THREE.Mesh( geometry, sphereMaterial );
	this.scene.add( meshSphere );

	
	// ----- User - Mouse Control ----- //
	document.getElementById("canvasScreen").addEventListener( 'mousedown', onDocumentMouseDown, false );	
	document.getElementById("canvasScreen").addEventListener( 'mousemove', onDocumentMouseMove, false );	
	document.getElementById("canvasScreen").addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.getElementById("canvasScreen").addEventListener( 'touchmove', onDocumentTouchMove, false );	
	
	
	// ------ Touch Movement ------ //
	function onDocumentTouchStart( event ) {		
		if ( event.touches.length == 1 & interactive ) {
			event.preventDefault();
			onPointerDownPointerX = event.touches[ 0 ].pageX;
			onPointerDownPointerY = event.touches[ 0 ].pageY;
			onPointerDownLon = lon;
			onPointerDownLat = lat;
		}
		
		if(videoElem.readyState){
			$('#placeholder').html("Please wait, video is starting...");			
			videoElem.play();
		}
	}

	function onDocumentTouchMove( event ) {
		if ( event.touches.length == 1  & interactive ) {
			event.preventDefault();
			lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.3 + onPointerDownLon;
			lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.3 + onPointerDownLat;
		}
	}

	// ------ Mouse Movement ------ //
	function onDocumentMouseDown( event ) {
		event.preventDefault();
		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;
		onPointerDownLon = lon;
		onPointerDownLat = lat;
	}
	
	function onDocumentMouseMove( event ) {
		if(event.buttons === 1){
			lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
			lat = ( onPointerDownPointerY - event.clientY ) * 0.1 + onPointerDownLat;
		}		
	}	

	// Update Scene Texture / Audio
	this.onNewMediaElement = function(mediaElement){
		meshSphere.material = new THREE.MeshBasicMaterial({ map: mediaElement.texture, side: THREE.DoubleSide });
		meshSphere.material.map.needsUpdate = true;
		gotStream = true;
	}
	
	// ------ Rendering ------ //
	var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

	this.render = function( delta, rtt ) {

		
		// ----- If we have Video Stream ----- //
		if(gotStream){ meshSphere.material.map.needsUpdate = true; }


		// ----- Sensors Control ----- //
		if(isMobile & !interactive){ this.controls.update(); }
		

		// ----- User Control ----- //
		if(!isMobile || interactive){
			
			lat = Math.max( - 85, Math.min( 85, lat ) );
			phi = THREE.Math.degToRad( 90 - lat );
			theta = THREE.Math.degToRad( lon - 180 );
			
			this.camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
			this.camera.position.y = distance * Math.cos( phi );
			this.camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );
			
			this.camera.lookAt( this.scene.position );
			
		}
		
		
		// ----- Renderer Update ----- //
		if ( rtt ){ renderOut.render( this.scene, this.camera, this.fbo, true );
		} else { renderOut.render( this.scene, this.camera ); }

	};
	
	function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY, color ) {
		context.translate( positionX, positionY );
		context.rotate( angleInRad * Math.PI/180);
		if(image !== ''){
			context.drawImage( image, -axisX, -axisY, canvasTexture.height, canvasTexture.width / 2 );
		} else {
			context.fillStyle = color;
			context.fillRect(-axisX, -axisY, canvasTexture.height, canvasTexture.width / 2);
		}		
		context.rotate( -angleInRad * Math.PI/180);
		context.translate( -positionX, -positionY );
	}
		
}