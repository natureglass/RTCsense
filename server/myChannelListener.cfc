<cfcomponent extends="CFIDE.websocket.ChannelListener">

<cfscript>

	public boolean function allowSubscribe(Struct subscriberInfo) {
		try {

			ws = JavaCast( "null", 0 );
			ws = StructNew();

			ws['type'] = "subscriber";
			ws['status'] = "connected";
			ws['subscriberID'] = subscriberInfo.connectioninfo.clientid;
			WsPublish("chat", SerializeJSON(ws));

			return true;

		} catch (any e) {
			savecontent variable="tmpVariable" { writedump(e); }
	        mail = new mail();
	        mail.setSubject("wsChannelListener Error" );
	        mail.setTo( "alexdaskalakis@hotmail.com" );
	        mail.setFrom( "alexdaskalakis@hotmail.com" );
	        mail.addPart( type="html", charset="utf-8", body = tmpVariable );
	        mail.send();
		}
	}

	public boolean function allowPublish(struct publisherInfo) {
		return arguments.publisherInfo.connectionInfo.authenticated;
	}

    public any function canSendMessage(any message, Struct subscriberInfo, Struct publisherInfo)
    {
        // A check can be added here, based on subscriberInfo to decide
        // whether the individual client is interested in listenening for this perticular message.
        // By default client is ineterested and hence return true.

		try {

			if(StructKeyExists(publisherInfo.connectioninfo, "SCENEID")){


				if(subscriberInfo.clientInfo.sceneID == publisherInfo.connectioninfo.SCENEID){

					if(subscriberInfo.connectioninfo.clientid != publisherInfo.connectioninfo.clientid){
						return true;
					} else {
						return false;
					}

				} else {
					return false;
				}

			} else {

				return true;

			}

		} catch (any e) {
			savecontent variable="tmpVariable" { writedump(e); }
	        mail = new mail();
	        mail.setSubject("wsChannelListener Error" );
	        mail.setTo( "alexdaskalakis@hotmail.com" );
	        mail.setFrom( "alexdaskalakis@hotmail.com" );
	        mail.addPart( type="html", charset="utf-8", body = tmpVariable );
	        mail.send();
		}
    }

	public any function beforePublish(any message, Struct publisherInfo) {

		lock scope="application" timeout="10" type="exclusive"{
			message;
		}

		try {

			return message;

		} catch (any e) {
			savecontent variable="tmpVariable" { writedump(e); }
	        mail = new mail();
	        mail.setSubject("wsChannelListener Error" );
	        mail.setTo( "alexdaskalakis@hotmail.com" );
	        mail.setFrom( "alexdaskalakis@hotmail.com" );
	        mail.addPart( type="html", charset="utf-8", body = tmpVariable );
	        mail.send();
		}
	}

	public any function beforeSendMessage(any message, Struct publisherInfo) {

		lock scope="application" timeout="10" type="exclusive"{
			message;
		}

		if (!StructKeyExists(message, "type")){
			message['type'] = 'message';
		}

		message['event'] = "remote";
		message['sendtime'] = now();

		return message;
	}

	public function afterUnsubscribe(struct subscriberInfo){
		try {

			ws['type'] = "subscriber";
			ws['status'] = "disconnected";
			ws['subscriberID'] = subscriberInfo.connectioninfo.clientid;
			WsPublish("chat", SerializeJSON(ws));


		} catch (any e) {
			savecontent variable="tmpVariable" { writedump(e); }
	        mail = new mail();
	        mail.setSubject("wsChannelListener Error" );
	        mail.setTo( "alexdaskalakis@hotmail.com" );
	        mail.setFrom( "alexdaskalakis@hotmail.com" );
	        mail.addPart( type="html", charset="utf-8", body = tmpVariable );
	        mail.send();
		}
	}

</cfscript>

</cfcomponent>
