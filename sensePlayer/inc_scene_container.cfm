<!--- <cfparam name="url.scenefile" default="temp_scene.js"> --->

<!DOCTYPE html>
<html lang="en">
	<head>
		<title></title>

	    <meta charset="UTF-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <!-- Remove Tap Highlight on Windows Phone IE -->
	    <meta name="msapplication-tap-highlight" content="no"/>

		<meta name="mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-capable" content="yes">

		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

		<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no">

	    <link rel="icon" type="image/png" href="assets/img/favicon-16x16.png" sizes="16x16">
	    <link rel="icon" type="image/png" href="assets/img/favicon-32x32.png" sizes="32x32">

		<link href="sensePlayer/js/jquery/jquery-ui.css" rel="stylesheet">

		<link rel="stylesheet" href="sensePlayer/fonts/material-icons.css" media="all">

		<link rel="stylesheet" href="sensePlayer/css/main.css" media="all">

		<style type="text/css">



		</style>

	</head>
	<body>

	<div id="stats_display"></div>

	<canvas id="canvasScreen"></canvas>

	<div id="sceneAlerts"></div>

	<div id="sticky-toolbar">
		<i class="md-card-toolbar-btn material-icons uk-margin-small-right btn-fullscreen" id="btn-fullscreen" title="Toggle fullscreen">fullscreen</i>
		<i class="md-card-toolbar-btn material-icons uk-margin-small-right btn-vr" id="btn-vr" title="VR Mode">surround_sound</i>
		<i class="md-card-toolbar-btn material-icons uk-margin-small-right btn-3d-rotation" id="btn-3d-rotation" title="Touch Mode">touch_app</i>
		<i class="md-card-toolbar-btn material-icons uk-margin-small-right btn-scr-settings" id="btn-scr-settings" title="Settings">settings</i>
	</div>

	<div id="VR-menu" title="View Mode">
		<img src="sensePlayer/img/Cardboard.png" id="cardboard_img" title="Google Cardboard">
		<img src="sensePlayer/img/anaglyph.png" id="anaglyph_img" title="Anaglyph CYAN/RED">
		<img src="sensePlayer/img/3DTV.png" id="parallax_img" title="Parallax Barrier">
		<img src="sensePlayer/img/default.png" id="default_img" class="selectedVR" title="Normal Viewing">
	</div>

	<div id="dropMenu" title="Selection">
		<span id="dropAlert"></span>
		<h4 class="dropTitle">Midi In:</h4>
		<select id="DropDown1" class="dropSelect"></select>
		<h4 class="dropTitle">Midi Out:</h4>
		<select id="DropDown2" class="dropSelect"></select>

	</div>

	<div id="error-dialog" title=""></div>



