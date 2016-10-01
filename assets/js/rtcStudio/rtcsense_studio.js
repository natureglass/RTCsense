RTCstudio = function(sections){

	var rtcstudio = this;	
	
	// *** Global Variables *** //
	this.global = {
		selectedPreview: '',
		selectedVideoFilter: '',
		selectedAudioFilter: '',
		selectedHID: '',
		fx_canvas: []	
	}
	
	/*

	// *** DetectRTC extended *** //
    DetectRTC.load(function() {

		DetectRTCextendedOptions();
		
		rtcstudio.DetectRTC = DetectRTC;		
	
		// *** GAMEPAD *** //
		if(DetectRTC.isGamepadSupported){
			rtcstudio.gamepad = new Gamepad();
			gamepadSetup(rtcstudio);
		}
		
		// *** SERIAL / RS232 *** //
		if((DetectRTC.browser.name == 'Firefox' || DetectRTC.browser.name == 'Chrome') & !DetectRTC.isMobileDevice){
			rtcstudio.serialConnector = new SerialConnector(rtcstudio);
			rtcstudio.serialConnector.init();
		}
		
		// *** MIDI *** //
		if(DetectRTC.isMIDIsupported){
			rtcstudio.midi = new Midi(rtcstudio);
			rtcstudio.midi.init();
		}

		// *** Screen Share *** //
		if((DetectRTC.browser.name == 'Firefox' || DetectRTC.browser.name == 'Chrome') & !DetectRTC.isMobileDevice){
			rtcstudio.screenShare = new ScreenShare(rtcstudio);
			rtcstudio.screenShare.init();
		}

		// *** Audio & Video *** //
		if(DetectRTC.isGetUserMediaSupported){
			//rtcstudio.audioVideo = new AudioVideo(rtcstudio);	
			//rtcstudio.audioVideo.init();			
		}
		
		// *** SENSORS *** //
		rtcstudio.sensors = new Sensors(rtcstudio);
		rtcstudio.sensors.init();
		
	});

	 */
	
	// **************** ENVIROMENT ***************** //

	this.ThreeJS = {

		isFullScreen: false,
		isSandBoxActive: false,
		scenes: [],
		mousePos: { Lstate: 0, Rstate: 0, x: 0, y: 0 },

		initThreeJS: // *** Initialize ThreeJS *** //

			function(canvasID, poster){

				this.threeJS_canvas = document.getElementById(canvasID);
				
				this.transition;
				this.clock = new THREE.Clock();
				
				this.transitionParams = {
					"useTexture": true,
					"transition": 0,
					"transitionSpeed": 0.009,
					"texture": 1,
					"loopTexture": true,
					"animateTransition": true,
					"textureThreshold": 0.3
				};
		
				// Set to window Threejs params
				window.threeWidth = this.threeJS_canvas.width;
				window.threeHeight = this.threeJS_canvas.height;
				window.threeJS_canvas = this.threeJS_canvas;
		
				// Create Scene Renderer
				renderer = new THREE.WebGLRenderer({ canvas: this.threeJS_canvas, antialias: true });
		        
				// Stats Element
				this.stats = new Stats();
				this.stats.domElement.style.position = 'relative';
				this.stats.domElement.style.backgroundColor = "white";		
				document.getElementById("stats_display").appendChild(this.stats.domElement); 
				this.animateThree();
		
				this.setScenes();
				
				if(typeof poster != "undefined"){
					this.setPoster(poster);
				}
				
				this.onWindowResize();
				window.addEventListener( 'resize', this.onWindowResize, false );
				window.addEventListener('resize', UIkit.Utils.debounce(this.reCheckSticky, 200));
			},

		onWindowResize:  // *** Responsive canvas & Keep Aspect Ratio *** //
			
			function(){

				if(!rtcStudio.ThreeJS.isFullScreen){
							
					var aspectRatio = 16 / 9;
					var cnvWidth = Math.round(window.innerHeight * aspectRatio);
					var cnvHeight = Math.round(window.innerWidth / aspectRatio);
	
					for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){
						var thisScene = rtcstudio.ThreeJS.scenes[i];
					    thisScene.camera.aspect = window.innerWidth / cnvHeight;
					    thisScene.camera.updateProjectionMatrix();
					}
		
				    renderer.setSize( window.innerWidth, cnvHeight );
				    
				} else {

			    	for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){
						var thisScene = rtcstudio.ThreeJS.scenes[i];
					    thisScene.camera.aspect = window.innerWidth / window.innerHeight;
					    thisScene.camera.updateProjectionMatrix();
					}
			    	
			    	renderer.setSize( window.innerWidth, window.innerHeight );
					
				}
			},
			
		reCheckSticky:
			
			function () {
			
		        $.each($('.uk-sticky-placeholder'), function(index, val) {
		            var $instance = $(val);

		            $instance.css('height', $instance.children().outerHeight());
		        });
		        
		    },
		    
		animateThree: // *** Main Loop of ThreeJS *** //

			function(){
			
				this.updateTempCanvas();
				this.updateVisualizer();
				this.updateDevices();
				
				requestAnimationFrame(this.animateThree.bind(this));
				
				if(this.transition != null){
					this.transition.render( this.clock.getDelta() );
				}
				
				this.stats.update();
				
			},

		updateTempCanvas: // *** Updating FX canvas *** //

			function(){
			
				for (i = 0; i < rtcStudio.global.fx_canvas.length; i++){
					if(rtcStudio.global.fx_canvas[i].video.ready){
						rtcStudio.global.fx_canvas[i].video.texture.loadContentsOf(rtcStudio.global.fx_canvas[i].mediaElem);
				        rtcStudio.global.fx_canvas[i].video.canvas.draw(rtcStudio.global.fx_canvas[i].video.texture);		        
				        if(rtcStudio.global.fx_canvas[i].video.filter.length){		        	
				        	var selectedFilters = '';
				        	for (f = 0; f < rtcStudio.global.fx_canvas[i].video.filter.length; f++){
				        		
				        		this.updateFilterNub(rtcStudio.global.fx_canvas[i].video.filter[f].filter);
				        		
				        		selectedFilters += "." + rtcStudio.global.fx_canvas[i].video.filter[f].code;
				        		
				        	}
				        	$('#headerText').html(selectedFilters);
				        	eval('rtcStudio.global.fx_canvas[' + i + '].video.canvas' + selectedFilters);
				        }
				        rtcStudio.global.fx_canvas[i].video.canvas.update();
				        
					}
				}
			},

		updateVisualizer: // *** Updating Audio Visualizer *** //

			function(){
			
				for (i = 0; i < rtcStudio.global.fx_canvas.length; i++){
					if(rtcStudio.global.fx_canvas[i].gotVisualizer){
						var analyserView = rtcStudio.global.fx_canvas[i].video.visualizer.analyserView;
						var analyser = rtcStudio.global.fx_canvas[i].video.visualizer.analyser;
						analyserView.doFrequencyAnalysis( analyser );
					}
				}
			},

		updateFilterNub: // *** Updating Filter Nubs in Scenes *** //

			function(filter){
			
				if(this.mousePos.Rstate === 1){					
					if(filter.name == rtcStudio.audioVideo.selectedVideoFilter & filter.nubs.length){
						filter.center.x = this.mousePos.x;
						filter.center.y = this.mousePos.y;
						filter.nubs[0].x = this.mousePos.x;
						filter.nubs[0].y = this.mousePos.y;
						filter.update();
					}
				}
			},

		setPoster: // *** Updating Canvas Poster in Scenes *** //
			
			function(imgURL){
			
				for (i = 0; i < this.scenes.length; i++){
					var thisScene = this.scenes[i];
					var exists = (typeof thisScene.onUpatePoster === 'function') ? true : false;
					if (exists){ this.scenes[i].onUpatePoster(imgURL); }
				}
			},

		setScenes: // *** Settings Scenes in CrossFader *** //
			
			function(){
			
				// Scenes
				//var sceneB = new Scene_Text(RTCstudio);
				//var sceneA = new Scene_Ocean();
			
				var sceneB = new Scene_Inputs(rtcstudio.DetectRTC);
				var sceneA = new Scene_dualFisheye(rtcstudio.DetectRTC); //Scene_Flat();
				
				this.scenes = [sceneA, sceneB];
				
				// Transition Set
				this.transition = new Transition(this.scenes, this.transitionParams);
				
				// --- Build Scenes Tools --- //
				buildSceneToolBars(this.scenes, this.transition, sections.sceenTools);
				
			},

		
		updateDevices: // *** Update Devices *** //
			
			function(){
				/*
				if(DetectRTC.isDeviceMotionSupported){
					if(typeof rtcstudio.sensors.updateInterval === 'function'){
						rtcstudio.sensors.updateInterval();
					}
				}
				*/
			}
					
	};

	// *** Initialize rtcStudio *** //
	this.init = function(){
	    DetectRTC.load(function() {
	        reloadDetectRTC();
	        if(DetectRTC.MediaDevices[0] && DetectRTC.MediaDevices[0].label === 'Please invoke getUserMedia once.') {
	            navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(reloadDetectRTC).catch(reloadDetectRTC);
	            return;
	        }
	    });
	}	

    function reloadDetectRTC() {
        DetectRTC.load(function(){
        	if(DetectRTC.MediaDevices[0].label !== 'Please invoke getUserMedia once.') {        		
        		onDetectRTCLoaded();
        	}
        });
    }

    function onDetectRTCLoaded(){
	
    	DetectRTCextendedOptions();
    	
    	rtcstudio.DetectRTC = DetectRTC;
		
		// *** Extended DetectRTC options *** //
		DetectRTCextendedOptions();			
		
		// *** Initialize TheeJS *** //
		rtcstudio.ThreeJS.initThreeJS(sections.mainScreen, sections.posterImage);
		
		// *** Sensors *** //
		initSensors(sections);
		
		// *** Actions *** //
		initActions(sections);		

		// *** Accordion INIT *** //
		UIkit.accordion($('.deviceList .uk-accordion'), {showfirst: false, collapse: true}).update();
    	
    }
    
    function initSensors(){
    	
    	// *** Extension Checker *** //
    	//rtcstudio.extensions = new ExtensionsGuard(rtcstudio);
    	//rtcstudio.extensions.init();

		// *** Audio & Video *** //
		if(DetectRTC.isGetUserMediaSupported){
			rtcstudio.audioVideo = new AudioVideo(rtcstudio);	
			rtcstudio.audioVideo.init();			
		}
		
    }

};
