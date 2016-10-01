Geolocation = function(scope){
	
	var watchID = null;
	
	// Init Geolocation
	this.init = function(){		
		if(watchID === null){

			$('.alert-GpsReq').remove();
			
			var options = scope.geolocation.options;
			var gpsOptions = {
	        		enableHighAccuracy: options.enableHighAccuracy || true,
	        		timeout: options.timeout || 10000,
	        		maximumAge: options.maximumAge || 0,
	        		desiredAccuracy: options.desiredAccuracy || 0,
	        		frequency: options.frequency || 1
	        };
			
	        watchID = navigator.geolocation.watchPosition(onSuccess, onError, gpsOptions);
		}
	}

    function onSuccess(position) {
    	
		var msg = {
			HID : "GEOLOCATION",
			position: position
		}
		
		if(typeof scope.onHIDupdate === "function") {		
			scope.onHIDupdate(msg);				
		}
    }

    // onError Callback receives a PositionError object
    function onError(error) {
		$( "#error-dialog" ).dialog('option', 'title', 'Geolocation error...');
		$( "#error-dialog" ).html(error.message + ' (code: ' + error.code + ')');
		$( "#error-dialog" ).dialog( "open" );
    }
    
    // clear the watch that was started earlier
    this.clearWatch = function(){
        if (watchID != null) {
            navigator.geolocation.clearWatch(watchID);
            watchID = null;
        }
    }
	
}