// --- Disables Context Menu on Right Click --- //
document.oncontextmenu = function() { return false; };

function setSelectedHID(deviceid){
	
	console.log(' **** SELECTING DEVICE ID ***');

	$('#midiPreview .inputPanel').find('.md-card').removeClass('selected');
	$('#midiPreview .inputPanel .' + deviceid).closest('.md-card').addClass('selected');

	var selectedid = rtcStudio.global.selectedHID;
	
	console.log(selectedid + " - " + deviceid);
	if(selectedid != deviceid){
		rtcStudio.global.selectedHID = deviceid;
		console.log(rtcStudio.global);
	}
}

function removeSelectedHID(deviceid){
	
	console.log("removing HID: " + deviceid)
	
	var streamPanel = $(this).closest('.inputPanel');		
	
	$('#InputDevicesTools div').fadeOut("normal", function() {
		$('#InputDevicesTools').html('');
	});
	
	$('#midiPreview .inputPanel .' + deviceid).closest('.inputPanel').fadeOut("normal", function() {
		
		// Removing Panel
		streamPanel.remove();			

		// Select a Remaing Panel
		selectRemainingHID();
		
    });

	closeHID(deviceid);
	
}

function selectRemainingHID(){
	console.log("Selecting Remaining HID!");
	
	//rtcStudio.midi.selectRemaining();
	
	
	rtcStudio.global.selectedHID = '';
}

function closeHID(deviceid){
	
	if(deviceid.indexOf('midi') > -1){
		
		console.log(" *** CLOSING MIDI *** ");
		rtcStudio.midi.close(deviceid);
		
	} else if(deviceid.indexOf('gamepad') > -1){
		
		console.log(" *** CLOSING GAMEPAD *** ");
		rtcStudio.gamepad.close(deviceid);
		
	} else if(deviceid.indexOf('serial') > -1){
		
		console.log(" *** CLOSING SERIAL *** ");
		rtcStudio.serialConnector.close(deviceid);
		
	} else if(deviceid == "geolocationDev" ){
		
		console.log(" *** CLOSING GEOLOCATION *** ");
		rtcStudio.geolocation.clearWatch();
		
	}
}

function setSelectedByID(selectedCanvasId){

	$('#videoFXfiltersBlock').html('');
	$('#visualizerToolsBlock').html('');
	$('#audioFXfiltersBlock').html('');
	$(".inputPanel .selected").removeClass("selected");
	$(".videoPanel .selected").removeClass("selected");
	
	var thisCanvas = rtcStudio.audioVideo.getSelectedCanvas(selectedCanvasId);
	
	var canvas = $(thisCanvas.video.canvas.outerHTML);
	var canvasid = canvas[0].id;
	var canvasType = canvas.data("type");
	
	rtcStudio.global.selectedPreview = selectedCanvasId;
	
	$('.' + canvasid + ' canvas').closest('.md-card').addClass('selected');

	if(thisCanvas.gotAudio){
		rtcStudio.audioVideo.buildAudioTools(canvasType, selectedCanvasId);
	}
	
	rtcStudio.audioVideo.buildVideoTools(canvasType, selectedCanvasId);
	
}

