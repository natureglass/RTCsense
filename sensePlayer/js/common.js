// VR Dialog Menu
$( "#error-dialog" ).dialog({
	autoOpen: false,
	resizable: false,
	width: '280px',
	height: 'auto',
	show: { effect: "fade", duration: 200 },
    create: function() {
        $(this).closest('div.ui-dialog')
               .find('.ui-dialog-titlebar-close')
               .click(function(e) {
            	   $( this ).dialog( "close" );
                   e.preventDefault();
               });	
	},		
	buttons: [
		{
			text: "Close",
			click: function() {
				$( this ).dialog( "close" );
			}
		}
	]
});

var popVR = false, popDropDialog = false;

function waitForMouseStop(stopCallback, movingCallbak) {
    var timer;
    function moveMoveHandler(evt) {
    	movingCallbak();		
        evt = evt || window.event;
        if (timer) { window.clearTimeout(timer); }
        timer = window.setTimeout(function() {
            stopCallback();
			window.clearTimeout(timer);
        }, 2000);
    }
    
    document.onmousemove = moveMoveHandler;
    document.onmouseout = stopCallback;
    document.ontouchstart = doubletap;
}

var mylatesttap, stickyVisible = true, stickyBar = document.getElementById("sticky-toolbar");
stickyBar.onmousemove = function(e){ e.preventDefault(); }

function doubletap(e) {
	var now = new Date().getTime();
	var timesince = now - mylatesttap;
	if((timesince < 300) && (timesince > 0)){
		if(system.isMobileDevice){ stickyBar.style.display = "block";
		} else { stickyBar.style.opacity = "1"; }
	}
	mylatesttap = new Date().getTime();
}
	
