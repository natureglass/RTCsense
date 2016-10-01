gamepadSetup = function(rtcstudio){

	var gamepad = rtcstudio.gamepad;

	// Appending Accordion Block for GamePads
	var html =	'<h3 class="uk-accordion-title gamepadTitle">Joysticks / GamePads <span class="gamepadsNum uk-badge uk-badge-notification uk-margin-left">0</span></h3>' +
			    '<div class="uk-accordion-content">' +
				    '<div class="uk-width-medium-1-1 uk-width-large-1-1">' +
						'<select id="joyDevices" data-md-selectize>' +
							'<option value="">Select...</option>' +
				        '</select>' +
				        '<span class="uk-form-help-block">Joystick Controlers</span>' +
				    '</div>' +
				    
	                '<div class="uk-grid uk-grid-small" data-uk-grid-margin>' +
	                    '<div class="uk-width-medium-7-10 joyStatus">' +
	                        '<span class="md-color-blue-900"></span>' +
						'</div>' +
	
						'<div class="uk-width-medium-3-10">' +
							'<a class="md-btn md-btn-primary md-btn-small md-btn-block md-btn-wave-light waves-effect waves-button waves-light uk-float-right disabled uk-text-nowrap gamepad-btn" onClick="startJoyControler();">Start Device</a>' +
				    	'</div>' +
				    '</div>' +
			    				    
			    '</div>';

	$('.deviceList .uk-accordion').prepend(html);
	
	$joyDevices = $('#joyDevices').selectize({
		onChange: function(value){
			$('.gamepad-btn').removeClass('disabled');
		}		
	});
	joyDevices = $joyDevices[0].selectize;
	joyDevices.disable();
	
	$('.joyStatus').html('<span class="md-color-red-500">No devices found..</span>');
	
	gamepad.close = function(deviceid){
		console.log("closing GamePad! " + deviceid);
	}
	
	// Gamepad Devices
	gamepad.appendGamepadDevice = function(device){
		
		$('#midiDevices').trigger('click');
		$('#inputSettings').trigger('click');	
		
		var html =	'<div class="uk-width-small-1-2 uk-width-medium-1-3 uk-margin-small-bottom inputPanel">' +
			'<div class="md-card">' +
				'<div class="md-card-toolbar">' +
					'<div class="md-card-toolbar-actions">' +
						'<i class="md-icon material-icons md-card-close">&#xE14C;</i>' +
					'</div>' +
					//'<h3 class="md-card-toolbar-heading-text"></h3>' +
					'<span class="md-card-toolbar-heading-text">' +
						//'<i class="uk-sortable-handle uk-icon uk-icon-bars uk-margin-small-right"></i>' +
						'<i class="material-icons md-color-red-A400 item" data-uk-tooltip title="'+device.id+'">usb</i>' +
					'</span>' +
				'</div>' +
				'<div class="canvasContainer">' +
					'<div class="gamepad_' + device.index+'" style="text-align: center; margin: auto;">' +					
						'<img src="assets/img/xbox_controller.jpg" id="gamepad_' + device.index+'" style="width: 100%;">';
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>';			
		$("#midiPreview").append(html);		
		
		gamepad.buildGamepadTools(device);
		
	}
	
	gamepad.buildGamepadTools = function(device){
		var title = device.id.substr(0, device.id.indexOf('(')); 
		var type = device.id.substring(device.id.indexOf('(') + 1, device.id.length - 1);
		
		var html = '<div class="uk-width-medium-1-1 uk-margin-small-bottom">' +
				'<div class="md-card">' +
					'<div class="md-card-content">' +
						'<h3 class="heading_a uk-margin-small-bottom">'+title+'</h3>' +		                    
		            	'<div class="uk-width-medium-1-1">' +
		            		'<img src="assets/img/xbox_controller.jpg" class="brandLogo">' +
		            		'<p>index: <b>' + device.index + '</b><br>' +
		            		'Name: <b>' + title + '</b><br>' +
		            		'type: <b>' + type + '</b><br>' +
		            		'Buttons: <b>' + device.buttons.length + '</b><br>' +
		            		'Axes: <b>' + device.axes.length + '</b><br>' +
		            		'<span id="joyRawData"></span></p>' +
		            	'</div>' +
		            '</div>' +
				'</div>' +
		   '</div>';
		
		$('#InputDevicesTools').html(html);		
	}
	
	gamepad.startJoyControler = function(){
		
		var joyControler = $('#joyDevices').selectize()[0];	
		if(joyControler.length){
			
			var joyIndex = joyControler.value.substring(8);
			
			//$('#midiPreview .inputPanel').find('.md-card').removeClass('selected');
			//$('#midiPreview .inputPanel .' + joyIndex).closest('.md-card').addClass('selected');
			
			$("#joyDevices")[0].selectize.clear();
			
			for (i = 0; i < gamepad.gamepads.length; i++){				
				if(gamepad.gamepads[i].index == joyIndex){
					gamepad.appendGamepadDevice(gamepad.gamepads[i]);
				}
			}
		}	
	}
	
	gamepad.updateGamePads = function(device){
		$('.deviceList .gamepadsNum').html(gamepad.gamepads.length);
		
		var joyInDev = [];
		
		for (i = 0; i < gamepad.gamepads.length; i++){
			var uniqueid = "gamepad_" + device.index;			
			joyInDev.push({'$order': gamepad.gamepads[i].index, 'text': gamepad.gamepads[i].index+': '+gamepad.gamepads[i].id, 'value': uniqueid, 'index': gamepad.gamepads[i].index });		
		}
		
		var joyInDevices = $('#joyDevices');		
		joyInDevices.html('');
		  
		var joyInSelectize = joyInDevices[0].selectize;
		joyInSelectize.clear();
		joyInSelectize.clearOptions();
		joyInSelectize.load(function(callback) {
			callback(joyInDev);
		});

		var msg = '';
		
		if(joyInDev.length){
			
			$('.gamepadTitle').addClass('uk-accordion-title-success');
			msg = '<span class="md-color-blue-500">Gamepad detected!</span>';
			//$('.gamepad-btn').removeClass('disabled');
			joyInSelectize.enable();
			
		} else {
			
			$('.gamepadTitle').removeClass('uk-accordion-title-success');
	    	msg = '<span class="md-color-red-500">No devices found..</span>';
	    	$('.gamepad-btn').addClass('disabled');
	    	joyInSelectize.disable();
	    	
		}
		
		$('.joyStatus').html(msg);

	}
	
	gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
		console.log('Connected', device);
	
		$('#gamepads').append('<li id="gamepad-' + device.index + '"><h1>Gamepad #' + device.index + ': &quot;' + device.id + '&quot;</h1></li>');
		
		// ------ Setting Gamepads in DropDown ------ //
		gamepad.updateGamePads(device);
		// -------------------------------------- //
		
		var mainWrap = $('#gamepad-' + device.index),
			statesWrap,
			logWrap,
			control,
			value,
			i;
	
		mainWrap.append('<strong>State</strong><ul id="states-' + device.index + '"></ul>');
		mainWrap.append('<strong>Events</strong><ul id="log-' + device.index + '"></ul>');
	
		statesWrap = $('#states-' + device.index)
		logWrap = $('#log-' + device.index)
	
		for (control in device.state) {
			value = device.state[control];
	
			statesWrap.append('<li>' + control + ': <span id="state-' + device.index + '-' + control + '">' + value + '</span></li>');
		}
		for (i = 0; i < device.buttons.length; i++) {
			value = device.buttons[i];
			statesWrap.append('<li>Raw Button ' + i + ': <span id="button-' + device.index + '-' + i + '">' + value + '</span></li>');
		}
		for (i = 0; i < device.axes.length; i++) {
			value = device.axes[i];
			statesWrap.append('<li>Raw Axis ' + i + ': <span id="axis-' + device.index + '-' + i + '">' + value + '</span></li>');
		}
	
		$('#connect-notice').hide();
	});
	
	gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
		console.log('Disconnected', device);
	
		$('#gamepad-' + device.index).remove();
	
		//if (gamepad.count() == 0) {
		//	$('#connect-notice').show();
		//}

		$('.inputPanel .gamepad_' + device.index).closest('.inputPanel').fadeOut("normal", function(){
			this.remove();
			$('#InputDevicesTools').html('');
			rtcstudio.gamepad.selectRemaining();
		});
		
		gamepad.updateGamePads(device);
		
	});
	
	gamepad.selectRemaining = function(){
		console.log("*** Seleting remaining! ****");
	}
	
	gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
		
		rtcstudio.gamepad.updateSceneData({
			index: e.gamepad.index,
			type: "BUTTON",
			data: e.control,
			value: true,
			action: "DOWN"
		});
		
		$('#log-' + e.gamepad.index).append('<li>' + e.control + ' down</li>');
		
		//var gamepadRAW = '<b>' + e.control + '</b> down';
		//$('#joyRawData').html(gamepadRAW);
		
	});
	
	gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {

		rtcstudio.gamepad.updateSceneData({
			index: e.gamepad.index,
			type: "BUTTON",
			data: e.control,
			value: false,
			action: "UP"
		});
				
		$('#log-' + e.gamepad.index).append('<li>' + e.control + ' up</li>');
		
		//var gamepadRAW = '<b>' + e.control + '</b> up';
		//$('#joyRawData').html(gamepadRAW);

	});
	
	gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {

		rtcstudio.gamepad.updateSceneData({
			index: e.gamepad.index,
			type: "AXIS",
			data: e.axis,
			value: e.value,
			action: "CHANGED"
		});
		
		$('#log-' + e.gamepad.index).append('<li>' + e.axis + ' changed to ' + e.value + '</li>');
		
		//var gamepadRAW = '<b>' + e.axis + '</b> changed to <b>' + e.value + '</b>';
		//$('#joyRawData').html(gamepadRAW);
		
	});
	
	gamepad.updateSceneData = function(obj){
		for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){		
			var thisScene = rtcstudio.ThreeJS.scenes[i];
			var exists = (typeof thisScene.onInputUpdate === 'function') ? true : false;
			if (exists){ thisScene.onInputUpdate({ type: "GAMEPAD", input: obj }) };
		}
	}
	
	if (!gamepad.init()) {
		alert('Your browser does not support gamepads, get the latest Google Chrome or Firefox.');
	}
}