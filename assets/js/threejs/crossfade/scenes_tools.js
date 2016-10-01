function buildSceneTools(scenes, transition, containerID){
	
// *** -- Build Transition Settings -- *** //
	
	//var transition = rtcStudio.transition;

	//animateTransition : true
	//loopTexture : true
	//texture : 1	
	//textureThreshold : 0.3
	//transition : 0
	//transitionSpeed : 0.001
	//useTexture : true
	var tranInit = { speed: 0.01, thres: 0.3 }
	
	var tranSliders = [
		{
			"id" : "transitionSpeed",
			"name" : "Transition Speed",
			"min" : 0.001,
			"max" : 0.02,
			"step" : 0.001,
			"value" : 0.01
		},{
			"id" : "textureThreshold",
			"name" : "Texture Threshold",
			"min" : 0,
			"max" : 1,
			"step" : 0.01,
			"value" : 0.3
		}
	];
	var html =  '<div class="uk-width-medium-1-2">' +
					'<div class="uk-width-medium-1-1">' +
						'<div class="md-card" style="padding-bottom: 15px;">' +						
							'<div class="md-card-content">' +
								'<select id="rtcScenes" data-md-selectize>' +
									'<option value="">Select Scene...</option>' +
								'</select>' +
								'<span class="uk-form-help-block uk-float-right">Working Scene</span>' +
							'</div>' +
						'</div>' +
					'</div>' +

					'<div class="uk-width-medium-1-1">' +
						'<div class="md-card">' +
							'<div class="md-card-content">' +
	    	                    '<input type="checkbox" name="tranUsePattern" id="tranUsePattern" data-md-icheck checked />' +
	    	                    '<label for="tranUsePattern" class="inline-label">Use Patterns</label>' +
							'</div>' +
						'</div>' +
					'</div>' +

					'<div class="uk-width-medium-1-1">' +
						'<div class="md-card" style="padding-bottom: 15px;">' +
							'<div class="md-card-content">' +
								'<select id="tranTextures" data-md-selectize>' +
									'<option value="">Transition type...</option>' +
									'<option value="1" selected>Perlin</option>' +
									'<option value="2">Squares</option>' +
									'<option value="3">Cells</option>' +
									'<option value="4">Distort</option>' +
									'<option value="5">Gradient</option>' +
									'<option value="6">Radial</option>' +									
								'</select>' +
								'<span class="uk-form-help-block uk-float-right">Transition pattern</span>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
	
				'<div class="uk-width-medium-1-2">' +
					
					'<div class="uk-width-medium-1-1">' +
						'<div class="md-card">' +
							'<div class="md-card-content">';

	for (var p = 0; p < tranSliders.length; p++) {
		html += '<input type="text" id="' + tranSliders[p].id + '" /><span class="uk-form-help-block uk-margin-small-bottom">' + tranSliders[p].name + '</span>';
	}

	html += '<a class="md-btn md-btn-primary md-btn-small md-btn-block md-btn-wave-light waves-effect waves-button waves-light tranReset">Reset</a>' +
			'</div></div></div></div>';

	var item = $(html).appendTo('#editorTransitions')[0];
	
    $('.tranReset').click(function() {
    	$('#transitionSpeed').data("ionRangeSlider").update({ from: tranInit.speed });
    	$('#textureThreshold').data("ionRangeSlider").update({ from: tranInit.thres });
    	transition.setSpeed(tranInit.speed);
    	transition.setTextureThreshold(tranInit.thres);
    });	
		
	$('input[name="tranUsePattern"]').on('ifChanged', function (event) {		
		var $select_pattern = $('#tranTextures').selectize();
		var $slider_threshold = $("#textureThreshold").data("ionRangeSlider");		
		var select_pattern  = $select_pattern[0].selectize;		
		if(this.checked){			
			select_pattern.enable();
			$slider_threshold.update({ disable: false });
		} else {
			select_pattern.disable();
			$slider_threshold.update({ disable: true });
		}
		transition.useTexture(this.checked);
    });
	
    for (var j = 0; j < tranSliders.length; j++) {
        
        $('#' + tranSliders[j].id).ionRangeSlider({
			disable: false,
			hide_min_max: false,
			grid: true,
			min: tranSliders[j].min, max: tranSliders[j].max, from: tranSliders[j].value, step: tranSliders[j].step,		            	
			onChange: function(ui){
				
				var value = parseFloat(ui.input[0].value);
				
				if(ui.input[0].id == "transitionSpeed"){
					transition.setSpeed(value);
				} else if(ui.input[0].id == "textureThreshold"){
					transition.setTextureThreshold(value);
				}
			}
        });        
    }
    
    $('#tranTextures').selectize({
        onItemAdd : function(itemValue){      	
        	transition.setTexture(parseInt(itemValue) - 1);
            this.close();
            this.blur();
        }
	});

	
 // *** -- Build Scenes Select -- *** //	
    
	//var scenes = rtcStudio.scenes;
	var optionsList = [];

	for (i = 0; i < scenes.length; i++) {
		optionsList.push({class: "thisList", value: scenes[i].scene.name, name: scenes[i].scene.label });	
	}
	
    var $select = $('#rtcScenes').selectize({
	    options:  optionsList,	    
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
        	//addItemOption(itemName);
        	//console.log(itemName + " Adding");
        	
        	for (i = 0; i < scenes.length; i++) {
        		if(scenes[i].scene.name == itemName){
        	   		var sceneParam = scenes[i].parameters;
        	  		var thisScene = scenes[i].scene;
        	  		
        	  		transition.setScene(itemName);
        	  		
        			initScene(thisScene, sceneParam, containerID);
        		}
        	}
        	
            this.close();
            this.blur();
        },
        onItemRemove : function(itemName){
        	console.log(itemName + " Remove");
        	//removeItemOption(itemName);
        	
        }
        ,create: function(input) {
        	console.log("On Create");
        	
        }
	});	
	
    $select[0].selectize.addItem(optionsList[0].value);
    $(".selectize-input input").attr('readonly','readonly');
    
}

