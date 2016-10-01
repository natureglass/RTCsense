<cfinclude template="fbx_settings.cfm">

<cfset fusebox = structNew()>

<cfif isDefined('url.fa')>
	<cfset fusebox.fuseaction = url.fa>
<cfelseif isDefined('form.fa')>
	<cfset fusebox.fuseaction = form.fa>
<cfelse>
	<cfset fusebox.fuseaction = defaultFuseAction>
</cfif>

<cfinclude template="fbx_switch.cfm">