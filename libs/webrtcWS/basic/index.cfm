<!DOCTYPE html>
<!--
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
-->
<html>
<head>

  <meta charset="utf-8">
  <meta name="description" content="WebRTC code samples">
  <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1">
  <meta itemprop="description" content="Client-side WebRTC code samples">
  <meta itemprop="image" content="../../../images/webrtc-icon-192x192.png">
  <meta itemprop="name" content="WebRTC code samples">
  <meta name="mobile-web-app-capable" content="yes">
  <meta id="theme-color" name="theme-color" content="#ffffff">

  <base target="_blank">

  <title>Transmit text</title>

  <link rel="icon" sizes="192x192" href="libs/webrtc/images/webrtc-icon-192x192.png">
  <link href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="libs/webrtc/css/main.css">
  <link rel="stylesheet" href="libs/webrtcWS/basic/main.css" />

  <script type="text/javascript">
      var randNum = Math.floor(Math.random() * 600) + 1;
      window.userID  = "1";
      window.username  = "user_" + randNum;
  </script>

</head>

<body>

  <div id="container">

    <h1><span>ClientID: </span><span style="color: red;" id="myClientID"></div></h1>

    <div id="buttons">
      <button id="connectToAll">Conn ALL</button>
      <button id="showUsers">Users</button>
      <button id="sendButton">Send</button>
    </div>

    <ul id="connectedUsersLog"></ul>

    <br>
    <div id="sendReceive">
      <div id="send">
        <h2>Send</h2>
        <textarea id="dataChannelSend" disabled placeholder="Press Start, enter some text, then press Send."></textarea>
      </div>
      <div id="receive">
        <h2>Receive</h2>
        <textarea id="dataChannelReceive" disabled></textarea>
      </div>
    </div>

  </div>

  <script src="sensePlayer/js/cfwebsockets.js"></script>
  <script src="libs/webrtc/js/adapter.js"></script>
  <script src="libs/webrtc/js/common.js"></script>

  <script src="sensePlayer/js/cfwebrtc.js"></script>
  <script src="libs/webrtcWS/basic/main.js"></script>

  <style>
    .connectToUser {
      cursor: pointer;
      color: green;
    }
    .connectToUser + a {
        font-weight: bold;
        position: relative;
        top: -15pt;
        left: -27pt;
    }
  </style>

</body>
</html>