// Initializing selected Scene
function initScene(thisScene, sceneParam, containerID){

	//var containerID = "editorScenes";
	var nextID = 0;

	$('#' + containerID).html('');
	
        if(sceneParam){            
			// Sliders
			var sliders = [];
			for (params in sceneParam) {				
				var paramName = sceneParam[params].name;
				var paramType = sceneParam[params].type;				
				
				if(paramType == "VR"){					
					var VR_Btn = sceneParam[params];
					
					//var vrIcon = '<img src="assets/icons/google-cardboard.png" style="margin:0 0 15px;" />';					
					//$('.toolbar-vr-btn').html('<i class="md-card-toolbar-btn btn-vr material-icons uk-float-right uk-margin-right" title="VR Mode">' + vrIcon + '</i>');
					
					$('.btn-vr').click(function(){							
						var checked = VR_Btn.set.value;
						VR_Btn.action(checked);

						if(checked){
							$('.btn-vr').html('surround_sound').attr('title', 'VR Mode');
						} else {
							$('.btn-vr').html('settings_overscan').attr('title', 'Normal Mode');
						}

						console.log(checked);
						
	                });				
					
				}
				
				if(paramType == "TOUCH_ACTIVE"){
					
					var Touch_Btn = sceneParam[params];
					
					//$('.toolbar-rotation-btn').html('<i class="md-card-toolbar-btn btn-3d-rotation material-icons uk-float-right uk-margin-right" title="Touch Mode">touch_app</i>');
					
					$('.btn-3d-rotation').click(function(){
						var checked = Touch_Btn.set.value;
						Touch_Btn.action(checked);

						if(checked){
							$('.btn-3d-rotation').html('touch_app').attr('title', 'Touch Mode');
						} else {
							$('.btn-3d-rotation').html('3d_rotation').attr('title', 'Sensors Mode');
						}						

					});
					
				}
				
				
				if(paramType == "slider"){

					var slider = sceneParam[params];
					var section = sceneParam[params].set;
					var sliders = [];

					var html =  '<div class="uk-width-medium-1-2">' +
									'<div class="md-card">' +
										'<div class="md-card-content">' +
										'<h3 class="heading_a uk-margin-medium-bottom">'+ slider.name +'</h3>';
					
					for (label in slider.set) {
						slider.id = 'sceneControl' + nextID++;					
						
						html += '<input type="text" id="' + slider.id + '" /><span class="uk-form-help-block uk-margin-small-bottom">' + slider.set[label].name + '</span>';
						
						var sliderParams = slider.set[label];
						sliders.push({
							"id" : slider.id,
							"name" : label,
							"min" : sliderParams.min,
							"max" : sliderParams.max,
							"step" : sliderParams.step,
							"value" : sliderParams.value
						});
						
					}						
					
					html += '<a class="md-btn md-btn-primary md-btn-small md-btn-block md-btn-wave-light waves-effect waves-button waves-light" id="param_' + params + '">Reset</a>' +
							'</div></div></div>';

					var item = $(html).appendTo('#' + containerID)[0];
					
		            (function(params, slider, sliders) {
		            	
		            	// Set Reset Button
		                $(item).find('#param_' + params).click(function() {
		                	slider.reset();
		                	for (var j = 0; j < sliders.length; j++) {
		                		$('#' + sliders[j].id).data("ionRangeSlider").update({ from: sliders[j].value });
		                	}
		                });		                
		            })(params, slider, sliders);

		            for (var j = 0; j < sliders.length; j++) {
		                
			            $('#' + sliders[j].id).ionRangeSlider({
			    			disable: false,
			    			hide_min_max: false,
			    			grid: true,
			    			min: sliders[j].min, max: sliders[j].max, from: sliders[j].value, step: sliders[j].step,		            	
			    			onChange: function(ui){

			    				for (var p = 0; p < sliders.length; p++) {
			    					if(sliders[p].id == ui.input[0].id){			    						
			    						slider.update(sliders[p].name, ui.input[0].value);
			    						break;
			    					}
			    				}
			    				
			    			}
			            });
			            
		            }

		        // All the others
				} else if(paramType == "button" || paramType == "checkbox" || paramType == "input" || paramType == "color" || paramType == "palette" || paramType == "VR"){

					var html =  '<div class="uk-width-medium-1-2" id="extraActions"></div>';
					var item = $(html).appendTo('#' + containerID)[0];
					
					if(paramType == "button"){
						
						var button = sceneParam[params];
						
						var html =  '<div class="uk-width-medium-1-1">' +
										'<div class="md-card">' +
											'<div class="md-card-content">' +
												'<a class="md-btn md-btn-primary md-btn-small md-btn-block md-btn-wave-light waves-effect waves-button waves-light" id="btn_' + params + '">' + paramName + '</a>' +
											'</div>' +
										'</div>' +											
				                	'</div>';
						
			            //var item = $(html).appendTo('#' + containerID)[0];
						var item = $(html).appendTo('#extraActions')[0];
			            (function(params, button) {
			                $(item).find('#btn_' + params).click(function() {
			                   button.action();
			                });
			            })(params, button);
			            
			        // Checkboxes    
					} else if(paramType == "checkbox"){
						
						var checkbox = sceneParam[params];
						var checked = checkbox.set.init ? "checked" : '';
	
						var html =  '<div class="uk-width-medium-1-1">' +
										'<div class="md-card">' +
											'<div class="md-card-content">' +					
					    	                    '<input type="checkbox" name="check_' + params + '" id="check_' + params + '" data-md-icheck ' + checked + ' />' +
					    	                    '<label for="check_' + params + '" class="inline-label">' + paramName + '</label>' +
					    	                '</div>' +
					    	            '</div>' +
		    	                    '</div>';
							
						//var item = $(html).appendTo('#' + containerID)[0];
						var item = $(html).appendTo('#extraActions')[0];
			            
			            $('input[name="check_' + params + '"]').iCheck({ checkboxClass: 'icheckbox_md' });
			            
			            (function(params, checkbox) {
			            	$('input[name="check_' + params + '"]').on('ifChanged', function (event) {	                	
			                	checkbox.action(this.checked);
			                });
			            })(params, checkbox);
					
			        // Input Box    
					} else if(paramType == "input"){
						var input = sceneParam[params];
						
						var html =  '<div class="uk-width-medium-1-1">' +
										'<div class="md-card">' +
											'<div class="md-card-content">' +										
												'<label>' + paramName + '</label>' +
												'<input class="md-input" id="text_' + params + '" name="check_' + params + '" value="' + input.set.value + '" />' +
											'</div>' +
										'</div>' +
					            	'</div>';
						
						//var item = $(html).appendTo('#' + containerID)[0];
						var item = $(html).appendTo('#extraActions')[0];
						
			            (function(params, input) {
			                $(item).find('#text_' + params).keyup(function(event){
			                	input.update(this.value, event);
			                });
			            })(params, input);
					
			        // Color Pick    
					} else if(paramType == "color"){
						var color = sceneParam[params];
						var html =  '<div class="uk-width-medium-1-1">' +
										'<div class="md-card">' +
											'<div class="md-card-content">' +										
												'<h4>' + paramName + '</h4>' +
												'<div id="color_' + params + '"></div>' +
											'</div>' +
										'</div>' +
					            	'</div>';
						
						//var item = $(html).appendTo('#' + containerID)[0];
						var item = $(html).appendTo('#extraActions')[0];

						$('#color_' + params).kendoColorPicker({
							  value: color.set.init,
							  buttons: false,
							  select: function preview(e) {
								  color.update(e.value, e);							  
							  }
						});
						
					// Color Palette    
					} else if(paramType == "palette"){
						var palette = sceneParam[params];
						var html =  '<div class="uk-width-medium-1-1">' +
										'<div class="md-card">' +
											'<div class="md-card-content">' +										
												'<h4>' + paramName + '</h4>' +
												'<div id="palette_' + params + '"></div>' +
											'</div>' +
										'</div>' +
					            	'</div>';
						
						//var item = $(html).appendTo('#' + containerID)[0];
						var item = $(html).appendTo('#extraActions')[0];

						// color palette
						$('#palette_' + params).kendoColorPalette({
						  columns: 5,
						  tileSize: {
						    width: 100,
						    height: 22
						  },						  
						  palette: palette.colors,
						  value: palette.set.init,
						  change: function(e){
							  palette.update(e.value, e);
						  }
						});
												
					}					
				}
			}
		}
	//}
	
}