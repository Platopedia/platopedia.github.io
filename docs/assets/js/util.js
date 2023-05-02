/* ////////////////////////////////////////////////// */

//$.fn.selectpicker.Constructor.BootstrapVersion = '4';

$.fn.valb = function ( )
{
    var val = this.val( );
    if ( val == '' ) val = undefined;
    return val;
}

$.fn.datab = function ( key )
{
    var val = this.data( key );
    if ( val == '' ) val = undefined;
    return val;
}

$.fn.reverse = function ( )
{
    return this.pushStack( this.get( ).reverse( ), arguments );
};

$.fn.random = function ( )
{
    return this.eq( Math.floor( Math.random( ) * this.length ) );
}

/* ////////////////////////////////////////////////// */

function _util_default_callback ( )
{
    return true;
}

/* ////////////////////////////////////////////////// */

function _util_dump ( message )
{
    console.log( '[' + Date.now( ) + ']', message );
    return true;
}

/* ////////////////////////////////////////////////// */

function _util_warn ( message )
{
    console.warn( message );
    return false;
}

/* ////////////////////////////////////////////////// */

function _util_error ( message )
{
    throw new Error( message );
    return false;
}

/* ////////////////////////////////////////////////// */

function _util_excep ( message )
{
    var excep = new DOMException( message );
    return excep;
}

/* ////////////////////////////////////////////////// */

function _util_popup_message ( message = '', callback = _util_default_callback )
{
    alert( message );
    callback( );
    return true;
}

/* ////////////////////////////////////////////////// */

function _util_popup_confirm ( message = '', callback_true = _util_default_callback, callback_false = _util_default_callback )
{
    var bool = confirm( message );
    if   ( bool == true ) { callback_true ( ) }
    else                  { callback_false( ) }
    return bool;
}

/* ////////////////////////////////////////////////// */

function _util_popup_dummy ( undefined, callback = _util_default_callback )
{
    callback( );
    return true;
}

/* ////////////////////////////////////////////////// */

function _util_upload ( url, name = '' )
{
    
}

/* ////////////////////////////////////////////////// */

function _util_download ( url, name = '' )
{
    url = url.replace( /^data\:[A-Z]+\/[A-Z]+\;/i, 'data:application/octet-stream;' );
    var link = document.createElement( 'a' );
    link.addEventListener( 'click', function ( ) { link.href = url; link.download = name }, false );
    link.click( );
    return true;
}

/* ////////////////////////////////////////////////// */

function _util_object ( inherit, param_override, param_default )
{
    var param = $.extend( { }, param_default || { }, param_override || { } );
    var that;
    if   ( inherit ) { that = inherit( param )        }
    else             { that = { }; that.param = param }
    return that;
}

/* ////////////////////////////////////////////////// */


