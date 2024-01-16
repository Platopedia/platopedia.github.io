(function(){

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

/* ////////////////////////////////////////////////// */

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
    frame_default.one( 'load',  function ( ) { if ( typeof deferred !== 'undefined' ) deferred.resolve( ) } );
  //frame_default.one( 'error', function ( ) { if ( typeof deferred !== 'undefined' ) deferred.resolve( ) } );
    
    // this.contentWindow.stop( );
    // this.contentWindow.history.go( -1 );
    // frame_default.attr( 'src', 'about:blank' );
    // window.location.replace( this.contentWindow.location.href );
    
    /*
    frame_default.on
    (
        'load',
        function ( )
        {
            try
            {
                var host  = window.location.host;
                var hostb = this.contentWindow.location.host;
                if ( host && hostb && host == hostb ) window.location.href = this.contentWindow.location.href;
            }
            catch ( error )
            {
                // x
            }
        }
    );
    */
    
    // https://stackoverflow.com/questions/2429045/iframe-src-change-event-detection
    
    on_iframeurlchange
    (
        frame_default.get( 0 ),
        function ( windowb )
        {
            try
            {
                var host  = window.location.host;
                var hostb = windowb.location.host;
                if ( host && hostb && host == hostb ) window.location.href = windowb.location.href;
            }
            catch ( error )
            {
                // x
            }
        }
    );
    
    function on_iframeurlchange ( iframe, callback )
    {
        var unload = function ( )
        {
            try
            {
                setTimeout( function ( ) { callback( iframe.contentWindow ) }, 0 ); // timeout otherwise url won't be ready
            }
            catch ( error )
            {
                // x
            }
        }
        
        var unloadb = function ( )
        {
            try
            {
                iframe.contentWindow.removeEventListener( 'unload', unload ); // remove otherwise might dispatch twice
                iframe.contentWindow.addEventListener   ( 'unload', unload );
            }
            catch ( error )
            {
                // x
            }
        }
        
        iframe.addEventListener( 'load', unloadb );
        unloadb( );
    }
    
    //
    
    return that;
}

/* ////////////////////////////////////////////////// */

})()


