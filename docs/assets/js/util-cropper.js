/* ////////////////////////////////////////////////// */

function Util_Cropper ( param )
{
    var that = _util_object
    (
        undefined,
        param,
        {
            'element' : null,
            'height'  : 200,
            'init'    : null,
        },
    );
    
    that.element = that.param.element || _util_error( 'element required' );
    
    that.obj      = null;
    that.objready = 0;
    
    var ratiomin    = null;
    var ratiomax    = null;
    var data        = null;
    var cropboxdata = null;
    var canvasdata  = null;
    var disabled    = null;
    
    that._cropper = function ( )
    {
        var cropper = new Cropper
        (
            that.element.get( 0 ),
            {
                aspectRatio        : 1,
                viewMode           : 0,
                dragMode           : 'move',
                responsive         : 1,
                restore            : 1,
                movable            : 1,
                rotatable          : 1,
                scalable           : 1,
                zoomable           : 1,
                autoCropArea       : 1.0,
                minContainerHeight : that.param.height,
                minCropBoxWidth    : 10,
                minCropBoxHeight   : 10,
                
                ready : function ( event )
                {
                    var cropper   = event.target.cropper;
                    var imagedata = cropper.getImageData( );
                    
                    var ratio = imagedata.width / imagedata.naturalWidth;
                    ratiomin  = ratio / 4;
                    ratiomax  = ratio * 4;
                    
                    cropper.setData       ( data        );
                    cropper.setCropBoxData( cropboxdata );
                    cropper.setCanvasData ( canvasdata  );
                    
                    if ( disabled ) cropper.disable( );
                    
                    if ( that.param.init ) that.param.init( cropper );
                    
                    that.objready = 1;
                },
                
                zoom : function ( event )
                {
                    var cropper = event.target.cropper;
                    var ratio   = event.detail.ratio;
                    
                    if ( ratio < ratiomin || ratio > ratiomax ) event.preventDefault( );
                },
            }
        );
        
        return cropper;
    };
    
    that.create = function ( )
    {
        if ( that.objready ) return false; // _util_warn( 'cannot create: obj ready' );
        that.obj = that._cropper( );
        return that;
    }
    
    that.destroy = function ( )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot destroy: obj not ready' );
        that.objready = 0;
        that.obj.destroy( );
        that.obj = null;
        return that;
    };
    
    that.destroycreate = function ( )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot destroycreate: obj not ready' );
        that.destroy( );
        that.create( );
        return that;
    };
    
    that.datanull = function ( )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot datanull: obj not ready' );
        data        = null;
        cropboxdata = null;
        canvasdata  = null;
        disabled    = null;
        return that;
    };
    
    that.datacurr = function ( )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot datacurr: obj not ready' );
        data        = that.obj.getData       ( );
        cropboxdata = that.obj.getCropBoxData( );
        canvasdata  = that.obj.getCanvasData ( );
        disabled    = that.obj.disabled;
        return that;
    };
    
    that.oper = function ( )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot oper: obj not ready' );
        that.obj.enable( );
        return that;
    };
    
    that.unoper = function ( )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot unoper: obj not ready' );
        that.obj.disable( );
        return that;
    };
    
    that.reset = function ( )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot reset: obj not ready' );
        that.obj.reset( );
        return that;
    };
    
    that.rotate = function ( degree = 1 )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot rotate: obj not ready' );
        that.obj.rotate( degree );
        return that;
    };
    
    that.fliphori = function ( )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot fliphori: obj not ready' );
      //that.obj.scale( -1, 1 );
        that.obj.scaleX( -that.obj.getData( ).scaleX || -1 );
        return that;
    };
    
    that.flipvert = function ( )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot flipvert: obj not ready' );
      //that.obj.scale( 1, -1 );
        that.obj.scaleY( -that.obj.getData( ).scaleY || -1 );
        return that;
    };
    
    that.canvasquad = function ( width, height )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot canvasquad: obj not ready' );
        
        var canvas = that.obj.getCroppedCanvas( { width : width, height : height } );
        
        return canvas;
    };
    
    that.canvascirc = function ( )
    {
        if ( ! that.objready ) return false; // _util_warn( 'cannot canvascirc: obj not ready' );
        
        var canvas = that.canvasquad.apply( null, arguments );
        
        var width  = canvas.width;
        var height = canvas.height;
        
        var canvasb    = document.createElement( 'canvas' );
        canvasb.width  = width;
        canvasb.height = height;
        var contextb   = canvasb.getContext( '2d' );
        contextb.imageSmoothingEnabled = true;
        contextb.drawImage( canvas, 0, 0, width, height );
        contextb.globalCompositeOperation = 'destination-in';
        contextb.beginPath( );
        contextb.arc( width / 2, height / 2, Math.min( width, height ) / 2, 0, 2 * Math.PI, true );
        contextb.fill( );
        
        return canvasb;
    };
    
  //that.init( );
    
    return that;
}

/* ////////////////////////////////////////////////// */


