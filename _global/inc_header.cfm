<header id="header_main">

	<div id="stats"></div>

    <div class="header_main_content">
        <nav class="uk-navbar">

            <!-- main sidebar switch -->
            <a href="##" id="sidebar_main_toggle" class="sSwitch sSwitch_left">
                <span class="sSwitchIcon"></span>
            </a>

			<div class="main_logo_top">
				<a href="javascript:void(0)" onclick="reload_home();"><img src="assets/img/RTCsense_logo.png" alt="" height="15" width="71"/></a>
			</div>

<!---
			<div class="header_custom_search_form">
				<a href="javascript:void(0)" id="clear">
					<i class="md-icon header_main_search_close material-icons">&#xE5CD;</i>
				</a>
		        <input type="text" class="header_main_search_input" id="kUI_automplete_all" placeholder="Search Project / Idea / Team or User" data-template="template" />
				<button class="header_main_search_btn uk-button-link"><i class="md-icon material-icons">&#xE8B6;</i></button>
			</div>
--->
            <!-- secondary sidebar switch -->
<!--- 			<a href="#" id="sidebar_secondary_toggle" class="sSwitch sSwitch_right sidebar_secondary_check">
                <span class="sSwitchIcon"></span>
            </a> --->

                <div id="menu_top_dropdown" class="uk-float-left uk-hidden-small">
                    <div class="uk-button-dropdown" data-uk-dropdown="{mode:'click'}">
                        <a href="#" class="top_menu_toggle"><i class="material-icons md-24">&#xE8F0;</i></a>
                        <div class="uk-dropdown uk-dropdown-width-3">
                            <div class="uk-grid uk-dropdown-grid" data-uk-grid-margin>
                                <div class="uk-width-2-3">
                                    <div id="top-menu" class="uk-grid uk-grid-width-medium-1-3 uk-margin-top uk-margin-bottom uk-text-center" data-uk-grid-margin>
                                        <a href="javascript:void(0)" onclick="profile_view(1);" class="uk-dropdown-close" data-menu="dashboard">
                                            <i class="material-icons md-36">&#xE87C;</i>
											<cfoutput>
                                            <span class="uk-text-muted uk-display-block">#session.username#</span>
											</cfoutput>
                                        </a>
                                        <a href="javascript:void(0)" onclick="all_streams();" class="uk-dropdown-close" data-menu="streams">
                                            <i class="material-icons md-36">&#xE639;</i>
                                            <span class="uk-text-muted uk-display-block">Streams</span>
                                        </a>
                                        <a href="javascript:void(0)" onclick="user_feeds();" class="uk-dropdown-close" data-menu="feeds">
                                            <i class="material-icons md-36 uk-text-secondary">&#xE91F;</i>
                                            <span class="uk-text-muted uk-display-block">Feeds</span>
                                        </a>
                                        <a href="javascript:void(0)" onclick="all_ideas();" class="uk-dropdown-close" data-menu="ideas">
                                            <i class="material-icons md-36">&#xE41D;</i>
                                            <span class="uk-text-muted uk-display-block">Ideas</span>
                                        </a>
                                        <a href="javascript:void(0)" onclick="public_teams_list();" class="uk-dropdown-close" data-menu="teams">
                                            <i class="material-icons md-36">&#xE886;</i>
                                            <span class="uk-text-muted uk-display-block">Teams</span>
                                        </a>
                                        <a href="javascript:void(0)" onclick="all_projects();" class="uk-dropdown-close" data-menu="projects">
                                            <i class="material-icons md-36">&#xE912;</i>
                                            <span class="uk-text-muted uk-display-block">Projects</span>
                                        </a>
                                    </div>
                                </div>
                                <div class="uk-width-1-3" id="top-menu-nav">
                                    <ul class="uk-nav uk-nav-dropdown uk-panel">
                                        <li class="uk-nav-header">My Profile</li>
                                        <li><a href="javascript:void(0)" onclick="all_friends();" class="uk-dropdown-close" data-menu="connections"><i class="material-icons">&#xE7FD;</i> Connections</a></li>
                                        <li><a href="javascript:void(0)" onclick="all_messages();" class="uk-dropdown-close" data-menu="messages"><i class="material-icons">&#xE158;</i> Messages</a></li>
                                        <li><a href="javascript:void(0)" onclick="photos_list();" class="uk-dropdown-close" data-menu="photos"><i class="material-icons">&#xE8A7;</i> Photos</a></li>
                                        <li><a href="javascript:void(0)" onclick="posts_list();" class="uk-dropdown-close" data-menu="posts"><i class="material-icons">&#xE896;</i> Posts</a></li>
                                        <!--- <li><a href="components_tabs.html">Tabs</a></li> --->
                                    </ul>
                                </div>
                            </div>
						</div>
                    </div>

                </div>



