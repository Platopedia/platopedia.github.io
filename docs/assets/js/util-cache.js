/* ////////////////////////////////////////////////// */

function Util_Cache ( param )
{
    var that = _util_object
    (
        undefined,
        param,
        {
            'driver'     : Util_Cache_Driver_Temp,
            'key'        : 'util_cache',
            'clear'      : false,
            'callbackr'  : null,
            'callbackw'  : null,
            'callbackrw' : null,
        },
    );
    
    that.driver = that.param.driver || _util_error( 'driver required' );
    if ( typeof that.driver !== 'object' ) that.driver = that.driver( );
    
    that.key = that.param.key || _util_error( 'key required' );
    
    that.ref = null; // new Object( null );
    
    that.test = function ( callback_ok, callback_nok )
    {
        var bool = null;
        
        try
        {
          //_util_error( '' );
            that.driver.test( );
            bool = true;
        }
        catch ( error )
        {
            error = 'Cache test error: ' + error;
            _util_popup_notice( error );
            bool = false;
        }
        
        return bool;
    }
    
    that.read = function ( callback_ok, callback_nok )
    {
        var bool = null;
        
        try
        {
          //_util_error( '' );
            that.ref = that.driver.read( that.key );
            bool = true;
        }
        catch ( error )
        {
            error = 'Cache read error: ' + error;
            _util_popup_notice( error );
            bool = false;
        }
        
        if ( ! _util_is_hash( that.ref ) ) that.ref = new Object( null ); // _util_error( 'ref not hash' );
        if ( that.param.callbackrw       ) that.param.callbackrw( that.ref );
        if ( that.param.callbackr        ) that.param.callbackr ( that.ref );
        
        return bool;
    };
    
    that.write = function ( callback_ok, callback_nok )
    {
        var bool = null;
        
        if ( ! _util_is_hash( that.ref ) ) that.ref = new Object( null ); // _util_error( 'ref not hash' );
        if ( that.param.callbackrw       ) that.param.callbackrw( that.ref );
        if ( that.param.callbackw        ) that.param.callbackw ( that.ref );
        
        try
        {
          //_util_error( '' );
            that.driver.write( that.key, that.ref );
            bool = true;
        }
        catch ( error )
        {
            error = 'Cache write error: ' + error;
            _util_popup_notice( error );
            bool = false;
        }
        
        return bool;
    };
    
    that.clear = function ( callback_ok, callback_nok )
    {
        var bool = null;
        
        try
        {
          //_util_error( '' );
            that.driver.clear( that.key );
            bool = true;
        }
        catch ( error )
        {
            error = 'Cache clear error: ' + error;
            _util_popup_notice( error );
            bool = false;
        }
        
        return bool;
    };
    
    if ( ! that.test( ) ) that.driver = Util_Cache_Driver_Temp( );
    if ( that.param.clear ) that.clear( );
    
  //that.read( );
  //that.write( );
    
    return that;
}

/* ////////////////////////////////////////////////// */

function Util_Cache_Driver_Temp ( )
{
    var that = new Object( null ); // _util_object( );
    
    that.ref = new Object( null );
    
    that.test = function ( )
    {
        // x
    };
    
    that.read = function ( key = '_' )
    {
        return that.ref[key];
    };
    
    that.write = function ( key = '_', val )
    {
        return that.ref[key] = val;
    };
    
    that.clear = function ( key )
    {
        if ( key ) delete that.ref[key];
        else that.ref = new Object( null );
    };
    
    return that;
}

/* ////////////////////////////////////////////////// */

function Util_Cache_Driver_Local ( )
{
    var that = new Object( null ); // _util_object( );
    
    that.test = function ( )
    {
        var key = 'util_cache_test';
        localStorage.setItem   ( key, '' );
        localStorage.getItem   ( key );
        localStorage.removeItem( key );
    };
    
    that.read = function ( key = '_' )
    {
        return JSON.parse( localStorage.getItem( key ) );
    };
    
    that.write = function ( key = '_', val )
    {
        return localStorage.setItem( key, JSON.stringify( val ) );
    };
    
    that.clear = function ( key )
    {
        if ( key ) localStorage.removeItem( key );
        else localStorage.clear( );
    };
    
    return that;
}

/* ////////////////////////////////////////////////// */

function Util_Cache_Driver_Remote ( )
{
    var that = new Object( null ); // _util_object( );
    
    that.test = function ( )
    {
        _util_error( 'unimplemented' );
    };
    
    return that;
}

/* ////////////////////////////////////////////////// */


