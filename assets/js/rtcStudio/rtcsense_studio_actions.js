function initActions(sections){
	
	var canGoFull = true, mylatesttap;
	
	// *** Video Preview Block *** //
	videoPreview = $('#' + sections.mediaPreview);
	
	// *** Human Interdace Devices *** //
	HIDpreview = $('#' + sections.HIDpreview);
	
	// --- ACTIONS --- //	
	
	videoPreview.on("click", ".md-card-close", function(event){		
		var inputDataType = $(this).parent().parent().next('div').find('canvas').attr('data-type');
		
		var streamid = $(this).parent().parent().next('div').find('canvas').attr('id');

		streamid = streamid.substring(5, streamid.length);

		var streamPanel = $(this).closest('.videoPanel');		
		streamPanel.closest('.videoPanel').fadeOut("normal", function() {			
			streamPanel.remove();
			rtcStudio.audioVideo.removeStream(streamid);
	    });
	});
	
	videoPreview.on("mousemove", "canvas", function(event){
		if(rtcStudio.ThreeJS.mousePos.Rstate == 1){
			var mousePos = getMousePos(this, event);
			rtcStudio.ThreeJS.mousePos.x =  mousePos.x;
			rtcStudio.ThreeJS.mousePos.y =  mousePos.y;
		}
	});	
	
	videoPreview.on("mousedown", "canvas", function(event){
		
		if(event.which === 1){
			rtcStudio.ThreeJS.mousePos.Lstate = 1;
			
			var selectedCanvasId = $(this).attr('id').substr(5);

			if(rtcStudio.global.selectedPreview != selectedCanvasId){
				setSelectedByID(selectedCanvasId);
			}
			
		} else if (event.which === 3) {
			rtcStudio.ThreeJS.mousePos.Rstate = 1;
		}
		
	});
	
	videoPreview.on("mouseup", "canvas", function(event){
		if(event.which === 1){
			rtcStudio.ThreeJS.mousePos.Lstate = 0;
		} else if (event.which === 3) {
			rtcStudio.ThreeJS.mousePos.Rstate = 0;
		}
	});

	HIDpreview.on("mousedown", "img", function(event){
		var selectedMidiId = $(this).attr('id');

		if(rtcStudio.global.selectedHID !== selectedMidiId){
			
			setSelectedHID(selectedMidiId);
			
			var thisMidi = rtcStudio.midi.getMidiDeviceByID(selectedMidiId);
			rtcStudio.midi.buildMidiTools(thisMidi);
			
		}
	});
	
	HIDpreview.on("mousedown", ".md-card-close", function(event){
		var inputDeviceID = $(this).parent().parent().next('div').find('img').attr('id');		
		removeSelectedHID(inputDeviceID);
		
//		var streamPanel = $(this).closest('.inputPanel');		
//		
//		streamPanel.closest('.inputPanel').fadeOut("normal", function() {
//			
//			// Removing Panel
//			streamPanel.remove();			
//			
//			// Closing Midi Port
//			var thisMidi = rtcStudio.midi.getMidiDeviceByID(inputDeviceID);
//			var midiInPort = rtcStudio.midi.access.inputs.get(thisMidi.id);
//			midiInPort.close();
//			
//			rtcStudio.midi.selectRemaining();
//
//	    });
		
	});
	
	var sortable = $('[data-uk-sortable]');

    sortable.on('stop.uk.sortable', function (e, el, type) {
    	var streamsOrder = [];
    	$('#' + sections.mediaPreview + ' .videoPanel').find('canvas').each(function (index, canvas) {
    		var canvasid = canvas.id.substring(5);
    		streamsOrder.push(canvasid);
    	});
		for (i = 0; i < rtcStudio.scenes.length; i++){		
			var thisScene = rtcStudio.scenes[i];
			var exists = (typeof thisScene.onOrderUpdate === 'function') ? true : false;
			if (exists){ thisScene.onOrderUpdate(streamsOrder); }
		}
    });


    // card toggle fullscreen
    $page_content = $('#page_content');
	videoPreview.on("click", ".md-card-fullscreen-activate", function(){
        var $thisCard = $(this).closest('.md-card');
        var $thisCanvas = $thisCard.find('canvas');        
        var $canvasContainer = $thisCard.find('canvas').parent();
        
        //$canvasContainer[0].style.backgroundColor = "black";

        if(!$thisCard.hasClass('md-card-fullscreen')) {
            // get card atributes
            var mdCard_h = $thisCard.height(),
                mdCardToolbarFixed = $(this).hasClass('toolbar_fixed'),
                mdCard_w = $thisCard.width(),
                body_scroll_top = $body.scrollTop(),
                mdCard_offset = $thisCard.offset();

            // create placeholder for card
            $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
            // add overflow hidden to #page_content (fix for ios)
            //$body.addClass('md-card-fullscreen-active');
            // add width/height to card (preserve original size)
            $thisCard
                .addClass('md-card-fullscreen')
                .css({
                    'width': mdCard_w,
                    'height': mdCard_h,
                    'left': mdCard_offset.left,
                    'top': mdCard_offset.top - body_scroll_top
                })
                // animate card to top/left position
                .velocity(
                    {
                        left: 0,
                        top: 0
                    },
                    {
                        duration: 400,
                        easing: easing_swiftOut,
                        begin: function(elements) {
                        	
                        	// Setting the elements
                            //$thisCanvas[0].style.height = "calc(100% - 50px)";
                            //$thisCanvas[0].style.display = "block";
                            //$thisCanvas[0].style.margin = "auto";
                            //$canvasContainer[0].style.height = "calc(100vh - 50px)";
                            
                            // add back button
                            var $toolbar = $thisCard.find('.md-card-toolbar');
                            if($toolbar.length) {
                                $toolbar.prepend('<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left">&#xE5C4;</span>');
                            } else {
                                $thisCard.append('<span class="md-icon md-card-fullscreen-deactivate material-icons uk-position-top-right" style="margin:10px 10px 0 0">&#xE5CD;</span>')
                            }
                            altair_page_content.hide_content_sidebar();
                        }
                    }
                // resize card to full width/height
                ).velocity(
                    {
                        height: '100%',
                        width: '100%'
                    },
                    {
                        duration: 400,
                        easing: easing_swiftOut,
                        complete: function(elements) {
                            // show fullscreen content
                            $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                duration: 400,
                                easing: easing_swiftOut,
                                complete: function(elements) {
                                    // activate onResize callback for some js plugins
                                    $(window).resize();
                                }
                            });
                            if(mdCardToolbarFixed) {
                                $thisCard.addClass('mdToolbar_fixed')
                            }
                        }
                    }
                );
        }
        
    });
	
	var stickyTool = $('#sticky-toolbar');

	// --- double tap --- //
	document.getElementById("canvasScreen").addEventListener('touchstart',function(e){
		var now = new Date().getTime();
		var timesince = now - mylatesttap;
		if((timesince < 300) && (timesince > 0)){		   
			e.preventDefault();
			toggleToolBar();
		}
		mylatesttap = new Date().getTime();		
	});

	$(".canvasContainer").on({
	    mouseenter: function () {
	    	stickyTool.fadeIn(200);
	    },
	    mouseleave: function () {
	    	stickyTool.fadeOut(200);
	    }
	});
	/*
	$('.canvasContainer').on("click", "#canvasScreen", function(event){
		event.preventDefault();
		toggleToolBar();
	});
	*/

	$('#sticky-toolbar').on("click", ".btn-fullscreen", function(event){
		console.log("toggling");
		toggleFullScreen();
	});

	function toggleToolBar(){
		if ( stickyTool.css('display') == 'none' ){
			stickyTool.fadeIn(200);			
		} else {
			stickyTool.fadeOut(200);
		}
	}
	
	function toggleFullScreen(){
		
		if(canGoFull){		
						
			if(!rtcStudio.ThreeJS.isFullScreen){
				
				//requestFullScreen(sections.mainScreen);
				$('.canvasContainer').addClass('fullScreen');		
				$('#header_main').css('display','none');
				$('html').addClass('overflowHidden');
				
				rtcStudio.ThreeJS.isFullScreen = true;
				
		    	for (i = 0; i < rtcStudio.ThreeJS.scenes.length; i++){
					var thisScene = rtcStudio.ThreeJS.scenes[i];
				    thisScene.camera.aspect = window.innerWidth / window.innerHeight;
				    thisScene.camera.updateProjectionMatrix();
				}
		    	
		    	renderer.setSize( window.innerWidth, window.innerHeight );
		    	
		    	//$('.toolBar-close-btn').show(); 
		    	
			} else {
		    	
		    	//requestFullScreen(sections.mainScreen);		
				$('.canvasContainer').removeClass('fullScreen');
				$('#header_main').css('display','block');
				$('html').removeClass('overflowHidden');
				
				rtcStudio.ThreeJS.isFullScreen = false;
				rtcStudio.ThreeJS.onWindowResize();
				rtcStudio.ThreeJS.reCheckSticky();		
	
				$(window).scrollTop(50);
				
				//$('.toolBar-close-btn').hide();
			}
			
			canGoFull = false; // adding a small delay hack
			setTimeout(function(){ canGoFull = true }, 500);
			
		}
	}
}