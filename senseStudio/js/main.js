window.sceneCodeChanged = false;
window.selectizeUpdating = false;
window.changingScene = false;

// *** On Content Loaded *** //
document.addEventListener('DOMContentLoaded', function() {

	var showEditor = getParameterByName('e');
	if(showEditor !== null ){ showSandBox(); };

	$(".overlay_cover").fadeOut();

});


function waitForMouseStop(callback) {
    var timer;

    function moveMoveHandler(evt) {

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

// <!-- ----------------------- -->
// <!-- --- Sticky ToolBar ---- -->
// <!-- ----------------------- -->

function initStickyToolbar(){
	var screenContainer = document.getElementById('leftBlock');
	screenContainer.addEventListener( 'mouseenter', showStickToolBar, false );
	screenContainer.addEventListener( 'mouseleave', hideStickToolBar, false );
}

function showStickToolBar(){
	$('#sticky-toolbar').css('opacity', 1);
}

function hideStickToolBar(){
	$('#sticky-toolbar').css('opacity', 0);
}

function reloadScene(value){
	changeScene($('#sceneID').val());
}

function changeScene(value){

	var sceneID	= value;
	var sceneNOTsaved = window.sceneCodeChanged;

	if(!sceneNOTsaved){

		reloadIFrame(sceneID, false);

	} else {

		var msgHTML = '<div id="confirmDialog"><h3 class="uk-modal-title" style="color: red;">YOU HAVE UNSAVED CHANGES!</h3>'+
					  '<p>Would you like to save your changes first?</p></div>';

		var confModal = UIkit.modal.confirm(msgHTML, function(){
			saveSceneCode(false, true);
		});

		var htmlBtn = '<button class="md-btn md-btn-flat" onClick="ignoreSave();">Ignore</button>';
		var btnOpt = $('#confirmDialog').closest('.uk-modal-content').next('div');
		btnOpt.find('.js-modal-confirm-cancel').after(htmlBtn);
		btnOpt.find('.js-modal-confirm').html('SAVE');

	}

}

function runSceneCode(){
	saveSceneCode(true, true);
}

function reloadIFrame(sceneID, isPreview){
    var frame_id 	= 'threeJSpreview';
	window.document.getElementById(frame_id).src = "?fa=play&s="+ sceneID +"&prev=" + isPreview;
	loadCodeInEditor(sceneID, isPreview);
}

function isSceneNOTsaved(status){
	if(status === true){
		$('#saveSceneBtn').removeClass('md-color-light-blue-500').addClass('md-color-yellow-700');
	} else {
		$('#saveSceneBtn').removeClass('md-color-yellow-700').addClass('md-color-light-blue-500');
	}
	window.sceneCodeChanged = status;
}

function saveSceneCode(isPreview, reloadIt){

	$('#closeSavePrompt').trigger('click');

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
			"preview"			: isPreview,
			"reload"			: reloadIt
		} });

	} else {

		UIkit.modal.alert('<span style="color: red;">ERROR</span><br> Please add a Scene Title!');

	}
}

function checkSaveStatus(data){

	var result = JSON.parse(data);

	if(result.status === "ok"){

		if(result.preview === "false") {

			$('#sceneName').val(result.name);
			var $select = $('#scenesDropDown').selectize()[0].selectize;
			var dropSceneID = $select.getValue();
			var selectizeName = $select.getItem($select.getValue())[0].innerText;
			if(selectizeName !== result.name){
				updateDropName(result.sceneID, result.name);
			}

			$('#success_notify').data("message", result.name + " <b>" + result.type +"!</b>").trigger("click");

			isSceneNOTsaved(false);

			if(result.reload === "true"){
				if(!window.changingScene){
					reloadIFrame(result.sceneID, false);
				} else {
					reloadIFrame(dropSceneID, false);
					window.changingScene = false;
				}
			}

		} else {
			reloadIFrame(result.sceneID, true);
		}

	} else {
		UIkit.modal.alert('<span style="color: red;">ERROR</span><br> the scene <b>'+ result.name +'</b> could not be saved!');
	}

}

function updateDropName(sceneID, sceneName){
	window.selectizeUpdating = true;
	var $selectize = $("#scenesDropDown").selectize()[0].selectize;
	$selectize.removeOption(sceneID); // Remove Option by Value
	$selectize.addOption({value: sceneID, text: sceneName}); // Add an Options
	if(!window.changingScene){
		$selectize.setValue(sceneID); // Set Default Selected by Value
	}
	window.selectizeUpdating = false;
}

function ignoreSave(){
	$('#confirmDialog').closest('.uk-modal-content').next('div').find('.js-modal-confirm-cancel').trigger('click');
	isSceneNOTsaved(false);

	var sceneID = $('#sceneID').val();
	var sceneName = $('#sceneName').val();

	$('#scene_name').val(sceneName);

	if(!window.changingScene){
		reloadIFrame(sceneID, false);
	} else {
		var $select = $('#scenesDropDown').selectize()[0].selectize;
		var dropSceneID = $select.getValue();
		reloadIFrame(dropSceneID, false);
		window.changingScene = false;
	}

}

function loadCodeInEditor(sceneID, isPreview){
	postData({ url:'?fa=loadSelectedScene', callfunction:'loadedCodeReturn',  Args: { "sceneID"	: sceneID, "isPreview" : isPreview } });
	postData({ url:'?fa=loadSceneResources', callfunction:'buildResources',  Args: { "sceneID"	: sceneID } });
}

function loadedCodeReturn(code){
	var saveStatus = window.sceneCodeChanged;

	var $select = $('#scenesDropDown').selectize()[0].selectize;
	var dropSceneID = $select.getValue();
	var sceneID = $('#sceneID').val();

	if(dropSceneID !== sceneID) {
		var selectizeName = $select.getItem($select.getValue())[0].innerText;
		$('#sceneName').val(selectizeName);
		$('#scene_name').val(selectizeName);
		$('#sceneID').val(dropSceneID);
	}

	window.sceneCodeEditor.setValue(code);
	window.sceneCodeChanged = saveStatus;
	isSceneNOTsaved(window.sceneCodeChanged);
}

function buildResources(resources){
	var codeRes = JSON.parse(resources), htmlRes = '';

	for(i = 0; i < codeRes.length; i++ ){
		htmlRes += '<div class="uk-input-group">' +
				   '<input type="url" class="md-input scene_resources" id="resource_' + i +'" value="' + codeRes[i].uri  + '" placeholder="JavaScript URI" />' +
				   '<span class="uk-input-group-addon"><a href="javascript:void(0);">';
		if(i < codeRes.length - 1){
			htmlRes += '<i class="material-icons md-color-red-500" title="Add more.." data-id="' + i + '" data-type="remove" onClick="insertResourceLine($(this));">&#xE15C;</i>';
		} else {
			htmlRes += '<i class="material-icons md-color-light-blue-500" title="Add more.." data-id="' + i + '" data-type="add" onClick="insertResourceLine($(this));">&#xE147;</i>';
		}
		htmlRes += '</a></span></div>';
	}

	$('#inputResources').html(htmlRes);
	altair_md.init();
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
