Midi = function(rtcstudio){
	
	// INIT MIDI Devices
	this.init = function(){

		rtcstudio.midi.appendInStudio();
		
		if(navigator.requestMIDIAccess !== undefined){
			navigator.requestMIDIAccess().then(
		      function onFulfilled(access){		    	
		    	  
		    	// Get MIDI access
		    	rtcstudio.midi.access = access;
		    	
		    	// Get MIDI Devices
		    	rtcstudio.midi.devices = getMidiDevices(access);
		    	
		    	// Update the device list when State is changed
		    	access.onstatechange = function(event){
					checkMidiDevices(event);
		        }
		        
		      },
		      function onRejected(e){
		        // something went wrong while requesting the MIDI devices
		    	  console.log(e.message);
		      }
		    );
		    
		} else {
			
		    // browsers without WebMIDI API and Jazz plugin
	    	$('.midiTitle').removeClass('uk-accordion-title-success').addClass('uk-accordion-title-danger');
	    	msg = '<span class="md-color-red-500">MIDI is not supported for this Browser/OS version yet.</span>';

	    	$('.midiStatus').html(msg);

	    	$('.midi-btn').addClass('disabled');

	    	var select = $("#midiInDevices").selectize();
	    	$(select).parent().find('.uk-form-help-block').hide();

	    	var selectize = select[0].selectize;
	    	selectize.$wrapper[0].style.display = "none";

		    console.log('No access to MIDI devices: browser does not support WebMIDI API, please use the WebMIDIAPIShim together with the Jazz plugin');

		}

	}

	// Closing MIDI Port
	this.close = function(deviceid){
		
		var midiInPort = rtcstudio.midi.access.inputs.get(deviceid.substring(5));

		if (typeof midiInPort !== 'undefined') {			
			midiInPort.close();
		}		
	}
	
	this.getMidiDeviceByID = function(deviceid){
		var thisMidi = null;
		for (i = 0; i < rtcstudio.midi.devices.midiIn.length; i++){
			if(rtcstudio.midi.devices.midiIn[i].value == deviceid){			
				thisMidi = rtcstudio.midi.devices.midiIn[i];
				break;
			}
		}	
		return thisMidi;
	}
	
	// Start a MIDI Device
	this.startMidiDevice = function(){
		
		var midiAccess = rtcstudio.midi.access;
		var midiInPort = "false", midiOutPort = "false";
		var midiInDevice = $('#midiInDevices').selectize()[0];
	
		if(midiInDevice.length){		

			//console.log(midiInDevice.value);			
			//var thisMidi = rtcstudio.midi.getMidiDeviceByID(midiInDevice.value);			
			//console.log(thisMidi.id);			
			//rtcstudio.midi.selected = thisMidi;
			
			var portid = midiInDevice.value.substring(5);
			
			var midiInPort = rtcstudio.midi.access.inputs.get(portid);			
			midiInPort.onmidimessage = midiListener;
			
			var midiInSelectize = $("#midiInDevices")[0].selectize;
			midiInSelectize.clear();
			
		}		
	}
	
	// Set selected Device
//	this.setSelectedDevice = function(deviceid){

//		setSelectedHID(deviceid);
		
//		$('#midiPreview .inputPanel').find('.md-card').removeClass('selected');
//		$('#midiPreview .inputPanel .' + deviceid).closest('.md-card').addClass('selected');
//
//		if(rtcstudio.midi.selected){			
//			var selectedid = rtcstudio.midi.selected.id;
//			if(selectedid !== deviceid.substring(5)){			
//				var thisMidi = getMidiDeviceByID(deviceid);
//				rtcstudio.midi.selected = thisMidi;
//				//console.log(rtcstudio.midi.selected);
//			}			
//		}
//		
//	}
	
	this.selectRemaining = function(){
		
		// Fetching the Remaining Panels
		var inputPanels = $('#midiPreview .inputPanel');
		//console.log(inputPanels.length);
		
		if(inputPanels.length){
			var lastPannel;
			
			inputPanels.each(function (index, value) {
				lastPannel = value; 
			});
			
			var lastPanelImg = $(lastPannel).find('img');
			
			var selectedMidiId = lastPanelImg[0].id;
						
			//setSelectedHID('midi_' + lastPanelImg[0].id);
			//rtcstudio.midi.setSelectedDevice(selectedMidiId);
			
			var thisMidi = rtcstudio.midi.getMidiDeviceByID(selectedMidiId);			
			
			rtcstudio.midi.buildMidiTools(thisMidi);
			
		} else {
			$('#InputDevicesTools').html('');
		}
		
	}
	
	// Get MIDI Devices
	function getMidiDevices(access){
		
		var midiInDev = [];
		var midiOutDev = [];
		var inputs = access.inputs;
		var outputs = access.outputs;
  
		inputs.forEach(function(port){
			var uniqueid = "midi_" + port.id;
			midiInDev.push({'$order': 0, 'text':port.name + ' (ver. '+port.version+')', 'value': uniqueid, 'manufacturer': port.manufacturer, 'name': port.name, 'id': port.id, 'version': port.version });
		});
	
		outputs.forEach(function(port){
			var uniqueid = "midi_" + port.id;
			midiOutDev.push({'$order': 0, 'text':port.name + ' (ver. '+port.version+')', 'value': uniqueid, 'manufacturer': port.manufacturer, 'name': port.name, 'id': port.id, 'version': port.version });
		});
	
		var devices = {
			midiIn: midiInDev,
			midiOut: midiOutDev
		}		
		
		var midiInDevices = $('#midiInDevices');		
		midiInDevices.html('');
		  
		var midiInSelectize = midiInDevices[0].selectize;
		midiInSelectize.clear();
		midiInSelectize.clearOptions();
		midiInSelectize.load(function(callback) {
			callback(midiInDev);
		});
		
		$('.deviceList .midiNum').html(midiInDev.length);
		
		var msg = '';
		
		if(midiInDev.length){
	    	msg = '<span class="md-color-blue-500">MIDI device detected!</span>';	
	    	
			$('.midiTitle').addClass('uk-accordion-title-success');
			
			midiInSelectize.enable();
			
		} else {
			
	    	msg = '<span class="md-color-red-500">No devices found..</span>';
			$('.midiTitle').removeClass('uk-accordion-title-success');
			
			midiInSelectize.disable();
			$('.midi-btn').addClass('disabled');
		}
		
		$('.midiStatus').html(msg);
		
		return devices;
	}

	// Check Devices for Updates
	function checkMidiDevices(event){
		var device = event.port;
		
		if(device.connection === 'open' & device.state === 'connected' & device.type === 'input'){
			console.warn("Midi Device is now CONNECTED / OPEN : " + device.name);

			var midiDevices = getMidiDevices(rtcstudio.midi.access);
			rtcstudio.midi.devices = midiDevices;
			
			// Setting HID as selected!
			//rtcstudio.global.selectedHID = 'midi_' + device.id;

			var thisMidi = rtcstudio.midi.getMidiDeviceByID('midi_' + device.id);
			appendMidiDevice(thisMidi);
			
		} else if(device.connection === 'closed' & device.state === 'connected' & device.type === 'input'){
			console.warn("Midi Device is now CONNECTED / CLOSED : " + device.name);

			var midiDevices = getMidiDevices(rtcstudio.midi.access);
			rtcstudio.midi.devices = midiDevices;

		} else if(device.connection === 'closed' & device.state === 'disconnected' & device.type === 'input'){		
			console.warn("Midi Device Disconnected! : " + device.name);

			var midiDevices = getMidiDevices(rtcstudio.midi.access);
			rtcstudio.midi.devices = midiDevices;

		} else if(device.connection === 'pending' & device.state === 'disconnected' & device.type === 'input'){
			
			console.warn("Midi Device is now DISCONNECTED / PENDING : " + device.name);
			
			var midiDevices = getMidiDevices(rtcstudio.midi.access);
			rtcstudio.midi.devices = midiDevices;
			
			removeSelectedHID('midi_' + device.id);
			
			//$('.inputPanel .midi_' + device.id).closest('.inputPanel').fadeOut("normal", function(){
			//	this.remove();
			//	rtcstudio.midi.selectRemaining();
			//});
			
		}
		
		//console.log(device);
		
	}
	
	// MIDI listeners
	function midiListener(midimessageEvent){
	
		var port, portId = midimessageEvent.srcElement.id,
			data = midimessageEvent.data,
			type = data[0],
			data1 = data[1],
			data2 = data[2];
	
		var msg = {
			index: portId,
			data: data,
			type: type,
			data1: data1,
			data2: data2
		}
	
		var midiAccess = rtcstudio.midi.access;
		
		//console.log(rtcstudio.midi.selected);
		
		//if(rtcstudio.midi.selected.id === portId){
		if(rtcstudio.global.selectedHID === 'midi_' + portId){
			$('#deviceRawData').html("RAW: ( type: " + type + ", data1: " + data1 + ", data2: " + data2 + ' )');
			
			for (i = 0; i < rtcstudio.ThreeJS.scenes.length; i++){		
				var thisScene = rtcstudio.ThreeJS.scenes[i];
				var exists = (typeof thisScene.onInputUpdate === 'function') ? true : false;
				if (exists){ thisScene.onInputUpdate({ type: "MIDI", input: msg }) };
			}
		}	
	}
	
	// Appending MIDI device to Preview
	function appendMidiDevice(device){
		
		$('#midiDevices').trigger('click');
		$('#inputSettings').trigger('click');	
	
		var imgLogo = getDeviceLogo(device.manufacturer);
		
		var html =	'<div class="uk-width-small-1-2 uk-width-medium-1-3 uk-margin-small-bottom inputPanel">' +
			'<div class="md-card">' +
				'<div class="md-card-toolbar">' +
					'<div class="md-card-toolbar-actions">' +
						'<i class="md-icon material-icons md-card-close">&#xE14C;</i>' +
					'</div>' +
					//'<h3 class="md-card-toolbar-heading-text"></h3>' +
					'<span class="md-card-toolbar-heading-text">' +
						//'<i class="uk-sortable-handle uk-icon uk-icon-bars uk-margin-small-right"></i>' +
						'<i class="material-icons md-color-red-A400 item" data-uk-tooltip title="'+device.name+'">usb</i>' +
					'</span>' +
				'</div>' +								
				'<div class="canvasContainer">' +
					'<div class="midi_' + device.id+'" style="text-align: center; margin: auto;">' +					
						'<img src="assets/img/'+imgLogo+'" id="midi_' + device.id+'" style="width: 100%;">';
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>';			
		$("#midiPreview").append(html);
		
		//console.log('midi_' + device.id);
		//rtcstudio.midi.setSelectedDevice('midi_' + device.id);
		
		setSelectedHID('midi_' + device.id);
		
		rtcstudio.midi.buildMidiTools(device);
		
	}

	this.buildMidiTools = function(device){
		
		var imgLogo = getDeviceLogo(device.manufacturer);

		var html = '<div class="uk-width-medium-1-1 uk-margin-small-bottom">' +
				'<div class="md-card">' +
					'<div class="md-card-content">' +
						'<h3 class="heading_a uk-margin-small-bottom">'+device.manufacturer+'</h3>' +		                    
	                	'<div class="uk-width-medium-1-1">' +
	                		'<img src="assets/img/'+imgLogo+'" class="brandLogo">' +
	                		'<p>Port: <b>' + device.id + '</b><br>' +
	                		'Name: <b>' + device.name + '</b><br>' +
	                		'Version: <b>' + device.version + '</b><br>' +
	                		'Manufacturer: <b>' + device.manufacturer + '</b><br>' +
	                		'<span id="deviceRawData"></span></p>' +
	                	'</div>' +
		            '</div>' +
				'</div>' +
		   '</div>';
		
		$('#InputDevicesTools').html(html);
	}
	
	function getDeviceLogo(manufacturer){
		
		var brandLogo = 'midiDevice.png';	
		
		if(manufacturer.indexOf("AKAI") > -1){
			brandLogo = 'akai_pro.jpg';
		}
		
		if(manufacturer.indexOf("Evolution") > -1){
			brandLogo = 'm-audio.jpg';
		}
		
		return brandLogo;
		
	}

	this.appendInStudio = function() {

		var html =  '<h3 class="uk-accordion-title midiTitle">Midi Controlers <span class="midiNum uk-badge uk-badge-notification uk-margin-left">0</span></h3>' +
				    '<div class="uk-accordion-content">' +
					    '<div class="uk-width-medium-1-1 uk-width-large-1-1">' +
							'<select id="midiInDevices" data-md-selectize>' +
								'<option value="">Select...</option>' +
					        '</select>' +
					        '<span class="uk-form-help-block">Midi input Device</span>' +
					    '</div>' +
					    
		                '<div class="uk-grid uk-grid-small" data-uk-grid-margin>' +
		                    '<div class="uk-width-medium-7-10 midiStatus">' +
		                        '<span class="md-color-blue-900"></span>' +
							'</div>' +
		
							'<div class="uk-width-medium-3-10">' +
								'<a class="md-btn md-btn-primary md-btn-small md-btn-block md-btn-wave-light waves-effect waves-button waves-light disabled midi-btn uk-text-nowrap" onClick="startMidiDevice();">Start Device</a>' +
					    	'</div>' +
					    '</div>' +
		
				    '</div>';

		$('.deviceList .uk-accordion').prepend(html);

		$midiInDevices = $('#midiInDevices').selectize({
			onChange: function(value){
				$('.midi-btn').removeClass('disabled');
			}
		});
		midiInDevices = $midiInDevices[0].selectize;
		midiInDevices.disable();
		
	}
	
}