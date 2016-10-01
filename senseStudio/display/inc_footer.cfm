<div class="overlay_cover">
    <div class="loader"></div>
    <div class="cs_loader_back md-btn-primary"></div>
    <div class="cs_loader"></div>
</div>

</div>
</div>
</div>

<!-- google web fonts -->
<script>
WebFontConfig = {
google: {
families: [
    'Source+Code+Pro:400,700:latin',
    'Roboto:400,300,500,700,400italic:latin'
]
}
};
(function() {
var wf = document.createElement('script');
wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
wf.type = 'text/javascript';
wf.async = 'true';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(wf, s);
})();
</script>

<!-- common functions -->
<script src="altair/assets/js/common.min.js"></script>
<!-- uikit functions -->
<script src="altair/assets/js/uikit_custom.min.js"></script>
<!-- altair common functions/helpers -->
<script src="altair/assets/js/altair_admin_common.min.js"></script>

<!--- iOS iframe auto-resize workaround --->
<script type="text/javascript">
	var viewer = document.getElementById( 'threeJSpreview' );
	if ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) {
	    viewer.style.width = getComputedStyle( viewer ).width;
	    viewer.style.height = getComputedStyle( viewer ).height;
	    viewer.setAttribute( 'scrolling', 'no' );
	}
</script>
