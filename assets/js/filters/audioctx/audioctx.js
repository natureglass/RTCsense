function buildAudioFilterTools(rtcStudio, previewBlockId, selectizeId, filtersBlockId){
	
	function Filter(name, label, init, update, reset) {
		this.label = label;
	    this.name = name;
	    this.update = update;
	    this.reset = reset;
	    this.sliders = [];
	    this.curves = [];
	    this.segmented = [];
	    this.nubs = [];	    
	    init.call(this);
	}

	Filter.prototype.addNub = function(name, x, y) {
		var nubs = { name: name, x: x, y: y };
	    this.nubs.push({ name: name, x: x, y: y });
	};

	Filter.prototype.addSegmented = function(name, label, labels, initial) {
		var segmented = { name: name, label: label, labels: labels, initial: initial };	
	    this.segmented.push({ name: name, label: label, labels: labels, initial: initial });
	};
	
	Filter.prototype.addSlider = function(id, name, label, min, max, value, step) {
		var sliders = { id: id, name: name, label: label, min: min, max: max, value: value, step: step };
	    this.sliders.push({ id: id, name: name, label: label, min: min, max: max, value: value, step: step });
	};
	
	Filter.prototype.setCode = function(settings) {		
		setFilter(settings);
	};
		
	var filters = {
		    'Adjust': [
				new Filter('Delay', 'delay', function() {
				    this.addSlider('equalizer1', 'dtime', 'Time', 0.01, 3, 0.15, 0.01);					
				    this.addSlider('equalizer2', 'dregen', 'Regen', 0.0, 1.0, 0.75, 0.01);
				}, function() {		        	
					this.setCode({
						"dtime": "filters.dtime.delayTime.value = " + this.dtime,
						"dregen": "filters.dregen.gain.value = " + this.dregen
					});
				}),
				new Filter('Reverb', 'reverb', function() {
				    //this.addSlider('equalizer1', 'dtime', 'Delay time', 0.01, 3, 0.15, 0.01);					
				    //this.addSlider('equalizer2', 'dregen', 'Regen', 0.0, 1.0, 0.75, 0.01);
				}, function() {		        	
					//this.setCode({
					//	"dtime": this.dtime,
					//	"dregen": this.dregen
					//});
				}),
				new Filter('Distortion', 'distortion', function() {
				    this.addSlider('equalizer3', 'drive', 'Drive', 0.01, 20, 5, 0.01);					
				}, function() {		        	
					this.setCode({
						"waveshaper": "filters.waveshaper.setDrive(" + this.drive + ")",
					});
				}),
				new Filter('Telephone', 'telephone', function() {
				    //this.addSlider('equalizer1', 'dtime', 'Delay time', 0.01, 3, 0.15, 0.01);					
				    //this.addSlider('equalizer2', 'dregen', 'Regen', 0.0, 1.0, 0.75, 0.01);
				}, function() {		        	
					//this.setCode({
					//	"dtime": this.dtime,
					//	"dregen": this.dregen
					//});
				}),
				new Filter('GainLFO', 'gainLFO', function() {
				    this.addSlider('equalizer4', 'lfo', 'LFO', 0.25, 20, 3, 0.25);					
				    this.addSlider('equalizer5', 'lfodepth', 'Depth', 0.0, 1.0, 1.0, 0.1);
				}, function() {		        	
					this.setCode({
						"filter": "filters.filter.frequency.value = " + this.lfo,
						"gain": "filters.gain.gain.value = " + this.lfodepth						
					});
				}),
				new Filter('Chorus', 'chorus', function() {
				    this.addSlider('equalizer6', 'cspeed', 'Speed', 0.5, 15, 3.5, 0.25);					
				    this.addSlider('equalizer7', 'cdelay', 'Delay', 0.005, 0.055, 0.03, 0.005);
				    this.addSlider('equalizer8', 'cdepth', 'Depth', 0.0005, 0.004, 0.002, 0.0005);				    
				}, function() {		        	
					this.setCode({
						"cspeed": "filters.cspeed.frequency.value = " + this.cspeed,
						"cdelay": "filters.cdelay.delayTime.value = " + this.cdelay,
						"cdepth": "filters.cdepth.gain.value = " + this.cdepth
					});
				}),
				new Filter('Flange', 'flange', function() {
				    this.addSlider('equalizer9', 'flspeed', 'Speed', 0.05, 5, 0.25, 0.05);					
				    this.addSlider('equalizer10', 'fldelay', 'Delay', 0.001, 0.02, 0.005, 0.001);
				    this.addSlider('equalizer11', 'fldepth', 'Depth', 0.0005, 0.005, 0.002, 0.00025);					
				    this.addSlider('equalizer12', 'flfb', 'LFB', 0, 1, 0.5, 0.01);				    
				}, function() {		        	
					this.setCode({
						"flspeed": "filters.flspeed.frequency.value = " + this.flspeed,
						"fldelay": "filters.fldelay.delayTime.value = " + this.fldelay,
						"fldepth": "filters.fldepth.gain.value = " + this.fldepth
						//,"flfb": "filters.flfb.gain.value = " + this.flfb
					});
				}),
				new Filter('Ringmod', 'ringMod', function() {
				    this.addSlider('equalizer13', 'rmfreq', 'Frequency', 9, 13, 11, 0.01);					
				}, function() {		        	
					this.setCode({
						"rmfreq": "filters.rmod.frequency.value = " + this.rmfreq
					});
				}),
				new Filter('StereoChorus', 'stereoChorus', function() {
				    this.addSlider('equalizer14', 'scspeed', 'Speed', 0.5, 15, 3.5, 0.25);					
				    this.addSlider('equalizer15', 'scdelay', 'Delay', 0.005, 0.055, 0.03, 0.005);
				    this.addSlider('equalizer16', 'scdepth', 'Depth', 0.0005, 0.004, 0.002, 0.0005);				    
				}, function() {		        	
					this.setCode({
						"scspeed": "filters.scspeed.frequency.value = " + this.scspeed,
						"scdelay": "filters.scrdelay.delayTime.value = " + this.scdelay,
						"scdepth": "filters.scrdepth.gain.value = " + this.scdepth						
					});
				}),
				new Filter('StereoFlange', 'stereoFlange', function() {
				    this.addSlider('equalizer17', 'sflspeed', 'Speed', 0.05, 2, 0.15, 0.05);					
				    this.addSlider('equalizer18', 'sfldelay', 'Delay', 0.001, 0.02, 0.003, 0.001);
				    this.addSlider('equalizer19', 'sfldepth', 'Depth', 0.0005, 0.02, 0.005, 0.00025);					
				    this.addSlider('equalizer20', 'sflfb', 'LFB', 0, 1, 0.9, 0.01);
				}, function() {		        	
					this.setCode({
						"sflspeed": "filters.sflspeed.frequency.value = " + this.sflspeed,
						"sfldelay": "filters.sflrdelay.delayTime.value = " + this.sfldelay,						
						"sfldepth": "filters.sflrdepth.gain.value = " + this.sfldepth,
						"sflfb": "filters.sflrfb.gain.value = " + this.sflfb
					});
				}),				
				new Filter('PitchShifting', 'pitchShifting', function() {
				    this.addSlider('equalizer21', 'octpitch', 'Pitch', -1, 1, -1, 0.05);					
				}, function() {		        	
					this.setCode({
						"effect": "filters.effect.setPitchOffset(" + this.octpitch + ")",
					});
				}),
				new Filter('ModDelay', 'modDelay', function() {
				    this.addSlider('equalizer22', 'mdtime', 'Time', 0.01, 3, 0.15, 0.01);					
				    this.addSlider('equalizer23', 'mdfeedback', 'Feedback', 0.0, 1.0, 0.5, 0.01);
				    this.addSlider('equalizer24', 'mdspeed', 'Speed', 0.5, 15, 3.5, 0.25);					
				    this.addSlider('equalizer25', 'mddelay', 'Delay', 0.005, 0.055, 0.03, 0.005);
				    this.addSlider('equalizer26', 'mddepth', 'Depth', 0.0005, 0.004, 0.002, 0.0005);					
				}, function() {		        	
					this.setCode({
						"mdtime": "filters.mdtime.delayTime.value = " + this.mdtime,
						"mdfeedback": "filters.mdfeedback.gain.value = " + this.mdfeedback,
						"mdspeed": "filters.mdspeed.frequency.value = " + this.mdspeed,
						"mddelay": "filters.mddelay.delayTime.value = " + this.mddelay,
						"mddepth": "filters.mddepth.gain.value = " + this.mddepth
					});
				}),
				new Filter('Ping-pong', 'ping-pong', function() {
				    //this.addSlider('equalizer1', 'dtime', 'Delay time', 0.01, 3, 0.15, 0.01);					
				    //this.addSlider('equalizer2', 'dregen', 'Regen', 0.0, 1.0, 0.75, 0.01);
				}, function() {		        	
					//this.setCode({
					//	"dtime": this.dtime,
					//	"dregen": this.dregen
					//});
				}),
				new Filter('LPF-LFO', 'lpf-lfo', function() {
				    this.addSlider('equalizer27', 'lplfo', 'LFO', 0.25, 20, 3, 0.25);					
				    this.addSlider('equalizer28', 'lplfodepth', 'Depth', 0.0, 1.0, 1.0, 0.1);
				    this.addSlider('equalizer29', 'lplfoq', 'LFOQ', 0.0, 20.0, 3.0, 0.5);
				}, function() {		        	
					this.setCode({
						"lplfo": "filters.lplfo.frequency.value = " + this.lplfo,
						"lplfodepth": "filters.lplfodepth.gain.value = " + this.lplfodepth,
						"lplfoq": "filters.lplfofilter.Q.value = " + this.lplfoq
					});
				}),
				new Filter('EnvelopeFollower', 'envelopeFollower', function() {
				    //this.addSlider('equalizer1', 'dtime', 'Delay time', 0.01, 3, 0.15, 0.01);					
				    //this.addSlider('equalizer2', 'dregen', 'Regen', 0.0, 1.0, 0.75, 0.01);
				}, function() {		        	
					//this.setCode({
					//	"dtime": this.dtime,
					//	"dregen": this.dregen
					//});
				}),
				new Filter('Autowah', 'autowah', function() {
				    this.addSlider('equalizer30', 'awEF', 'Frequency', 0.25, 20, 10, 0.25);					
				    this.addSlider('equalizer31', 'lfo', 'Depth', 0, 4, 3.5, 0.1);
				    this.addSlider('equalizer32', 'awQ', 'Q', 0.0, 20.0, 5.0, 0.1);				    
				}, function() {		        	
					this.setCode({
						"awFollower": "filters.awFollower.frequency.value = " + this.awEF,
						"awDepth": "filters.awDepth.gain.value = Math.pow(2, 10 + " + this.lfo + ")",						
						"awFilter": "filters.awFilter.Q.value = " + this.awQ
					});
				}),
				new Filter('NoiseGate', 'noiseGate', function() {
				    this.addSlider('equalizer33', 'ngEF', 'Frequency', 0.25, 20, 10, 0.25);					
				    this.addSlider('equalizer34', 'ngFloor', 'Floor', 0.0, 0.1, 0.01, 0.001);
				}, function() {		        	
					this.setCode({
						"ngFollower": "filters.ngFollower.frequency.value = " + this.ngEF,
						"ngGate": "filters.ngGate.curve = filters.generateNoiseFloorCurve(" + this.ngFloor + ")"
					});
				}),
				new Filter('DistortedWahChorus', 'distortedWahChorus', function() {
				    //this.addSlider('equalizer1', 'dtime', 'Delay time', 0.01, 3, 0.15, 0.01);					
				    //this.addSlider('equalizer2', 'dregen', 'Regen', 0.0, 1.0, 0.75, 0.01);
				}, function() {		        	
					//this.setCode({
					//	"dtime": this.dtime,
					//	"dregen": this.dregen
					//});
				}),
				new Filter('Vibrato', 'vibrato', function() {
				    this.addSlider('equalizer35', 'vspeed', 'Speed', 0.5, 15, 3.5, 0.25);					
				    this.addSlider('equalizer36', 'vdelay', 'Delay', 0.005, 0.055, 0.03, 0.005);
				    this.addSlider('equalizer37', 'vdepth', 'Depth', 0.0005, 0.004, 0.002, 0.0005);
				}, function() {		        	
					this.setCode({
						"cspeed": "filters.cspeed.frequency.value = " + this.vspeed,
						"cdelay": "filters.cdelay.delayTime.value = " + this.vdelay,
						"cdepth": "filters.cdepth.gain.value = " + this.vdepth
					});
				}),
				new Filter('BitCrusher', 'bitCrusher', function() {
				    this.addSlider('equalizer38', 'bitdepth', 'Depth', 1, 16, 8, 0.25);					
				    this.addSlider('equalizer39', 'btcrFreq', 'Frequency', 0, 1, 1, 0.01);
				}, function() {		        	
					this.setCode({
						"bitdepth": "filters.btcrBits = " + this.bitdepth,
						"btcrFreq": "filters.btcrNormFreq = " + this.btcrFreq
					});
				}),				
				new Filter('ApolloEffect', 'apolloEffect', function() {
				    this.addSlider('equalizer40', 'apolloFloor', 'Noise floor', 0.0, 0.2, 0.01, 0.001);					
				}, function() {		        	
					this.setCode({
						"apolloGate": "filters.apolloGate.curve = filters.generateNoiseFloorCurve(" + this.apolloFloor + ")"
					});
				})				
		    ]
	};

	// --- Creating Audio Fitlers --- //
	var nextID = 0,
		optionsList = [],
		optionsListGroups = [];

    for (var category in filters) {
		var catClass = category;
		for (var i = 0; i < filters[category].length; i++) {
			var filterName = filters[category][i].name;
			var filterValue = "filter_" + nextID;
			optionsList.push({class: catClass, value: filterName, name: filterName });
		}
		optionsListGroups.push({value: catClass, label: catClass});
		nextID+=1;
    }    
    
	$('#' + selectizeId).selectize({
        plugins: {
            'remove_button': {
                label     : ''
            }/*,
            'drag_drop' : {
            	label     : ''
            } */
        },
        maxItems: 3,
	    options:  optionsList,
	    optgroups: optionsListGroups,
	    optgroupField: 'class',
	    labelField: 'name',
	    searchField: ['name'],
	    render: {
	        optgroup_header: function(data, escape) {
	            return '<div class="optgroup-header">' + escape(data.label) + ' </div>';
	        }
	    },
        onDropdownOpen: function($dropdown) {
            $dropdown
                .hide()
                .velocity('slideDown', {
                    begin: function() {
                        $dropdown.css({'margin-top':'0'})
                    },
                    duration: 200,
                    easing: easing_swiftOut
                })
        },
        onDropdownClose: function($dropdown) {
            $dropdown
                .show()
                .velocity('slideUp', {
                    complete: function() {
                        $dropdown.css({'margin-top':''})
                    },
                    duration: 200,
                    easing: easing_swiftOut
                })
        },
        onItemAdd : function(itemName){
        	/*
        	$('#videoFXfiltersBlock .filterAudioPanel').each(function(){
        		var elem = $(this);
        		var existItem = elem.attr('id');
        		if(existItem == itemName){
        			elem.remove();
        		}        		
        	}); */
        	
        	addItemOption(itemName);
            this.close();
            this.blur();
        },
        onItemRemove : function(itemName){
        	removeItemOption(itemName);
        }
        ,create: function(input) {
        	console.log("On Create");
        }
	});    
    

    
    $('#toggleMono').change(function(){
    	//if(this.checked){
			var audioStream = getSelectedCanvas(rtcStudio.global.selectedPreview);
			var filters = audioStream.filters;
			filters.toggleMono();
    	//}    	
    });
    
	function addItemOption(itemName){
		var filter = '';
	    for (var category in filters) {
			var catClass = category;
			for (var i = 0; i < filters[category].length; i++) {
				var filterName = filters[category][i].name;
				if(itemName == filterName){					
					filter = filters[category][i];
					rtcStudio.addAudioFilter(filter, itemName);
				}
			}
	    }
	    //addItemSlider(filter, itemName);
	}

	function removeItemOption(itemName){
		var filter = '';
	    for (var category in filters) {
			var catClass = category;
			for (var i = 0; i < filters[category].length; i++) {
				var filterName = filters[category][i].name;
				if(itemName == filterName){
					console.log(itemName);
					filter = filters[category][i];
				    $('#' + filter.label).closest('.filterAudioPanel').remove();
				    removeFilter(itemName);
				}
			}
	    }


	}
	
	function removeFilter(itemName){
		
		var selectedAudioFilter = rtcStudio.selectedAudioFilter;			
		var audioStream = getSelectedCanvas(rtcStudio.global.selectedPreview);
		var filters = audioStream.filters;
		
	    if (filters.currentEffectNode) 
	    	filters.currentEffectNode.disconnect();
	    if (filters.effectInput)
	    	filters.effectInput.disconnect();
	    
	}
	/*
	function addItemSlider(filter, itemName){
		
		var accordion = UIkit.accordion($('#' + filtersBlockId), {collapse: false});
		
		//var selectedCanvas = getSelectedCanvas(rtcStudio.global.selectedPreview);
		var filterID = filter.label;	

		var html =  '<h3 class="uk-accordion-title">' + itemName + '</h3>' +
					'<div class="uk-accordion-content">' +					
						'<div class="uk-grid uk-grid-divider" data-uk-grid-margin>' +
						
							'<div class="uk-width-medium-6-10 uk-row-first" id="' + filterID + '">' +
							'</div>' +
							
							'<div class="uk-width-medium-4-10">' +
							
								'<div class="uk-width-medium-1-1 uk-margin-medium-bottom">' +
									'<input type="checkbox" name="active_filter" id="active_filter" data-md-icheck />' +
									'<label for="active_filter" class="inline-label">Active</label>' +
								'</div>' +
								
//								'<span class="uk-badge uk-badge-primary uk-badge-notification">' +
//									'<input checked id="active_filter" type="checkbox" data-switchery data-switchery-color="##ffb300" />' +
//									'<label class="uk-badge uk-badge-secondary uk-badge-notification" style="font-size: 12px;" for="active_filter" class="inline-label">active</label>' +
//								'</span>' +

								'<div class="uk-width-medium-1-1 uk-margin-small">' +
									'<input type="text" id="mixSlider" name="mixSlider" class="ion-slider" />' +
									'<span class="uk-form-help-block uk-margin-small-bottom">Effect Mix</span>' +
								'</div>' +
								
							'</div>' +
							
					'</div>';

		$('#' + filtersBlockId).append(html);
				
		// --- init Effect Mixer Slider --- //
	    $('#mixSlider').ionRangeSlider({
			disable: false,
			hide_min_max: false,
			grid: true,
			min: 0.0, max: 1.0, from: 0.5, step: 0.01,
			onChange: function(data){
				var audioStream = getSelectedCanvas(rtcStudio.global.selectedPreview);
				var filters = audioStream.filters;
				
				var value = data.slider.context.value;
				filters.crossfade( value );
			}
		});	
	    
	    // --- init Check Button --- //
	    //$('#active_filter').switchery();
	    //altair_forms.init();
	    //altair_forms.switches($('#active_filter'));
	    
		// --- init Check Button --- //
	    $('#active_filter').iCheck({
            checkboxClass: 'icheckbox_md',
            radioClass: 'iradio_md',
            increaseArea: '20%'
        });
	    
        for (var j = 0; j < filter.sliders.length; j++) {

            var slider = filter.sliders[j];
            filter[slider.name] = slider.value;

            var onchange = (function(filter, slider) {
            	return function(data) {
            		var value = data.slider.context.value;
                    filter[slider.name] = parseFloat(value);
                    filter.update();
            	}
			})(filter, slider);
        	
        	$('#' + filterID).append('<input data-streamid="" type="text" id="' + slider.id + '" /><span class="uk-form-help-block uk-margin-small-bottom">' + slider.label + '</span>');

            $('#' + slider.id).ionRangeSlider({
        		disable: false,
        		hide_min_max: false,
        		grid: true,
        		min: slider.min, max: slider.max, from: slider.value, step: slider.step,
        		onChange: onchange,
        	    onStart: function (data) {
        	    	rtcStudio.selectedAudioFilter = filter.name;
        	    }
        	});
    		
    		accordion.update();
    		
        }
		filter.update();
	}
*/

	$('#audioFXfiltersBlock').on("click", ".filterAudioBlock", function(){
		//$('.filterAudioBlock').removeClass("selected");		
		var filterName = $(this).closest('.filterAudioPanel').attr('id');
		console.log(filterName);
		//$(this).addClass("selected");
		rtcStudio.selectedAudioFilter = filterName;
	});
	
	function getSelectedCanvas(canvasid){
		for (i = 0; i < rtcstudio.global.fx_canvas.length; i++){
			if(rtcstudio.global.fx_canvas[i].videoID == canvasid){
				return rtcstudio.global.fx_canvas[i];
				break;
			}			
		}		
	}

	function setFilter(settings){
		
		//var selectedAudioFilter = rtcStudio.selectedAudioFilter;
		
		var audioStream = getSelectedCanvas(rtcStudio.global.selectedPreview);
		var filters = audioStream.filters;

		
		for (var set in settings) {
			eval(settings[set]);
			console.log(filters[set]);
		}
				
	};
	
	function initFilter(filter){
		
		//var selectedAudioFilter = rtcStudio.selectedAudioFilter;
		//var audioContext = audioStream.audioContext;
		//var sourceNode = audioStream.audioStream;	
		
		var audioStream = getSelectedCanvas(rtcStudio.global.selectedPreview);		
		//var audioFilters = audioStream.filters;
		
		console.log(rtcStudio.global.selectedPreview);
		console.log(audioStream);
		
		//audioFilters.init(filter.name);				
		
	}
}