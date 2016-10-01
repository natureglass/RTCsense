AudioVideo = function(scope){
	
	this.init = function(){
		
		openSelectDialog('Media Input Select');
		
		if(DetectRTC.MediaDevices[0].label === 'Please invoke getUserMedia once.') {
			$('#dropAlert').html('Please allow to Share your Camera and Microphone for devices detection!').show();
			$('#dropBtnStart').hide();
			$('#dropBtnCancel').hide();
		}

        function reloadDetectRTC() {
            DetectRTC.load(scope.audioVideo.onDetectRTCLoaded);
        }
		
        DetectRTC.load(function() {
            reloadDetectRTC();

            if(DetectRTC.MediaDevices[0] && DetectRTC.MediaDevices[0].label === 'Please invoke getUserMedia once.') {
                navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(reloadDetectRTC).catch(reloadDetectRTC);
                return;
            }
            
            console.log("Media already init!");
            //scope.audioVideo.onDetectRTCLoaded();
            
        });
        
	}	

	// *** When DetectRTC is Loaded *** //
	this.onDetectRTCLoaded = function(){
		
		$('#DropDown1-button').hide(); $('#DropDown1').prev('h4').html('').hide();		
		$('#DropDown2-button').hide(); $('#DropDown2').prev('h4').html('').hide();		
		$('#DropDown3-button').hide(); $('#DropDown3').prev('h4').html('').hide();
		
		if(DetectRTC.MediaDevices[0].label === 'Please invoke getUserMedia once.') {
			return;
		}
		
		var options = [];
		
		options.push("<option value='' disabled selected data-type='media'>Select Media...</option>");
		
		for (i = 0; i < scope.DetectRTC.videoInputDevices.length; i++){
			options.push("<option value='" + scope.DetectRTC.videoInputDevices[i].deviceId + "' data-type='media'>" + scope.DetectRTC.videoInputDevices[i].label + "</option>");
		}
		
		var reqMedia = scope.audioVideo.reqMedia;
		
		//console.log(reqMedia);
		
		$('#camReq').html(reqMedia.length);
		
		$( "#dropMenu" ).dialog('option', 'title', reqMedia[0].title);
		$('#dropBtnStart').show();
		
		var skipBtn = scope.audioVideo.options.optional ? true : false;
		
		if(skipBtn){ $('#dropBtnCancel').show();
		} else { $('#dropBtnCancel').hide(); }
		
	    //append after populating all options
		$('#DropDown1-button').show();
	    $('#DropDown1')
	        .html(options.join(""))
	        .selectmenu("refresh")
	        .prev('h4').html(reqMedia[0].name).show();

	    $('#dropAlert').hide();
	    $('#camDropDown-button').show();
		
	}
	
	this.startMedia = function(camName, camId){
		var constraints = scope.audioVideo.reqMedia[0];	
		var chromeConstraints = {
			video: constraints.video == false ? false : {
				optional : [{
					sourceId: camId 
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
			
			scope.audioVideo.nextReq();
						
			// Create DOM video		
			var videoElem = document.createElement('video');			
		    videoElem.src = URL.createObjectURL(stream);
		    videoElem.autoplay = true;
		    videoElem.muted = true;

		    videoElem.onloadedmetadata = function(e) {

	        	videoElem.play();

	        	var mediaElement = {
					stream: stream,
					texture: new THREE.Texture( videoElem ),
					videoElem: videoElem
				}
				
	        	//console.log(mediaElement);
	        	
				if(typeof scope.onNewMediaElement === "function") {		
					scope.onNewMediaElement(mediaElement);				
				}
				
			}		
			
		}, function(err){
			
			var errorMsg = sortError(err);		
			$( "#error-dialog" ).dialog('option', 'title', 'media Input error...');
			$( "#error-dialog" ).html(errorMsg);
			$( "#error-dialog" ).dialog( "open" );

		});	
	}
	
	this.nextReq = function(){
		
		console.log("Next");
		
		var reqMedia = scope.audioVideo.reqMedia;
		reqMedia.shift();
		
		if(reqMedia.length){
			scope.audioVideo.init();
		} else {
			$('.alert-CamReq').remove();
		}
		
	}
	
}