<!---
	<div id="sceneErrors">
	</div>
 --->

	<script src="assets/js/stacktrace/stacktrace.js"></script>

	<!-- ThreeJS -->
	<script src="assets/js/devices/audioVideo/DetectRTC.min.js"></script>
	<script src="assets/js/threejs/three.min.js" type="text/javascript"></script>
	<script src="assets/js/threejs/Detector.js" type="text/javascript"></script>
	<script src="assets/js/threejs/stats.min.js" type="text/javascript"></script>
	<script src="assets/js/threejs/Mirror.js" type="text/javascript"></script>
	<script src="assets/js/threejs/WaterShader.js" type="text/javascript"></script>
	<script src="assets/js/threejs/effects/CardboardEffect.js" type="text/javascript"></script>
	<script src="assets/js/threejs/effects/StereoEffect.js" type="text/javascript"></script>
	<script src="assets/js/threejs/effects/AnaglyphEffect.js" type="text/javascript"></script>
	<script src="assets/js/threejs/effects/ParallaxBarrierEffect.js" type="text/javascript"></script>

	<script src="assets/js/threejs/libs/dat.gui.min.js" type="text/javascript"></script>
	<script src="assets/js/threejs/utils/GeometryUtils.js" type="text/javascript"></script>

	<script src="assets/js/threejs/controls/DeviceOrientationControls.js"></script>

	<script src="assets/js/threejs/iphone-inline-video.browser.js"></script>
	<script src="assets/js/threejs/crossfade/scenes_tools.js" type="text/javascript"></script>
	<script src="assets/js/threejs/crossfade/transition.js" type="text/javascript"></script>

	<!-- JQUERY UI -->
	<script src="sensePlayer/js/jquery/external/jquery/jquery.js"></script>
	<script src="sensePlayer/js/jquery/jquery-ui.js"></script>

	<script src="sensePlayer/js/common.js" type="text/javascript"></script>

	<!-- AUDIO/VIDEO -->
	<script src="sensePlayer/js/devices/audioVideo/adapter.js" type="text/javascript"></script>
	<script src="sensePlayer/js/devices/audioVideo/audioVideo.js" type="text/javascript"></script>

	<!-- MIDI -->
	<script src="sensePlayer/js/devices/midi/midi_controlers.js" type="text/javascript"></script>

	<!-- GAMEPAD -->
	<script src="sensePlayer/js/devices/gamepad/gamepad_setup.js" type="text/javascript"></script>
	<script src="sensePlayer/js/devices/gamepad/gamepad.min.js" type="text/javascript"></script>

	<!-- GEOLOCATION -->
	<script src="sensePlayer/js/devices/geolocation/geolocation.js" type="text/javascript"></script>

	<script type="text/javascript">

		document.addEventListener('DOMContentLoaded', function() {

			var stickyBar = document.getElementById("sticky-toolbar");

			DetectRTC.load(function(){

				DetectRTC.isIphone = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );

				system = DetectRTC;

				waitForMouseStop(function(e){
					showStickyBar(false);
				}, function(){
					showStickyBar(true);
				});

				// Stats Element
				var stats = new Stats();
				stats.domElement.style.position = 'relative';
				stats.domElement.style.backgroundColor = "white";
				document.getElementById("stats_display").appendChild(stats.domElement);

				var sceneResizer = 0;
				var scope = this;

				var canvasScreen = document.getElementById('canvasScreen');

				this.default_renderer = new THREE.WebGLRenderer({
					canvas: canvasScreen, antialias: true
				});

				this.StereoEffect = new THREE.StereoEffect( this.default_renderer );
				this.CardboardEffect = new THREE.CardboardEffect( this.default_renderer );
				this.AnaglyphEffect = new THREE.AnaglyphEffect( this.default_renderer );
				this.ParallaxBarrier = new THREE.ParallaxBarrierEffect( this.default_renderer );

				renderer = this.default_renderer;

				var scene = new THREE.Scene();
				this.camera = new THREE.PerspectiveCamera(45, window.threeWidth / window.threeHeight, 1, 10000 );
				this.camera.position.z = 30;

				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				window.addEventListener('orientationchange', onOrientationChange, false);
				window.addEventListener( 'resize', onWindowResize, false );

				try {
					<!--- <cfinclude template="../assets/js/scenes/#url.scenefile#"> --->
					<cfoutput>#qryScene.code#</cfoutput>
				} catch (e) {
					debugError(e);
				}

				initElements(this);
				sceneParameters(this);
				showStickyBar(false);

				animate();

				function animate() {
					stats.update();

					requestAnimationFrame( animate );

		        	if(typeof this.render === "function"){
		        		this.render();
		        	}

					renderer.render( scene, camera );

				}

				function onOrientationChange(e) {
					parent.onOrientationChange();
					orientationUpdated(e);
				}

				function onWindowResize(e) {

					var pageWidth = window.innerWidth;
					var pageHeight = window.innerHeight;

					camera.aspect = pageWidth / pageHeight;
					camera.updateProjectionMatrix();
					renderer.setSize( pageWidth, pageHeight );

					screenUpdated(e);

				}

				function showStickyBar(status){
					if(status){
						if(system.isMobileDevice){ stickyBar.style.display = "block";
						} else { stickyBar.style.opacity = "1"; }
					} else {
						if(system.isMobileDevice){ stickyBar.style.display = "none";
						} else { stickyBar.style.opacity = "0"; }
					}
				}

<!--- 				var testName = '<cfoutput>#qryScene.name#</cfoutput>';
				alert(testName); --->

			});

		});

		function debugError(e){

			$( "#error-dialog" ).dialog('option', 'title', 'Error...');
			$( "#error-dialog" ).html(e);
			$( "#error-dialog" ).dialog( "open" );

			return false;
		}
	</script>

	</body>
</html>
