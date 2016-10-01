<cfinclude template="senseStudio/display/inc_footer.cfm">

<!-- codeMirror -->
<link rel="stylesheet" href="assets/js/CodeMirror/lib/codemirror.css">
<link rel="stylesheet" href="assets/js/CodeMirror/addon/lint/lint.css">
<link rel="stylesheet" href="assets/js/CodeMirror/addon/scroll/simplescrollbars.css">
<script src="assets/js/CodeMirror/lib/codemirror.js"></script>
<script src="assets/js/CodeMirror/mode/javascript/javascript.js"></script>
<script src="assets/js/CodeMirror/mode/css/css.js"></script>
<script src="//ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js"></script>
<script src="https://rawgithub.com/zaach/jsonlint/79b553fb65c192add9066da64043458981b3972b/lib/jsonlint.js"></script>
<script src="assets/js/CodeMirror/addon/lint/lint.js"></script>
<script src="assets/js/CodeMirror/addon/lint/javascript-lint.js"></script>
<script src="assets/js/CodeMirror/addon/lint/json-lint.js"></script>
<script src="assets/js/CodeMirror/addon/scroll/simplescrollbars.js"></script>


<style type="text/css">
	.CodeMirror {
		border: 1px solid #eee;
       	height: calc(100vh - 120px);
		/* height: auto; */
	}
</style>

<script type="text/javascript">

	window.sceneCodeEditor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
		lineNumbers: true,
		mode: "javascript",
		gutters: ["CodeMirror-lint-markers"],
		scrollbarStyle: "simple",
		lint: true,
		onChange: function (cm) {
		   alert("changed");
		},
	    extraKeys: {
	        "Ctrl-S": function(cm) {
	        	saveSceneCode(false);
	        },
	        "Ctrl-R": function(cm) {
	        	runSceneCode(cm.getValue());
	        },
	        "Esc": function(cm) {
				closeSandBox();
	        }
	    }
	});

	window.sceneCodeEditor.on('change',function(cm){
		if(window.sceneCodeChanged === false){
			isSceneNOTsaved(true);
		}
	});

	$('#scene_name').on('input', function(){
		if(window.sceneCodeChanged === false){
			isSceneNOTsaved(true);
		}
	});

	$('.scene_resources').on('input',function(){
		if(window.sceneCodeChanged === false){
			isSceneNOTsaved(true);
		}
	});

<!--- 	window.sceneCodeEditor.setValue(''); --->

/*
	var randNum = Math.round(Math.random() * 1000) + 1;
	jQuery.get("assets/js/scenes/dual_fisheye.js?rnd=" + randNum, function(data) {

		window.sceneCodeEditor.setValue(data);

		setTimeout(function(){
			window.sceneCodeEditor.refresh();
			window.sceneCodeEditor.scrollTo(null, 0);
		}, 3000);

	}, "html").done(function() {
	    //console.log("second success");
	}).fail(function(jqXHR, textStatus) {
	    //console.log(textStatus);
	}).always(function() {
	    //console.log("finished");
	});

*/

</script>



<!--  jquery ui -->
<!--- <script src="assets/js/jquery/jquery-ui.min.js" type="text/javascript"></script> --->
<script type="text/javascript" src="https://code.jquery.com/ui/1.8.23/jquery-ui.min.js"></script>

<!-- ionrangeslider -->
<script src="altair/bower_components/ion.rangeslider/js/ion.rangeSlider.min.js"></script>

<!--  kendoui functions -->
<link rel="stylesheet" href="altair/bower_components/kendo-ui/styles/kendo.common-material.min.css"/>
<link rel="stylesheet" href="altair/bower_components/kendo-ui/styles/kendo.material.min.css"/>
<script src="altair/assets/js/kendoui_custom.min.js"></script>
<script src="altair/assets/js/pages/kendoui.min.js"></script>

<!--  notifications functions -->
<script src="altair/assets/js/pages/components_notifications.min.js"></script>

<!-- Header AutoHide --->
<!--- <script type="text/javascript">

	var element		= element = document.getElementById('header_main');

	var elHeight		= 0,
		elTop			= 0,
		dHeight			= 0,
		wHeight			= 0,
		wScrollCurrent	= 0,
		wScrollBefore	= 0,
		wScrollDiff		= 0;

	window.addEventListener( 'scroll', function() {
		elHeight		= element.offsetHeight;
		dHeight			= document.body.offsetHeight;
		wHeight			= window.innerHeight;
		wScrollCurrent	= window.pageYOffset;
		wScrollDiff		= wScrollBefore - wScrollCurrent;
		elTop			= parseInt( window.getComputedStyle( element ).getPropertyValue( 'top' ) ) + wScrollDiff;

		if( wScrollCurrent <= 0 ){ // scrolled to the very top; element sticks to the top

			element.style.top = '0px';

		} else if( wScrollDiff > 0 ){ // scrolled up; element slides in

			element.style.top = ( elTop > 0 ? 0 : elTop ) + 'px';
			//console.log("333");

		} else if( wScrollDiff < 0 ){ // scrolled down

			if( wScrollCurrent + wHeight >= dHeight - elHeight ){  // scrolled to the very bottom; element slides in

				//element.style.top = ( ( elTop = wScrollCurrent + wHeight - dHeight ) < 0 ? elTop : 0 ) + 'px';
				//console.log("111");

			} else { // scrolled down; element slides out

				element.style.top = ( Math.abs( elTop ) > elHeight ? -elHeight : elTop ) + 'px';

			}
		}

		wScrollBefore = wScrollCurrent;
	});

</script> --->

<!-- RTCsense Global Scripts -->
<script src="_global/js/global_scripts.js" type="text/javascript"></script>

<!-- RTCStudio Scripts -->
<script src="senseStudio/js/main.js" type="text/javascript"></script>


<script src="assets/js/custom.js"></script>

<div id="rtcFooter"></div>
