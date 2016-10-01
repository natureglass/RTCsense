Sensors = function(rtcstudio){

	// Device Motion Variables
	var x = 0, y = 0, z = 0, vx = 0, vy = 0, vz = 0, ax = 0, ay = 0, az = 0, ai = 0, arAlpha = 0, sensorsCnt = 0,
		arBeta = 0, arGamma = 0, alpha = 0, beta = 0, gamma = 0, delay = 100, vMultiplier = 0.01, watchID = null;
	
	this.init = function(){
		
		rtcstudio.sensors.appendInStudio();
		
		if(DetectRTC.isDeviceMotionSupported){
			rtcstudio.sensors.startMotionSensor();	
		}

		if(DetectRTC.isDeviceOrientationSupported){
			rtcstudio.sensors.startOrientationSensor();	
		}
		
		//if(DetectRTC.isGeolocationSupported){
		//	rtcstudio.sensors.startGeolocationDevice();	
		//}
		
		if(DetectRTC.isDeviceLightEventSupported){
			rtcstudio.sensors.startLightSensor();	
		}
		
		if(DetectRTC.isBatterySupported){
			rtcstudio.sensors.startBatterySensor();	
		}
	}
	
	this.appendInStudio = function(){
		
		var html = '';

		if(DetectRTC.isGeolocationSupported){
			sensorsCnt++;
			html += '<div class="uk-width-1-1 uk-grid-margin">' + //'<div class="uk-width-1-1 uk-margin-small">' + 
					'<a class="md-btn md-btn-primary md-btn-block md-btn-wave-light waves-effect waves-button waves-light uk-float-right uk-text-nowrap geo-btn" onClick="rtcStudio.sensors.startGeolocationDevice();">Start Geolocation device</a>' +
					'</div>';
		}
		
		if(DetectRTC.isDeviceMotionSupported){
			sensorsCnt++;
			html += '<div class="uk-width-1-1 uk-grid-margin">' + //'<div class="uk-width-1-1 uk-margin-small">' + 
				   '<a class="md-btn md-btn-primary md-btn-block md-btn-wave-light waves-effect waves-button waves-light uk-float-right uk-text-nowrap sens-btn" onClick="rtcStudio.sensors.startMotionSensor();">Start Gyroscope Sensor</a>' +
				   '</div>';
		}
		
		if(DetectRTC.isDeviceOrientationSupported){
			sensorsCnt++;
			html += '<div class="uk-width-1-1 uk-grid-margin">' + //'<div class="uk-width-1-1 uk-margin-small">' + 
					'<a class="md-btn md-btn-primary md-btn-block md-btn-wave-light waves-effect waves-button waves-light uk-float-right uk-text-nowrap geo-btn" onClick="rtcStudio.sensors.startOrientationSensor();">Start Orientation Sensor</a>' +
					'</div>';
		}
		
		if(DetectRTC.isDeviceLightEventSupported){
			sensorsCnt++;
			html += '<div class="uk-width-1-1 uk-grid-margin">' + // '<div class="uk-width-1-1 uk-margin-small">' +  
					'<a class="md-btn md-btn-primary md-btn-block md-btn-wave-light waves-effect waves-button waves-light uk-float-right uk-text-nowrap light-btn" onClick="rtcStudio.sensors.startLightSensor();">Start Light Sensor</a>' +
					'</div>';
		}

		if(DetectRTC.isBatterySupported){
			sensorsCnt++;
			html += '<div class="uk-width-1-1 uk-grid-margin">' + //'<div class="uk-width-1-1 uk-margin-small">' +  
					'<a class="md-btn md-btn-primary md-btn-block md-btn-wave-light waves-effect waves-button waves-light uk-float-right uk-text-nowrap light-btn" onClick="rtcStudio.sensors.startBatterySensor();">Start Battery Sensor</a>' +
					'</div>';
		}
		
		$('.uk-sensors').append(html);
		
		if(sensorsCnt > 0){
			$('.devSensors').addClass('uk-accordion-title-success');
			$('.sensorsNum').html(sensorsCnt);
		}
		
	}
	
	this.startMotionSensor = function(){
	
		window.ondevicemotion = function(event) {
			
			ax = Math.round(Math.abs(event.accelerationIncludingGravity.x * 1));
			ay = Math.round(Math.abs(event.accelerationIncludingGravity.y * 1));
			az = Math.round(Math.abs(event.accelerationIncludingGravity.z * 1));			
			ai = Math.round(event.interval * 100) / 100;
			
			rR = event.rotationRate;
			if (rR != null) {
				arAlpha = Math.round(rR.alpha);
				arBeta = Math.round(rR.beta);
				arGamma = Math.round(rR.gamma);
			}
			
			var sensors = {
				acceleration: {
					x: Math.abs(event.acceleration.x * 1000),
					y: Math.abs(event.acceleration.y * 1000),
					z: Math.abs(event.acceleration.z * 1000)
				},					
				accelerationGravity: {
					x: ax,
					y: ay,
					z: az
				},
				rotationRate: {
					x: arAlpha,
					y: arBeta,
					z: arGamma
				},
				interval: ai
			};

			for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){
				var thisScene = rtcstudio.ThreeJS.scenes[i];
				var exists = (typeof thisScene.onInputUpdate === 'function') ? true : false;
				if (exists){ thisScene.onInputUpdate({ type: "DEVICEMOTION", input: sensors }) };
			}

		}
		
	}
	
	this.startOrientationSensor = function(){
/*
		window.onorientationchange = function(event){ // Not working for some reason...
			
			for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){
				var thisScene = rtcstudio.ThreeJS.scenes[i];
				var exists = (typeof thisScene.onInputUpdate === 'function') ? true : false;
				if (exists){ thisScene.onInputUpdate({ type: "ORIENTATION", input: window.orientation }) };				
			}

		}
*/		
		window.ondeviceorientation = function(event) {
			console.log(event);
			alpha = Math.round(event.alpha);
			beta = Math.round(event.beta);
			gamma = Math.round(event.gamma);
			
			var gyro = {
				x: alpha,
				y: beta,
				z: gamma
			}
			
			for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){
				var thisScene = rtcstudio.ThreeJS.scenes[i];
				var exists = (typeof thisScene.onInputUpdate === 'function') ? true : false;
				if (exists){ thisScene.onInputUpdate({ type: "GYROSCOPE", input: gyro }) };
				
			}
			
		}
		
	}

	this.startLightSensor = function(){
		
		window.addEventListener('devicelight', function(event) {
			
			rtcstudio.sensors.lightValue = event.value;
			
			if (event.value < 50) {				
				rtcstudio.sensors.lightState = 'darklight';
			} else {
				rtcstudio.sensors.lightState = 'brightlight';
			}
			  
			var lightSen = {
				value: event.value,
				state: rtcstudio.sensors.lightState
			};
			
			for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){
				var thisScene = rtcstudio.ThreeJS.scenes[i];
				var exists = (typeof thisScene.onInputUpdate === 'function') ? true : false;
				if (exists){ thisScene.onInputUpdate({ type: "LIGHTSENSOR", input: lightSen }) };
			}
			
		});

	}
	
	this.startBatterySensor = function(){
		
		navigator.getBattery().then(function(battery) {
			
			updateBatteryStatus(battery);
			
		    battery.onlevelchange = updateBatteryStatus(battery);
		    battery.onchargingchange = updateBatteryStatus(battery);
		    battery.onchargingtimechange = updateBatteryStatus(battery);
		    battery.oncdischargingtimechange = updateBatteryStatus(battery);
		    battery.onlevelchange = updateBatteryStatus(battery);

		});
		
	}
	
	function updateBatteryStatus(battery){
		
		var bttLevel = Math.floor(battery.level * 100),
			bttEvent = '', bttTime = 0;
		
        if(battery.charging){
        	bttTime = Math.round(battery.chargingTime / 60);
        	bttEvent = "charging";
        } else {
        	bttTime = Math.round(battery.dischargingTime / 60);
        	bttEvent = "discharging";        	
        }

        $('#battLevel').html(bttLevel + "%" );
        $('#battEvent').html(bttEvent);
        $('#battTime').html(bttTime);
        
        var battStatus = {
        	level: bttLevel,
        	event: bttEvent,
        	time: bttTime
        }
        
		for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){
			var thisScene = rtcstudio.ThreeJS.scenes[i];
			var exists = (typeof thisScene.onInputUpdate === 'function') ? true : false;
			if (exists){ thisScene.onInputUpdate({ type: "BATTERY", input: battStatus }) };
		}
		
	}
	
	this.startGeolocationDevice = function(){

		if(watchID === null){
			
	        var options = {enableHighAccuracy: true,timeout: 5000,maximumAge: 0,desiredAccuracy: 0, frequency: 1 };	        
	        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
	        
		}
		
	}

    function onSuccess(position) {

		for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){		
			var thisScene = rtcstudio.ThreeJS.scenes[i];
			var exists = (typeof thisScene.onInputUpdate === 'function') ? true : false;
			if (exists){ thisScene.onInputUpdate({ type: "GEOLOCATION", input: position }) };
		}
    }

    // onError Callback receives a PositionError object
    function onError(error) {
    	$('.geoStatus').html(error.message + ' (code: ' + error.code + ')');
    }
    
    // clear the watch that was started earlier
    this.clearWatch = function(){
        if (watchID != null) {
            navigator.geolocation.clearWatch(watchID);
            watchID = null;
        }
    }
	
