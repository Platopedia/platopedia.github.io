/* ////////////////////////////////////////////////// */

var util_theme     = undefined;
var util_theme_key = 'util_theme';

/* ////////////////////////////////////////////////// */

function Util_Theme ( )
{
    var theme_dom    = theme_dom_bodyprop;
    var theme_cache  = theme_cache_local;
    var theme_field  = theme_field_radio;
  //var theme_device = theme_device;
  //var theme_random = theme_random;
    
    init( );
    
    function init ( )
    {
        theme( theme_cache( ) || theme_field( ) );
        
        var cb = function ( ) { theme( theme_field( ) ) };
        theme_field ( cb );
        theme_device( cb );
        
      //document.addEventListener( util_theme_key + '_in', function ( event ) { theme( event.detail.theme ) } );
    }
    
    function theme ( theme = 'device' ) // theme = theme || 'device'
    {
        var themeb = ( theme === 'device' ) ? theme_device( ) :
                   //( theme === 'random' ) ? theme_random( ) :
                                              theme;
        
        theme_dom  ( themeb );
        theme_cache( theme  );
        theme_field( theme  );
        
      //if ( util_theme === themeb ) return; // won't trigger detect_theme_forcedark
        
        util_theme = themeb;
        
        document.dispatchEvent( new CustomEvent( util_theme_key + '_out', { 'detail' : { 'theme' : themeb } } ) );
    }
    
    function theme_dom_bodyprop ( val )
    {
        if ( val ) document.body.setAttribute( 'data-theme', val );
    }
    
    function theme_cache_local ( val )
    {
        if ( ! window.localStorage ) return undefined;
        
        if ( val )  window.localStorage.setItem( util_theme_key, val );
        else return window.localStorage.getItem( util_theme_key );
    }
    
    /*
    function theme_field_menu ( val )
    {
        var element = document.querySelector( '[name="' + util_theme_key + '"]' ); if ( ! element ) throw new Error( '' );
        
        if ( val && typeof val === 'function' ) element.addEventListener( 'change', val );
        else if ( val )                         ( Array.from( element.options ).find( function ( elementb ) { return val === elementb.value } ) || new Object( ) ).selected = true;
        else return                             element.value;
    }
    */
    
    /*
    function theme_field_check ( val )
    {
        var element = document.querySelector( '[name="' + util_theme_key + '"]' ); if ( ! element ) throw new Error( '' );
        
        if ( val && typeof val === 'function' ) element.addEventListener( 'change', val );
        else if ( val )                         element.checked = ( val === element.getAttribute( 'data-theme-on' ) ) ? 1 : ( val === element.getAttribute( 'data-theme-off' ) ) ? 0 : undefined;
        else return                             element.checked ? element.getAttribute( 'data-theme-on' ) : element.getAttribute( 'data-theme-off' );
    }
    */
    
    function theme_field_radio ( val )
    {
        var elements = document.querySelectorAll( '[name="' + util_theme_key + '"]' ); if ( ! elements.length ) throw new Error( '' );
        
        if ( val && typeof val === 'function' ) elements.forEach( function ( element ) { element.addEventListener( 'change', val ) } );
        else if ( val )                         elements.forEach( function ( element ) { element.checked = ( val === element.value ) ? 1 : 0 } );
        else return                             ( Array.from( elements ).find( function ( element ) { return element.checked } ) || new Object( ) ).value;
    }
    
    function theme_device ( val )
    {
        if ( ! window.matchMedia ) return 'light';
        
        if ( val && typeof val === 'function' ) window.matchMedia( '(prefers-color-scheme: dark)' ).addEventListener( 'change', val );
        else return                             window.matchMedia( '(prefers-color-scheme: dark)' ).matches ? 'dark' : 'light';
    }
    
    /*
    function theme_random ( val )
    {
        var themes = [ 'light', 'dark' ];
        return themes[ Math.floor( Math.random( ) * themes.length ) ];
    }
    */
    
    return true;
}

/* ////////////////////////////////////////////////// */


