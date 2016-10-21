<cfcomponent>

<cfscript>
	THIS.clientmanagement	= "Yes";
	THIS.sessionmanagement	= "Yes";
	THIS.applicationtimeout	= CreateTimeSpan(1,0,0,0);
	THIS.sessiontimeout		= CreateTimeSpan(1,0,0,0);
	THIS.SessionManagement 	= true;

	THIS.wschannels = [{ name="chat", cfclistener="server/myChannelListener" }];

	if(Find("127.0.0.1",cgi.HTTP_HOST) OR FindNoCase("localhost",cgi.HTTP_HOST) or find('192.168.254' ,cgi.HTTP_HOST)){
		THIS.environment="development";
        THIS.name		= "RTCsense-development";
	} else{
		THIS.environment="production";
        THIS.name		= "RTCsense";
	}

</cfscript>

	<cffunction name="onApplicationStart">
		<cfscript>

			basePath = GetDirectoryFromPath(GetCurrentTemplatePath());
			parentPath = GetDirectoryFromPath(GetDirectoryFromPath(GetCurrentTemplatePath()).ReplaceFirst( "[\\\/]{1}$", "" ));
			grandParentPath = GetDirectoryFromPath(parentPath.ReplaceFirst( "[\\\/]{1}$", "" ));

			application.datasource.rtcsense = "rtcsense";

			application.paths.delimiter 	= "\";
			application.server.type 	= server.os.name;

			if(server.os.name contains 'Mac' OR server.os.name contains 'linux'){
				application.paths.delimiter = "/";
		    }

   			application.filepathDelimiter = application.paths.delimiter;

			application.urls.web = "http://#CGI.HTTP_HOST#/rtcsense/";

			application.paths.basePath = "#basePath#";
			application.paths.parentPath = "#parentPath#";
			application.paths.grandParentPath = "#grandParentPath#";

			application.paths.rtcsense = "#parentPath#RTCsense#Application.paths.delimiter#";
			application.paths.scenes = "#parentPath#RTCsense#Application.paths.delimiter#assets#Application.paths.delimiter#js#Application.paths.delimiter#scenes#Application.paths.delimiter#";

			application.mailAttr = {
				username = "rtcsense@alexddask.com", password = "!Vegas451452",
				server = "mail19.hostek.com", port = "26",
				from = "rtcsense@alexddask.com" };

			switch(THIS.environment){
				case "development":

				break;

			case "production":

				if(Compare(cgi.SERVER_PORT,443)){
					location("https://securec80.ezhostingserver.com/alexddask-com/?fa=main", false);
				}

				break;
			}

			application.mappings["/handlers"]		= "#application.paths.basepath#_handlers\";

		</cfscript>

	</cffunction>

	<cffunction name="onRequestStart">
		<cfargument type="String" name="targetPage" required=true/>

		<cfif StructKeyExists(URL,"resetme") AND URL.resetme >
			<cfset session.setMaxInactiveInterval( javaCast( "long", 1 ))>
			<cfscript>
				applicationStop();
    	        location('./',false);
			</cfscript>
			<cfset onApplicationStart()>
		</cfif>
	</cffunction>

	<!--- On Error --->
    <cffunction
        name="OnError"
        access="public"
        returntype="boolean"
        output="true"
        hint="Fires any CF error.">

		<cfargument name="exception" type="any" default="0" required="false">
		<cfset errMsg = "Error!"><!--- "#arguments.exception.rootcause.message#"> --->

		<cfdump var="#arguments.exception#">

		<cfmail to="alex@glopac.com" subject="#errMsg#" type="html" attributeCollection = "#application.mailAttr#">
			<cfdump var="#arguments.exception#">
		</cfmail>

		<!--- <cfinclude template="home/dsp_errorpage.cfm"> --->

		<cfabort>
	</cffunction>

	<!--- WebSockets Authantication --->
	<cffunction name="onWSAuthenticate" output="true">
		<cfargument name="userID" type="string">
		<cfargument name="username" type="string">
		<cfargument name="connectionInfo" type="struct">

	    <!--- Put some authentication logic here --->
		<!--- <cfset connectionInfo.username = arguments.username> --->
		<cfset connectionInfo.username = arguments.username>
		<cfset connectionInfo.userID = arguments.userID>

		<cfset arguments.connectionInfo.authenticated = true>

	    <cfreturn true>

	</cffunction>

</cfcomponent>
