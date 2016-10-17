<!--- <cfparam name="url.scenefile" default="temp_scene.js"> --->
<script type="text/javascript">
	window.sceneID = '<cfoutput>#foo.sceneID#</cfoutput>';
</script>

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

	<!-- system DetectRTC -->
	<script src="assets/js/devices/audioVideo/DetectRTC.min.js"></script>

	<!-- ThreeJS -->
	<script src="assets/js/threejs/three.min.js" type="text/javascript"></script>
	<script src="assets/js/threejs/Detector.js" type="text/javascript"></script>
	<script src="assets/js/threejs/stats.min.js" type="text/javascript"></script>

	<cfoutput query="qrySceneResources">
		<script src="#qrySceneResources.uri#"></script>
	</cfoutput>

	<!-- JQUERY UI -->
	<script src="sensePlayer/js/jquery/external/jquery/jquery.js"></script>
	<script src="sensePlayer/js/jquery/jquery-ui.js"></script>

	<script src="sensePlayer/js/common.js" type="text/javascript"></script>

	<!-- WebSockets -->
	<script src="assets/js/cfwebsockets.js" type="text/javascript"></script>

	<!-- AUDIO/VIDEO -->
	<!--- <script src="sensePlayer/js/devices/audioVideo/adapter.js" type="text/javascript"></script>
	<script src="sensePlayer/js/devices/audioVideo/audioVideo.js" type="text/javascript"></script> --->

	<!-- MIDI -->
	<!--- <script src="sensePlayer/js/devices/midi/midi_controlers.js" type="text/javascript"></script> --->

	<!-- GAMEPAD -->
	<!--- <script src="sensePlayer/js/devices/gamepad/gamepad_setup.js" type="text/javascript"></script>
	<script src="sensePlayer/js/devices/gamepad/gamepad.min.js" type="text/javascript"></script> --->

	<!-- GEOLOCATION -->
	<!--- <script src="sensePlayer/js/devices/geolocation/geolocation.js" type="text/javascript"></script> --->

	<script type="text/javascript">

		var scope = this;

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

				var requestAnimId;
				var sceneResizer = 0;


				var canvasScreen = document.getElementById('canvasScreen');

				this.stats = false;

				this.default_renderer = new THREE.WebGLRenderer({
					canvas: canvasScreen, antialias: true
				});

				this.webSockets = function(msg){

					var pubMSG = {
						'message': msg,
						'sceneID': window.sceneID
					};

					ws.publish("chat", pubMSG);

				};

				// this.StereoEffect = new THREE.StereoEffect( this.default_renderer );
				// this.CardboardEffect = new THREE.CardboardEffect( this.default_renderer );
				// this.AnaglyphEffect = new THREE.AnaglyphEffect( this.default_renderer );
				// this.ParallaxBarrier = new THREE.ParallaxBarrierEffect( this.default_renderer );

				renderer = this.default_renderer;

				//var scene = new THREE.Scene();
				//this.camera = new THREE.PerspectiveCamera(45, window.threeWidth / window.threeHeight, 1, 10000 );
				//this.camera.position.z = 30;

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

				if(this.stats){
					document.getElementById("stats_display").appendChild(stats.domElement);
				}

				initElements(this);
				sceneParameters(this);
				showStickyBar(false);

				$( "#sceneAlerts" ).prepend('<div class="ui-widget">' +
						'<div class="ui-state-highlight ui-corner-all">' +
							'<p><span class="ui-icon ui-icon-info"></span>' +
							'<span id="status-message">Boom</span></p>' +
						'</div>' +
					'</div>');

				AdvancedSocket.statusLabel = document.getElementById('status-message');

				function animate(request) {

					if(request || request === undefined){

						if(this.stats){
							stats.update();
						}

						requestAnimId = requestAnimationFrame( animate );

			        	if(typeof this.render === "function"){
			        		this.render();
			        	}

					}

					if(request === false){

					   window.cancelAnimationFrame(requestAnimId);
					   requestId = undefined;

					}

				}

				function onOrientationChange(e) {
					parent.onOrientationChange();
					orientationUpdated(e);
				}

				function onWindowResize(e) {

					if(typeof this.onWindowResize === "function"){
		        		this.onWindowResize();
		        	}

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

			});

		});

		var wsMSG = {};

		function receiveMessage(objData){
			wsMSG = {};
			if(typeof objData.data === 'object'){
				if(objData.data.MESSAGE.EVENT != undefined){
					wsMSG.event = objData.data.MESSAGE.EVENT;
					wsMSG.sceneID = objData.data.INFO.SCENEID;
					wsMSG.userID = objData.data.INFO.clientid;
					if(typeof this.onWSusers === "function"){
						scope.onWSusers(wsMSG);
					}
				} else {
					if(typeof this.onWSreceive === "function"){
						wsMSG = objData.data.MESSAGE.message;
						wsMSG.sceneID = objData.data.INFO.SCENEID;
						wsMSG.userID = objData.data.INFO.clientid;
						scope.onWSreceive(wsMSG);
					}
				}
			}
		}

		function debugError(e){

			$( "#error-dialog" ).dialog('option', 'title', 'Error...');
			$( "#error-dialog" ).html(e);
			$( "#error-dialog" ).dialog( "open" );

			return false;
		}
	</script>

	<!--- <script src="assets/js/cfwebsockets.js" type="text/javascript"></script> --->

	</body>
</html>
