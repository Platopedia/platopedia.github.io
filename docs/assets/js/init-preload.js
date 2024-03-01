/* ////////////////////////////////////////////////// */

var images = [ ];
var audios = [ ];

(
    function ( )
    {    
        for ( var i = 0; i < arguments.length; i++ )
        {
            images[i]         = new Image( );
          //images[i].onload  = function ( ) { alert( 'onload: '  + this.src ) }
          //images[i].onerror = function ( ) { alert( 'onerror: ' + this.src ) }
            images[i].src     = arguments[i];
        }
    }
)
(
    '/docs/assets/images/404.webp',
    '/docs/assets/images/logos/default.png',
    '/docs/assets/images/logos/ramadan.png',
    '/docs/assets/images/query.png',
    '/docs/assets/images/coin.png',
    '/docs/assets/images/pip.png',
    '/docs/assets/images/profilebuilder/picture/default-light.png',
    '/docs/assets/images/profilebuilder/picture/default-dark.png',
    '/docs/assets/images/profilebuilder/banner/iap_banner_default_light.png',
    '/docs/assets/images/profilebuilder/banner/iap_banner_default_dark.png',
    '/docs/assets/images/profilebuilder/chat/iap_greybubble_asset.png',
    '/docs/assets/images/profilebuilder/chat/iap_darkbubble_asset.png',
);

/* ////////////////////////////////////////////////// */


