/* ////////////////////////////////////////////////// */

function _Util_Element ( param )
{
    var that = _util_object
    (
        undefined,
        param,
        {
            'callback' : { },
            'element'  : null,
            'rebuild'  : false,
        },
    );
    
  //var inher = { init : that.init, };
    
    that.element = that.param.element || _util_error( 'element required' );
  //that.parent  = that.element.parent( );
    
    that.prop = 'unimplemented';
    
    that.init = function ( )
    {
        if ( that.param.rebuild ) that.rebuild( );
        if ( that.value ) that.valuedefault = that.value( );
        if ( that.title ) that.titledefault = that.title( );
        
        if ( that.callback       ) that.callback( );
        if ( that.param.callback ) $.each( that.param.callback, function ( event, callback ) { that.element.on( event, { that : that }, callback ) } );
        
        that.element.trigger( 'init' );
        
        return that;
    };
    
    that.rebuild = function ( )
    {
        var $element = that.element;
        var $elementb = $element.clone( true, true );
        $elementb.addClass( 'is-rebuilt' );
        $element.replaceWith( $elementb );
        that.element = $elementb;
        return true;
    };
    
    that.items = function ( )
    {
        return that.element.children( );
    };
    
    that.item = function ( )
    {
        return that.items( ).last( );
    };
    
    that.eventcreate = function ( event, callback )
    {
        return that.element.on( event, callback );
    };
    
    that.eventexecute = function ( event )
    {
        return that.element.trigger( event );
    };
    
    that.eventon = function ( event, callback )
    {
        return that.element.on( event, callback );
    };
    
    that.eventoff = function ( event, callback )
    {
        return that.element.off( event, callback );
    };
    
    that.oper = function ( )
    {
        return that.element.prop( 'disabled', false );
    };
    
    that.unoper = function ( )
    {
        return that.element.prop( 'disabled', true );
    };
    
    that.disp = function ( )
    {
        return that.element.show( );
    };
    
    that.undisp = function ( )
    {
        return that.element.hide( );
    };
    
    that.title = function ( titleb, disp = false )
    {
        if ( typeof titleb !== 'undefined' )
        {
            that.element.attr( 'title', titleb );
            if ( that.element.is( '[data-toggle="tooltip"]' ) )
            {
                that.element.tooltip( '_fixTitle' );
                
              //that.element.attr( 'data-original-title', titleb );
              //that.element.tooltip( 'update' );
                
              //that.element.tooltip( 'dispose' );
              //that.element.tooltip( { title : titleb } );
                
                if ( disp ) that.element.tooltip( 'show' );
            }
        }
        return that.element.attr( 'title' );
    };
    
    return that;
}

/* ////////////////////////////////////////////////// */

function _Util_Element_Button ( param )
{
    var that = _util_object
    (
        _Util_Element,
        param,
        undefined,
    );
    
    return that;
}

/* ////////////////////////////////////////////////// */

function _Util_Element_Input ( param )
{
    var that = _util_object
    (
        _Util_Element,
        param,
        {
            'validate' : function ( ) { return true },
        },
    );
    
    that.value = function ( valueb )
    {
        if ( typeof valueb !== 'undefined' )
        {
            that.element.val( valueb );
            that.element.trigger( 'change' );
        }
        return that.element.val( );
    };
    
    that.reset = function ( )
    {
        return that.value( that.valuedefault );
    };
    
    that.clear = function ( )
    {
        return that.value( '' );
    };
    
    that.length = function ( )
    {
        return that.value( ).length;
    };
    
    that.validate = function ( )
    {
        [ ].unshift.call( arguments, that.value( ) );
        var bool = that.param.validate.apply( null, arguments );
        if   ( bool ) that.element.removeClass( 'is-invalid' );
        else          that.element.addClass   ( 'is-invalid' );
        return bool;
    };
    
    return that;
}

/* ////////////////////////////////////////////////// */

