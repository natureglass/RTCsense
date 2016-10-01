/*
 *  'scope' variable is THIS environment
 *  'system' object is System Informations
 *    
 *	'renderer' object is THREE.WebGLRenderer()
 *  'scene' object is THREE.Scene()
 *  
 *  'canvasScreen' variable is your ThreeJS Canvas
 *  
 *  'this.parameters' function is Scene Settings (check documentation)
 *  'this.render' function is requestAnimationFrame
 *  'this.onWindowResize' function is resize Listener
 *  'this.onNewMediaElement' function fires in new MediaElement
 *  
 */

// ----- Scene Setup ----- //
scene.label = "Dual Fisheye";
scene.name = "dualfisheye";

// ----- Setting Variables ----- //
var isMobile = system.isMobileDevice,
	browser = system.browser.name;

var onMouseDownMouseX = 0, onMouseDownMouseY = 0,
	onPointerDownPointerX = 0, onPointerDownPointerY = 0,
	onPointerDownLon = 0, onPointerDownLat = 0, 
	lon = 0, onMouseDownLon = 0,
	lat = 0, onMouseDownLat = 0,
	phi = 0, theta = 0, distance = 10,
	gotStreams = 0;

var isEquirectangular = false,
	isInteractive = false;

var cameraRTT, sceneRTT, sceneScreen,
	frontCamMesh, frontCamMaterial,
	backCamMesh, backCamMaterial;

// ----- Scene Parameters ----- //
this.parameters = {
	effectVR : {
		StereoEffect :true,
		CardboardEffect: true,
		AnaglyphEffect: true,
		ParallaxBarrier: true
	},
	sensorControl : {
		init: isInteractive,
		showMobileOnly: true,
		onClick : function(status){
			isInteractive = status;
		}
	},
	mediaDevice :{
		autoInit: false,
		inputs: [
		    {name: "Front Camera", video: true, audio: false},
		    {name: "Back Camera", video: true, audio: false}
		]
	},		
}

// ----- Setup Scene / Camera ----- //
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
var controls = new THREE.DeviceOrientationControls( camera );	


// ----- Create Scene Environment ----- //
var geometry, sphereTexture, sphereMaterial, meshSphere;

createCombinedMaterial();
createEnvironment();

//----- Setup Interactions ----- //
setupInteractions();

// Update Scene Texture / Audio
this.onNewMediaElement = function(mediaElement){
	
	if(gotStreams == 0){
		var frontCamMaterial = new THREE.MeshBasicMaterial({ map: mediaElement.texture, side: THREE.DoubleSide });
		frontCamMaterial.map.minFilter = THREE.LinearFilter;	
		frontCamMaterial.map.format = THREE.RGBFormat;
		frontCamMesh.material = frontCamMaterial;
	} else {
		var backCamMaterial = new THREE.MeshBasicMaterial({ map: mediaElement.texture, side: THREE.DoubleSide });
		backCamMaterial.map.minFilter = THREE.LinearFilter;	
		backCamMaterial.map.format = THREE.RGBFormat;
		backCamMesh.material = backCamMaterial;		
	}
	gotStreams++;
}

// ------ Renderer Update ------ //
this.render = function() {

	renderer.clear();

	// Render first scene into texture
	renderer.render( sceneRTT, cameraRTT, rtTexture, true );
	// Render full screen quad with generated texture
	renderer.render( sceneScreen, cameraRTT );	
	
	if(gotStreams !== 0){
		frontCamMesh.material.map.needsUpdate = true;
		backCamMesh.material.map.needsUpdate = true;
	}
	
	// ----- Sensors Control ----- //
	if(isMobile & !isInteractive){
		controls.update();
	}
	
	// ----- User Control ----- //
	if(!isMobile || isInteractive){
		
		lat = Math.max( - 85, Math.min( 85, lat ) );
		phi = THREE.Math.degToRad( 90 - lat );
		theta = THREE.Math.degToRad( lon - 180 );
		
		camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
		camera.position.y = distance * Math.cos( phi );
		camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );
		
		camera.lookAt( scene.position );
		
	}
	
};


