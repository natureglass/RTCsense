<!DOCTYPE html>
<html>
    <head>
        <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
        <script src="libs/webRTCws/main.js"></script>

        <script type="text/javascript">
          window.userID = 1;
          window.username = "natureglass";
        </script>

    </head>

    <body>
        <video id="localVideo" autoplay muted style="width:40%;"></video>
        <video id="remoteVideo" autoplay style="width:40%;"></video>

        <br />

        <input type="button" id="start" onclick="start(true)" value="Start Video"></input>

        <script src="assets/js/cfwebsockets.js"></script>

    </body>
</html>