<!---
            <div class="uk-navbar-flip">
                <ul class="uk-navbar-nav user_actions">
<!---                     <li><a href="#" id="main_search_btn" class="user_action_icon"><i class="material-icons md-24 md-light">&#xE8B6;</i></a></li> --->
                    <!--- <li><a href="#" id="full_screen_toggle" class="user_action_icon uk-visible-large"><i class="material-icons md-24 md-light">&#xE5D0;</i></a></li> --->
					<li><a href="javascript:void(0)" onClick="BroadCaster('Broadcast_123456')" class="user_action_icon uk-visible-large" data-uk-tooltip="{pos:'bottom'}" title="Instant BroadCast">
							<i data-camid="" class="WebCamIcon material-icons md-24 md-light">&#xE639;</i>
						</a>
					</li>

                    <li data-uk-dropdown="{mode:'click',pos:'bottom-right'}">
                        <a href="#" class="user_action_icon"><i class="material-icons md-24 md-light">&#xE7F4;</i><span class="uk-badge">16</span></a>
                        <div class="uk-dropdown uk-dropdown-xlarge">
                            <div class="md-card-content">
                                <ul class="uk-tab uk-tab-grid" data-uk-tab="{connect:'#header_alerts',animation:'slide-horizontal'}">
                                    <li class="uk-width-1-2 uk-active"><a href="#" class="js-uk-prevent uk-text-small">Messages (12)</a></li>
                                    <li class="uk-width-1-2"><a href="#" class="js-uk-prevent uk-text-small">Alerts (4)</a></li>
                                </ul>
                                <ul id="header_alerts" class="uk-switcher uk-margin">
                                    <li>
                                        <ul class="md-list md-list-addon">
                                            <li>
                                                <div class="md-list-addon-element">
                                                    <span class="md-user-letters md-bg-cyan">di</span>
                                                </div>
                                                <div class="md-list-content">
                                                    <span class="md-list-heading"><a href="pages_mailbox.html">Voluptate neque tempore.</a></span>
                                                    <span class="uk-text-small uk-text-muted">Est velit culpa consequatur possimus delectus ratione ex rerum sint quo.</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="md-list-addon-element">
                                                    <img class="md-user-image md-list-addon-avatar" src="assets/img/avatars/avatar_07_tn.png" alt=""/>
                                                </div>
                                                <div class="md-list-content">
                                                    <span class="md-list-heading"><a href="pages_mailbox.html">Praesentium quidem voluptas.</a></span>
                                                    <span class="uk-text-small uk-text-muted">Ab enim quia voluptas illo vel commodi.</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="md-list-addon-element">
                                                    <span class="md-user-letters md-bg-light-green">vj</span>
                                                </div>
                                                <div class="md-list-content">
                                                    <span class="md-list-heading"><a href="pages_mailbox.html">Maiores quae.</a></span>
                                                    <span class="uk-text-small uk-text-muted">Dolores sequi cumque repellat itaque at itaque exercitationem hic dolorem eligendi enim.</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="md-list-addon-element">
                                                    <img class="md-user-image md-list-addon-avatar" src="assets/img/avatars/avatar_02_tn.png" alt=""/>
                                                </div>
                                                <div class="md-list-content">
                                                    <span class="md-list-heading"><a href="pages_mailbox.html">Autem recusandae in.</a></span>
                                                    <span class="uk-text-small uk-text-muted">Odio magni possimus iure velit deleniti eos qui laborum aut.</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="md-list-addon-element">
                                                    <img class="md-user-image md-list-addon-avatar" src="assets/img/avatars/avatar_09_tn.png" alt=""/>
                                                </div>
                                                <div class="md-list-content">
                                                    <span class="md-list-heading"><a href="pages_mailbox.html">Architecto ut.</a></span>
                                                    <span class="uk-text-small uk-text-muted">Assumenda unde necessitatibus veniam est enim aut aut ullam accusamus eligendi.</span>
                                                </div>
                                            </li>
                                        </ul>
                                        <div class="uk-text-center uk-margin-top uk-margin-small-bottom">
                                            <a href="page_mailbox.html" class="md-btn md-btn-flat md-btn-flat-primary js-uk-prevent">Show All</a>
                                        </div>
                                    </li>
                                    <li>
                                        <ul class="md-list md-list-addon">
                                            <li>
                                                <div class="md-list-addon-element">
                                                    <i class="md-list-addon-icon material-icons uk-text-warning">&#xE8B2;</i>
                                                </div>
                                                <div class="md-list-content">
                                                    <span class="md-list-heading">Rerum maxime.</span>
                                                    <span class="uk-text-small uk-text-muted uk-text-truncate">Saepe facere beatae debitis atque.</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="md-list-addon-element">
                                                    <i class="md-list-addon-icon material-icons uk-text-success">&#xE88F;</i>
                                                </div>
                                                <div class="md-list-content">
                                                    <span class="md-list-heading">Aut sequi dolorum.</span>
                                                    <span class="uk-text-small uk-text-muted uk-text-truncate">Sit dolor error sunt odit deleniti.</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="md-list-addon-element">
                                                    <i class="md-list-addon-icon material-icons uk-text-danger">&#xE001;</i>
                                                </div>
                                                <div class="md-list-content">
                                                    <span class="md-list-heading">Est nihil.</span>
                                                    <span class="uk-text-small uk-text-muted uk-text-truncate">Quam et alias harum autem quisquam dolores officiis.</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="md-list-addon-element">
                                                    <i class="md-list-addon-icon material-icons uk-text-primary">&#xE8FD;</i>
                                                </div>
                                                <div class="md-list-content">
                                                    <span class="md-list-heading">Unde voluptatibus quisquam.</span>
                                                    <span class="uk-text-small uk-text-muted uk-text-truncate">Ut rerum corporis nostrum animi sed ad ut.</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
 					<li>
						<cfoutput>
						<span class="uk-badge uk-badge-secondary uk-badge-notification" style="font-size: 14px; padding: 5px 10px; margin-top: 10px;" data-uk-tooltip="{cls:'uk-tooltip-small',pos:'top'}" title="Eearned Stars">
							<span class="">#session.stars#</span>
							<a href="javascript:void(0)">
							<i class="material-icons" style="color: ##ffb300;" data-liked="true">&##xE838;</i></a>
						</span>
						</cfoutput>
					</li>
                    <li data-uk-dropdown="{mode:'click',pos:'bottom-right'}">
                        <a href="#" class="user_action_image">
							<div class="md-list-addon-avatar-small-element">
							<span class="element-status element-status-success"></span>
							<cfoutput>
						    <cfif session.avatar EQ "">
						        <img src="assets/img/avatars/avatar_11_tn.png" alt="user avatar" class="md-user-image"/>
							<cfelse>
								<img src="_users_data/#session.avatar#?r=#RandRange(0, 90000)#" data-current="_users_data/#session.avatar#" alt="user avatar" class="md-user-image"/>
							</cfif></cfoutput>
							</div>
						</a>
                        <div class="uk-dropdown uk-dropdown-small">
                            <ul class="uk-nav js-uk-prevent">
                                <li class="uk-dropdown-close"><a href="javascript:void(0)" onclick="profile_view(1); menu_highlight('dashboard')"><i class="material-icons">&#xE853;</i> My profile</a></li>
                                <li class="uk-dropdown-close"><a href="javascript:void(0)" onclick="profile_settings(); menu_highlight();"><i class="material-icons">&#xE8B8;</i> Settings</a></li>
                                <li class="uk-dropdown-close"><a href="javascript:void(0)" onclick="logout();"><i class="material-icons">&#xE879;</i> Logout</a></li>
                            </ul>
                        </div>
                    </li>

                </ul>
            </div>
					 --->

        </nav>
    </div>
<!---     <div class="header_main_search_form">
        <i class="md-icon header_main_search_close material-icons">&#xE5CD;</i>
        <form class="uk-form">
            <input type="text" class="header_main_search_input" />
            <button class="header_main_search_btn uk-button-link"><i class="md-icon material-icons">&#xE8B6;</i></button>
        </form>
    </div> --->
</header>

<style type="text/css">
	li .over { display: inline-block; border: 1px solid blue; margin: 5px; padding: 10px; vertical-align: top; }
</style>
