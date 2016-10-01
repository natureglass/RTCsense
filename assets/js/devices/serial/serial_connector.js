SerialConnector = function(rtcstudio){
	
	var checkInterval = null,
		preAnalogValue = '', preDigitalValue = '',
		baudRate = 9600;
	
	var linkAppID = 'iccejeonidbdghffljiadmjjkeldpiff',
		linkExtID = 'cgiaclgflkoolhiffiblfmfiamgjpgno';		
	
	this.extInstalled = false;
	this.appInstalled = false;
	
	this.installState = 0;
	
	this.devices = {
		serial: []
	}
	
	this.btnStatus = 'check';
	this.lastCommand = '';
	this.lastStatus = '';
	
	this.close = function(deviceid){
		console.log("closing Serial! " + deviceid);
	}

	this.init = function(){
		
		rtcstudio.serialConnector.appendInStudio();		
		
	}
	
	this.appendInStudio = function() {

		var html =	'<h3 class="uk-accordion-title serialTitle">' +
				    	'Serial Devices <span class="SerialNum uk-badge uk-badge-notification uk-margin-left">0</span>' +
					'</h3>' +
				    '<div class="uk-accordion-content">' +
				
					    '<div class="uk-width-medium-1-1 uk-width-large-1-1">' +
							'<select id="serialDevices" data-md-selectize>' +
								'<option value="">Select...</option>' +
					        '</select>' +
					        '<span class="uk-form-help-block">Serial Devices</span>' +
					    '</div>' +
				
					    '<div class="uk-width-medium-1-1 serialWarn"></div>' +

					    
		                '<div class="uk-grid uk-grid-small" data-uk-grid-margin>' +
		                    '<div class="uk-width-medium-7-10 serialStatus">' +
		                        '<span class="md-color-blue-900">checking...</span>' +
							'</div>' +
		
							'<div class="uk-width-medium-3-10">' +
								'<a class="md-btn md-btn-primary md-btn-small md-btn-block md-btn-wave-light waves-effect waves-button waves-light uk-float-right disabled uk-text-nowrap serial-btn" onClick="rtcStudio.serialConnector.startDevice();">Start Device</a>' +
					    	'</div>' +
					    '</div>' +					    
				
				    '</div>';
    
		$('.deviceList .uk-accordion').prepend(html);

		$serialDevices = $('#serialDevices').selectize({
			onChange: function(value){
				$('.serial-btn').removeClass('disabled');
				rtcstudio.serialConnector.btnStatus = 'start';
			}
		});
		
		serialDevices = $serialDevices[0].selectize;
		serialDevices.disable();
		
	}

	this.showExtensionsInstalls = function(){
		
		var type = '', extState = '', appState = '';

		console.log("apprunning: " + rtcstudio.extensions.apprunning);
		console.log("extInstalled: " + rtcstudio.extensions.extInstalled);
		console.log("appInstalled: " + rtcstudio.extensions.appInstalled);
		console.log("devices: " + rtcstudio.extensions.devices.serial.length);
				
		if(!rtcstudio.extensions.extInstalled){
			
			$('.deviceList .serialWarn').html('<small class="md-color-red-A700"><b>Checking for extensions..</b> (click to install if not yet dene & refresh the application!)</small>');			
			$('.serial-btn').addClass('disabled');
			serialDevices = $('#serialDevices')[0].selectize;
			appState = 'disabled';
			rtcstudio.serialConnector.btnStatus = 'check';
			console.log(" -- 0 -- ");
			
		} else if(!rtcstudio.extensions.appInstalled){
			
			$('.deviceList .serialWarn').html('<small class="md-color-red-A700">Serial Link is needed, please click to install & <b>check connection!</small>');			
			$('.serial-btn').html('Check Connection').removeClass('disabled');
			extState = 'disabled';
			rtcstudio.serialConnector.btnStatus = 'check';
			console.log(" -- 1 -- ");
			
		} else if(rtcstudio.extensions.extInstalled & rtcstudio.extensions.appInstalled & !rtcstudio.extensions.apprunning){
			
			$('.deviceList .serialWarn').html('<small class="md-color-red-A700">Serial APP is not running, please <b>click Launch App!</small>');			
			$('.serial-btn').html('Launch App').removeClass('disabled');
			extState = 'disabled'; appState = 'disabled';
			rtcstudio.serialConnector.btnStatus = 'launch';
			console.log(" -- 2 -- ");
		}
				
		msg = '<div class="uk-grid uk-grid-small" data-uk-grid-margin>' +
				'<div class="uk-width-medium-1-2">';

		msg += '<a class="'+extState+' md-btn md-btn-block md-btn-primary md-btn-small md-btn-wave-light waves-effect waves-button waves-light uk-text-nowrap" onClick="rtcStudio.extensions.popExtInstaller();">Serial Link Client</a>';
						
		msg += '</div><div class="uk-width-medium-1-2">';
	
		msg += '<a class="'+appState+' md-btn md-btn-block md-btn-primary md-btn-small md-btn-wave-light waves-effect waves-button waves-light uk-text-nowrap" onClick="rtcStudio.extensions.popAppInstaller();">Serial Link Server</a>';
		
		msg += '</div></div>';
		
		if(rtcstudio.extensions.extInstalled & rtcstudio.extensions.appInstalled & rtcstudio.extensions.apprunning & rtcstudio.extensions.devices.serial.length){
			
			msg = '<span class="md-color-green-A700">Please select device!</span>';
			$('.serial-btn').html('Start Device').addClass('disabled');			
			console.log(" -- 3 -- ");
			
		} else if(rtcstudio.extensions.extInstalled & rtcstudio.extensions.appInstalled & rtcstudio.extensions.apprunning & !rtcstudio.extensions.devices.serial.length){
			
			$('.deviceList .serialWarn').html('');
			$('.serial-btn').html('Start Device').addClass('disabled');
			msg = ('<span class="md-color-red-A700">No devices found!</span>');
			console.log(" -- 4 -- ");
		}
		
		checkForDevices();
		
		if(msg.length){
			$('.deviceList .serialStatus').html(msg);
		}
	}
	
	this.bridgeUpdate = function(event){
		
	
		if(event.init === "app"){
		
			console.log(event);
			$('.deviceList .serialWarn').html('');
			//$('.deviceList .serialStatus').html('');
			rtcstudio.serialConnector.showExtensionsInstalls();			
			//$('.serial-btn').html('Start Device').addClass('disabled');
			
		} else if (typeof event.onReceive !== 'undefined') {
			
			var dataBlock = event.onReceive.split('E');
			 
			for (var j=0; j<dataBlock.length; j++){
				
				var indexAD = dataBlock[j].indexOf('A'), type = 'A';
				if(indexAD === -1){ indexAD = dataBlock[j].indexOf('D'); type = 'D'; }
				
				var indexV = dataBlock[j].indexOf('V');
				var indexE = dataBlock[j].indexOf('E');

				if(indexAD == 0 && indexAD < indexV && indexV == dataBlock[j].lastIndexOf('V') && indexV >= 0){
					
					var pin = parseInt(dataBlock[j].substring(indexAD+1,indexV));
					var value = dataBlock[j];
					
					if(!isNaN(value)){
						var currentValue = parseInt(value);
					} else {
						var currentValue = value;
					};
					
					if(type === 'A'){

						if(preAnalogValue !== currentValue){
							preAnalogValue = currentValue;
							involtReceivedPin = { pin: pin, type: type, value: currentValue }
							//console.log(involtReceivedPin);
							updateScene(involtReceivedPin);
						}
						
					} else {

						if(preDigitalValue !== currentValue){
							preDigitalValue = currentValue;
							involtReceivedPin = { pin: pin, type: type, value: currentValue }
							updateScene(involtReceivedPin);
						}
						
					}
					
				}

			};

		} else if (typeof event.onGetDevices !== 'undefined' || event.status === "app_installed" || event.status === "app_closed") {
			
			rtcstudio.serialConnector.showExtensionsInstalls();
			
		} else if(event.status === "app_restarting"){
			
			$serialDevices = $('#serialDevices').selectize();
			serialDevices = $serialDevices[0].selectize;
			serialDevices.disable();
			$('.serial-btn').addClass('disabled');
			$('.deviceList .serialWarn').html('<span class="md-color-red-500"><small><B>Port connection failed..</b></small></span>');
			$('.deviceList .serialStatus').html('<span class="md-color-red-500">Restarting app, please wait...</span>');
		}
		
		//console.log(event);
	}
	
	function updateScene(data){

		for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){
			var thisScene = rtcstudio.ThreeJS.scenes[i];
			var exists = (typeof thisScene.onInputUpdate === 'function') ? true : false;
			if (exists){ thisScene.onInputUpdate({ type: "SERIAL", input: data }) };
		}

	}
	
	this.startDevice = function(){

		switch (rtcstudio.serialConnector.btnStatus) {
			case "check":
				console.log("checking....");
				rtcstudio.serialConnector.showExtensionsInstalls();
				break;
				
			case "launch":
				$('.serial-btn').addClass('disabled');
				$('.deviceList .serialWarn').html('');
				$('.deviceList .serialStatus').html('<span class="md-color-red-500">Launching app, please wait...</span>');
				rtcstudio.extensions.launchApp();
				break;

			case "start":
				var serialDevices = $('#serialDevices')[0].selectize;
				var selectedPort = serialDevices.getValue();
				rtcstudio.extensions.serialReq({ connect: selectedPort, baudRate: baudRate });
				$('.deviceList .serialWarn').html('<span class="md-color-blue-500"><small><b>Device on ' + selectedPort + ' connectd!</b></small></span>');
				break;
		}
		
	}

	function checkForDevices(){
		
		var serial = rtcstudio.extensions.devices.serial;
		
		$('.deviceList .SerialNum').html(serial.length);

		var serialBlueDev = [];
		
		for (i = 0; i < serial.length; i++){
			console.log(serial[i]);
			serialBlueDev.push({'$order': i, 'text': serial[i].name, 'value': serial[i].port, 'index': i });		
		}
		
		var serialBlueDevices = $('#serialDevices');		
		serialBlueDevices.html('');
		  
		var serialBlueSelectize = serialBlueDevices[0].selectize;
		serialBlueSelectize.clear();
		serialBlueSelectize.clearOptions();
		serialBlueSelectize.load(function(callback) {
			callback(serialBlueDev);
		});
		
		if(serial.length){
			serialBlueSelectize.enable();
		} else {
			serialBlueSelectize.disable();
			//$('.serial-btn').addClass('disabled');
		}
		
	}
	
	this.init = function(){
		
		rtcstudio.serialConnector.appendInStudio();
		rtcstudio.serialConnector.showExtensionsInstalls();

	}
	

}
		