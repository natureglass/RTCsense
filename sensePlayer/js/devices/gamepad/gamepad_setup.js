GamepadDevice = function(scope){
	
	this.gamepadDev = [];
	this.selectDialog = false;
	
	this.gamepad = new Gamepad();

	this.updateDevices = function(device){
		scope.gamepad.gamepadDev.push({ index: device.index, id: device.id });
		if(scope.gamepad.selectDialog === true){
			$('#dropAlert').html('').hide();
			buildGamePadDropDown();
		}
	}
	
	this.gamepad.bind(Gamepad.Event.CONNECTED, function(device){
		scope.gamepad.updateDevices(device);
	});
	
	this.gamepad.bind(Gamepad.Event.DISCONNECTED, function(device){
		scope.gamepad.updateDevices(device);
	});
	
	this.gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e){
		var data = { index: e.gamepad.index, type: "BUTTON", id: e.gamepad.id,
			data: e.control, action: "DOWN", value: 1, HID : "GAMEPAD" };
		updateScene(data);
	});
	
	this.gamepad.bind(Gamepad.Event.BUTTON_UP, function(e){
		var data = { index: e.gamepad.index, type: "BUTTON", id: e.gamepad.id,
			data: e.control, action: "UP", value: 0, HID : "GAMEPAD" };
		updateScene(data);
	});
	
	this.gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e){
		var data = { index: e.gamepad.index, type: "AXIS", id: e.gamepad.id,
			data: e.axis, value: e.value, action: "CHANGED", HID : "GAMEPAD" };
		updateScene(data);
	});
	
//	this.gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
//		console.log(gamepads[0]);
//	});
	
	if (!this.gamepad.init()) {
		console.log('Your browser does not support gamepads, get the latest Google Chrome or Firefox.');
	}
	
	this.init = function(){

		$('#DropDown1-button').hide(); $('#DropDown1').prev('h4').html('').hide();		
		$('#DropDown2-button').hide(); $('#DropDown2').prev('h4').html('').hide();		
		$('#DropDown3-button').hide(); $('#DropDown3').prev('h4').html('').hide();
		
		if(!scope.gamepad.gamepadDev.length){
			$('#dropAlert').html('Connect your controller and press any button for detection!').show();
			$('#dropBtnStart').hide();
			$('#dropBtnCancel').hide();
		} else {
			buildGamePadDropDown();
		}	
		
		var skipBtn = scope.gamepad.options.optional ? true : false;
		openSelectDialog('GamePad Input Select', skipBtn);
		
		scope.gamepad.selectDialog = true;
		
		buildGamePadDropDown();
		
		
	}
	
	this.startGamePad = function(devSel){		
		
		scope.gamepad.selectDialog = false;
		
		scope.gamepad.nextReq();		
		
		console.log(devSel.selName + " / " + devSel.selId);
	}
	
	function buildGamePadDropDown(){
		
		console.log("building!");
		console.log(scope.gamepad);
		
		var gamepadOpt = [],
			gamepads = scope.gamepad.gamepadDev;

		gamepadOpt.push("<option value='' disabled selected data-type='gamepad'>Select Gamepad...</option>");
		
		for (i = 0; i < gamepads.length; i++){				
			gamepadOpt.push("<option value='" + gamepads[i].index + "' data-id='" + gamepads[i].id + "' data-type='gamepad'>" + gamepads[i].id + "(" + gamepads[i].index + ")</option>");
		}		
		
		var reqPads = scope.gamepad.reqPads;
		$('#gamepadReq').html(reqPads.length);
		//$('#dropMenu').dialog('option', 'title', reqPads[0].title);
		$('#dropBtnStart').show();
		
		var skipBtn = scope.gamepad.options.optional ? true : false;		
		if(skipBtn){ $('#dropBtnCancel').show();
		} else { $('#dropBtnCancel').hide(); }
		
	    //append after populating all options
		$('#DropDown1-button').show();
	    $('#DropDown1')
	        .html(gamepadOpt.join(""))
	        .selectmenu("refresh")
	        .prev('h4').html(reqPads[0].name).show();		
	}
	
	this.nextReq = function(){
		
		var reqPads = scope.gamepad.reqPads;
		
		console.log(reqPads);
		
		reqPads.shift();
		
		if(reqPads.length){
			scope.gamepad.init();
		} else {
			$('.alert-GamepadReq').remove();
		}
		
	}
	
	function updateScene(data){
		if(typeof scope.onHIDupdate === "function") {		
			scope.onHIDupdate(data);				
		}
	}
}