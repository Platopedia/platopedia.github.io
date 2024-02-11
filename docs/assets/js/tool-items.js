(function(){

/* ////////////////////////////////////////////////// */

$( document ).ready
(
    function ( )
    {
        var deferred = $.Deferred( );
        $.when( deferred ).then( function ( ) { $( '.loaded-b' ).attr( 'style', 'display:block !important' ) } );
        Tool_Items( deferred );
    }
);

/* ////////////////////////////////////////////////// */

const Tool_Items_conf =
{
    'namespace'  : 'tool_items',
    'host_image' : 'https://profile.platocdn.com',
    'host_audio' : 'https://game-assets-prod.platocdn.com',
};

const Tool_Items_var =
{
    'list_ver'  : 1,
    'list_bool' : 0,
    'list_max'  : 1000,
};

/////

var col = new Object( null );
$.each( [ 'id', 'type', 'name', 'price', 'info', 'new', 'disc', 'rare', 'tour', 'rank', 'event' ], function ( idx, val ) { col[val] = idx } );

var uri_image = function ( row, idx = 0 ) { return items[row.data( )[col.id]].med.images[idx].uri };
var uri_audio = function ( row, idx = 0 ) { return items[row.data( )[col.id]].med.audios[idx].uri };

var preload = null;

var query = _util_query( );

var cache_driver = Util_Cache_Driver_Local;
if      ( query.cd === 'temp'   ) cache_driver = Util_Cache_Driver_Temp;
else if ( query.cd === 'local'  ) cache_driver = Util_Cache_Driver_Local;
else if ( query.cd === 'remote' ) cache_driver = Util_Cache_Driver_Remote;
delete query.cd;

var cache_key = 'tool_items';
if ( query.ck ) cache_key = 'tool_items_' + query.ck;
delete query.ck;

var cache_clear = false;
//if ( query.cc ) cache_clear = true;
//delete query.cc;

var cache = Util_Cache
(
    {
        'driver' : cache_driver,
        'key'    : cache_key,
        'clear'  : cache_clear,
        
        'callbackrw' : function ( ref )
        {
            if ( ref.list_ver !== Tool_Items_var.list_ver || ! _util_is_hash( ref.list ) )
            {
                ref.list_ver = Tool_Items_var.list_ver;
                ref.list     = new Object( null );
            }
        },
    }
);

$.fn.dataTable.ext.search.push
(
    function ( undefined, row_data )
    {
        if ( Tool_Items_var.list_bool )
        {
            if ( typeof cache.ref.list[row_data[col.id]] === 'undefined' ) return false;
        }
        
        return true;
    }
);

/* ////////////////////////////////////////////////// */

function Tool_Items ( deferred )
{
    var that = null;
    
    // table
    
    var table_default = $( '#tool_items_table_default' );
    
  //table_default.on( 'draw.dt', function ( ) { _util_dump( 'draw' ) } ); // preDraw.dt draw.dt search.dt
    
    // modal
    
    var modal_default = $( '#popup-item' );
    
    // datatable
    
    var datatable_default = Util_Datatable
    (
        {
            'element'     : table_default,
            'wordentries' : 'items',
            
            'init' : function ( datatable )
            {
                datatable.columns( ).visible( false );
                datatable.columns( [ col.type, col.name, col.price, col.info ] ).visible( true );
                
                Tool_Items_field( datatable );
                Tool_Items_query( datatable );
                
                var container = $( datatable.table( ).container( ) );
                container.wrap( '<form autocomplete="off"></form>' );
                container.find( 'input, select' ).attr( 'autocomplete', 'off' );
                
                if ( typeof deferred !== 'undefined' ) deferred.resolve( );
            },
            
            'callbackrowclick' : function ( datatable, row )
            {
                Tool_Items_popup( datatable, row );
            },
            
            'callbackinfo' : function ( undefined, undefined, undefined, undefined, items )
            {
                return items.toLocaleString( 'en-US' ) + ' items';
            },
        }
    );
    
    //
    
    /*
    modal_default.on
    (
        'shown.bs.modal',
        function ( event )
        {
            
        }
    );
    */
    
    modal_default.on
    (
        'hidden.bs.modal',
        function ( event )
        {
          //if ( Tool_Items_var.list_bool ) datatable_default.obj.draw( );
            
            modal_default.find( 'audio' ).each
            (
                function ( )
                {
                    this.pause( );
                    this.currentTime = 0;
                    this.setAttribute( 'src', '' );
                    this.load( );
                }
            );
        }
    );
    
    //
    
    return that;
}

function Tool_Items_field ( datatable )
{
    var fields  = [ ];
    var fieldsb = [ ];
    
    var field_cat =
    $( '\
        <select id="tool_items_table_default_field_cat" class="custom-select custom-select-sm form-control form-control-sm">\
            <option value="Any"        data-filter="" selected          >Any Category</option>\
            <option value="Favorite"   data-filter=""                   >&#9734; Favorite</option>\
            <option value="New"        data-filter="' + col.new   + '=1">New</option>\
            <option value="Discounted" data-filter="' + col.disc  + '=1">Discounted</option>\
            <option value="Rare"       data-filter="' + col.rare  + '=1">Rare</option>\
            <option value="Tournament" data-filter="' + col.tour  + '=1">Tournament Prize</option>\
            <option value="Ranked"     data-filter="' + col.rank  + '=1">Ranked Prize</option>\
            <option value="Event"      data-filter="' + col.event + '=1">Event Prize</option>\
        </select>\
    ' );
    
    fields.push( field_cat );
    
    var field_type =
    $( '\
        <select id="tool_items_table_default_field_type" class="custom-select custom-select-sm form-control form-control-sm">\
            <option value="Any" data-filter="" selected>Any Type</option>\
        </select>\
    ' );
    
    fields.push( field_type );
    
    datatable.column( col.type ).data( ).unique( )
    .sort( function ( a, b ) { return a.toLowerCase( ).localeCompare( b.toLowerCase( ) ) } )
    .each( function ( val  ) { field_type.append( '<option value="' + val + '" data-filter="' + col.type + '=' + val + '">' + val + '</option>' ) } );
    
    $.each
    (
        [ field_cat, field_type ],
        function ( idx, menu )
        {
            menu.on
            (
                'val',
                function ( event, val = '', draw = false )
                {
                    var regexp = new RegExp( $.fn.dataTable.util.escapeRegex( val ).split( ' ' ).join( '.+' ), 'i' );
                    var filter = function ( ) { return regexp.test( $( this ).val( ) ) };
                    menu.find( 'option' ).filter( filter ).first( ).attr( 'selected', true ); // .not( ':first' )
                    menu.trigger( 'change', [ draw ] );
                }
            );
            
            menu.on
            (
                'change',
                function ( event, draw = true )
                {
                    datatable.columns( ).search( '' );
                    
                    $.each
                    (
                        [ field_cat, field_type ],
                        function ( idx, menu )
                        {
                            var filter = menu.find( 'option' ).filter( ':selected' ).data( 'filter' );
                            if ( filter == '' ) return;
                            filter = filter.split( '=', 2 );
                            filter[1] = $.fn.dataTable.util.escapeRegex( filter[1] );
                            var regexp = '^' + filter[1] + '$';
                            datatable.column( filter[0] ).search( regexp, true, false );
                        }
                    );
                    
                    Tool_Items_var.list_bool = 0;
                    if ( field_cat.val( ) === 'Favorite' )
                    {
                        Tool_Items_var.list_bool = 1;
                        cache.read( );
                    }
                    
                    if ( draw ) datatable.draw( );
                }
            );
        }
    );
    
    /*
    if ( 'p' in query )
    {
        var field_price_label = $( '<label class="font-weight-bold">Price: </label>' );
        var field_price       = $( '<input id="tool_items_table_default_field_price" class="form-control form-control-sm" type="text"></input>' );
        
        field_price_label.append( field_price       );
        fieldsb.push            ( field_price_label );
        
        field_price.on
        (
            'val',
            function ( event, val = '', draw = false )
            {
                field_price.val( val );
                field_price.trigger( 'input', [ draw ] );
            }
        );
        
        var min = 0;
        var max = Infinity;
        
        field_price.on
        (
            'input',
            function ( event, draw = true )
            {
                var range = $( this ).val( );
                range = range.replace( /[^\d-]/g, '' );
                var rangeb = range.split( '-', 2 );
                
                if ( /^\d+$/.test( range ) )
                {
                    min = parseInt( rangeb[0], 10 );
                    max = min;
                }
                else if ( /^\d+-$/.test( range ) )
                {
                    min = parseInt( rangeb[0], 10 );
                    max = Infinity;
                }
                else if ( /^-\d+$/.test( range ) )
                {
                    min = 0;
                    max = parseInt( rangeb[1], 10 );
                }
                else if ( /^\d+-\d+$/.test( range ) )
                {
                    min = parseInt( rangeb[0], 10 );
                    max = parseInt( rangeb[1], 10 );
                }
                else
                {
                    min = 0;
                    max = Infinity;
                }
                
                if ( min > max ) [ min, max ] = [ max, min ];
                
                if ( draw ) datatable.draw( );
            }
        );
        
        $.fn.dataTable.ext.search.push
        (
            function ( undefined, undefined, undefined, row_data )
            {
                var mid = parseFloat( row_data[col.price]['@data-order'] ) || 0;
                if ( min <= mid && mid <= max ) return true;
                return false;
            }
        );
    }
    */
    
    if ( 'p' in query || 'pmin' in query || 'pmax' in query )
    {
        var field_pricemin_label = $( '<label class="font-weight-bold">Price Min: </label>' );
        var field_pricemin       = $( '<input id="tool_items_table_default_field_pricemin" class="form-control form-control-sm" type="text" style="width:100px!important;"></input>' );
        var field_pricemax_label = $( '<label class="font-weight-bold">Price Max: </label>' );
        var field_pricemax       = $( '<input id="tool_items_table_default_field_pricemax" class="form-control form-control-sm" type="text" style="width:100px!important;"></input>' );
        
        field_pricemin_label.append( field_pricemin       );
        fieldsb.push               ( field_pricemin_label );
        field_pricemax_label.append( field_pricemax       );
        fieldsb.push               ( field_pricemax_label );
        
        var range_def = [ 0, Infinity ];
        var range     = [ 0, Infinity ];
        
        $.each
        (
            [ field_pricemin, field_pricemax ],
            function ( idx, field )
            {
                field.on
                (
                    'val',
                    function ( event, val = '', draw = false )
                    {
                        field.val( val );
                        field.trigger( 'input', [ draw ] );
                    }
                );
                
                field.on
                (
                    'input',
                    function ( event, draw = true )
                    {
                        var val = field.val( );
                        val = val.replace( /\D+/g, '' );
                        field.val( val );
                        val = parseInt( val, 10 );
                        range[idx] = ( isNaN( val ) ) ? range_def[idx] : val;
                        if ( draw ) datatable.draw( );
                    }
                );
            }
        );
        
        $.fn.dataTable.ext.search.push
        (
            function ( undefined, undefined, undefined, row_data )
            {
                var mid = parseFloat( row_data[col.price]['@data-order'] ) || 0;
                if ( range[0] <= mid && mid <= range[1] ) return true;
                return false;
            }
        );
    }
    
    fields  = $.map( fields,  function ( field ) { return [ field, '<br/>' ] } );
    fieldsb = $.map( fieldsb, function ( field ) { return [ '<br/>', field ] } );
    
    $( datatable.table( ).container( ) ).find( '.dataTables_filter' ).prepend( fields  ).append ( fieldsb );
    
    return true;
}

function Tool_Items_query ( datatable )
{
    if ( jQuery.isEmptyObject( query ) ) return;
    
    if ( query.id )
    {
        var id = query.id.split( ' ' );
        
        if ( id.some( function ( id ) { return typeof items[id] === 'undefined' } ) ) _util_popup_notice( 'Invalid item id' );
        else if ( id.length > 1 ) datatable.column( col.id ).search( '^(' + id.join( '|' ) + ')$', true, false ).draw( );
        else Tool_Items_popup( datatable, datatable.row( '#id-' + id[0] ) );
    }
    else
    {
        if ( query.c ) $( '#tool_items_table_default_field_cat'   ).trigger( 'val', query.c );
        if ( query.t ) $( '#tool_items_table_default_field_type'  ).trigger( 'val', query.t );
        if ( query.q ) datatable.search( query.q );
        
        if ( query.p || query.pmin || query.pmax )
        {
          //$( '#tool_items_table_default_field_price'    ).trigger( 'val', query.p );
            $( '#tool_items_table_default_field_pricemin' ).trigger( 'val', query.p || query.pmin );
            $( '#tool_items_table_default_field_pricemax' ).trigger( 'val', query.p || query.pmax );
        }
        
        datatable.draw( );
    }
    
    return true;
}

function Tool_Items_popup ( datatable, row )
{
  //var element = $( row.node( ) );
    
    var row_data = row.data( );
    
    var id     = row_data[col.id   ];
    var type   = row_data[col.type ];
    var name   = row_data[col.name ];
    var price  = row_data[col.price].display;
    var info   = row_data[col.info ];
    var images = items[id].med.images;
    var audios = items[id].med.audios;
    var url    = 'https://platopedia.com/items?id=' + id; // window.location.protocol + window.location.host + window.location.pathname + '?id=' + id; // window.location.href.split( '?' )[0] + '?id=' + id;
    
    var cats = [ 'New', 'Discounted', 'Rare', 'Tournament Prize', 'Ranked Prize', 'Event Prize' ];
    cats = $.grep( cats, function ( cat, idx ) { return row_data[idx + col.new] === '1' } );
    if ( cats.length === 0 ) cats.push( 'None' );
  //cats = $.map( cats, function ( cat, idx ) { return '<span class="badge badge-pill badge-cat">' + cat + '</span>' } );
    cats = cats.join( ', ' );
    
    var modal              = $( '#popup-item' );
    var modal_button_left  = modal.find( '.modal-button-left'  );
  //var modal_button_right = modal.find( '.modal-button-right' );
    var modal_title        = modal.find( '.modal-title'        );
    var modal_head         = modal.find( '.modal-header'       );
    var modal_body         = modal.find( '.modal-body'         );
    
  //var deferred = $.Deferred( );
  //$.when( deferred ).then( function ( ) { modal_body.find( '.row' ).removeClass( 'd-none' ) } );
    
    modal_title.html( name );
    
    modal_body.html
    (
        '\
            <table class="table table-borderless w-auto">\
                <tbody>\
                    <tr>\
                        <td class="text-left align-top font-weight-bold">Cat:</td>\
                        <td class="text-left">' + cats + '</td>\
                    </tr>\
                    <tr>\
                        <td class="text-left align-top font-weight-bold">Type:</td>\
                        <td class="text-left">' + type + '</td>\
                    </tr>\
                    <tr>\
                        <td class="text-left align-top font-weight-bold">Price:</td>\
                        <td class="text-left">' + price + '</td>\
                    </tr>\
                    <tr>\
                        <td class="text-left align-top font-weight-bold">Info:</td>\
                        <td class="text-left">' + info + '</td>\
                    </tr>\
                    <tr>\
                        <td class="text-left align-top font-weight-bold">Link:</td>\
                        <td class="text-left"><a class="btn-copy" href="'+ url + '">Click to copy</a></td>\
                    </tr>\
                </tbody>\
            </table>\
        '
    );
    
    if ( typeof images !== 'undefined' && images.length > 0 )
    {
        $.each
        (
            images,
            function ( idx, val )
            {
                var type = val.type;
                var uri  = val.uri;
                var url  = Tool_Items_conf.host_image + '/' + uri;
                
                var image     = new Image( );
              //image.onload  = function ( ) { deferred.resolve( ) }
              //image.onerror = function ( ) { deferred.resolve( ) }
                image.src     = url;
                
                modal_body.append
                (
                    '\
                        <div class="row">\
                            <div class="col text-center">\
                                <!--<figure class="figure">-->\
                                    <!--<figcaption class="figure-caption">' + type + ':</figcaption>-->\
                                    <img class="d-block w-100" src="' + url + '" />\
                                <!--</figure>-->\
                            </div>\
                        </div>\
                    '
                );
            }
        );
    }
    
    if ( typeof audios !== 'undefined' && audios.length > 0 )
    {
        $.each
        (
            audios,
            function ( idx, val )
            {
                var type = val.type;
                var uri  = val.uri;
                var url  = Tool_Items_conf.host_audio + '/' + uri;
                
                modal_body.append
                (
                    '\
                        <div class="row">\
                            <div class="col text-center">\
                                <figure class="figure">\
                                    <figcaption class="figure-caption">' + type + ':</figcaption>\
                                    <audio controls controlsList="nodownload"><source type="audio/mp4" src="' + url + '"><a href="' + url + '" target="_blank">' + type + '</a></audio>\
                                </figure>\
                            </div>\
                        </div>\
                    '
                );
            }
        );
    }
    
    modal.modal( 'show' );
    
    modal            .off( 'swiped.popup' );
    modal            .off( 'keyup.popup'  );
    modal_button_left.off( 'toggle.popup' );
    modal_button_left.off( 'click.popup'  );
    
    modal_button_left.on
    (
        'toggle.popup',
        function ( event )
        {
            var element = $( this );
            element.removeClass( 'is-off is-on' );
            if ( typeof cache.ref.list[id] === 'undefined' ) element.addClass( 'is-off' );
            else                                             element.addClass( 'is-on'  );
            
            if ( Tool_Items_var.list_bool )
            {
                datatable.draw( 'full-hold' );
                
              //row.page( true );
              //var info = datatable.page.info( ); if ( info.page > 0 && info.start === info.end ) datatable.page( 'previous' ).draw( 'page' );
            }
        }
    );
    
    if ( cache.read( ) ) modal_button_left.trigger( 'toggle.popup' );
    
    modal_button_left.on
    (
        'click.popup',
        function ( event )
        {
            if ( typeof cache.ref.list[id] === 'undefined' )
            {
                if ( Object.keys( cache.ref.list ).length >= Tool_Items_var.list_max ) return _util_popup_notice( 'Maximum of ' + Tool_Items_var.list_max + ' Favorites exceeded' );
                
                cache.ref.list[id] = 1;
                if ( cache.write( ) ) modal_button_left.trigger( 'toggle.popup' );
                else delete cache.ref.list[id];
            }
            else
            {
                delete cache.ref.list[id];
                if ( cache.write( ) ) modal_button_left.trigger( 'toggle.popup' );
                else cache.ref.list[id] = 1;
            }
        }
    );
    
    modal.on
    (
        'keyup.popup',
        function ( event )
        {
          //modal.focus( ); // quickfix
            
            {
                var op = event.key;
                if ( op === '\\' ) modal_button_left.trigger( 'click.popup' );
            }
            
            modal.focus( ); // quickfix
        }
    );
    
    var row_prev = row.prev( );
    var row_next = row.next( );
    
    modal.on
    (
        'keyup.popup',
        function ( event )
        {
          //modal.focus( ); // quickfix
            
            if ( ! row.equal( row_prev, row_next ) )
            {
                var op = event.key;
                if      ( op === 'ArrowLeft'  ) Tool_Items_popup( datatable, row_prev );
                else if ( op === 'ArrowRight' ) Tool_Items_popup( datatable, row_next );
            }
            
            modal.focus( ); // quickfix
        }
    );
    
    modal.on
    (
        'swiped.popup',
        function ( event )
        {
          //modal.focus( ); // quickfix
            
            if ( ! row.equal( row_prev, row_next ) )
            {
                var op = event.detail.dir;
                if      ( op === 'right' ) Tool_Items_popup( datatable, row_prev );
                else if ( op === 'left'  ) Tool_Items_popup( datatable, row_next );
            }
            
            modal.focus( ); // quickfix
        }
    );
    
    preload = [ new Image( ), new Image( ) ];
    preload[0].src = Tool_Items_conf.host_image + '/' + uri_image( row_prev );
    preload[1].src = Tool_Items_conf.host_image + '/' + uri_image( row_next );
    
    row.page( true );
    
    return true;
}

/* ////////////////////////////////////////////////// */

})()