function sceneParameters(scope){
	
	var VR_effect = false, sControl = true, isActiveFullScreen = false,
		centerMenu = document.getElementById('centerMenu'),
		VR_elem = document.getElementById('btn-vr'),
		RotBtn = document.getElementById('btn-3d-rotation');
	
	var fullscreenBtn = document.getElementById('btn-fullscreen');
	fullscreenBtn.addEventListener( 'click', toggleFullScreen, false );
	
	//var closeBtn = document.getElementById('closeBtn');
	//closeBtn.addEventListener( 'click', closePopVR, false );
		
	var cardboard_img = document.getElementById('cardboard_img');
	cardboard_img.addEventListener( 'click', setVRFX, false );
	
	var anaglyph_img = document.getElementById('anaglyph_img');
	anaglyph_img.addEventListener( 'click', setVRFX, false );
	
	var parallax_img = document.getElementById('parallax_img');
	parallax_img.addEventListener( 'click', setVRFX, false );
	
	var default_img = document.getElementById('default_img');
	default_img.addEventListener( 'click', setVRFX, false );	
	
	sceneParam = scope.parameters;
	
    if(sceneParam){
		for (params in sceneParam) {
						
			var varValue = sceneParam[params], displayRotBtn = false;
			
			// ** Render Effect Button ** //
			
			if(params === "effectVR"){

				var vrFX = 0, oneEffect, stereo = false,
					cardboard = false, anaglyph = false, parallax = true;

				if(sceneParam.effectVR.StereoEffect){ vrFX++; stereo = true; }
				if(sceneParam.effectVR.CardboardEffect){ vrFX++; cardboard = true; }
				if(sceneParam.effectVR.AnaglyphEffect){ vrFX++; anaglyph = true; }
				if(sceneParam.effectVR.ParallaxBarrier){ vrFX++; parallax = true; }

				if(vrFX > 0) {
										
					VR_elem.style.display = 'block';

					VR_elem.addEventListener('click', function() {
						if(popVR){
							$( "#VR-menu" ).dialog( "close" );
							popVR = false;							
						} else {
							$( "#VR-menu" ).dialog( "open" );
							popVR = true;
						}
						
						// If only One effect
						if(vrFX === 1 & VR_effect){
							renderer = default_renderer;
							VR_effect = false;
						} else if(vrFX === 1 & !VR_effect){
							if(stereo){ renderer = StereoEffect;
							} else if(cardboard){ renderer = CardboardEffect;
							} else if(anaglyph){ renderer = AnaglyphEffect;
							} else if(parallax){ renderer = ParallaxBarrier; }
							VR_effect = true;
						}
					}, false );
				}

			}			
			
			// ** Sensor Control ToolBar Button ** //
			
			if(params === "sensorControl"){
				if(sceneParam[params]){
					
					var controlStatus = sceneParam[params];
					
					displayRotBtn = true;
					
					if(sceneParam[params].init){
						sControl = true;
						RotBtn.innerHTML = "touch_app";
					} else {
						sControl = false;
						RotBtn.innerHTML = "3d_rotation";
					}
					
					if(sceneParam[params].showMobileOnly){
						if(system.isMobileDevice){
							displayRotBtn = true;
						} else {
							displayRotBtn = false;
						}
					}
					
					if(displayRotBtn){

						RotBtn.style.display = 'block';

						RotBtn.addEventListener( 'click', function(){
								
							if(sControl){
								sControl = false;
								RotBtn.innerHTML = "3d_rotation";
							} else { 
								sControl = true;
								RotBtn.innerHTML = "touch_app";
							}

							controlStatus.onClick(sControl);
							
						}, false );						
					} else {
						RotBtn.style.display = 'none';
					}
				}
			}
			
			if(params == "mediaDevice"){
				var mediaOptions = varValue;
				if(mediaOptions){
					if(mediaOptions.inputs.length){
						var uiState = mediaOptions.optional ? "ui-state-highlight" : "ui-state-error";
						var uiIcon = mediaOptions.optional ? "ui-icon-info" : "ui-icon-alert";
						$( "#sceneAlerts" ).prepend('<div class="ui-widget">' +
								'<div class="' + uiState + ' ui-corner-all alert-CamReq">' +
									'<p><span class="ui-icon ' + uiIcon + '"></span>' +
									'You have <span id="camReq">' + mediaOptions.inputs.length + '</span> Camera Request!</p>' +
								'</div>' +
							'</div>');
						$('.alert-CamReq').click(function(){
							initCameras(mediaOptions);
						});
					}
					
					if(mediaOptions.autoInit){
						initCameras(mediaOptions);
					}
				}
			}

			if(params == "midiDevice"){
				var midiOptions = varValue;
				if(midiOptions){
					var uiState = midiOptions.optional ? "ui-state-highlight" : "ui-state-error";
					var uiIcon = midiOptions.optional ? "ui-icon-info" : "ui-icon-alert";
					$( "#sceneAlerts" ).prepend('<div class="ui-widget">' +
							'<div class="' + uiState + ' ui-corner-all alert-MidiReq">' +
								'<p><span class="ui-icon ' + uiIcon + '"></span>' +
								'You have <span id="midiReq">' + midiOptions.inputs.length + '</span> Midi Device Request!</p>' +
							'</div>' +
						'</div>');
					$('.alert-MidiReq').click(function(){
						initMidi(midiOptions);
					});
					
					if(midiOptions.autoInit){
						initMidi(midiOptions);
					}
				}
			}

			if(params == "gamepad"){
				var gamepadOptions = varValue;
				if(gamepadOptions){
					var uiState = gamepadOptions.optional ? "ui-state-highlight" : "ui-state-error";
					var uiIcon = gamepadOptions.optional ? "ui-icon-info" : "ui-icon-alert";
					$( "#sceneAlerts" ).prepend('<div class="ui-widget">' +
							'<div class="' + uiState + ' ui-corner-all alert-GamepadReq">' +
								'<p><span class="ui-icon ' + uiIcon + '"></span>' +
								'You have <span id="gamepadReq">' + gamepadOptions.inputs.length + '</span> Gamepad Request!</p>' +
							'</div>' +
						'</div>');
					$('.alert-GamepadReq').click(function(){
						initGamepad(gamepadOptions);
					});
					
					if(gamepadOptions.autoInit){
						initGamepad(gamepadOptions);
					}
				}
			}			

			if(params == "geolocation"){
				var gpsOptions = varValue;
				if(gpsOptions){
					var uiState = gpsOptions.optional ? "ui-state-highlight" : "ui-state-error";
					var uiIcon = gpsOptions.optional ? "ui-icon-info" : "ui-icon-alert";
					$( "#sceneAlerts" ).prepend('<div class="ui-widget">' +
							'<div class="' + uiState + ' ui-corner-all alert-GpsReq">' +
								'<p><span class="ui-icon ' + uiIcon + '"></span>' +
								'You have 1 Geolocation Request!</p>' +
							'</div>' +
						'</div>');
					$('.alert-GpsReq').click(function(){
						initGeolocation(gpsOptions);
					});
					
					if(gpsOptions.autoInit){
						initGeolocation(gpsOptions);
					}
				}
			}
			
			console.log(params);
			
		}
		
    }    
	    
	function setVRFX(){
		cardboard_img.className = ""; anaglyph_img.className = ""; parallax_img.className = ""; default_img.className = "";
		var imgID = this.id, effect = imgID.substring(0, imgID.length - 4);
	
		if(effect === 'cardboard'){ renderer = CardboardEffect;
		} else if(effect === 'anaglyph'){ renderer = AnaglyphEffect;
		} else if(effect === 'parallax'){ renderer = ParallaxBarrier;
		} else if(effect === 'default') { renderer = default_renderer; }
		this.className = "selectedVR";
	
		VR_effect = true;
	}

	function toggleFullScreen() {

		// iOS iframe auto-resize workaround
		if(scope.system.isIphone){
			
			if(isActiveFullScreen){
				isActiveFullScreen = false;
				parent.toggleFullScreen(false);			
			} else {
				isActiveFullScreen = true;
				parent.toggleFullScreen(true);
			}
			
		} else {			
		
			var doc = window.document;
			var docEl = doc.documentElement;
			
			var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
			var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
			
			if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
				requestFullScreen.call(docEl);
			} else {
				cancelFullScreen.call(doc);
			}

		}

		
	}

	function initCameras(options){
		if(scope.system.isIphone){
			$( "#error-dialog" ).dialog('option', 'title', 'Sorry...');
			$( "#error-dialog" ).html("Camera is not supported on this iOS device! The app may not work as expected...");
			$( "#error-dialog" ).dialog( "open" );
			$('.alert-CamReq').remove();
		} else {
			if(!$('#dropMenu').dialog('isOpen')){
				if(!scope.audioVideo){
					scope.audioVideo = new AudioVideo(scope);
					scope.audioVideo.reqMedia = options.inputs;
				}
				scope.audioVideo.options = options;
				scope.audioVideo.init();
			}
		}
	}
	
	function initMidi(options){
		if(scope.system.isIphone || navigator.requestMIDIAccess === undefined){
			$( "#error-dialog" ).dialog('option', 'title', 'Sorry...');
			$( "#error-dialog" ).html("WebMIDI API is not supported on this Browser, please try with Chrome! The app may not work as expected...");
			$( "#error-dialog" ).dialog( "open" );
			$('.alert-MidiReq').remove();
		} else {
			if(!$('#dropMenu').dialog('isOpen')){
				if(!scope.midiDevice){
					scope.midiDevice = new Midi(scope);
					scope.midiDevice.reqMidi = options.inputs;
				}
				scope.midiDevice.options = options;
				scope.midiDevice.init();
			}
		}
	}

	function initGamepad(options){
		var gamePadSupport = navigator.getGamepads ? true : false || navigator.webkitGamepads ? true : false || navigator.webkitGetGamepads ? true : false;
		if(!gamePadSupport){
			$( "#error-dialog" ).dialog('option', 'title', 'Sorry...');
			$( "#error-dialog" ).html("Your browser does not support gamepads, get the latest Google Chrome or Firefox and try again...");
			$( "#error-dialog" ).dialog( "open" );
			$('.alert-GamepadReq').remove();
		} else {
			if(!$('#dropMenu').dialog('isOpen')){
				if(!scope.gamepad){					
					scope.gamepad = new GamepadDevice(scope);					
					scope.gamepad.reqPads = options.inputs;
				}
				scope.gamepad.options = options;
				scope.gamepad.init();
			}
		}
	}
	
	function initGeolocation(options){
		var geolocation = navigator.geolocation ? true : false;
		if(!geolocation){
			$( "#error-dialog" ).dialog('option', 'title', 'Sorry...');
			$( "#error-dialog" ).html("Your browser does not support Geolocation, The app may not work as expected...");
			$( "#error-dialog" ).dialog( "open" );
			$('.alert-GpsReq').remove();
		} else {
			if(!$('#dropMenu').dialog('isOpen')){
				if(!scope.geolocation){
					scope.geolocation = new Geolocation(scope);
				}
				scope.geolocation.options = options;
				scope.geolocation.init();				
			}
		}
	}
	
}