function addShareShare(){
	
	var uniqueid = randomString(10);	
	var html =	'<div class="uk-width-small-1-2 uk-width-medium-1-3 uk-margin-small-bottom videoPanel sharePanel">' +
					'<div class="md-card">' +
						'<div class="md-card-toolbar">' +
							'<div class="md-card-toolbar-actions">' +
								'<i class="md-icon material-icons md-card-fullscreen-activate">&#xE5D0;</i>' +
								'<i class="md-icon material-icons md-card-close">&#xE14C;</i>' +
							'</div>' +
							//'<h3 class="md-card-toolbar-heading-text"></h3>' +
							'<span class="md-card-toolbar-heading-text">' +
								'<i class="uk-sortable-handle uk-icon uk-icon-bars uk-margin-small-right"></i>' +
							'</span>' +
						'</div>' +								
						'<div class="canvasContainer ' + uniqueid + '">' +
							'<div style="text-align: center; margin: auto; margin-top: 25%; padding-bottom: 25%;">' +
								'<div class="md-preloader"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="32" width="32" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="6"/></svg></div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>';			
	$("#videoPreview").append(html);
	
	$('#mediaDevices').trigger('click');
	
	navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;

	var stream = null;

	if (!location.protocol.match('https')) {
		console.log('You may need to run this app from https.');
	}
	
	if (!(navigator.userAgent.match('Chrome') && parseInt(navigator.userAgent.match(/Chrome\/(.*) /)[1]) >= 26)) {
		UIkit.modal.alert('You need Chrome 26+ to run this demo properly.');
	}
		
	// Seems to only work over SSL.
	navigator.getUserMedia({
		video: {
			mandatory: {
				chromeMediaSource: 'screen',
				maxWidth: 1280,
				maxHeight: 960
			}
		}
	}, function(stream) {

		stream.type = "screen";
		
		// Set Stream to RTCsense Studio
		rtcStudio.setStream(stream, function(canvas){

			$(".videoPanel .selected").removeClass("selected");

			var canvasid = canvas.id.replace("}", "").replace("{", "");				
			$('.' + uniqueid).addClass(canvasid);
			
			$('.' + uniqueid).html('');
			//$('.' + uniqueid).append('<img src="assets/img/screenShare.jpg" id="'+stream.id+'" class="screen_'+stream.id+'" data-type="screen" style="width: 100%;">');
			$('.' + uniqueid).append(canvas);
			$('.' + uniqueid).closest('.md-card').addClass('selected');

		});

	    stream.onended = function(e) {
	    	var streamPanel = $('.videoPanel .prev_'+stream.id);	    	
	    	if(streamPanel.length){
		    	rtcStudio.audioVideo.removeStream(stream.id);
		    	// Remove video
				$('.videoPanel .prev_'+stream.id).closest('.videoPanel').fadeOut("normal", function(){
					this.remove();				
				});
	    	}
	    };

	}, function(e) {
		if (e.code == e.PERMISSION_DENIED) {
			UIkit.modal.alert('PERMISSION_DENIED. Are you no SSL? Have you enabled the --enable-usermedia-screen-capture flag?')
		}
	});
	
}

//--- Get Mouse Position in Canvas --- //
function  getMousePos(canvas, evt) {
	  var rect = canvas.getBoundingClientRect(), // abs. size of element
	      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
	      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

	  return {
	    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
	    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
	  }
}

// --- Check if Object is Empty --- //
function isOBJnotEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return true;
    }
    return false && JSON.stringify(obj) === JSON.stringify({});
}

