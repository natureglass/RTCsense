//////////////////////////////////////////////////////////////POST DATA TO PAGE SITE WIDE //////////////////////////////////////////////////////////////////////////
function postData(params){

		var url 				= params.url;
		var Args				= params.Args;
		var callfunction		= params.callfunction;

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
		});//end post
}
/////////////////////////////////////////////////////////////////////////LOAD PAGE DIV SITE WIDE //////////////////////////////////////////////////////////////////////////
function loadPageToPlaceHolder(params){

		var url 				= params.url;
		var placeHolder			= params.placeHolder;
		var textareaID			= params.textareaID;
		var Args				= params.Args;

		if (typeof params.callfunction !== 'undefined') {
			var callfunction	= params.callfunction;
		}else{
			var callfunction	= '';
		}

		$("#"+placeHolder).html($loading);

		$.post(url, Args, function(data){
				$("#"+placeHolder).html(data);
				initReload(placeHolder);
			//check if we load ckeditor
			if (textareaID.length == 0 || textareaID == "no"){
			} else {

				createCKE(textareaID);
			}
			///////calfunction
			if ( callfunction.length > 0 ){
				window[callfunction](data);
			}

		});
}

//////////////// Convert to Boolean ////////////////
function getBool(val){
	var num = +val;
	return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0,'');
}

/////////////////////////////////////////////////////////////////////////////CONTROL CKEDITOR SITE WIDE //////////////////////////////////////////////////
