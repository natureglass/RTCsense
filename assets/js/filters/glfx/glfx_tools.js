VideoFilters = function(rtcstudio){
	
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
	
	Filter.prototype.setCode = function(code) {		
		setFilter(code);
	};
	
	var filters = {
		    'Adjust': [
		        new Filter('Brightness / Contrast', 'brightnessContrast', function() {
		            this.addSlider('adjust1', 'brightness', 'Brightness', -1, 1, 0, 0.01);
		            this.addSlider('adjust2', 'contrast', 'Contrast', -1, 1, 0, 0.01);
		        }, function() {		        	
		        	this.setCode('brightnessContrast(' + this.brightness + ', ' + this.contrast + ')');
		        }),
		        new Filter('Hue / Saturation', 'hueSaturation', function() {
		            this.addSlider('adjust3', 'hue', 'Hue', -1, 1, 0, 0.01);
		            this.addSlider('adjust4', 'saturation', 'Saturation', -1, 1, 0, 0.01);
		        }, function() {
		        	this.setCode('hueSaturation(' + this.hue + ', ' + this.saturation + ')');		        	
		        }),		        
		        new Filter('Unsharp Mask', 'unsharpMask', function() {
		            this.addSlider('adjust5', 'radius', 'Radius', 0, 200, 20, 1);
		            this.addSlider('adjust6', 'strength', 'Strength', 0, 5, 2, 0.01);
		        }, function() {
		        	this.setCode('unsharpMask(' + this.radius + ', ' + this.strength + ')');
		        }),
		        new Filter('Noise', 'noise', function() {
		            this.addSlider('adjust7', 'amount', 'Amount', 0, 1, 0.5, 0.01);
		        }, function() {
		        	this.setCode('noise(' + this.amount + ')');
		        }),
		        new Filter('Denoise', 'denoise', function() {
		            this.addSlider('adjust8', 'strength', 'Strength', 0, 1, 0.5, 0.01);
		        }, function() {
		        	this.setCode('denoise(' + 3 + 200 * Math.pow(1 - this.strength, 4) + ')');
		        }),
		        new Filter('Vibrance', 'vibrance', function() {
		            this.addSlider('adjust9', 'amount', 'Amount', -1, 1, 0.5, 0.01);
		        }, function() {
		        	this.setCode('vibrance(' + this.amount + ')');
		        }),
		        new Filter('Sepia', 'sepia', function() {
		            this.addSlider('adjust10', 'amount', 'Amount', 0, 1, 1, 0.01);
		        }, function() {
		        	this.setCode('sepia(' + this.amount + ')');
		        }),
		        new Filter('Vignette', 'vignette', function() {
		            this.addSlider('adjust10', 'size', 'Size', 0, 1, 0.5, 0.01);
		            this.addSlider('adjust11', 'amount', 'Amount', 0, 1, 0.5, 0.01);
		        }, function() {
		        	this.setCode('vignette(' + this.size + ', ' + this.amount + ')');
		        })
		        
		    ],
		    'Blur': [
		        new Filter('Zoom Blur', 'zoomBlur', function() {
		        	this.addNub('center', 320, 240);
		            this.addSlider('adjust12', 'strength', 'Strength', 0, 1, 0.3, 0.01);
		        }, function() {
		        	//console.log(this);
		        	this.setCode('zoomBlur(' + this.center.x + ', ' + this.center.y + ', ' + this.strength + ')');
		        	//this.setCode('this.fx_canvas[i].zoomBlur(' + this.center.x + ', ' + this.center.y + ', ' + this.strength + ').update();');
		        }),
		        new Filter('Triangle Blur', 'triangleBlur', function() {
		            this.addSlider('adjust13', 'radius', 'Radius', 0, 200, 50, 1);
		        }, function() {
		        	this.setCode('triangleBlur(' + this.radius + ')');
		        }),
		        new Filter('Tilt Shift', 'tiltShift', function() {
		            //this.addNub('start', 0.15, 0.75);
		            this.addNub('end', 0.75, 0.6);
		            this.addSlider('adjust14', 'blurRadius', 'Radius', 0, 50, 15, 1);
		            this.addSlider('adjust15', 'gradientRadius', 'Thickness', 0, 400, 200, 1);
		        }, function() {
		        	this.setCode('tiltShift(0, (window.threeHeight / 2) + (window.threeHeight / 6), window.threeWidth , (window.threeHeight / 2) + (window.threeHeight / 6), ' + this.blurRadius + ', ' + this.gradientRadius + ')');
		        	//this.setCode('this.fx_canvas[i].tiltShift(' + this.start.x + ', ' + this.start.y + ', ' + this.end.x + ', ' + this.end.y + ', ' + this.blurRadius + ', ' + this.gradientRadius + ').update();');
		        }),
		        new Filter('Lens Blur', 'lensBlur', function() {
		            this.addSlider('adjust16', 'radius', 'Radius', 0, 50, 10, 1);
		            this.addSlider('adjust17', 'brightness', 'Brightness', -1, 1, 0.75, 0.01);
		            //this.addSlider('adjust18', 'angle', 'Angle', 0, Math.PI, 0, 0.01);
		        }, function() {
		        	this.setCode('lensBlur(' + this.radius + ', ' + this.brightness + ', 1)');
		        })
		    ],
		    'Warp': [
		        new Filter('Swirl', 'swirl', function() {
		            this.addNub('center', 320, 240);
		            this.addSlider('adjust19', 'angle', 'Angle', -25, 25, 3, 0.1);
		            this.addSlider('adjust20', 'radius', 'Radius', 0, 600, 200, 1);
		        }, function() {
		        	this.setCode('swirl(' + this.center.x + ', ' + this.center.y + ', ' + this.radius + ', ' + this.angle + ')');
		        	//this.setCode('this.fx_canvas[i].swirl(' + this.center.x + ', ' + this.center.y + ', ' + this.radius + ', ' + this.angle + ').update();');
		        }),
		        new Filter('Bulge / Pinch', 'bulgePinch', function() {
		        	this.addNub('center', 320, 240);
		            this.addSlider('adjust21', 'strength', 'Strength', -1, 1, 0.5, 0.01);
		            this.addSlider('adjust22', 'radius', 'Radius', 0, 600, 200, 1);
		        }, function() {		        	
		        	this.setCode('bulgePinch(' + this.center.x + ', ' + this.center.y + ', ' + this.radius + ', ' + this.strength + ')');
		        	//this.setCode('this.fx_canvas[i].bulgePinch(' + this.center.x + ', ' + this.center.y + ', ' + this.radius + ', ' + this.strength + ').update();');
		        })
		    ],
		    'Fun': [
		        new Filter('Ink', 'ink', function() {
		            this.addSlider('adjust23', 'strength', 'Strength', 0, 1, 0.25, 0.01);
		        }, function() {
		        	this.setCode('ink(' + this.strength + ')');
		        }),
		        new Filter('Edge Work', 'edgeWork', function() {
		            this.addSlider('adjust24', 'radius', 'Radius', 0, 200, 10, 1);
		        }, function() {
		        	this.setCode('edgeWork(' + this.radius + ')');
		        }),
		        new Filter('Hexagonal Pixelate', 'hexagonalPixelate', function() {
		        	this.addNub('center', 320, 240);
		            this.addSlider('adjust25', 'scale', 'Scale', 10, 100, 20, 1);
		        }, function() {		        	
		        	this.setCode('hexagonalPixelate(' + this.center.x + ', ' + this.center.y + ', ' + this.scale + ')');
		        	//this.setCode('this.fx_canvas[i].hexagonalPixelate(' + this.center.x + ', ' + this.center.y + ', ' + this.scale + ').update();');
		        }),
		        new Filter('Dot Screen', 'dotScreen', function() {
		        	this.addNub('center', 320, 240);
		            //this.addSlider('adjust26', 'angle', 'Angle', 0, Math.PI / 2, 1.1, 0.01);
		            this.addSlider('adjust27', 'size', 'Size', 3, 20, 3, 0.01);
		        }, function() {
		        	this.setCode('dotScreen(' + this.center.x + ', ' + this.center.y + ', 1, ' + this.size + ')');
		        	//this.setCode('this.fx_canvas[i].dotScreen(' + this.center.x + ', ' + this.center.y + ', ' + this.angle + ', ' + this.size + ').update();');
		        }),
		        new Filter('Color Halftone', 'colorHalftone', function() {
		        	this.addNub('center', 320, 240);
		            //this.addSlider('adjust28', 'angle', 'Angle', 0, Math.PI / 2, 1.1, 0.01);
		            this.addSlider('adjust29', 'size', 'Size', 3, 20, 4, 0.01);
		        }, function() {		        	
		        	this.setCode('colorHalftone(' + this.center.x + ', ' + this.center.y + ', 1, ' + this.size + ')');
		        	//this.setCode('this.fx_canvas[i].colorHalftone(' + this.center.x + ', ' + this.center.y + ', ' + this.angle + ', ' + this.size + ').update();');
		        })
		    ]
	};

	this.createDropDown = function(){
		
		var html =  '<div class="uk-width-medium-1-1 uk-width-large-1-1 uk-row-first">' +
		                '<select id="videoFXfilters" name="videoFXfilters" multiple>' +
							'<option value="">Select Video Filter...</option>' +
						'</select>' +
				        '<span class="uk-form-help-block uk-float-right">Video Effects</span>' +					
					'</div>';
		
		$('#videoFXfiltersDrop').append(html);

		// --- Creating Video Fitlers --- //
		var nextID = 0,
			optionsList = [],
			optionsListGroups = [];

	    for (var category in filters) {
			var catClass = category;
			for (var i = 0; i < filters[category].length; i++) {
				var filterName = filters[category][i].name;
				var filterValue = filters[category][i].label;
				optionsList.push({class: catClass, value: filterValue, name: filterName });
			}
			optionsListGroups.push({value: catClass, label: catClass});
			nextID+=1;
	    }

	    var $select = $('#videoFXfilters').selectize({
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
		    valueField: 'value',
		    searchField: ['name'],
		    render: {
		        optgroup_header: function(data, escape) {
		            return '<div class="optgroup-header">' + escape(data.label) + ' </div>';
		        }
		    },
	        onDropdownOpen: function($dropdown) {
	        	$('#streamVideoFilters').addClass('minfilterHeight');
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
	        	$('#streamVideoFilters').removeClass('minfilterHeight');
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
	        	addItemOption(itemName);
	            this.close();
	            this.blur();
	        },
	        onItemRemove : function(itemName){
	        	//console.log(itemName + " Remove");
	        	removeItemOption(itemName);
	        }
	        ,create: function(input) {
	        	console.log("On Create");
	        }
		});
		

		var selectedCanvas = getSelectedCanvas(rtcstudio.global.selectedPreview);		
		var activefilters = selectedCanvas.filter;
		
		if(activefilters.length){
			for (var i = 0; i < activefilters.length; i++) {
				var filterName = activefilters[i].name;
				$select[0].selectize.addItem(filterName);
			}
		}
		
	}
	
	function setFilter(code){
		
		var selectedCanvas = getSelectedCanvas(rtcstudio.global.selectedPreview);		
		var filterName = code.substring(0 , code.indexOf("("));
		
		if(!selectedCanvas.filter.length){
			
			selectedCanvas.filter.push({
				name : filterName,
				code : code,
				filter : getFilterByLabel(filterName)
			});
			
		} else {
			
			var exist = false
			for (c = 0; c < selectedCanvas.filter.length; c++){
				if(selectedCanvas.filter[c].name == filterName){
					selectedCanvas.filter[c].code = code;
					exist = true;
					break;
				}
			}
			
			if(!exist){
				selectedCanvas.filter.push({
					name : filterName,
					code : code,
					filter : getFilterByLabel(filterName)
				});
			}
		}		
	};

	function getFilterByLabel(label){
		var filterid = '';
	    for (var category in filters) {
			var catClass = category;
			for (var i = 0; i < filters[category].length; i++) {
				var filterName = filters[category][i].label;
				if(filterName == label){
					return filters[category][i];
					break;
				}
			}					
	    }		
	}
	
	function getFilterNameById(name){
		var filterid = '';
	    for (var category in filters) {
			var catClass = category;
			for (var i = 0; i < filters[category].length; i++) {
				var filterName = filters[category][i].name;
				if(filterName == name){
					return filters[category][i].label;
					break;
				}
			}					
	    }		
	}
	
	function removeFilter(name){		
		var selectedCanvas = getSelectedCanvas(rtcstudio.global.selectedPreview);
		for (c = 0; c < selectedCanvas.filter.length; c++){
			if(selectedCanvas.filter[c].name == name){				
				selectedCanvas.filter.splice(c, 1);
				break;	
			}
		}
	}	
		
	function addItemSlider(filter){		
		
		//console.log(filter);
		
		var selectedCanvas = getSelectedCanvas(rtcstudio.global.selectedPreview);
		
		var filterID = filter.label;
		var html = '<div class="uk-width-medium-1-3 uk-margin-small-bottom filterVideoPanel">' +
						'<div class="md-card" style="min-height: 100px;">' +
							'<div class="md-card-content filterBlock" id="' + filter.label + '"><h3 class="heading_a uk-margin-small-bottom">' + filter.name + '</h3></div>' +
						'</div>' +
					'</div>';
		
		$('#videoFXfiltersBlock').append(html);
		
        for (var j = 0; j < filter.sliders.length; j++) {

            var slider = filter.sliders[j];
            filter[slider.name] = slider.value;

            if(filter.nubs.length){

                filter.center = {
                	x: filter.nubs[0].x,
                	y: filter.nubs[0].y 
                };

                
            } else {
                filter.center = {
                	x: selectedCanvas.canvas.width / 2,
                	y: selectedCanvas.canvas.height / 2 
                };
            	
            }
            
            
            if(filter.nubs.length){
	            filter.nubs[0] = {
	        		x: filter.center.x,
	        		y: filter.center.y
	            };
            }
            
            var onchange = (function(filter, slider) {

            	return function(data) {
            		var value = data.slider.context.value;
            		
                    filter[slider.name] = value;

                    for (var s = 0; s < filter.sliders.length; s++) {
                    	if(slider.name == filter.sliders[s].name){
                    		filter.sliders[s].value = value;
                    	}                    	
                    }
                    
                    if(filter.nubs.length){
                        var nub = filter.nubs[0];                    
                        filter[nub.name] = { x: nub.x, y: nub.y };
                    } 
                    
                    filter.update();
            	}

			})(filter, slider);

			$('#videoFXfiltersBlock' + ' #' + filterID).append('<input data-streamid="" type="text" id="' + slider.id + '" /><span class="uk-form-help-block uk-margin-small-bottom">' + slider.label + '</span>');

			//console.log(slider.label);
			
            $('#' + slider.id).ionRangeSlider({
    			disable: false,
    			hide_min_max: false,
    			grid: true,
    			min: slider.min, max: slider.max, from: slider.value, step: slider.step,
    			onChange: onchange,
    		    onStart: function (data) {
    		    	$('.filterBlock').removeClass("selected");
    		    	$('#' + filter.label).addClass("selected");
    		    	rtcstudio.audioVideo.selectedVideoFilter = filter.name;
    		    }
    		    //onFinish: function (data) { console.log("onFinish"); },
    		    //onUpdate: function (data) { console.log("onUpdate"); }
    		});

        }
		filter.update();
	}

	function addItemOption(itemName){
		
		var filter = '';
		var selectedCanvas = getSelectedCanvas(rtcstudio.global.selectedPreview);		
		var activefilters = selectedCanvas.filter;
		
		if(activefilters.length){

			for (var i = 0; i < activefilters.length; i++) {
				//console.log(activefilters[i].name);
				var filterLabel = activefilters[i].filter.label;				
				if(itemName == filterLabel){
					filter = activefilters[i].filter;					
					break;
				} else {
					filter = getOriginalFilter(itemName);
					break;
				}
			}
			
		} else {
			filter = getOriginalFilter(itemName);
		}
		    
		addItemSlider(filter);
	    
	}

	function getOriginalFilter(itemName){
		
		var filter = '';
		
	    for (var category in filters) {
			var catClass = category;
			for (var i = 0; i < filters[category].length; i++) {
				var filterLabel = filters[category][i].label;
				if(itemName == filterLabel){
					filter = filters[category][i];					
					break;
				}
			}
	    }
	    
	    return filter;
	    
	}
	
	function removeItemOption(itemName){
		var filter = '';
	    for (var category in filters) {
			var catClass = category;
			for (var i = 0; i < filters[category].length; i++) {
				var filterName = filters[category][i].label;
				if(itemName == filterName){
					filter = filters[category][i];
					break;
				}
			}
	    }
	    removeFilter(itemName);
	    $('#' + filter.label).closest('.filterVideoPanel').remove();

	}
	
	function getSelectedCanvas(canvasid){
		for (i = 0; i < rtcstudio.global.fx_canvas.length; i++){			
			if(rtcstudio.global.fx_canvas[i].streamid == canvasid){
				return rtcstudio.global.fx_canvas[i].video;
				break;
			}			
		}		
	}
	
	
}