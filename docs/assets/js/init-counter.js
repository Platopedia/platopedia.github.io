/* ////////////////////////////////////////////////// */

(
    function ( callback )
    {
        if ( document.readyState !== 'loading' ) callback( );
        else document.addEventListener( 'DOMContentLoaded', callback );
    }
)
(
    function ( )
    {
        var host = 'platopedia.github.io'; // location.host;
        
        var url = [ location.protocol, '//', host, location.pathname ];
            url = url.join( '' );
            url = encodeURIComponent( url );
            url = 'https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=' + url;
        
        document.body.insertAdjacentHTML( 'beforeend', '<img class="d-none" src="' + url + '" />' );
    }
);

/* ////////////////////////////////////////////////// */


