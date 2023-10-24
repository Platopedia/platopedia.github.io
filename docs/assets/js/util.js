/* ////////////////////////////////////////////////// */

$.fn.valb = function ( )
{
    var val = this.val( );
    if ( val == '' ) val = undefined;
    return val;
};

$.fn.datab = function ( key )
{
    var val = this.data( key );
    if ( val == '' ) val = undefined;
    return val;
};

$.fn.random = function ( )
{
    return this.eq( Math.floor( Math.random( ) * this.length ) );
};

$.fn.reverse = function ( )
{
    return this.pushStack( this.get( ).reverse( ), arguments );
};

$.fn.sortletter = function ( )
{
    return this.pushStack( this.sort( function ( a, b ) { return a.toLowerCase( ).localeCompare( b.toLowerCase( ) ) } ), arguments );
};

$.fn.sortnumber = function ( )
{
    return this.pushStack( this.sort( function ( a, b ) { return a - b } ), arguments );
};

/* ////////////////////////////////////////////////// */

// misc

$( document ).on
(
    'click',
    '.btn-copy',
    function ( event )
    {
        event.preventDefault( );
        var url = $( this ).attr( 'href' );
        _util_copy
        (
            url,
            function ( ) { _util_popup_notice( 'Link copied!' ) },
            function ( ) { _util_popup_copy  ( url )            }
        );
        return false;
    }
);

// modal

/*
$( document ).on
(
    'keydown mousedown',
    '.modal',
    function ( event )
    {
        event.preventDefault( );
        return false;
    }
);
*/

// modal not bootbox

$( document ).on
(
    'hide.bs.modal',
    '.modal:not(.bootbox)',
    function ( event )
    {
        var modalboot = $( '.modal.bootbox.show' );
        modalboot.modal( 'hide' );
    }
);

// modal bootbox

$( document ).on
(
    'show.bs.modal',
    '.modal.bootbox',
    function ( )
    {
        $( 'body' ).append( '<div class="bootbox-modal-backdrop modal-backdrop fade show"></div>' );
        var modal = $( '.modal:not(.bootbox)' ); // .show
        modal.addClass( 'overflow-hidden' );
    }
);

$( document ).on
(
    'shown.bs.modal',
    '.modal.bootbox',
    function ( )
    {
        var modalboot = $( this ); // .filter( '.popup-copy' );
        if ( modalboot.hasClass( 'popup-copy' ) )
        {
            var input = modalboot.find( 'input' );
            input.on( 'focus',       function ( ) { _util_call_noexcep( ( ) => input.select( ) ) } );
            input.on( 'click xblur', function ( ) { window.setTimeout( function ( ) { input.trigger( 'focus' ) }, 0 ) } );
            input.trigger( 'focus' );
        }
    }
);

$( document ).on
(
    'hide.bs.modal',
    '.modal.bootbox',
    function ( )
    {
        $( '.bootbox-modal-backdrop' ).remove( );
        var modal = $( '.modal:not(.bootbox)' ); // .show
        modal.removeClass( 'overflow-hidden' );
    }
);

$( document ).on
(
    'hidden.bs.modal',
    '.modal.bootbox',
    function ( )
    {
        var modal = $( '.modal:not(.bootbox).show' );
        if ( modal.length )
        {
            $( 'body' ).addClass( 'modal-open' );
            modal.trigger( 'focus' );
        }
    }
);

$( document ).on
(
    'click', // mousedown
    '.modal.bootbox',
    function ( event )
    {
        var modalboot = $( this );
        if ( event.target === event.currentTarget ) modalboot.modal( 'hide' );
    }
);

// document ready

$( document ).ready
(
    function ( )
    {
        var hash = window.location.hash.slice( 1 );
        if ( hash && hash != 'popup-item' ) _util_call_noexcep( ( ) => $( '#' + hash ).modal( 'show' ) );
        
        $( document ).one
        (
            'click', // mousedown
            '.container',
            function ( )
            {
                $( '.modal:not(.bootbox)' ).each
                (
                    function ( )
                    {
                        var modal = $( this );
                        var id    = modal.attr( 'id' );
                        var hash  = '#' + id;
                        
                        var cb_back = function ( ) { modal.modal( 'hide' ) };
                        
                        modal.on
                        (
                            'shown.bs.modal',
                            function ( )
                            {
                                window.history.pushState( hash, id, window.location.pathname + window.location.search + hash );
                                window.addEventListener( 'popstate', cb_back, false );
                            }
                        );
                        
                        modal.on
                        (
                            'hidden.bs.modal',
                            function ( )
                            {
                                if ( window.history.state === hash ) window.history.go( -1 );
                                window.removeEventListener( 'popstate', cb_back );
                            }
                        );
                    }
                );
            }
        );
    }
);

