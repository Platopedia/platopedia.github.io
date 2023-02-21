$( document ).ready( on_ready );

function on_ready ( ) {
    
    var url = [ location.protocol, '//', location.host, location.pathname ];
        url = url.join( '' );
        url = encodeURIComponent( url );
        url = 'https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=' + url;
    
    //alert( url );
    
    $( 'body' ).append( '<img src="' + url + '" style="display:none" />' );
    
}


