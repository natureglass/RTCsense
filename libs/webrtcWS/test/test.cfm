<cfoutput>

<script type="text/javascript">
	var randNum = Math.floor(Math.random() * 600) + 1;
	window.userID  = "1";
	window.username  = "user_" + randNum;
	console.log(window.userID);
</script>

</cfoutput>

<!DOCTYPE html>
<html lang="en">
	<head>
		<title></title>

	    <meta charset="UTF-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <!-- Remove Tap Highlight on Windows Phone IE -->
	    <meta name="msapplication-tap-highlight" content="no"/>

		<meta name="mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-capable" content="yes">

		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

		<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=no">

	    <link rel="icon" type="image/png" href="assets/img/favicon-16x16.png" sizes="16x16">
	    <link rel="icon" type="image/png" href="assets/img/favicon-32x32.png" sizes="32x32">

		<link href="sensePlayer/js/jquery/jquery-ui.css" rel="stylesheet">

		<link rel="stylesheet" href="sensePlayer/fonts/material-icons.css" media="all">

		<link rel="stylesheet" href="sensePlayer/css/main.css" media="all">

		<style type="text/css">
		</style>

	</head>
	<body>
		<button onClick="sendSomething()">Send</button>
	</body>
	<!-- WebSockets -->
	<script src="sensePlayer/js/cfwebsockets.js" type="text/javascript"></script>

	<script type="text/javascript">

		function initWebRTC( data ){
			console.log(data.event + " - " + data.status + " - " + data.localID);
		}

		function gotMessageFromServer(data) {
			console.log(data);
		}

		function sendSomething(){
			window.webSockets.send("Hello!!");
		}

	</script>

	</body>
</html>