/*	function buildSensorsTools(){

		var html = '<div class="uk-width-medium-1-1 uk-margin-small-bottom">' +
				'<div class="md-card">' +
					'<div class="md-card-content">' +
						'<h3 class="heading_a uk-margin-small-bottom">Sensors</h3>' +		                    
	                	'<div class="uk-width-medium-1-1">' +
	                		'<img src="assets/img/sensors.jpg" class="brandLogo" style="height: 50%; width: auto;">' +
	                		'Interval: <b><span id="sensInt"></span></b><br>' +
	                		'Velocity: <b><span id="sensVel"></span></b><br>' +
	                		'Acceleration: <b><span id="sensAcc"></span></b><br>' +
	                		'Gyroscope: <b><span id="sensGyr"></span></b><br>' +
	                	'</div>' +
		            '</div>' +
				'</div>' +
		   '</div>';
		
		$('#InputDevicesTools').html(html);
	}
	
	function appendSensorsDevice(){
		
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
						'<i class="material-icons md-color-red-A400 item" data-uk-tooltip title="Geolocation">usb</i>' +
					'</span>' +
				'</div>' +								
				'<div class="canvasContainer">' +
					'<div class="sensorsDev" style="text-align: center; margin: auto;">' +					
						'<img src="assets/img/sensors.jpg" id="sensorsDev" style="width: 100%;">';
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>';			
		$("#midiPreview").append(html);
		
		setSelectedHID('sensorsDev');
		
		buildSensorsTools();
	}*/
	
}