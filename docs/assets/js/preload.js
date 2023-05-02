/* ////////////////////////////////////////////////// */

var images = [ ];
var audios = [ ];

function preload ( ) {
    
    for ( var i = 0; i < arguments.length; i++ ) {
        
        images[i]         = new Image( );
      //images[i].onload  = function ( ) { alert( 'onload: '  + this.src ) }
      //images[i].onerror = function ( ) { alert( 'onerror: ' + this.src ) }
        images[i].src     = arguments[i];
        
    }
    
}

preload
(
    '/docs/assets/images/icon.png',
    '/docs/assets/images/search.png',
    '/docs/assets/images/tool-profilebuilder/picture/default.png',
    '/docs/assets/images/tool-profilebuilder/banner/iap_banner_default_light.png',
    '/docs/assets/images/tool-profilebuilder/chat/iap_greybubble_asset.png',
);

/* ////////////////////////////////////////////////// */