function createEnvironment(){
	
	// ----- Prepare Sphere Geometry ----- //		
	geometry = new THREE.SphereBufferGeometry( 500, 60, 40 ).toNonIndexed();
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

	
	// ----- Set Texture ----- //
	sphereTexture = new THREE.TextureLoader().load( 'assets/img/panorama.jpg' );
	sphereTexture.format = THREE.RGBFormat;

	
	// ---- Setting SphereTexture & adding in Scene ---- //
	sphereMaterial = new THREE.MeshBasicMaterial( {map: rtTexture } );
		sphereMaterial.map.minFilter = THREE.LinearFilter;	
		sphereMaterial.map.format = THREE.RGBFormat;

	meshSphere = new THREE.Mesh( geometry, sphereMaterial );

	scene.add( meshSphere );
	
}

function createCombinedMaterial(){

	cameraRTT = new THREE.OrthographicCamera( -420, 420, 235, -235, -10000, 10000 );

	sceneRTT = new THREE.Scene();
	sceneScreen = new THREE.Scene();

	rtTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );

	var combinedSceens = new THREE.Object3D();
	
	var loaderF = new THREE.TextureLoader();
	loaderF.load('assets/img/fish1.jpg', function ( texture ) {
		texture.minFilter = THREE.LinearFilter;
		frontCamMesh = new THREE.Mesh(
				new THREE.CubeGeometry( 470, 425, 1 ),
				new THREE.MeshBasicMaterial( { 
				    map: texture,
				    side: THREE.DoubleSide
				})
		);
		frontCamMesh.rotateZ(Math.PI / 2);
		frontCamMesh.position.set(-210, 0, 0);
		combinedSceens.add( frontCamMesh );		
	});	

	var loaderB = new THREE.TextureLoader();
	loaderB.load('assets/img/fish2.jpg', function ( texture ) {
		texture.minFilter = THREE.LinearFilter;
		backCamMesh = new THREE.Mesh(
			new THREE.CubeGeometry( 470, 425, 1 ),
			new THREE.MeshBasicMaterial({ 
			    map: texture,
			    side: THREE.DoubleSide
			})
		);
		
		backCamMesh.rotateZ((Math.PI / 2) * 3);
		backCamMesh.position.set(210, 0, 0);
		combinedSceens.add( backCamMesh );	
	});
	
	sceneRTT.add( combinedSceens );
	
	// Preview Screen
//	var planelikeGeometry = new THREE.CubeGeometry( 8, 6, 0.1 );
//	var plane = new THREE.Mesh( planelikeGeometry, new THREE.MeshBasicMaterial( { map: rtTexture } ) );
//	plane.position.set(0,3,8);
//	plane.rotateY(Math.PI / 2);
//	scene.add(plane);

}

function setupInteractions(){

	
	// ----- User - Mouse Control ----- //
	if(isMobile){
		canvasScreen.addEventListener( 'touchstart', onDocumentTouchStart, false );
		canvasScreen.addEventListener( 'touchmove', onDocumentTouchMove, false );
	} else {
		canvasScreen.addEventListener( 'mousedown', onDocumentMouseDown, false );	
		canvasScreen.addEventListener( 'mousemove', onDocumentMouseMove, false );		
	}
	
	// ------ Touch Movement ------ //
	function onDocumentTouchStart( event ) {		
		if ( event.touches.length == 1 & isInteractive ) {
			event.preventDefault();
			onPointerDownPointerX = event.touches[ 0 ].pageX;
			onPointerDownPointerY = event.touches[ 0 ].pageY;
			onPointerDownLon = lon;
			onPointerDownLat = lat;
		}
		
		//if(videoElem.readyState){
		//	$('#placeholder').html("Please wait, video is starting...");			
		//	videoElem.play();
		//}
	}

	function onDocumentTouchMove( event ) {
		if ( event.touches.length == 1  & isInteractive ) {
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
	
}
