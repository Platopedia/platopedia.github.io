/* ////////////////////////////////////////////////// */

$( document ).ready
(
    function ( )
    {
        var deferred = $.Deferred( );
        $.when( deferred ).then( function ( ) { $( '.loaded-b' ).attr( 'style', 'display:block !important' ) } );
        Tool_Embed( deferred );
    }
);

/* ////////////////////////////////////////////////// */

const Tool_Embed_conf =
{
    
};

function Tool_Embed ( deferred )
{
    var that = null;
    
    // div
    
    var div_default = $( '#tool_embed_div_default' );
    
    var url    = div_default.data( 'url'    );
    var height = div_default.data( 'height' );
    
    // frame
    
    var frame_default = $( '<iframe src="' + url + '" style="min-height:' + height + '"></iframe>' );
    
    frame_default.appendTo( div_default );
    frame_default.on( 'load',  function ( ) { if ( typeof deferred !== 'undefined' ) deferred.resolve( ) } );
  //frame_default.on( 'error', function ( ) { if ( typeof deferred !== 'undefined' ) deferred.resolve( ) } );
    
    //
    
    return that;
}

/* ////////////////////////////////////////////////// */


