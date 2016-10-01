window.sceneCodeChanged = false;

// *** On Content Loaded *** //

document.addEventListener('DOMContentLoaded', function() {

	var showEditor = getParameterByName('e');
	if(showEditor !== null ){ showSandBox(); };

	$(".overlay_cover").fadeOut();

});


function waitForMouseStop(callback) {
    var timer;

	//var screenContainer = document.getElementById('screenContainer');

    function moveMoveHandler(evt) {

		console.log("moving");

        evt = evt || window.event;

        if (timer) {
            window.clearTimeout(timer);
        }

        timer = window.setTimeout(function() {
            callback();
			window.clearTimeout(timer);
        }, 2000);
    }

    document.onmousemove = moveMoveHandler;

}

// <!-- ------------------------ -->
// <!-- Toggle Normal to SandBox -->
// <!-- ------------------------ -->

var isSandBoxActive = false,
	isEditorRefreshed = false,
	fastEase = 'fast',
	slowEase = 'slow';

function showSandBox(){

	if(isSandBoxActive){

		$('.sandBox-btn').show();
		$('#ThreeJSeditor').hide();

		$('#leftBlock').css('width','70%');
		$('#rightBlock').css('float', 'right');
		$('#toolBarRight').removeClass('noMargins');

		$('#commentsCard, #sceneDescCard, #watchingCard').show();

		isSandBoxActive = false;

	} else {

		$('.sandBox-btn').hide();
		$('#ThreeJSeditor').show();

		refreshEditor();

		$('#leftBlock').css('width','30%');
		$('#rightBlock').css('float', 'left');
		$('#toolBarRight').addClass('noMargins');

		$('#commentsCard, #sceneDescCard, #watchingCard').hide();

		isSandBoxActive = true;
	}


}


// <!-- -------------- -->
// <!-- Editor Refresh -->
// <!-- -------------- -->

function refreshEditor(scrollToTop){
	if(!isEditorRefreshed){
		window.sceneCodeEditor.refresh();
		if(scrollToTop){ window.sceneCodeEditor.scrollTo(null, 0); }
		isEditorRefreshed = true;
	}
}

// <!-- ------------------------ -->
// <!-- ------------------------ -->

function initStickyToolbar(){
	var screenContainer = document.getElementById('leftBlock');

	//screenContainer.removeEventListener( 'mouseenter', showStickToolBar, true );
	//screenContainer.removeEventListener( 'mouseleave', hideStickToolBar, true );

	screenContainer.addEventListener( 'mouseenter', showStickToolBar, false );
	screenContainer.addEventListener( 'mouseleave', hideStickToolBar, false );
}

function showStickToolBar(){
	//console.log("in");
	$('#sticky-toolbar').css('opacity', 1);
}

function hideStickToolBar(){
	$('#sticky-toolbar').css('opacity', 0);
	//console.log("out");
}

// Get URL keys
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}









function reloadScene(){

	if(window.sceneCodeChanged === false){

		reloadPage();

	} else {

		$('#saveChangesPrompt').trigger('click');

	}

}

function reloadPage(){

	var sceneID	= $('#sceneID').val();
	var locationLink = "?fa=studio";

	if(sceneID !== "0"){ locationLink += "&s=" + sceneID + "&e=true"; }

	location.href = locationLink;

}

function runSceneCode(){

	var userSceneID		= $('#userSceneID').val();
	var sceneID			= $('#sceneID').val();
	var sceneCode 		= window.sceneCodeEditor.getValue();
	var sceneResources	= new Array();

	$('.scene_resources').each(function(){
	    sceneResources.push($(this).val());
	});

	postData({ url:'?fa=saveScene', callfunction:'reloadIFrame',  Args: {
		"userSceneID"		: userSceneID,
		"sceneID"			: sceneID,
		"sceneCode" 		: sceneCode,
		"sceneResources" 	: sceneResources,
		"preview"			: true
	} });

}

