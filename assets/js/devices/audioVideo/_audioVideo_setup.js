AudioVideo = function(rtcstudio){

	var gotVideo = '', gotAudio = '';

	this.fx_canvas = [];
	this.selectedVideoFilter = '';
	this.selectedAudioFilter = '';
	
	this.init = function(){
		rtcstudio.audioVideo.appendInStudio();
		rtcstudio.audioVideo.invokeDevices();
	}
	
	this.appendInStudio = function() {

		var html =	'<h3 class="uk-accordion-title mediaTitle">Audio / Video Devices <span class="audioVideoNum uk-badge uk-badge-notification uk-margin-left">0</span></h3>' +
				    '<div class="uk-accordion-content deviceDropDown">' +
			
					    '<div class="uk-width-medium-1-1 uk-width-large-1-1">' +
							'<select id="audioInDevices" data-md-selectize>' +
								'<option value="">Select...</option>' +
					        '</select>' +
					        '<span class="uk-form-help-block">Audio Input Device</span>' +
					    '</div>' +
			
					    '<div class="uk-width-medium-1-1 uk-width-large-1-1">' +
							'<select id="videoInDevices" data-md-selectize>' +
								'<option value="">Select...</option>' +
					        '</select>' +
					        '<span class="uk-form-help-block">Video Input Device</span>' +
					    '</div>' +
			
			            '<div class="uk-grid" data-uk-grid-margin>' +
			
			                '<div class="uk-width-medium-6-10 mediaStatus">' +
			                    '<span class="md-color-blue-900">checking...</span>' +
							'</div>' +
			
							'<div class="uk-width-medium-4-10">' +
								'<a class="md-btn md-btn-primary md-btn-small md-btn-wave-light waves-effect waves-button waves-light uk-float-right " onClick="addMediaDevice();">Start Device</a>' +
							'</div>' +
			
						'</div>' +
			
				    '</div>';

		$('.deviceList .uk-accordion').append(html);
		$('#midiInDevices').selectize();

	}
	
	// --- Enumerate Devices --- //
	this.enumerateDevices = function(callback, error, invokegetUserMedia, localStream){
		
		$('.mediaTitle').removeClass('uk-accordion-title-warning').addClass('uk-accordion-title-warning');
		$('.mediaStatus').html('<span class="md-color-red-500">Please allow to share WebCam & Microphone for devices detection!</span');
		
		if(invokegetUserMedia){
			
			this.initMediaDevice('','',function(devices, gotLabels, stream){
				
				if(typeof callback === "function") {
					callback(devices, gotLabels);
				}

				if(typeof localStream === "function") {
					localStream(stream);
				} else {
					for (i = 0; i < stream.getAudioTracks().length; i++) {
						stream.getAudioTracks()[i].stop();
					}
					
					for (i = 0; i < stream.getVideoTracks().length; i++) {
						stream.getVideoTracks()[i].stop();
					}				
				}
				
			}, function(err){		
				if(typeof error === "function") {
					error(err);
				}
			});		
			
		} else {
		
			// -- Call to get a List of Devices -- //
			rtcstudio.audioVideo.getMediaDevices(function(devices, gotLabels){
				if(typeof callback === "function") {
					callback(devices, gotLabels); }		
			}, function(err){		
				if(typeof error === "function") { error(err); }		
			});
			
		}
	}

	// --- Get List of Devices --- //
	this.getMediaDevices = function(callback, error){

		navigator.mediaDevices.enumerateDevices().then(function(devices) {
			
			var videoInOptions = [], audioInOptions = [], audioOutOptions = [], gotLabels = false;
			
			devices.forEach(function(device) {
				if(device.kind == 'videoinput'){				
					gotLabels = device.label.length ? true : false;					
					videoInOptions.push({ text: device.label.length ? device.label : "Video Device" , value: device.deviceId });                
				} else if(device.kind == 'audioinput'){
					audioInOptions.push({ text: device.label.length ? device.label : "Audio Device" , value: device.deviceId });
				} else if(device.kind == 'audiooutput'){
					audioOutOptions.push({ text: device.label.length ? device.label : "Speakers" , value: device.deviceId });
				}
			});
			
			var devicesList = { 
				"videoIn": videoInOptions,
				"audioIn": audioInOptions,
				"audioOut": audioOutOptions
			};

			$('.deviceList .audioVideoNum').html(audioInOptions.length + " / " + videoInOptions.length);
			
			if(typeof callback === "function") {
				callback(devicesList, gotLabels);
			}
			
		}).catch(function(err) {
		
			if(typeof error === "function") {
				error(err);
			}
		});
		
	}

	// --- Initiate a Media Device --- //
	this.initMediaDevice = function(options, localStream, callback, error){
		//console.log("initMediaDevice !");
		var constraints = isOBJnotEmpty(options) ? options : { video: true, audio: true };
		var browser = systemInfo.browser.name;

		
		if(browser == "Chrome" || browser == "Opera" ){
			
			//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			
			var chromeConstraints = {
				video: constraints.video == false ? false : {
					optional : [{
						sourceId: constraints.video.deviceId.exact 
					}],
					mandatory : {
						minWidth : 320,
						maxWidth : 1280,
						minHeight : 180,
						maxHeight : 720,
						minFrameRate : 30
					}
				},
				audio: constraints.audio == false ? false : {optional : [{ sourceId: constraints.audio.deviceId.exact }] }
			}		
			
			navigator.mediaDevices.getUserMedia(chromeConstraints).then(function(stream){
				
				stream.constraints = constraints;
				
				// -- Get Devices -- //
				rtcstudio.audioVideo.getMediaDevices(function(devices, gotLabels){
					if(typeof callback === "function") { callback(devices, gotLabels, stream); }		
				}, function(err){
					if(typeof error === "function") { error(err); }
				});
		
				if(typeof localStream === "function") {
					localStream(stream);
				}
				
			}, function(err){
				
				if(typeof error === "function") {
					error(sortError(err));
				}
				
			});		
			
		} else {

			navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
				
				stream.constraints = constraints;
				
				// -- Get Devices -- //
				rtcstudio.audioVideo.getMediaDevices(function(devices, gotLabels){
					if(typeof callback === "function") { callback(devices, gotLabels, stream); }		
				}, function(err){		
					if(typeof error === "function") { error(err); }
				});
		
				if(typeof localStream === "function") {
					localStream(stream);
				}
		
			}).catch(function(err) {
				
				if(typeof error === "function") {
					error(sortError(err));
				}
				
			});
			
		}
		
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

	this.invokeDevices = function(invokegetUserMedia){

		// *** Get Media Devices *** //
		this.enumerateDevices(function(devices, gotLabels){

			if(gotLabels){

				rtcstudio.audioVideo.devices = devices;
				//rtcstudio.devices = devices;

				devices.videoIn.push({'$order': 0, 'text':'- no video -', 'value': "false" });
				devices.audioIn.push({'$order': 0, 'text':'- no audio -', 'value': "false" });
				
				var videoInputDevices = $('#videoInDevices');
				var audioInputDevices = $('#audioInDevices');

				videoInputDevices.html(''); audioInputDevices.html('');

				var videoInSelectize = $("#videoInDevices")[0].selectize;
				videoInSelectize.clear();
				videoInSelectize.clearOptions();
				videoInSelectize.load(function(callback) {
					callback(devices.videoIn);
				});

				var audioInSelectize = $("#audioInDevices")[0].selectize;
				audioInSelectize.clear();
				audioInSelectize.clearOptions();
				audioInSelectize.load(function(callback) {
					callback(devices.audioIn);
				});

				$('.mediaTitle').removeClass('uk-accordion-title-warning').addClass('uk-accordion-title-success');
				$('.mediaStatus').html('<span class="md-color-blue-500">Media device detected!</span');
				
			} else {
				rtcstudio.audioVideo.invokeDevices(true);
			}

		}, function(err){

			$('.mediaTitle').removeClass('uk-accordion-title-warning uk-accordion-title-success').addClass('uk-accordion-title-danger');
			$('.mediaStatus').html('<span class="md-color-red-500">' + err + '</span>');

		}, invokegetUserMedia);

	}
	
	// *** Get Audio / Video Stream ***
	this.setStream = function(stream, prevCallback){

		gotVideo = stream.getVideoTracks().length ? true : false; 
		gotAudio = stream.getAudioTracks().length ? true : false;		

		// Only Video
		if(gotVideo == true & gotAudio == false){ console.log("Only Video");
		rtcstudio.audioVideo.getCanvasFromVideoStream(stream, function(mediaElement){
				
			rtcstudio.audioVideo.sortMediaForScenes(mediaElement);
				prevCallback(mediaElement.video.canvas);
				
			});
		// Only Audio
		} else if(gotVideo == false & gotAudio == true){ console.log("Only Audio");
		rtcstudio.audioVideo.getCanvasFromAudioStream(stream, function(mediaElement){
				
			rtcstudio.audioVideo.sortMediaForScenes(mediaElement);				
				prevCallback(mediaElement.video.canvas);
				
			});
		// Video & Audio 
		} else if(gotVideo == true & gotAudio == true){ console.log("Video & Audio");
		rtcstudio.audioVideo.getCanvasFromVideoStream(stream, function(mediaElement){
				
			rtcstudio.audioVideo.sortMediaForScenes(mediaElement);
				prevCallback(mediaElement.video.canvas);
				
			});
		}		
	};

	this.getCanvasFromVideoStream = function(stream, callback){

    	var audio = null;
    	
		// Create DOM video		
		var videoElem = document.createElement('video');			
        videoElem.src = URL.createObjectURL(stream);
        videoElem.autoplay = true;
        videoElem.muted = true;
        
        videoElem.onloadedmetadata = function(e) {
        	videoElem.play();
        	
        	if(gotAudio){

        		var audioContext = new AudioContext();
				var analyser = audioContext.createAnalyser();
				analyser.fftSize = 1024;
				
				var audioStreamSource = audioContext.createMediaStreamSource(stream);
			    var audioElemSource = ''; //audioContext.createMediaElementSource(videoElem); Not supported
			    
				audioStreamSource.connect(analyser);
				  
			    //var audioFilters = new AudioFilters(audioContext, audioStreamSource);
			    //audioFilters.init('');
			    
				audio = {
					"audioContext": audioContext,
					"audioStreamSource": audioStreamSource,
					"audioElemSource": audioElemSource,
					"analyser": analyser,
					"filters": new AudioFilters(audioContext, audioStreamSource),
					"filter": [],
					"settings": {
						"volume": 1.0,
						"feedback": false,
						"autoGain" : false,
						"echoCancel": true,
						"noiseSupp": false,
						"highPass": false
					}					
				};
			    
        	}
		    
			var mediaElement = {				
				"stream": stream,
				"streamid": stream.id,				
				"mediaElem": videoElem,
				"gotVisualizer" : false,
				"video": {
					"canvas": fx.canvas(),
					"filters": new VideoFilters(rtcstudio),
					"filter": []
				},
				"audio": audio
			};

			mediaElement.video.texture = mediaElement.video.canvas.texture(videoElem);
        	mediaElement.video.canvas.setAttribute("id", "prev_" + stream.id);
        	mediaElement.video.canvas.setAttribute("data-type", stream.type);
        	mediaElement.video.canvas.className = stream.type;
        	mediaElement.video.canvas.texture = mediaElement.video.texture;
        	mediaElement.video.ready = true;

        	if(typeof callback === "function"){
        		callback(mediaElement);
        	}
        	
        }
	};
	
	this.getCanvasFromAudioStream = function(stream, callback){

		var audioElem = new Audio();
	    audioElem.src = URL.createObjectURL(stream);
	    audioElem.autoplay = true;
	    audioElem.muted = true;
		
	    audioElem.onloadedmetadata = function(e) {
	    	audioElem.play();
	    	    
			var canvas = document.createElement('canvas');
			canvas.width = 640; canvas.height = 480;
			canvas.setAttribute("id", "prev_" + stream.id);
			canvas.setAttribute("data-type", "visualizer");

    		var audioContext = new AudioContext();
			var analyser = audioContext.createAnalyser();
			analyser.fftSize = 1024;
			
			var audioStreamSource = audioContext.createMediaStreamSource(stream);
		    var audioElemSource = ''; //audioContext.createMediaElementSource(audioElem); Not supported
			
			audioStreamSource.connect(analyser);

			var analyserView = new AnalyserView(canvas);
			analyserView.initByteBuffer( analyser );	
			
		    //var audioFilters = new AudioFilters(audioContext, audioStreamSource);
		    //audioFilters.init('', analyser);
		    
			var mediaElement = {				
				"stream": stream,
				"streamid": stream.id,				
				"mediaElem": audioElem,
				"gotVisualizer" : true,
				"video": {
					"canvas": canvas,
					"visualizer": {
						"analyser": analyser,
						"analyserView": analyserView,
						"style": "ANALYSISTYPE_3D_SONOGRAM"
					}					
				},
				"audio": {
					"audioContext": audioContext,
					"audioStreamSource": audioStreamSource,
					"audioElemSource": audioElemSource,
					"analyser": analyser,
					"filters": new AudioFilters(audioContext, audioStreamSource),
					"filter": [],
					"settings": {
						"volume": 1.0,
						"feedback": false,
						"autoGain" : false,
						"echoCancel": true,
						"noiseSupp": false,
						"highPass": false
					}					
				}
			};
			
	    	if(typeof callback === "function"){
	    		callback(mediaElement);
	    	}
	    }
	};
	
	this.sortMediaForScenes = function(mediaElement){

		$('#videoFXfiltersBlock').html('');
		$('#visualizerToolsBlock').html('');
		$('#videoFXfiltersDrop').html('');
		
		rtcstudio.global.selectedPreview = mediaElement.streamid;

		rtcstudio.audioVideo.fx_canvas.push(mediaElement);

		if(gotAudio){
			rtcstudio.audioVideo.buildAudioTools(mediaElement.video.canvas.getAttribute("data-type"), mediaElement.streamid);
		}
		
		this.buildVideoTools(mediaElement.video.canvas.getAttribute("data-type"), mediaElement.streamid);
		
		var streamTexture = new THREE.Texture( mediaElement.video.canvas );				
		streamTexture.minFilter = THREE.LinearFilter;
		streamTexture.magFilter = THREE.LinearFilter;
		streamTexture.format = THREE.RGBFormat;
		
		mediaElement.texture = streamTexture;
		mediaElement.gotVideo = gotVideo;
		mediaElement.gotAudio = gotAudio;
		
		for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){		
			var thisScene = rtcstudio.ThreeJS.scenes[i];
			var exists = (typeof thisScene.onNewMediaElement === 'function') ? true : false;
			if (exists){ thisScene.onNewMediaElement(mediaElement); }
		}

	};

	this.removeStream = function(streamid){
		for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){
			var thisScene = rtcstudio.ThreeJS.scenes[i];
			var exists = (typeof thisScene.onStreamRemove === 'function') ? true : false;
			if (exists){ thisScene.onStreamRemove(streamid); }
		}
		
		this.stopStream(streamid);
				
	}
	
	this.stopStream = function(streamid){
		
		var mediaElement = rtcstudio.audioVideo.getSelectedCanvas(streamid);
		
		var stream = mediaElement.stream;
		
		// Stopping Camera		
		for (i = 0; i < stream.getAudioTracks().length; i++) {
			stream.getAudioTracks()[i].stop();
		}
		
		for (i = 0; i < stream.getVideoTracks().length; i++) {
			stream.getVideoTracks()[i].stop();
		}
		
		// Removing everything from memory
		var stream2remove;
		for (i = 0; i < rtcstudio.audioVideo.fx_canvas.length; i++){
			if(rtcstudio.audioVideo.fx_canvas[i].streamid == streamid){
				stream2remove = i;
				break;
			}
		}				

		if(rtcstudio.audioVideo.fx_canvas[stream2remove].audio !== null){
			rtcstudio.audioVideo.fx_canvas[stream2remove].audio.audioContext.close();
		}
		
		rtcstudio.audioVideo.fx_canvas[stream2remove].video.ready = false;
		
		if(!rtcstudio.audioVideo.fx_canvas[stream2remove].gotVisualizer){
			$(rtcstudio.audioVideo.fx_canvas[stream2remove].video.canvas)[0].texture.destroy();
		};
		
		$(rtcstudio.audioVideo.fx_canvas[stream2remove].video.canvas)[0].remove();

		$(rtcstudio.audioVideo.fx_canvas[stream2remove].mediaElem)[0].pause();
		$(rtcstudio.audioVideo.fx_canvas[stream2remove].mediaElem)[0].src = "";
		$(rtcstudio.audioVideo.fx_canvas[stream2remove].mediaElem)[0].remove();

		rtcstudio.audioVideo.fx_canvas.splice(stream2remove, 1);
				
		var canvasCount = rtcstudio.audioVideo.fx_canvas.length;
		
		if(rtcstudio.global.selectedPreview == streamid){
			
			if(canvasCount >= 1){
				console.log(canvasCount);			
				rtcstudio.global.selectedPreview = rtcstudio.audioVideo.fx_canvas[canvasCount - 1].streamid;			
				setSelectedByID(rtcstudio.global.selectedPreview);
			} else {
				
				$('#videoFXfiltersDrop').html('');				 
				$('#videoFXfiltersBlock').html('');
				$('#visualizerToolsBlock').html('');
				$('#audioFXfiltersBlock').html('');
			}
		}

		
	};

	this.buildVideoTools = function(mediaType, selectedCanvasId){
		
		$('#videoFXfiltersBlock').html('');
		$('#visualizerToolsBlock').html('');
		$('#videoFXfiltersDrop').html('');
		
		if(mediaType == "visualizer"){
			
			//$('#videoFXfiltersDrop').hide();
			
			var html = '<div class="uk-width-medium-1-1 uk-margin-small-bottom">' +
							'<div class="md-card" style="min-height: 100px;">' +
								'<div class="md-card-content filterBlock" id="visualizer_tools">' +
									'<h3 class="heading_a uk-margin-small-bottom">visualizer</h3>' +
				                    '<div class="uk-grid uk-grid-divider" data-uk-grid-margin>' +
				                        '<div class="uk-width-medium-1-2">' +
				                            '<input type="radio" name="visualizer" class="visualizer" id="ANALYSISTYPE_FREQUENCY" data-md-icheck />' +
				                            '<label for="Frequency" class="inline-label">Frequency</label>' +
				                        '</div>' +
				                        '<div class="uk-width-medium-1-2">' +
				                            '<input type="radio" name="visualizer" class="visualizer" id="ANALYSISTYPE_SONOGRAM" data-md-icheck />' +
				                            '<label for="Sonogram" class="inline-label">Sonogram</label>' +
				                        '</div>' +
				                    '</div>' +
				                    '<hr class="uk-grid-divider">' +
									'<div class="uk-grid uk-grid-divider" data-uk-grid-margin>' +
				                        '<div class="uk-width-medium-1-2">' +
				                            '<input type="radio" name="visualizer" class="visualizer" id="ANALYSISTYPE_3D_SONOGRAM" data-md-icheck />' +
				                            '<label for="3D_Sonogram" class="inline-label">3D Sonogram</label>' +
				                        '</div>' +
				                        '<div class="uk-width-medium-1-2">' +
				                            '<input type="radio" name="visualizer" class="visualizer" id="ANALYSISTYPE_WAVEFORM" data-md-icheck />' +
				                            '<label for="Waveform" class="inline-label">Waveform</label>' +
				                        '</div>' +
				                    '</div>' +
				                '</div>' +
							'</div>' +
					   '</div>';
			
			$('#visualizerToolsBlock').html(html);
			
			$('input[name="visualizer"]').iCheck({
				radioClass: 'iradio_md'
	        });
			
			for (i = 0; i < rtcstudio.audioVideo.fx_canvas.length; i++){
				if(rtcstudio.audioVideo.fx_canvas[i].streamid == selectedCanvasId){
					var selVisID = rtcstudio.audioVideo.fx_canvas[i].video.visualizer.style
					$('#' + selVisID).iCheck('check');
				}
			}
			
		    $('input[name="visualizer"]').on('ifClicked', function (event) {
		        var type = this.id;
				for (i = 0; i < rtcstudio.audioVideo.fx_canvas.length; i++){				
					if(rtcstudio.audioVideo.fx_canvas[i].streamid == selectedCanvasId){
						
						rtcstudio.audioVideo.fx_canvas[i].video.visualizer.style = type;
						
			       		if(type == "ANALYSISTYPE_FREQUENCY"){
							rtcstudio.audioVideo.fx_canvas[i].video.visualizer.analyserView.setAnalysisType(ANALYSISTYPE_FREQUENCY);
						} else if(type == "ANALYSISTYPE_SONOGRAM"){
							rtcstudio.audioVideo.fx_canvas[i].video.visualizer.analyserView.setAnalysisType(ANALYSISTYPE_SONOGRAM);
							
						} else if(type == "ANALYSISTYPE_3D_SONOGRAM"){
							rtcstudio.audioVideo.fx_canvas[i].video.visualizer.analyserView.setAnalysisType(ANALYSISTYPE_3D_SONOGRAM);
							
						} else if(type == "ANALYSISTYPE_WAVEFORM"){
							rtcstudio.audioVideo.fx_canvas[i].video.visualizer.analyserView.setAnalysisType(ANALYSISTYPE_WAVEFORM);
						}

					}
				}
		    });
		    
		} else if(mediaType == "media"){

			var thisCanvas = rtcstudio.audioVideo.getSelectedCanvas(rtcstudio.global.selectedPreview);

			thisCanvas.video.filters.createDropDown();
			
			
			//var filters = thisCanvas.video.filter;
			//if(filters.length){
			//	thisCanvas.video.filters.addItemSlider(filters[0].filter, filters[0].name);
			//}
			
			//for (c = 0; c < filters.length; c++){
			//	var filterName = filters[c].name;
			//	thisCanvas.video.filters.addItemSlider(filters[c].filter, filterName)
			//	console.log(filterName);
			//}
			
			/*
			var select = $("#videoFXfilters").selectize();
			var selectize = select[0].selectize;
			selectize.clear();
			selectize.enable();
			*/
		}
	};
	
	this.buildAudioTools = function(mediaType, selectedCanvasId){

		var html =	'<div class="uk-width-medium-1-1 uk-margin-small-bottom">' +
		
						'<div class="md-card" style="min-height: 100px;">' +
							'<div class="md-card-content filterBlock">' +
							
								'<h3 class="heading_a uk-margin-small-bottom">Audio Settings</h3>' +
				                '<div class="uk-grid uk-grid-divider" data-uk-grid-margin>' +
							
									'<div class="uk-width-1-1">' +
			                            '<select id="spkAudioOut" name="spkAudioOut">' +
											'<option value="">Select Audio Output...</option>' +
										'</select>' +
										'<span class="uk-form-help-block uk-margin-small-bottom">' +
											'<div class="uk-float-left">Speakers Audio Output</div>' +
										'</span>' +									        
								    '</div>' +
								    
									'<div class="uk-width-medium-6-10 uk-row-first">' +
										'<input type="text" id="inputVolume" name="inputVolume" class="ion-slider" />' +
										'<span class="uk-form-help-block uk-margin-small-bottom">' +										
											'<div class="uk-float-left">Input Volume</div>' +
										'</span>' +
									'</div>' +
									
					                '<div class="uk-width-medium-4-10">' +
					                    '<p>' +
					                        '<input type="checkbox" name="audio_echo" id="audio_echo" data-md-icheck />' +
					                        '<label for="audio_echo" class="inline-label"><small>Echo Cancellation</small></label>' +
					                    '</p>' +
					                    '<p>' +
					                        '<input type="checkbox" name="audio_noise" id="audio_noise" data-md-icheck />' +
					                        '<label for="audio_noise" class="inline-label"><small>Noise Suppression</small></label>' +
					                    '</p>' +
					                    '<p>' +
					                        '<input type="checkbox" name="audio_highpass" id="audio_highpass" data-md-icheck />' +
					                        '<label for="audio_highpass" class="inline-label"><small>Highpass Filter</small></label>' +
										'</p>' +
									'</div>' +
									
									'<div class="md-bg-blue-grey-50">' +
										'<div class="uk-width-1-1">' +
											'<div class="uk-float-left">' +					                            
					                            '<input type="checkbox" name="enable_feedback" id="enable_feedback" data-md-icheck />' +
					                            '<label for="enable_feedback" class="inline-label">Enable feedback</label>' +					                            
											'</div>' +
										'</div>' +
									'</div>' +


								'</div>' +								
							'</div>' +
						'</div>' +
					'</div>';
		
		$('#audioFXfiltersBlock').html(html);
		
		$('#spkAudioOut').selectize({
	        onDropdownOpen: function($dropdown) {
	            $dropdown
	                .hide()
	                .velocity('slideDown', {
	                    begin: function() {
	                        $dropdown.css({'margin-top':'0'})
	                    },
	                    duration: 200,
	                    easing: easing_swiftOut
	                })
	        },
	        onDropdownClose: function($dropdown) {
	            $dropdown
	                .show()
	                .velocity('slideUp', {
	                    complete: function() {
	                        $dropdown.css({'margin-top':''})
	                    },
	                    duration: 200,
	                    easing: easing_swiftOut
	                })
	        },
	        onItemAdd : function(itemID){

	        	var audioStream = rtcstudio.audioVideo.getSelectedCanvas(selectedCanvasId);	        	
	        	var mediaElem = audioStream.mediaElem;
	        	attachSinkId(mediaElem, itemID);	        	
	        	
	            this.close();
	            this.blur();
	        }
		});
		
		var AudioOutSelectize = $("#spkAudioOut")[0].selectize;
		AudioOutSelectize.clear();
		AudioOutSelectize.clearOptions();
		AudioOutSelectize.load(function(callback) {
			callback(rtcstudio.devices.audioOut);
		});
		
		var thisCanvas = rtcstudio.audioVideo.getSelectedCanvas(selectedCanvasId);;

		// --- init Volume Slider --- //
	    $('#inputVolume').ionRangeSlider({
			disable: true,
			hide_min_max: false,
			grid: true,
			min: 0.0, max: 1.0, from: thisCanvas.audio.settings.volume, step: 0.01,
			onChange: function(data){
				var audioStream = rtcstudio.audioVideo.getSelectedCanvas(selectedCanvasId);
				
				var value = data.slider.context.value;
				audioStream.mediaElem.volume = value;
				
				thisCanvas.audio.settings.volume = value;
				
				//var filters = audioStream.audio.filters;
				//console.log(filters[0].outputMix);
				//var audioGain = thisCanvas.audio.audioGain;				
				//filters[0].outputMix.gain.value = value;
				//audioGain.gain.value = value;
				
			}
		});
	    
	    $('input[name="enable_feedback"]').iCheck({ checkboxClass: 'icheckbox_md' });	    
	    $('input[name="audio_echo"]').iCheck({ checkboxClass: 'icheckbox_md' });
	    $('input[name="audio_noise"]').iCheck({ checkboxClass: 'icheckbox_md' });
	    $('input[name="audio_highpass"]').iCheck({ checkboxClass: 'icheckbox_md' });
	    
	    if(thisCanvas.audio.settings.feedback){
	    	$('input[name="enable_feedback"]').iCheck('check');
	    	$('#spkAudioOut')[0].selectize.enable();
			$('input[name="audio_echo"]').iCheck('enable');
			$('input[name="audio_noise"]').iCheck('enable');
			$('input[name="audio_highpass"]').iCheck('enable');
	    } else {
	    	$('#spkAudioOut')[0].selectize.disable();
			$('input[name="audio_echo"]').iCheck('disable');
			$('input[name="audio_noise"]').iCheck('disable');
			$('input[name="audio_highpass"]').iCheck('disable');
	    }
	    
	    if(thisCanvas.audio.settings.echoCancel){ $('input[name="audio_echo"]').iCheck('check') }
	    if(thisCanvas.audio.settings.noiseSupp){ $('input[name="audio_noise"]').iCheck('check') }
	    if(thisCanvas.audio.settings.highPass){ $('input[name="audio_highpass"]').iCheck('check') }

	    $('input[name="enable_feedback"]').on('ifChanged', function (event) {
	    	
	    	thisCanvas.audio.settings.feedback = this.checked;
	    	
	    	var audioStream = rtcstudio.audioVideo.getSelectedCanvas(selectedCanvasId);
	    	
	    	if(this.checked){
	    		
	    		$('#spkAudioOut')[0].selectize.enable();
	    		audioStream.mediaElem.muted = false;
	    		
	    		$("#inputVolume").data("ionRangeSlider").update({ disable: false });
				$('input[name="audio_echo"]').iCheck('enable');
				$('input[name="audio_noise"]').iCheck('enable');
				$('input[name="audio_highpass"]').iCheck('enable');
				
	    	} else {
	    		
	    		$('#spkAudioOut')[0].selectize.disable();
	    		audioStream.mediaElem.muted = true;

	    		$("#inputVolume").data("ionRangeSlider").update({ disable: true });
				$('input[name="audio_echo"]').iCheck('disable');
				$('input[name="audio_noise"]').iCheck('disable');
				$('input[name="audio_highpass"]').iCheck('disable');

	    	}
	    	
	    });
	    $('input[name="audio_echo"]').on('ifChanged', function (event) {
	    	thisCanvas.audio.settings.echoCancel = this.checked;
	    });
	    $('input[name="audio_noise"]').on('ifChanged', function (event) {
	    	thisCanvas.audio.settings.noiseSupp = this.checked;
	    });
	    $('input[name="audio_highpass"]').on('ifChanged', function (event) {
	    	thisCanvas.audio.settings.highPass = this.checked;
	    });
		
	}

	this.addAudioFilter = function(filter, itemName){
		
		var filterID = filter.label;
		
		var thisCanvas = rtcstudio.audioVideo.getSelectedCanvas(rtcstudio.audioVideo.selectedPreview);

		var audioContext = thisCanvas.audio.audioContext;
		var audioStream = thisCanvas.audio.audioStream;
		var filters = new AudioFilters(audioContext, audioStream);
		
		filters.init(filter.name);		
		//filters.changeEffect(filter.name);
		
		thisCanvas.audio.filters.push(filters);
		
		var html =  '<h3 class="uk-accordion-title">' + itemName + '</h3>' +
					'<div class="uk-accordion-content" id="accord_' + filterID + '">' +					
						'<div class="uk-grid uk-grid-divider" data-uk-grid-margin>' +
							'<div class="uk-width-medium-6-10 uk-row-first" id="' + filterID + '">' +
							'</div>' +
							'<div class="uk-width-medium-4-10">' +

								'<div class="uk-width-medium-1-1 uk-margin-small">' +
									'<input type="text" id="' + filterID + '_mixSlider" name="' + filterID + '_mixSlider" class="ion-slider" />' +
									'<span class="uk-form-help-block uk-margin-small-bottom">Effect Mix</span>' +
								'</div>' +
							
								'<div class="uk-width-medium-1-1 uk-margin-small">' +
									'<input type="checkbox" name="' + filterID + '_active_filter" id="' + filterID + '_active_filter" data-md-icheck />' +
									'<label for="active_filter" class="inline-label uk-float-right">Enabled FX</label>' +
								'</div>' +
								
							'</div>' +
					'</div>';

		$('#audioFXfiltersPanels').append(html);		
				
		// --- init Effect Mixer Slider --- //
	    $('#' + filterID + '_mixSlider').ionRangeSlider({
			disable: false,
			hide_min_max: false,
			grid: true,
			min: 0.0, max: 1.0, from: 1.0, step: 0.01,
			onChange: function(data){
				var value = data.slider.context.value;
				filters.crossfade( value );
			}
		});	

	    // --- Active Filter Button --- //
	    $('#' + filterID + '_active_filter').iCheck({ checkboxClass: 'icheckbox_md checked uk-float-right' });

	    for (var j = 0; j < filter.sliders.length; j++) {

            var slider = filter.sliders[j];
            filter[slider.name] = slider.value;

            var onchange = (function(filter, slider) {
            	return function(data) {
            		var value = data.slider.context.value;
                    filter[slider.name] = parseFloat(value);
                    filter.update();
            	}
			})(filter, slider);
        	
        	$('#' + filterID).append('<input data-streamid="" type="text" id="' + slider.id + '" /><span class="uk-form-help-block uk-margin-small-bottom">' + slider.label + '</span>');

            $('#' + slider.id).ionRangeSlider({
        		disable: false,
        		hide_min_max: false,
        		grid: true,
        		min: slider.min, max: slider.max, from: slider.value, step: slider.step,
        		onChange: onchange,
        	    onStart: function (data) {
        	    	rtcstudio.audioVideo.selectedAudioFilter = filter.name;
        	    }
        	});
    		
        }

        //filter.update();
        UIkit.accordion($('#audioFXfiltersPanels'), {collapse: false}).update();

	}
	
	// Attach audio output device to video element using device/sink ID.
	function attachSinkId(element, sinkId) {
	  if (typeof element.sinkId !== 'undefined') {
	    element.setSinkId(sinkId)
	    .then(function() {
	    	$('.mediaTitle').html('Success, audio output device attached: ' + sinkId);
	    })
	    .catch(function(error) {
	      var errorMessage = error;
	      if (error.name === 'SecurityError') {
	        errorMessage = 'You need to use HTTPS for selecting audio output ' +
	            'device: ' + error;
	      }
	      $('.mediaTitle').removeClass('uk-accordion-title-warning uk-accordion-title-success').addClass('uk-accordion-title-danger');
	      $('.mediaStatus').html('<span class="md-color-red-500">' + errorMessage + '</span>');
	      //console.error(errorMessage);
	      // Jump back to first output device in the list as it's the default.
	      //audioOutputSelect.selectedIndex = 0;
	    });
	  } else {
		  $('.mediaStatus').html('<span class="md-color-red-500">Browser does not support output device selection.</span>');
		  //console.warn('Browser does not support output device selection.');
	  }
	}
	
	this.getSelectedCanvas = function(canvasid){
		for (i = 0; i < rtcstudio.audioVideo.fx_canvas.length; i++){
			if(rtcstudio.audioVideo.fx_canvas[i].streamid == canvasid){
				return rtcstudio.audioVideo.fx_canvas[i];
				break;
			}			
		}		
	};
	
}