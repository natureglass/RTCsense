<!DOCTYPE html>
<html>
    <head>

        <script type="text/javascript">
        	var randNum = Math.floor(Math.random() * 600) + 1;
        	window.userID  = "1";
        	window.username  = "user_" + randNum;
        </script>

        <script src="sensePlayer/js/cfwebsockets.js"></script>

        <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
        <script src="libs/webrtcWS/webRTCws/main.js"></script>

    </head>

    <body>
        <video id="localVideo" autoplay muted style="width:40%;"></video>
        <video id="remoteVideo" autoplay style="width:40%;"></video>

        <br />

        <input type="button" id="start" onclick="start(true)" value="Start Video"></input>

    </body>
</html>
