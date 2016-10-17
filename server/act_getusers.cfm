<cfscript>
	allusers.SUBSCRIBERS = normJSON(WSgetSubscribers("chat"));
	allusers.REQTYPE = "allusers";
	WsPublish("chat", allusers);
</cfscript>

<cffunction name="normJSON" access="public">
	<cfargument name="myJson" type="any">
	<cfset myNormJson = "{">
	<cfoutput>
		<cfset num = 0>
		<cfset ArrLen = arrayLen(myJson)>
		<cfloop array="#myJson#" index="myArray">
			<cfset num = num + 1>
			<cfset myJson = serializeJSON(myArray)>
			<cfset myNormJson = myNormJson & '"user#num#":#myJson#'>
			<cfif num NEQ ArrLen><cfset myNormJson = myNormJson & ",">
				<cfelse><cfset myNormJson = myNormJson & "}">
			</cfif>
		</cfloop>
	</cfoutput>
	<cfreturn myNormJson>
</cffunction>
