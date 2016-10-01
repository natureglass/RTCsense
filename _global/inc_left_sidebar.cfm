<cfoutput>
<aside id="sidebar_main">

	<div class="md-btn-primary">
		<span id="status-message" style="width: 100%;" class="uk-badge uk-badge-warning text-center">We are connecting ...</span>
    </div>

    <div class="menu_section" id="sidebar_menu">  <!--- style="overflow-y: scroll" --->
        <ul>

            <li title="Live Streams">
                <a href="javascript:void(0)" onclick="stream_start(2);" data-menu="test">
                    <span class="menu_icon"><i class="material-icons md-color-red-A400">&##xE639;</i></span>
                    <span class="menu_title">test</span>
                </a>
            </li>

            <li title="Live Streams">
                <a href="javascript:void(0)" onclick="all_streams();" data-menu="streams">
                    <span class="menu_icon"><i class="material-icons md-color-red-A400">&##xE639;</i></span>
                    <span class="menu_title">Live Streams</span>
                </a>
            </li>

			<hr>

            <li class="current_section" title="Feeds">
                <a href="javascript:void(0)" onclick="user_feeds();" data-menu="feeds">
                    <span class="menu_icon"><i class="material-icons">&##xE91F;</i></span>
                    <span class="menu_title">Feeds</span>
                </a>
            </li>

            <li title="All Ideas">
                <a href="javascript:void(0)" onclick="all_ideas();" data-menu="ideas">
                    <span class="menu_icon"><i class="material-icons">&##xE41D;</i>
					</span>
                    <span class="menu_title">Ideas</span>
                </a>
            </li>

            <li title="All Teams">
                <a href="javascript:void(0)" onclick="public_teams_list();" data-menu="teams">
                    <span class="menu_icon"><i class="material-icons">&##xE886;</i>
					</span>
                    <span class="menu_title">Teams</span>
                </a>
            </li>

            <li title="All Projects">
                <a href="javascript:void(0)" onclick="all_projects();" data-menu="projects">
                    <span class="menu_icon"><i class="material-icons">&##xE912;</i></span>
                    <span class="menu_title">Projects</span>
                </a>
            </li>

            <li title="Dashboard">
                <a href="javascript:void(0)" onclick="profile_view(1);" data-menu="dashboard">
                    <span class="menu_icon"><i class="material-icons">&##xE87C;</i></span>
                    <span class="menu_title usrGlobal">#session.username#</span>
                </a>
            </li>

            <li class="act_section">
                <a href="javascript:void(0)" class="drop_down" data-menu="connections">
                    <span class="menu_icon"><i class="material-icons">&##xE853;</i></span>
                    <span class="menu_title">My Profile</span>
                </a>
                <ul style="display: block; padding-top: 0px;">
		            <li title="My Friends">
		                <a href="javascript:void(0)" onclick="all_friends();" data-menu="connections">
		                    <span class="menu_icon"><i class="material-icons">&##xE7FD;</i></span>
		                    <span class="menu_title">Connections</span>
		                </a>
		            </li>
		            <li title="My Messages">
		                <a href="javascript:void(0)" onclick="all_messages();" data-menu="messages">
		                    <span class="menu_icon"><i class="material-icons">&##xE158;</i></span>
		                    <span class="menu_title">Messages</span>
		                </a>
		            </li>
		            <li title="My Photos">
		                <a href="javascript:void(0)" onclick="photos_list();" data-menu="photos">
		                    <span class="menu_icon"><i class="material-icons">&##xE8A7;</i></span>
		                    <span class="menu_title">Photos</span>
		                </a>
		            </li>
		            <li title="My Posts">
		                <a href="javascript:void(0)" onclick="posts_list();" data-menu="posts">
		                    <span class="menu_icon"><i class="material-icons">&##xE896;</i></span>
		                    <span class="menu_title">Posts</span>
		                </a>
		            </li>
                </ul>
            </li>

            <li title="Developer Console" id="left-menu_console">
                <a href="javascript:void(0)" onclick="" data-menu="console">
                    <span class="menu_icon"><i class="material-icons">&##xE312;</i></span>
                    <span class="menu_title">Developer Console</span>
                </a>
            </li>

        </ul>
    </div>
</aside>
</cfoutput>