function _Util_Element_Input_Multi ( param )
{
    var that = _util_object
    (
        _Util_Element_Input,
        param,
        undefined,
    );
    
    that.item = function ( )
    {
      //return that.element.find( ':' + that.prop );
        return that.items( ).filter( ':' + that.prop );
    };
    
    that.value = function ( )
    {
        _util_error( 'unimplemented' );
    };
    
    that.valuebytext = function ( key )
    {
        return that.items( ).filter( function ( ) { return $( this ).html( ) == key } ).val( );
    };
    
    that.valuebyrand = function ( )
    {
        return that.items( ).random( ).val( );
    };
    
    return that;
}

/* ////////////////////////////////////////////////// */

function _Util_Element_Media ( param )
{
    var that = _util_object
    (
        _Util_Element,
        param,
        undefined,
    );
    
    that.value = function ( valueb )
    {
        if ( typeof valueb !== 'undefined' )
        {
            that.item( ).trigger( 'loading' );
            that.item( ).attr( 'src', valueb );
        }
        return that.item( ).attr( 'src' );
    };
    
    that.reset = function ( )
    {
        return that.value( that.valuedefault );
    };
    
    that.clear = function ( )
    {
        return that.value( '' );
    };
    
    that.callback = function ( )
    {
        that.item( ).on
        (
            'loading',
            function ( )
            {
                that.element.trigger    ( 'loading' );
                that.element.removeClass( [ 'is-loaded', 'is-errored' ] );
                that.element.addClass   ( 'is-loading' );
            }
        );
        
        that.item( ).on
        (
            'error',
            function ( )
            {
                that.element.trigger    ( 'errored' );
                that.element.removeClass( [ 'is-loading', 'is-loaded' ] );
                that.element.addClass   ( 'is-errored' );
            }
        );
        
        that.item( ).on
        (
            'load',
            function ( )
            {
                that.element.trigger    ( 'loaded', [ that.value( ) ] );
                that.element.removeClass( [ 'is-loading', 'is-errored' ] );
                that.element.addClass   ( 'is-loaded' );
            }
        );
    };
    
    return that;
}

/* ////////////////////////////////////////////////// */

function Util_Element_Button_Default ( param )
{
    var that = _util_object
    (
        _Util_Element_Button,
        param,
        undefined,
    );
    
    that.init( );
    
    return that;
}

/* ////////////////////////////////////////////////// */

function Util_Element_Button_Toggle ( param )
{
    var that = _util_object
    (
        _Util_Element_Button,
        param,
        undefined,
    );
    
    that.ison = function ( )
    {
        return that.element.hasClass( 'is-on' );
    };
    
    that.isoff = function ( )
    {
        return that.element.hasClass( 'is-off' );
    };
    
    that.on = function ( disp = true )
    {
        that.element.removeClass( 'is-off' );
        that.element.addClass   ( 'is-on'  );
        that.title( that.titledefault + ' on', disp );
        that.element.trigger( 'on' );
        
        return true;
    };
    
    that.off = function ( disp = true )
    {
        that.element.removeClass( 'is-on'  );
        that.element.addClass   ( 'is-off' );
        that.title( that.titledefault + ' off', disp );
        that.element.trigger( 'off' );
        
        return false;
    };
    
    that.callback = function ( )
    {
        that.element.on
        (
            'click',
            function ( event )
            {
              //var $element = $( this );
                
                if      ( that.ison ( ) ) { that.off( )       }
                else if ( that.isoff( ) ) { that.on ( )       }
                else                      { _util_error( '' ) }
                
                return true;
            }
        );
    };
    
    that.init( );
    
    return that;
}

/* ////////////////////////////////////////////////// */

function Util_Element_Input_Default ( param )
{
    var that = _util_object
    (
        _Util_Element_Input,
        param,
        undefined,
    );
    
    that.init( );
    
    return that;
}

/* ////////////////////////////////////////////////// */