function openSelectDialog(title, skipBtn){

	if(skipBtn){ $('#dropBtnCancel').show();
	} else { $('#dropBtnCancel').hide(); }
	
	$( "#dropMenu" ).dialog('option', 'title', title);
	$( "#dropMenu" ).dialog( "open" );
	popDropDialog = true;
	$( "#dropMenu" ).dialog( "open" );
	
}

function screenUpdated(e) {
	$( "#VR-menu, #dropMenu, #error-dialog" ).dialog( "option", "position", { my: "center", at: "center", of: window } );
}

function initElements(scope){
	$('.ui-dialog-titlebar-close').click(function(){
		closeVRdialog();	
	});
	
	// VR Dialog Menu
	$( "#VR-menu" ).dialog({
		autoOpen: false,
		resizable: false,
		width: '280px',
		show: { effect: "fade", duration: 200 },
	    create: function() {
	        $(this).closest('div.ui-dialog')
	               .find('.ui-dialog-titlebar-close')
	               .click(function(e) {
	            	   closeVRdialog();
	                   e.preventDefault();
	               });	
		},		
		buttons: [
			{
				text: "Close",
				click: function() {
					closeVRdialog();
				}
			}
		]
	});

	// VR Dialog Menu
	$( "#dropMenu" ).dialog({
		autoOpen: false,
		resizable: false,
		width: '280px',
		height: 'auto',
		show: { effect: "fade", duration: 200 },
	    create: function() {
	        $(this).closest('div.ui-dialog')
	               .find('.ui-dialog-titlebar-close')
	               .click(function(e) {
	            	   closeDropDialog();
	                   e.preventDefault();
	               });	
		},		
		buttons: [
		    {
				id: "dropBtnCancel",
				text: "Skip",				
				click: function() {
					closeDropDialog();
					var type = $( "#DropDown1 option:selected" ).data('type');
					switch (type) {
						case 'midi':
							scope.midiDevice.nextReq();
							break;
						case 'media':
							scope.audioVideo.nextReq();
							break;
						case 'gamepad':
							scope.gamepad.nextReq();
							console.log("SS");
							break;
					}
				}
		    },
			{
				id: "dropBtnStart",
				text: "Start",				
				click: function() {
					
					if($("#DropDown1 option:selected" ).val()){
						closeDropDialog();
						
						var type = $( "#DropDown1 option:selected" ).data('type');
						switch (type) {
						    case 'midi':
						        console.log("MIDI!");
						        var midiSelection = {
						        	inName: $( "#DropDown1 option:selected" ).text(),
						        	inID: $( "#DropDown1 option:selected" ).val(),
						        	outName: $( "#DropDown2 option:selected" ).text(),
						        	outID: $( "#DropDown2 option:selected" ).val()
						        }
								scope.midiDevice.startMidi(midiSelection);					        
						        break;
						        
						    case 'media':
						    	console.log("MEDIA!");
								var selName = $( "#DropDown1 option:selected" ).text();					
								var selId = $( "#DropDown1 option:selected" ).val();
								scope.audioVideo.startMedia(selName, selId);
						        break;
						    case 'gamepad':
						    	console.log("GAMEPAD!");
						    	var gamepadSelection = {
						    		selName : $( "#DropDown1 option:selected" ).text(),					
						    		selId : $( "#DropDown1 option:selected" ).val()
						    	}
								scope.gamepad.startGamePad(gamepadSelection);
						        break;
						}
					}
				}
			}
		]
	});

    $( "#DropDown1" ).selectmenu();
    $( "#DropDown2" ).selectmenu();
    $( "#DropDown3" ).selectmenu();
    
}

function closeVRdialog(){
	popVR = false;
	$( "#VR-menu" ).dialog( "close" );
}

function closeDropDialog(){
	popDropDialog = false;
	$( "#dropMenu" ).dialog( "close" );
}
	
// --- Sorting Media Error --- //
function sortError(err){
	
	if (err.name === 'ConstraintNotSatisfiedError') {
		return 'The resolution ' + constraints.video.width.exact + 'x' +
			constraints.video.width.exact + ' px is not supported by your device.';
	} else if (err.name === 'PermissionDeniedError') {
		return 'Permissions have not been granted to use your camera and ' +
			'microphone, you need to allow the page access to your devices.';
	} else {
		return err;
	}
	
}