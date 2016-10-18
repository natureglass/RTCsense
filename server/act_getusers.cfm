<cfset subscribers = WSgetSubscribers("chat")>

<cfdump var="#subscribers#">

<cfset subSize = ArrayLen(subscribers)>
<cfset i = 0>
[<cfloop array="#subscribers#" index="myArray">
		<cfset i = i+1>
		<cfoutput>#myArray.clientID#</cfoutput>
		<cfif subSize NEQ i>,</cfif>
</cfloop>]