function Util_Element_Input_File ( param )
{
    var that = _util_object
    (
        _Util_Element_Input,
        param,
        undefined,
    );
    
    var urldefault = that.element.attr( 'data-url' );
    var url        = urldefault;
    
    that.file = function ( )
    {
        var file = { };
        
        if ( that.element.get( 0 ).files.length > 0 )
        {
            file.obj  = that.element.get( 0 ).files[0];
            file.name = file.obj.name;
            file.type = file.obj.type;
            file.byte = file.obj.size;
        }
        else if ( url )
        {
            file.url  = url;
            file.name = 'dummy';
            file.type = 'image/dummy';
            file.byte = 1000;
        }
        
        return file;
    };
    
    that.reset = function ( )
    {
        url = urldefault; // quickfix
        return that.value( that.valuedefault );
    };
    
    that.callback = function ( )
    {
        that.element.on
        (
            'init change',
            function ( event )
            {
              //var $element = $( this );
                
                that.element.trigger( 'loading' );
                
                var file = that.file( );
                if ( ! that.validate( file ) ) return; // quickfix
                
                url = null; // quickfix
                
                if ( typeof file.obj !== 'undefined' )
                {
                    _util_upload
                    (
                        file.obj,
                        function ( ) { that.element.trigger( 'errored', arguments ) },
                        function ( ) { that.element.trigger( 'loaded',  arguments ) },
                    );
                }
                else if ( typeof file.url !== 'undefined' )
                {
                    that.element.trigger( 'loaded', [ file.url ] );
                }
                
                return true;
            }
        );
    };
    
    that.init( );
    
    return that;
}

/* ////////////////////////////////////////////////// */

function Util_Element_Input_Menu ( param )
{
    var that = _util_object
    (
        _Util_Element_Input_Multi,
        param,
        undefined,
    );
    
    that.prop = 'selected';
    
    that.items = function ( )
    {
        return that.element.find( 'option' );
    };
    
    that.value = function ( valueb )
    {
        if ( typeof valueb !== 'undefined' )
        {
            that.element.val( valueb );
          //that.items( ).prop( that.prop, false );
          //that.items( ).filter( function ( ) { return $( this ).val( ) == valueb } ).prop( that.prop, true );
            
            if ( that.element.is( '[class^="is-selectpicker"]' ) ) that.element.selectpicker( 'render' ); // refresh
            
          //that.items( ).trigger( 'change' );
            that.element.trigger( 'change' );
        }
        
        return that.element.val( );
      //return that.item( ).val( );
    };
    
    that.init( );
    
    return that;
}

/* ////////////////////////////////////////////////// */

function Util_Element_Input_Radiocheck ( param )
{
    var that = _util_object
    (
        _Util_Element_Input_Multi,
        param,
        undefined,
    );
    
    that.prop = 'checked';
    
    that.items = function ( )
    {
        return that.element.find( 'input:checkbox' );
    };
    
    that.value = function ( valueb )
    {
        if ( typeof valueb !== 'undefined' )
        {
          //that.element.val( valueb );
          //that.items( ).prop( that.prop, false );
            that.items( ).filter( function ( ) { return $( this ).val( ) == valueb } ).prop( that.prop, true );
            
            that.items( ).trigger( 'change' );
            that.element.trigger( 'change' );
        }
        
      //return that.element.val( );
        return that.item( ).val( );
    };
    
    that.reset = function ( )
    {
        return that.items( ).prop( that.prop, false );
    };
    
    that.callback = function ( )
    {
        that.items( ).on
        (
            'change',
            function ( event )
            {
                var $element = $( this );
                
                if ( $element.is( ':' + that.prop ) )
                {
                    that.reset( );
                    $element.prop( that.prop, true );
                }
                else
                {
                    $element.prop( that.prop, false );
                }
                
                return true;
            }
        );
    };
    
    that.init( );
    
    return that;
}

/* ////////////////////////////////////////////////// */

function Util_Element_Media_Default ( param )
{
    var that = _util_object
    (
        _Util_Element_Media,
        param,
        undefined,
    );
    
    that.init( );
    
    return that;
}

/* ////////////////////////////////////////////////// */

function Util_Element_Media_Image ( param )
{
    var that = _util_object
    (
        _Util_Element_Media,
        param,
        undefined,
    );
    
    that.item = function ( )
    {
        return that.element.find( 'img' );
    };
    
    that.clear = function ( )
    {
        return that.value( 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' );
    };
    
    that.init( );
    
    return that;
}

/* ////////////////////////////////////////////////// */


