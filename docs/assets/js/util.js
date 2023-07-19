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

function _util_dump ( message )
{
    console.log( '[' + Date.now( ) + ']', message );
    return true;
}

function _util_warn ( message )
{
    console.warn( message );
    return false;
}

function _util_error ( message )
{
    throw new Error( message );
    return false;
}

function _util_excep ( message )
{
    var excep = new DOMException( message );
    return excep;
}

function _util_popup_notice ( message = '', callback = _util_default_callback )
{
    alert( message );
    callback( );
    return true;
}

function _util_popup_confirm ( message = '', callback_true = _util_default_callback, callback_false = _util_default_callback )
{
    var time = new Date( );
    var bool = confirm( message );
    var timeb = new Date( );
    if ( timeb - time < 10 ) bool = true;
    
    if   ( bool ) { callback_true ( ) }
    else          { callback_false( ) }
    
    return bool;
}

function _util_popup_input ( message, text = '', callback_true = _util_default_callback, callback_false = _util_default_callback )
{
    var textb = prompt( message, text );
    if   ( textb !== null ) { callback_true ( ) }
    else                    { callback_false( ) }
    return textb;
}

function _util_popup_null ( undefined, callback = _util_default_callback )
{
    callback( );
    return true;
}

function _util_upload ( file, callback_errored = _util_default_callback, callback_loaded = _util_default_callback )
{
    if ( ! window.File || ! window.FileReader || ! window.FileList || ! window.Blob ) _util_error( 'File, FileReader, FileList, Blob required' );
    var filereader = new FileReader( );
    filereader.onerror = function ( event ) { filereader.abort( ); callback_errored( ) }
    filereader.onload  = function ( event ) { callback_loaded( filereader.result )     }
    filereader.readAsDataURL( file );
    return true;
}

function _util_download ( url, name = '' )
{
    url = url.replace( /^data\:[A-Z]+\/[A-Z]+\;/i, 'data:application/octet-stream;' );
    var link = document.createElement( 'a' );
    link.addEventListener( 'click', function ( ) { link.href = url; link.download = name }, false );
    link.click( );
    return true;
}

function _util_copy ( text = '', callback_ok = _util_default_callback, callback_nok = _util_default_callback )
{
    if ( navigator.clipboard ) navigator.clipboard.writeText( text ).then( callback_ok ).catch( callback_nok );
    else callback_nok( '' );
    return true;
}

function _util_query ( text = window.location.search )
{
    if ( ! text ) return;
    text = decodeURI( text );
    var query = { };
    for ( var [ key, val ] of new URLSearchParams( text ).entries( ) ) query[key.toLowerCase( )] = val;
    return query;
}

function _util_object ( inherit, param_override = { }, param_default = { } )
{
    var param = $.extend( { }, param_default, param_override );
    var that;
    if   ( inherit ) { that = inherit( param )        }
    else             { that = { }; that.param = param }
    return that;
}

/* ////////////////////////////////////////////////// */