function reloadIFrame(){

	var sceneID		= $('#sceneID').val();
    var frame_id 	= 'threeJSpreview';
	window.document.getElementById(frame_id).src = "?fa=play&s="+ sceneID +"&prev=true";

}

function isSceneNOTsaved(status){
	if(status === true){
		$('#saveSceneBtn').removeClass('md-color-light-blue-500').addClass('md-color-yellow-700');
	} else {
		$('#saveSceneBtn').removeClass('md-color-yellow-700').addClass('md-color-light-blue-500');
	}
	window.sceneCodeChanged = status;
}

function saveSceneCode(sceneReload){

	var userSceneID		= $('#userSceneID').val();
	var sceneID			= $('#sceneID').val();
	var sceneCode 		= window.sceneCodeEditor.getValue();
	var sceneName 		= $('#scene_name').val();
	var sceneResources	= new Array();


	if(sceneName.length !== 0 & sceneCode.length !== 0) {

		$('.scene_resources').each(function(){
		    sceneResources.push($(this).val());
		});

		postData({ url:'?fa=saveScene', callfunction:'checkSaveStatus',  Args: {
			"userSceneID"		: userSceneID,
			"sceneID"			: sceneID,
			"sceneName" 		: sceneName,
			"sceneCode" 		: sceneCode,
			"sceneResources" 	: sceneResources,
			"reload"			: sceneReload,
			"preview"			: false
		} });

	} else {

		UIkit.modal.alert('<span style="color: red;">ERROR</span><br> Please add a Scene Title!');

	}
}

function checkSaveStatus(data){

	var result = JSON.parse(data);

	if(result.status === "ok"){

		$('#success_notify').data("message", result.name + " <b>" + result.type +"!</b>").trigger("click");

		var $select = $(document.getElementById('scenesDropDown')).selectize();
		var dropDownScenes = $select[0].selectize;
		dropDownScenes.removeOption(result.id);
		dropDownScenes.addOption({value: result.id, text: result.name});
		dropDownScenes.addItem(result.id, false);

		isSceneNOTsaved(false);

		if(result.reload === true){ reloadPage(); }

	} else {
		UIkit.modal.alert('<span style="color: red;">ERROR</span><br> the scene <b>'+ result.name +'</b> could not be saved!');
	}

}

function openExtResources(){
	$('#external_resources').slideToggle();
}

function closeExtResources(){
	$('#external_resources').slideUp();
}

function checkURI(uri){
	if(/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(uri)){
		return true;
	} else {
		return false;
	}
}

function insertResourceLine($this){

	var type = $this.attr('data-type');
	var count = $this.attr('data-id');
	var uri = $('#resource_' + count).val().trim();

	var urlType = uri.substr(uri.lastIndexOf(".") + 1);

	if(type === "add"){

		if( checkURI(uri) & urlType == "js" ){

			$('#resource_' + count).val(uri);

			$this.attr('data-type', 'remove');
			$this.removeClass('md-color-light-blue-500').addClass('md-color-red-500');
			$this.html('&#xE15C;');

			count++;

			var resInput = '<div class="uk-input-group">' +
								'<input type="url" class="md-input scene_resources" id="resource_' + count + '" value="" placeholder="JavaScript/CSS URI" />' +
								'<span class="uk-input-group-addon">' +
									'<a href="javascript:void(0)"><i class="material-icons md-color-light-blue-500" title="Add more.." data-id="' + count + '" data-type="add" onClick="insertResourceLine($(this));">&#xE147;</i></a>' +
								'</span>' +
							'</div>';

			$('#inputResources').append(resInput);

			altair_md.init();

		} else {
			UIkit.modal.alert('<span style="color: red;">Invalid URI! Please type something like:</span> <br> https://cdnjs.cloudflare.com/ajax/libs/test.min.js');
		}

	} else {

		$($this).closest('.uk-input-group').remove();
		isSceneNOTsaved(true);

	}

}
