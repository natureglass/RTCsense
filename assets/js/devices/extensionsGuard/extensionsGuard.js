ExtensionsGuard = function(rtcstudio){

	this.init = function(){
		
		setTimeout(function(){			
			rtcstudio.extensions.lastStatus = 'Checking for extensions!';		
			rtcstudio.extensions.serialReq({command: 'isExtInstalled'});
		}, 1000);
		
	}

	var linkAppID = 'iccejeonidbdghffljiadmjjkeldpiff',
		linkExtID = 'cgiaclgflkoolhiffiblfmfiamgjpgno';		
	
	this.screenSharing = false;
	this.apprunning = false;
	this.lastStatus = '';
	this.extInstalled = false;
	this.appInstalled = false;	
	this.devices = { serial: [], bluetooth: [] };		
			
	window.addEventListener('message', function(event) {
		
		if (typeof event.data.onScreenShare !== 'undefined') {

			if(event.data.onScreenShare === 'onstreamended'){				
				
				//rtcstudio.extensions.serialReq({screenshare: 'reload'});
				
			} else if(event.data.onShareLink){				
				rtcstudio.extensions.screenSharing = true;				
			} else if(event.data.onScreenShare === "onstreamended"){				
				rtcstudio.extensions.screenSharing = false;				
			}
			
		}
		
		if (typeof event.data.onGetDevices !== 'undefined') {
						
			rtcstudio.extensions.apprunning = true;
			rtcstudio.extensions.appInstalled = true;
			
			if(rtcstudio.extensions.devices.serial.length !== event.data.onGetDevices.length){
				rtcstudio.extensions.devices.serial = event.data.onGetDevices;
			}

			if(event.data.onGetDevices.length){
				rtcstudio.extensions.lastStatus = "Device detected!";
			} else {
				rtcstudio.extensions.lastStatus = "No devices found..";
			}

		}
		
		if (typeof event.data.onConnect !== 'undefined') {
			console.log(" ------- onConnect ------- ");
		}
		
		if (typeof event.data.init !== 'undefined') {
			if(event.data.init === 'app'){
				rtcstudio.extensions.apprunning = true;
				rtcstudio.extensions.serialReq({command: 'checked'});
				rtcstudio.extensions.lastStatus = "No devices found..";
			}
		}
			
		if (typeof event.data.status !== 'undefined') {
			
			//rtcstudio.extensions.lastStatus = event.data.status;
			
			switch (event.data.status) {
				case "ext_installed":
					
					rtcstudio.extensions.lastStatus = "Extension bridge installed!";					
					rtcstudio.extensions.extInstalled = true;
					rtcstudio.extensions.serialReq({command: 'getDevices'});
					
					break;
					
			    case "app_offline":
			    	rtcstudio.extensions.apprunning = false;
			    	rtcstudio.extensions.lastStatus = "Serial Extension App is not Running!";
			    	rtcstudio.extensions.serialReq({launch: 'appcheck', appid: linkAppID});			    	
			    	break;
			        
			    case "app_launched":			    	
			    	rtcstudio.extensions.lastStatus = "Lunching Extension!";
			    	break;
			    	
			    case "app_closed":
			    	rtcstudio.extensions.apprunning = false;
			    	rtcstudio.extensions.lastStatus = "Serial App Extension is Closed!";
			    	rtcstudio.extensions.devices = { serial: [], bluetooth: [] }
			    	break;

			    case "app_installed":
			    	rtcstudio.extensions.appInstalled = true;
			    	rtcstudio.extensions.lastStatus = "Serial Extension App is Installed!";			    	
			    	break;
			    	
			    case "app_not_installed":
			    	
			    	checkExtensionsInstalls();
			    	break;
			    	
			}
			
		}

		sendExternalEvents(event.data);
		
		//console.log(event.data);
		//console.log(rtcstudio.extensions.lastStatus);

	});
	
	this.popAppInstaller = function(){
		window.open('https://chrome.google.com/webstore/detail/' + linkAppID, '_blank');
	}

	this.popExtInstaller = function(){
		window.open('https://chrome.google.com/webstore/detail/' + linkExtID, '_blank');
	}
	
	this.startDevice = function(){		
		if(rtcstudio.extensions.extInstalled === true){
			rtcStudio.extensions.serialReq({command: 'getDevices'});
		}
	}
	
	this.stopDevice = function(deviceid){
		console.log("closing Serial! " + deviceid);
	}
	
	this.launchApp = function(){
		rtcstudio.extensions.serialReq({launch: 'app', appid: linkAppID});
	}
	
	this.serialReq = function(obj){
		var element = document.createElement("MyExtensionDataElement");
		for (var key in obj) {
		  if (obj.hasOwnProperty(key)) {
		  	element.setAttribute(key, obj[key]);
		  }
		}
		document.documentElement.appendChild(element);
		var evt = document.createEvent("Event");
		evt.initEvent("RTCsense", true, false);
		element.dispatchEvent(evt);
	}
	
	function checkExtensionsInstalls(){
		if(rtcstudio.extensions.extInstalled === false & rtcstudio.extensions.appInstalled === false){
			rtcstudio.extensions.lastStatus = "Client & Server extensions are not installed!";
		} else if(rtcstudio.extensions.extInstalled === true & rtcstudio.extensions.appInstalled === false){
			rtcstudio.extensions.lastStatus = "Server extension is not installed!";
		}
	}
		
	function sendExternalEvents(event){
		if(typeof rtcstudio.serialConnector.bridgeUpdate === 'function'){
			rtcstudio.serialConnector.bridgeUpdate(event);
		}

		if(typeof rtcstudio.screenShare.bridgeUpdate === 'function'){
			rtcstudio.screenShare.bridgeUpdate(event);
		}
	}
	
}