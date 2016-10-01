ScreenShare = function(rtcstudio){

	this.init = function(){
		
		rtcstudio.screenShare.appendInStudio();
		
	}
	
	this.appendInStudio = function(){
		
		var html =	'<h3 class="uk-accordion-title">Screen Sharing <span class="screenNum uk-badge uk-badge-notification uk-margin-left">0</span></h3>' +
				    '<div class="uk-accordion-content screenDropDown">' +

				    '<div class="uk-grid uk-grid-small" data-uk-grid-margin>' +
		                	
		                    '<div class="uk-width-medium-7-10">' +
		                    
		            			'<div class="uk-grid uk-grid-small" data-uk-grid-margin>' +
		            				'<div class="uk-width-medium-1-2">' +
		            					'<span class="sharelWarn" style="display: block;"></span>' +
		            					'<span class="shareStatus">' +
		            						'<a class="md-btn md-btn-block md-btn-primary md-btn-small md-btn-wave-light waves-effect waves-button waves-light uk-text-nowrap" onClick="rtcStudio.extensions.popExtInstaller();">Serial Link Client</a>' +
		            					'</span>' +
		            				'</div>' +
		            				
		            				'<div class="uk-width-medium-1-2 qrcode">' +
		            					'<span class="qrcode"></span>' +
		            				'</div>' +
	            				
		            			'</div>' +



	            			
		                        '<span class="md-color-blue-900"></span>' +
		                        
							'</div>' +
							
							'<div class="uk-width-medium-3-10">' +
								'<a class="md-btn md-btn-primary md-btn-small md-btn-block md-btn-wave-light waves-effect waves-button waves-light uk-float-right uk-text-nowrap disabled share-btn" onClick="rtcStudio.screenShare.startScreenShare();">Share Screen</a>' +
					    	'</div>' +
					    '</div>' +
				    
				    '</div>';
		
		$('.deviceList .uk-accordion').prepend(html);

		$('.deviceList .sharelWarn').html('<small class="md-color-red-A700">Extensions are needed, please click to install & <b>refresh the application!</b></small>');
		
		rtcstudio.screenShare.qrcode = new QRCode($(".qrcode")[0], {
			width : 100,
			height : 100
		});
		
	}

	this.startScreenShare = function(){
		
		if(!rtcstudio.extensions.screenSharing){
			rtcStudio.extensions.serialReq({screenshare: 'init', roomid: 'Alex123'});
			console.log("Starting Screen Share!");
			
		} else {
			rtcStudio.extensions.serialReq({screenshare: 'stop'});
			console.log("Stopping screen share..");			
		}
		
	}
	
	this.bridgeUpdate = function(event){

		//console.log(event);

		$('.share-btn').removeClass('disabled');
		
		if(event.onScreenShare === "user_denied"){
			
			$('.deviceList .shareStatus').html('<span class="md-color-red-500">User denied to share his screen..</span>');			
			
		} else if(event.onScreenShare === "onstreamended"){
		
			$('.qrcode').html('');
			$('.deviceList .sharelWarn').html('');
			$('.screenNum').html('0');
			$('.share-btn').html('Share Screen');
			$('.deviceList .shareStatus').html('<span class="md-color-red-500">Stream eneded..</span>');	
		
		} else if(event.onShareLink){
			
			$('.deviceList .shareStatus').html('<span class="md-color-blue-500"><a href="' + event.onShareLink + '" target="_blank">' + event.onShareLink + '</a></span>');
			$('.deviceList .sharelWarn').html('<small class="md-color-red-A700">Scan with you mobile or use the link!</small>');

			$('.share-btn').html('Stop Stream');
			
			rtcstudio.screenShare.qrcode.makeCode(event.onShareLink);
			
			
		} else if(event.onScreenError){
			
			$('.deviceList .shareStatus').html('<span class="md-color-red-500">' + event.onScreenError + '</span>');

		} else if(event.onScreenUsers){
			$('.screenNum').html(event.onScreenUsers);
		} else {
			
			$('.deviceList .sharelWarn').html('');
			$('.deviceList .shareStatus').html('<span class="md-color-red-500">No devices found..</span>');
			
		}
		
	}

}