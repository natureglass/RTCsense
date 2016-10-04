<!doctype html>
<!--[if lte IE 9]> <html class="lte-ie9" lang="en"> <![endif]-->
<!--[if gt IE 9]><!--> <html lang="en"> <!--<![endif]-->

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- Remove Tap Highlight on Windows Phone IE -->
    <meta name="msapplication-tap-highlight" content="no"/>

	<meta name="mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-capable" content="yes">

	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

	<meta name="viewport" content="minimal-ui">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

    <link rel="icon" type="image/png" href="assets/img/favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="assets/img/favicon-32x32.png" sizes="32x32">

	<!-- Extension (Client) -->
	<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/cgiaclgflkoolhiffiblfmfiamgjpgno">
	<!-- App (Server) -->
	<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/iccejeonidbdghffljiadmjjkeldpiff">

    <title>RTCsense</title>

    <!-- additional styles for plugins -->

    <!-- weather icons -->
    <link rel="stylesheet" href="altair/bower_components/weather-icons/css/weather-icons.min.css" media="all">
    <!-- metrics graphics (charts) -->
    <link rel="stylesheet" href="altair/bower_components/metrics-graphics/dist/metricsgraphics.css">
    <!-- chartist -->
    <link rel="stylesheet" href="altair/bower_components/chartist/dist/chartist.min.css">

    <!-- uikit -->
    <link rel="stylesheet" href="altair/bower_components/uikit/css/uikit.almost-flat.min.css" media="all">

    <!-- flag icons -->
    <link rel="stylesheet" href="altair/assets/icons/flags/flags.min.css" media="all">

    <!-- style switcher -->
    <link rel="stylesheet" href="altair/assets/css/style_switcher.min.css" media="all">

    <!-- altair admin -->
    <link rel="stylesheet" href="altair/assets/css/main.min.css" media="all">

    <!-- themes -->
    <link rel="stylesheet" href="altair/assets/css/themes/themes_combined.min.css" media="all">

    <!-- RTCsense Global Style -->
    <link rel="stylesheet" href="_global/css/global_style.css" media="all">

    <!-- RTCStudio Style -->
    <link rel="stylesheet" href="senseStudio/css/main.css" media="all">

	<script type="text/javascript">

		function toggleFullScreen(isActiveFullScreen){

			var threeJSpreview = document.getElementById('threeJSpreview');

			window.scrollTo(0, 50);

			if(isActiveFullScreen){
				threeJSpreview.className = "fullScreen";
				//document.documentElement.className = "overflowHidden";
				document.html.className = "overflowHidden";
			} else {
				threeJSpreview.className = "";
				//document.documentElement.className = "";
				document.html.className = "";
			}

		}

		function onOrientationChange(){

			var threeJSpreview = document.getElementById('threeJSpreview'),
				ratioHelper = document.getElementById('ratioHelper'),
				iframeWidth = ratioHelper.clientWidth,
				iframeHeight = ratioHelper.clientHeight;

			threeJSpreview.style.width = iframeWidth + 'px';
			threeJSpreview.style.height = iframeHeight + 'px';

		}

		// setInterval(function(){
        //
		// 	var threeJSpreview = document.getElementById('threeJSpreview'),
		// 		ratioHelper = document.getElementById('ratioHelper'),
		// 		status = document.getElementById('status');
        //
		// 	var prevWidth =	threeJSpreview.style.width,
		// 		prevHeight = threeJSpreview.style.height,
		// 		ratioWidth = ratioHelper.clientWidth,
		// 		ratioHeight = ratioHelper.clientHeight;
        //
		// 	if(prevWidth !== ratioWidth + 'px' || prevHeight !== ratioHeight + 'px' ){
		// 		onOrientationChange();
		// 	}
        //
		// }, 1000);

	</script>

</head>

<!-- Initializing Session -->
<cfinclude template="../../_global/init_session.cfm">

<!--- <cfinclude template="init_scripts.cfm"> --->

<cfinclude template="../../_global/inc_header.cfm">

<body class="sidebar_main_swipe boxed_layout"> <!--- header_full --->

	<div id="page_content">
	    <div id="page_content_inner">