// --- System Info --- //
var systemInfoModule = {
    options: [],
    header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
    dataos: [
        { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
        { name: 'Windows', value: 'Win', version: 'NT' },
        { name: 'iPhone', value: 'iPhone', version: 'OS' },
        { name: 'iPad', value: 'iPad', version: 'OS' },
        { name: 'Kindle', value: 'Silk', version: 'Silk' },
        { name: 'Android', value: 'Android', version: 'Android' },
        { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
        { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
        { name: 'Macintosh', value: 'Mac', version: 'OS X' },
        { name: 'Linux', value: 'Linux', version: 'rv' },
        { name: 'Palm', value: 'Palm', version: 'PalmOS' }
    ],
    databrowser: [
        { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
        { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
        { name: 'Safari', value: 'Safari', version: 'Version' },
        { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
        { name: 'Opera', value: 'Opera', version: 'Opera' },
        { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
        { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
    ],
    init: function () {
        var agent = this.header.join(' '),
            os = this.matchItem(agent, this.dataos),
            browser = this.matchItem(agent, this.databrowser);
        
        return { os: os, browser: browser };
    },
    matchItem: function (string, data) {
        var i = 0,
            j = 0,
            html = '',
            regex,
            regexv,
            match,
            matches,
            version;
        
        for (i = 0; i < data.length; i += 1) {
            regex = new RegExp(data[i].value, 'i');
            match = regex.test(string);
            if (match) {
                regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                matches = string.match(regexv);
                version = '';
                if (matches) { if (matches[1]) { matches = matches[1]; } }
                if (matches) {
                    matches = matches.split(/[._]+/);
                    for (j = 0; j < matches.length; j += 1) {
                        if (j === 0) {
                            version += matches[j] + '.';
                        } else {
                            version += matches[j];
                        }
                    }
                } else {
                    version = '0';
                }
                return {
                    name: data[i].name,
                    version: parseFloat(version)
                };
            }
        }
        return { name: 'unknown', version: 0 };
    }
}; systemInfo = systemInfoModule.init(), debug = '';

function randomString(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

function requestFullScreen(id) {

	var el = document.getElementById(id);

	// Supports most browsers and their versions.
	var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen 
		|| el.mozRequestFullScreen || el.msRequestFullScreen;

	if (requestMethod) {
		// Native full screen.
		requestMethod.call(el);

	} else if (typeof window.ActiveXObject !== "undefined") {

		// Older IE.
		var wscript = new ActiveXObject("WScript.Shell");

		if (wscript !== null) {
			wscript.SendKeys("{F11}");
		}
	}
}

function DetectRTCextendedOptions(){

	/* Geolocation */
	var geolocation = navigator.geolocation ? true : false;
	DetectRTC.isGeolocationSupported = geolocation;

	/* MIDI support */
	var MIDIsupport = navigator.requestMIDIAccess ? true : false;
	DetectRTC.isMIDIsupported = MIDIsupport;

	/* Gamepad support */
	var GamePadSupport = navigator.getGamepads ? true : false || navigator.webkitGamepads ? true : false || navigator.webkitGetGamepads ? true : false;
	DetectRTC.isGamepadSupported = GamePadSupport;

	/* Bluetooth support */
	var BluetoothSupport = navigator.bluetooth ? true : false;
	DetectRTC.isBluetoothSupported = BluetoothSupport;

	/* Battary support */
	var BatterySupport = navigator.battery ? true : false || navigator.webkitBattery ? true : false;
	DetectRTC.isBatterySupported = BatterySupport;

	/* Battary support */
	var VibrateSupport = navigator.vibrate ? true : false || navigator.mozVibrate ? true : false;
	DetectRTC.isVibrateSupported = VibrateSupport;

	/* Device Orientation */
	var DeviceOrientation = window.DeviceOrientationEvent ? true : false;
	DetectRTC.isDeviceOrientationSupported = DeviceOrientation;

	/* Device Motion */
	var DeviceMotion = window.DeviceMotionEvent ? true : false;
	DetectRTC.isDeviceMotionSupported = DeviceMotion;

	/* Device Light */
	var DeviceLight = window.DeviceLightEvent ? true : false;
	DetectRTC.isDeviceLightEventSupported = DeviceLight;

	/* WebGL Supported */
	var webGLSupport = window.WebGLRenderingContext ? true : false;
	DetectRTC.isWebGlSupported = webGLSupport;

}


// ****************** Scene Tools ************************ //


function showTranSettings(){
	$('#tranSettings').slideToggle("fast");
}

function buildSceneToolBars(scenes, transition, containerID){
	
	var html = '<div class="md-card-toolbar">' +
				   '<div class="md-card-toolbar-actions">' +
				       '<a class="md-btn md-btn-primary md-btn-block md-btn-small md-btn-wave-light waves-effect waves-button waves-light" onClick="showSandBox();">SandBox</a>' +
				   '</div>' +
				   '<h3 class="md-card-toolbar-heading-text">' +
				       'RealTime VR enviroment' +
				   '</h3>' +
				'</div>' +
				
			 '<div class="md-card-content">' +
					'<div class="uk-width-1-1 uk-grid uk-grid-small" data-uk-grid-margin>' +
						'<div class="uk-width-medium-1-1">' +
							'<select id="rtcScenes" data-md-selectize>' +
								'<option value="">Select Scene...</option>' +
							'</select>' +
							'<span class="uk-form-help-block uk-float-left">Working Scene</span>' +
							'<span class="uk-form-help-block uk-float-right"><a onClick="showTranSettings();">+ Transition Settings</a></span>' +
						'</div>' +
					'</div>' +
				'</div>';							
	
	var item = $(html).appendTo('#sceneSelection')[0];
			
	// ---- rtcScene DropDown ---- //
	
	var optionsList = [];
	
	for (i = 0; i < scenes.length; i++) {
		optionsList.push({class: "thisList", value: scenes[i].scene.name, name: scenes[i].scene.label });	
	}
	
	var $select = $('#rtcScenes').selectize({
		options:  optionsList,	    
		labelField: 'name',
		valueField: 'value',
		searchField: ['name'],
		render: {
		optgroup_header: function(data, escape) {
			return '<div class="optgroup-header">' + escape(data.label) + ' </div>';
		}
	},
	
	onDropdownOpen: function($dropdown) {
		
		$('#streamVideoFilters').addClass('minfilterHeight');
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
		$('#streamVideoFilters').removeClass('minfilterHeight');
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
	
	onItemAdd : function(itemName){      	
	//addItemOption(itemName);
	//console.log(itemName + " Adding");
	
	for (i = 0; i < scenes.length; i++) {
		if(scenes[i].scene.name == itemName){
			var sceneParam = scenes[i].parameters;
			var thisScene = scenes[i].scene;
			
			transition.setScene(itemName);
			
			initScene(thisScene, sceneParam, containerID);
		}
	}
	
	this.close();
	this.blur();
	
	},
	onItemRemove : function(itemName){
		console.log(itemName + " Remove");
		//removeItemOption(itemName);	
	}
	,create: function(input) {
			console.log("On Create");	
		}
	});	
	
	$select[0].selectize.addItem(optionsList[0].value);
	$(".selectize-input input").attr('readonly','readonly');
	
	// ------------------------------------------------------ //
	
	var html =  '<div class="md-card-content">' +
					'<div class="uk-width-medium-1-1">' +
					
						'<div class="uk-grid uk-grid-divider" data-uk-grid-margin>' +
						
							'<div class="uk-width-medium-1-2">' +

								'<select id="tranTextures" data-md-selectize>' +
									'<option value="">Transition type...</option>' +
									'<option value="1" selected>Perlin</option>' +
									'<option value="2">Squares</option>' +
									'<option value="3">Cells</option>' +
									'<option value="4">Distort</option>' +
									'<option value="5">Gradient</option>' +
									'<option value="6">Radial</option>' +									
								'</select>' +
								'<span class="uk-margin uk-form-help-block uk-float-left">' +
				                    '<input type="checkbox" name="tranUsePattern" id="tranUsePattern" data-md-icheck checked />' +
				                    '<label for="tranUsePattern" class="inline-label">Use Patterns</label>' +														
								'</span>' +
							'</div>' +
							
							'<div class="uk-width-medium-1-2" id="transOptions"></div>' +
							
						'</div>' +
						
					'</div>' +	
				'</div>';
	
	var item = $(html).appendTo('#tranSettings')[0];
		    
	// ---- tranTextures DropDown ---- //
	$('#tranTextures').selectize({
		onItemAdd : function(itemValue){      	
			transition.setTexture(parseInt(itemValue) - 1);
			this.close();
			this.blur();
		}
	});
		    
	$('#tranUsePattern').iCheck({ checkboxClass: 'icheckbox_md' });
	
	$('#tranUsePattern').on('ifChanged', function (event) {		
		var $select_pattern = $('#tranTextures').selectize();
		var $slider_threshold = $("#textureThreshold").data("ionRangeSlider");		
		var select_pattern  = $select_pattern[0].selectize;		
		if(this.checked){			
			select_pattern.enable();
			$slider_threshold.update({ disable: false });
		} else {
			select_pattern.disable();
			$slider_threshold.update({ disable: true });
		}
		transition.useTexture(this.checked);
	});
		
	// ---- Transition Sliders Settings ---- //
	var tranInit = { speed: 0.01, thres: 0.3 };				
	var tranSliders = [
		{
			"id" : "transitionSpeed", "name" : "Transition Speed",
			"min" : 0.001, "max" : 0.02,
			"step" : 0.001, "value" : 0.01
		},{
			"id" : "textureThreshold", "name" : "Texture Threshold",
			"min" : 0, "max" : 1,
			"step" : 0.01, "value" : 0.3
		}
	];
	
	var html = '';
	
	for (var p = 0; p < tranSliders.length; p++) {
		html += '<input type="text" id="' + tranSliders[p].id + '" /><span class="uk-form-help-block uk-margin-small-bottom">' + tranSliders[p].name + '</span>';
	}
	
	html += '<a class="md-btn md-btn-primary md-btn-small md-btn-block md-btn-wave-light waves-effect waves-button waves-light tranReset">Reset</a>' +
			'</div></div></div></div>';
	
	var item = $(html).appendTo('#transOptions')[0];
	
	$('.tranReset').click(function() {
		$('#transitionSpeed').data("ionRangeSlider").update({ from: tranInit.speed });
		$('#textureThreshold').data("ionRangeSlider").update({ from: tranInit.thres });
		transition.setSpeed(tranInit.speed);
		transition.setTextureThreshold(tranInit.thres);
	});	
	
	$('input[name="tranUsePattern"]').on('ifChanged', function (event) {		
		var $select_pattern = $('#tranTextures').selectize();
		var $slider_threshold = $("#textureThreshold").data("ionRangeSlider");		
		var select_pattern  = $select_pattern[0].selectize;		
		if(this.checked){			
			select_pattern.enable();
			$slider_threshold.update({ disable: false });		
		} else {
			select_pattern.disable();
			$slider_threshold.update({ disable: true });
		}
		transition.useTexture(this.checked);
	});
	
	for (var j = 0; j < tranSliders.length; j++) {	
		$('#' + tranSliders[j].id).ionRangeSlider({
			disable: false,
			hide_min_max: false,
			grid: true,
			min: tranSliders[j].min, max: tranSliders[j].max, from: tranSliders[j].value, step: tranSliders[j].step,		            	
			onChange: function(ui){		
				var value = parseFloat(ui.input[0].value);		
				if(ui.input[0].id == "transitionSpeed"){
					transition.setSpeed(value);
				} else if(ui.input[0].id == "textureThreshold"){
					transition.setTextureThreshold(value);
				}
			}
		});
	}	
	
}