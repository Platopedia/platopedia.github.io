/* ////////////////////////////////////////////////// */

var util_counter      = undefined;
var util_counter_host = 'platopedia.github.io'; // location.host;

if ( document.readyState !== 'loading' ) Util_Counter( );
else document.addEventListener( 'DOMContentLoaded', Util_Counter );

/* ////////////////////////////////////////////////// */

function Util_Counter ( )
{
    var url = [ location.protocol, '//', util_counter_host, location.pathname ];
        url = url.join( '' );
        url = encodeURIComponent( url );
        url = 'https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=' + url;
    
    document.body.insertAdjacentHTML( 'beforeend', '<img class="d-none" src="' + url + '" />' );
}

/* ////////////////////////////////////////////////// */