/* ////////////////////////////////////////////////// */

function _util_popup_notice ( message = '', callback = _util_default_callback )
{
    var modalboot = bootbox.dialog
    (
        {
            className      : 'popup-notice',
            title          : '',
            message        : message,
            backdrop       : false,
            centerVertical : true,
            onEscape       : true,
            buttons        :
            {
                close :
                {
                    label     : 'Close',
                    className : 'btn btn-form font-weight-bold m-0 mr-3 mb-3',
                  //callback  : callback,
                },
            }
        }
    );
    
    return modalboot;
}

function _util_popup_confirm ( message = '', callback_true = _util_default_callback, callback_false = _util_default_callback )
{
    var modalboot = bootbox.dialog
    (
        {
            className      : 'popup-confirm',
            title          : '',
            message        : message,
            backdrop       : false,
            centerVertical : true,
            onEscape       : true,
            buttons        :
            {
                no :
                {
                    label     : 'No',
                    className : 'btn btn-form font-weight-bold m-0 mr-3 mb-3',
                  //callback  : callback_false,
                },
                yes :
                {
                    label     : 'Yes',
                    className : 'btn btn-form font-weight-bold m-0 mr-3 mb-3',
                    callback  : callback_true,
                }
            }
        }
    );
    
    return modalboot;
}

function _util_popup_copy ( text = '', callback_true = _util_default_callback, callback_false = _util_default_callback )
{
    var modalboot = bootbox.dialog
    (
        {
            className      : 'popup-copy',
            title          : '',
            message        : '<input class="form-control" type="text" value="' + text + '" readonly />',
            backdrop       : false,
            centerVertical : true,
            onEscape       : true,
            buttons        :
            {
                close :
                {
                    label     : 'Close',
                    className : 'btn btn-form font-weight-bold m-0 mr-3 mb-3',
                  //callback  : callback_true,
                },
            }
        }
    );
    
    return modalboot;
}

/* ////////////////////////////////////////////////// */

function _util_default_callback ( )
{
    return true;
}

function _util_is_list ( ref )
{
    if ( ! ref                   ) return false;
    if ( typeof ref !== 'object' ) return false;
    if ( ! Array.isArray( ref )  ) return false;
    return true;
}

function _util_is_hash ( ref )
{
    if ( ! ref                   ) return false;
    if ( typeof ref !== 'object' ) return false;
    if ( Array.isArray( ref )    ) return false;
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

function _util_call_noexcep ( callback = _util_default_callback )
{
    var errorb = null;
    try             { callback( )    }
    catch ( error ) { errorb = error }
    return errorb;
}

function _util_dprc_popup_notice ( message = '', callback = _util_default_callback )
{
    alert( message );
    callback( );
    return true;
}

function _util_dprc_popup_confirm ( message = '', callback_true = _util_default_callback, callback_false = _util_default_callback )
{
    var time = new Date( );
    var bool = confirm( message );
    var timeb = new Date( );
    if ( timeb - time < 10 ) bool = true;
    
    if   ( bool ) { callback_true ( ) }
    else          { callback_false( ) }
    
    return bool;
}

function _util_dprc_popup_input ( message, text = '', callback_true = _util_default_callback, callback_false = _util_default_callback )
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

function _util_dprc_download ( url, name = '' )
{
    url = url.replace( /^data\:[A-Z]+\/[A-Z]+\;/i, 'data:application/octet-stream;' );
    var link = document.createElement( 'a' );
    link.addEventListener( 'click', function ( ) { link.href = url; link.download = name }, false );
    link.click( );
    return true;
}

function _util_download ( url, name = '' )
{
    url = url.replace( /^data\:[A-Z]+\/[A-Z]+\;/i, 'data:application/octet-stream;' );
    var link = document.createElement( 'a' );
    link.download = name;
    link.href = url;
  //link.target = '';
    document.body.appendChild( link );
    link.click( );
    document.body.removeChild( link );
    delete link;
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
    var query = new Object( null );
    if ( ! text ) return query;
    text = decodeURI( text );
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


