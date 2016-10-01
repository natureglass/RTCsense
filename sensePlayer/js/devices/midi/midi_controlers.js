Midi = function(scope){
	
	// INIT MIDI Devices
	this.init = function(){
		
		navigator.requestMIDIAccess().then(
	      function onFulfilled(access){		    	
	    	  
	    	// Get MIDI access
	    	scope.midiDevice.access = access;
	    	
	    	// Get MIDI Devices
	    	setMidiDevices(access);
	    	
	    	// Update the device list when State is changed
	    	access.onstatechange = function(event){
				checkMidiDevices(event);
	        }
	        
	      },
	      function onRejected(e){
	    	  
	    	// something went wrong while requesting the MIDI devices
			var errorMsg = sortError(err);		
			$( "#error-dialog" ).dialog('option', 'title', 'Midi Input error...');
			$( "#error-dialog" ).html(e.message);
			$( "#error-dialog" ).dialog( "open" );
			
	      }
	    );		    
	}
	
	// Get MIDI Devices
	function setMidiDevices(access){		
		
		openSelectDialog('MIDI Input Select');
		
		$('#DropDown1-button').hide(); $('#DropDown1').prev('h4').html('').hide();		
		$('#DropDown2-button').hide(); $('#DropDown2').prev('h4').html('').hide();		
		$('#DropDown3-button').hide(); $('#DropDown3').prev('h4').html('').hide();
		
		console.log("here");
		
		var midiInDev = [], midiInOpt = [];
		var midiOutDev = [], midiOutOpt = [];
		var inputs = access.inputs;
		var outputs = access.outputs;
		
		midiInOpt.push("<option value='' disabled selected data-type='midi'>Select MIDI In...</option>");
		midiOutOpt.push("<option value='' disabled selected data-type='midi'>Select MIDI Out...</option>");
		
		inputs.forEach(function(port){
			midiInOpt.push("<option value='" + port.id + "' data-manufacturer='" + port.manufacturer + "' data-version='" + port.version + "' data-type='midi'>" + port.name + "</option>");
			midiInDev.push({ id: port.id, manufacturer: port.manufacturer, version: port.version, name: port.name});
		});

		outputs.forEach(function(port){
			midiOutOpt.push("<option value='" + port.id + "' data-manufacturer='" + port.manufacturer + "' data-version='" + port.version + "' data-type='midi'>" + port.name + "</option>");
			midiOutDev.push({ id: port.id, manufacturer: port.manufacturer, version: port.version, name: port.name});			
		});
		
		scope.midiDevice.devices = {
			inputs: midiInDev,
			outputs: midiOutDev
		}
				
		var reqMidi = scope.midiDevice.reqMidi;
		
		$('#midiReq').html(reqMidi.length);

		$( "#dropMenu" ).dialog('option', 'title', reqMidi[0].title);
		$('#dropBtnStart').show();

		var skipBtn = scope.midiDevice.options.optional ? true : false;
		
		if(skipBtn){ $('#dropBtnCancel').show();
		} else { $('#dropBtnCancel').hide(); }
		
	    //append after populating all options
		$('#DropDown1-button').show();
	    $('#DropDown1')
	        .html(midiInOpt.join(""))
	        .selectmenu("refresh")
	        .prev('h4').html('Midi In:').show();

	    $('#DropDown2-button').show();
	    $('#DropDown2')
	        .html(midiOutOpt.join(""))
	        .selectmenu("refresh")
	        .prev('h4').html('Midi Out:').show();
	    
	    $('#dropAlert').hide();
	    $('#camDropDown-button').show();

	}

	this.startMidi = function(devSel){

		var midiAccess = scope.midiDevice.access;
			
		var midiInPort = midiAccess.inputs.get(devSel.inID);			
		midiInPort.onmidimessage = midiListener;
			
		scope.midiDevice.nextReq();
		
		//console.log(scope.midiDevice);
		
	}
	
	this.nextReq = function(){
		
		var reqMidi = scope.midiDevice.reqMidi;
		reqMidi.shift();
		
		if(reqMidi.length){
			setMidiDevices(scope.midiDevice.access);
		} else {
			$('.alert-MidiReq').remove();
		}
		
	}
	
	// MIDI listeners
	function midiListener(midimessageEvent){

		var portId = midimessageEvent.srcElement.id,
			data = midimessageEvent.data, type = data[0], data1 = data[1], data2 = data[2];
	
		var msg = {
			HID : "MIDI",
			index: portId, type: type,
			note: data1, velocity: data2
		}
		
		if(typeof scope.onHIDupdate === "function") {		
			scope.onHIDupdate(msg);				
		}
		
	}

	// Check Devices for Updates
	function checkMidiDevices(event){
		var device = event.port;		
		if(device.connection === 'open' & device.state === 'connected' & device.type === 'input'){
			console.warn("Midi Device is now CONNECTED / OPEN : " + device.name);
		} else if(device.connection === 'closed' & device.state === 'connected' & device.type === 'input'){
			console.warn("Midi Device is now CONNECTED / CLOSED : " + device.name);
		} else if(device.connection === 'closed' & device.state === 'disconnected' & device.type === 'input'){		
			console.warn("Midi Device Disconnected! : " + device.name);
		} else if(device.connection === 'pending' & device.state === 'disconnected' & device.type === 'input'){
			console.warn("Midi Device is now DISCONNECTED / PENDING : " + device.name);		
		}
	}

}