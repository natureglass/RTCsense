<cfparam name="url.id" default="0">

<cfset subscribers = WSgetSubscribers("chat")>

<cfset users = []>

<cfloop array="#subscribers#" index="myArray">

	<cfif url.id NEQ myArray.clientID>
		<cfset ArrayAppend(users, myArray.clientID)>
	</cfif>

</cfloop>

<cfoutput>#SerializeJSON(users)#</cfoutput>
