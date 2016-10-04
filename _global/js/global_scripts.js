document.addEventListener('DOMContentLoaded', function() {

	var $loading = $('<div class="loaderLine"></div>');

	/////////////////////////////////////////////POST DATA TO PAGE SITE WIDE //////////////////////////////////////////
	function postData(params){

			var url 				= params.url;
			var Args				= params.Args;

			if (typeof params.callfunction !== 'undefined') {
				var callfunction	= params.callfunction;
			}else{
				var callfunction	= '';
			}

			if (typeof params.loader !== 'undefined') {
				$("#" + params.loader).html($loading);
			} else {
				$(".overlay_cover").fadeIn();
			}

			$.post(url, Args, function(data){

				//initReload();
				if((callfunction.length)){

						//check to see if  function variable has passed
						if (callfunction.indexOf("(") !== -1 ){
							var fun = callfunction.split("(");
							var funName = callfunction[0];
							var param	= callfunction[1];
							funName(param);
						}else{
							//alert("this is without data");
							window[callfunction](data);
						}//end if
				}
				$(".overlay_cover").fadeOut();
			});//end post
	}
	///////////////////////////////////////////////LOAD PAGE DIV SITE WIDE /////////////////////////////////////////////
	function loadPageToPlaceHolder(params){

		var url 		= params.url;
		var placeHolder	= params.placeHolder;
		var Args		= params.Args;

		if (typeof params.callfunction !== 'undefined') {
			var callfunction	= params.callfunction;
		}else{
			var callfunction	= '';
		}

		if (typeof params.loader !== 'undefined') {
			$("#" + placeHolder).html($loading);
		} else {
			$(".overlay_cover").fadeIn();
		}

		if (typeof params.effect !== 'undefined') {
			loadEffect = params.effect;
		} else {
			loadEffect = "fadeIn";
		}

		$.ajax({
		    type: 'post',
		    data: Args,
		    url: url,
		    success: function(response){

		    	checkRemoveHide();
		        $("#" + placeHolder).fadeOut(function(){
		            $("#" + placeHolder).html(''); // clear the contents - do not chain this with the next .html()
		            $("#" + placeHolder).html(response); // add new contents - do not chain the next hide() as the element must be parsed in the DOM correctly first
		            if(loadEffect == "none"){
			            $("#" + placeHolder).hide().show(0 , function(){
			    			if (callfunction.length > 0){ window[callfunction](params); } $(".overlay_cover").fadeOut();
			            }); // hide the added content, then fade in
		            } else {
			            $("#" + placeHolder).hide().effect(loadEffect, function(){
			    			if (callfunction.length > 0){ window[callfunction](params); } $(".overlay_cover").fadeOut();
			            }); // hide the added content, then fade in
		            }
		        });
		    },
	        error: function (textStatus, errorThrown) {
	        	UIkit.modal.confirm('There was an error loading your action!', function(){
	        		loadPageToPlaceHolder(params);
	        	});
	        	$(".overlay_cover").fadeOut();
	        }
		});
	}

	//////////////// Convert to Boolean ////////////////
	function getBool(val){
	    var num = +val;
	    return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0,'');
	}

});
