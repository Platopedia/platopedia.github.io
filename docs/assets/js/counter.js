/* ////////////////////////////////////////////////// */

$( document ).ready( on_ready );

function on_ready ( ) {
    
    var host = 'platopedia.github.io'; // location.host;
    
    var url = [ location.protocol, '//', host, location.pathname ];
        url = url.join( '' );
        url = encodeURIComponent( url );
        url = 'https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=' + url;
    
    $( 'body' ).append( '<img src="' + url + '" style="display:none" />' );
    
}

/* ////////////////////////////////////////////////// */


