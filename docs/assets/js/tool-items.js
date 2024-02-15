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
    'list_ver' : 1,
    'list_max' : 1000,
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

var filter =
{
    id       : null,
    list     : 0,
  //query    : null,
    cat      : null,
    type     : null,
    pricemin : null,
    pricemax : null,
};

/* ////////////////////////////////////////////////// */

function Tool_Items ( deferred )
{
    var that = null;
    
    // table
    
    var table_default = $( '#tool_items_table_default' );
    
  //table_default.on( 'draw.dt', function ( ) { _util_dump( filter ) } ); // preDraw.dt draw.dt search.dt
    
    // modal
    
    var modal_default = $( '#popup-item' );
    
    // datatable
    
    var datatable_default = Util_Datatable
    (
        {
            'element'     : table_default,
            'dom'         : "<'row'<'#tool_items_dom_filter.col-sm-12'>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            'def'         : [ { targets : [ col.type, col.name, col.price, col.info ], visible : true, searchable : true }, { targets : '_all', visible : false, searchable : false } ],
            'wordentries' : 'items',
            
            'init' : function ( datatable )
            {
                Tool_Items_filter( datatable );
                Tool_Items_query ( datatable );
                
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
    
    modal_default.on
    (
        'hidden.bs.modal',
        function ( event )
        {
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

function Tool_Items_filter ( datatable )
{
    // dom filter
    
    $( '#tool_items_dom_filter' ).html
    (
        '\
            <form id="tool_items_form_filter" autocomplete="off">\
                <div class="form-group">\
                    <select id="tool_items_form_filter_field_cat" class="custom-select custom-select-sm form-control form-control-sm" autocomplete="off">\
                        <option value="Any" data-filter-col="" data-filter-val="" selected>Any Category</option>\
                    </select>\
                </div>\
                <div class="form-group">\
                    <select id="tool_items_form_filter_field_type" class="custom-select custom-select-sm form-control form-control-sm" autocomplete="off">\
                        <option value="Any" data-filter-col="" data-filter-val="" selected>Any Type</option>\
                    </select>\
                </div>\
                <div class="form-group">\
                    <input id="tool_items_form_filter_field_query" class="form-control form-control-sm" type="search" autocomplete="off">\
                </div>\
                <div class="form-group">\
                    <p id="tool_items_form_filter_collap_additional_button_open" class="collapsed" data-toggle="collapse" data-target="#tool_items_form_filter_collap_additional" aria-expanded="false" aria-controls="tool_items_form_filter_collap_additional">\
                        <i class="fa" data-icon-o="&#xf068;" data-icon-c="&#xf067;"></i> Additional Filters\
                    </p>\
                </div>\
                <div id="tool_items_form_filter_collap_additional" class="collapse hide">\
                    <div class="form-group row">\
                        <label class="col-auto col-form-label" for="tool_items_form_filter_field_pricemin">Price Min:</label>\
                        <div class="col pl-0">\
                            <input id="tool_items_form_filter_field_pricemin" class="form-control form-control-sm" type="search" inputmode="numeric" maxlength="10" autocomplete="off"></input>\
                        </div>\
                    </div>\
                    <div class="form-group row">\
                        <label class="col-auto col-form-label" for="tool_items_form_filter_field_pricemax">Price Max:</label>\
                        <div class="col pl-0">\
                            <input id="tool_items_form_filter_field_pricemax" class="form-control form-control-sm" type="search" inputmode="numeric" maxlength="10" autocomplete="off"></input>\
                        </div>\
                    </div>\
                </div>\
            </form>\
        '
    );
    
    // field query
    
    var field_query = $( '#tool_items_form_filter_field_query' );
    
    field_query.on
    (
        'val',
        function ( event, val = '', draw = false )
        {
            $( this ).val( val );
            $( this ).trigger( 'input', [ draw ] );
        }
    );
    
    field_query.on
    (
        'input',
        function ( event, draw = true )
        {
            var val = $( this ).val( );
            datatable.search( val );
            if ( draw ) datatable.draw( );
        }
    );
    
    // field cat
    
    var field_cat = $( '#tool_items_form_filter_field_cat' );
    
    $(
        [
            [ 'Favorite',   'list',    '',  '&#9734; Favorite' ],
            [ 'New',        col.new,   '1', 'New'              ],
            [ 'Discounted', col.disc,  '1', 'Discounted'       ],
            [ 'Rare',       col.rare,  '1', 'Rare'             ],
            [ 'Tournament', col.tour,  '1', 'Tournament Prize' ],
            [ 'Ranked',     col.rank,  '1', 'Ranked Prize'     ],
            [ 'Event',      col.event, '1', 'Event Prize'      ],
        ]
    )
    .each( function ( idx, val ) { field_cat.append( '<option value="' + val[0] + '" data-filter-col="' + val[1] + '" data-filter-val="' + val[2] + '">' + val[3] + '</option>' ) } );
    
    field_cat.on
    (
        'val',
        function ( event, val = '', draw = false )
        {
            var regexp = new RegExp( $.fn.dataTable.util.escapeRegex( val ).split( ' ' ).join( '.+' ), 'i' );
            var filter = function ( ) { return regexp.test( $( this ).val( ) ) };
            $( this ).find( 'option' ).filter( filter ).first( ).attr( 'selected', true );
            $( this ).trigger( 'change', [ draw ] );
        }
    );
    
    field_cat.on
    (
        'change',
        function ( event, draw = true )
        {
            var opt = $( this ).find( 'option' ).filter( ':selected' );
            var col = opt.data( 'filter-col' );
            var val = opt.data( 'filter-val' );
            
            if      ( ! col )         { filter.cat = null;         filter.list = 0                }
            else if ( col == 'list' ) { filter.cat = null;         filter.list = 1; cache.read( ) }
            else                      { filter.cat = [ col, val ]; filter.list = 0                }
            
            if ( draw ) datatable.draw( );
        }
    );
    
    // field type
    
    var field_type = $( '#tool_items_form_filter_field_type' );
    
    datatable.column( col.type ).data( ).unique( )
    .sort( function ( a, b ) { return a.toLowerCase( ).localeCompare( b.toLowerCase( ) ) } )
    .each( function ( val  ) { field_type.append( '<option value="' + val + '" data-filter-col="' + col.type + '" data-filter-val="' + val + '">' + val + '</option>' ) } );
    
    field_type.on
    (
        'val',
        function ( event, val = '', draw = false )
        {
            var regexp = new RegExp( $.fn.dataTable.util.escapeRegex( val ).split( ' ' ).join( '.+' ), 'i' );
            var filter = function ( ) { return regexp.test( $( this ).val( ) ) };
            $( this ).find( 'option' ).filter( filter ).first( ).attr( 'selected', true );
            $( this ).trigger( 'change', [ draw ] );
        }
    );
    
    field_type.on
    (
        'change',
        function ( event, draw = true )
        {
            var opt = $( this ).find( 'option' ).filter( ':selected' );
            var col = opt.data( 'filter-col' );
            var val = opt.data( 'filter-val' );
            
            if   ( ! col ) filter.type = null;
            else           filter.type = [ col, val ];
            
            if ( draw ) datatable.draw( );
        }
    );
    
    // field pricemin
    
    var field_pricemin = $( '#tool_items_form_filter_field_pricemin' );
    
    field_pricemin.on
    (
        'val',
        function ( event, val = '', draw = false )
        {
            $( this ).val( val );
            $( this ).trigger( 'input', [ draw ] );
        }
    );
    
    field_pricemin.on
    (
        'input',
        function ( event, draw = true )
        {
            var val = $( this ).val( );
            val = val.replace( /\D+/g, '' );
            $( this ).val( val );
            val = parseInt( val, 10 );
            
            if   ( isNaN( val ) ) filter.pricemin = null;
            else                  filter.pricemin = [ val ];
            
            if ( draw ) datatable.draw( );
        }
    );
    
    // field pricemax
    
    var field_pricemax = $( '#tool_items_form_filter_field_pricemax' );
    
    field_pricemax.on
    (
        'val',
        function ( event, val = '', draw = false )
        {
            $( this ).val( val );
            $( this ).trigger( 'input', [ draw ] );
        }
    );
    
    field_pricemax.on
    (
        'input',
        function ( event, draw = true )
        {
            var val = $( this ).val( );
            val = val.replace( /\D+/g, '' );
            $( this ).val( val );
            val = parseInt( val, 10 );
            
            if   ( isNaN( val ) ) filter.pricemax = null;
            else                  filter.pricemax = [ val ];
            
            if ( draw ) datatable.draw( );
        }
    );
    
    //
    
    $.fn.dataTable.ext.search.push
    (
        function ( undefined, undefined, undefined, row_data )
        {
            if ( filter.id   && ! filter.id.includes( row_data[col.id] )                ) return false;
            if ( filter.list && typeof cache.ref.list[row_data[col.id]] === 'undefined' ) return false;
            if ( filter.cat  && row_data[filter.cat [0]] != filter.cat [1]              ) return false;
            if ( filter.type && row_data[filter.type[0]] != filter.type[1]              ) return false;
            if ( filter.pricemin || filter.pricemax )
            {
                var price = parseFloat( row_data[col.price]['@data-order'] ) || 0;
                if ( filter.pricemin && filter.pricemin[0] > price ) return false;
                if ( filter.pricemax && filter.pricemax[0] < price ) return false;
            }
            
            return true;
        }
    );
    
    //
    
    return true;
}

function Tool_Items_query ( datatable )
{
    if ( jQuery.isEmptyObject( query ) ) return;
    
    if ( query.id && /^\d+$/.test( query.id ) )
    {
        var id = query.id;
        if ( typeof items[id] === 'undefined' ) _util_popup_notice( 'Invalid item id' );
        else Tool_Items_popup( datatable, datatable.row( '#id-' + id ) );
        return;
    }
    
    var draw = false;
    
    if ( query.id && ! /^\d+$/.test( query.id ) )
    {
        var id = query.id.split( ' ' );
        if ( id.some( function ( id ) { return typeof items[id] === 'undefined' } ) ) _util_popup_notice( 'Invalid item id' );
        else filter.id = id;
        draw = true;
    }
    
    if ( query.q )
    {
        $( '#tool_items_form_filter_field_query' ).trigger( 'val', query.q );
        draw = true;
    }
    
    if ( query.c )
    {
        $( '#tool_items_form_filter_field_cat' ).trigger( 'val', query.c );
        draw = true;
    }
    
    if ( query.t )
    {
        $( '#tool_items_form_filter_field_type' ).trigger( 'val', query.t );
        draw = true;
    }
    
    if ( query.p || query.pmin )
    {
        $( '#tool_items_form_filter_field_pricemin' ).trigger( 'val', query.p || query.pmin );
        draw = true;
    }
    
    if ( query.p || query.pmax )
    {
        $( '#tool_items_form_filter_field_pricemax' ).trigger( 'val', query.p || query.pmax );
        draw = true;
    }
    
    if ( draw ) datatable.draw( );
    
    /*
    if ( query.id && /^\d+$/.test( query.id ) )
    {
        var id = query.id;
        if ( typeof items[id] === 'undefined' ) _util_popup_notice( 'Invalid item id' );
        else Tool_Items_popup( datatable, datatable.row( '#id-' + id ) );
    }
    */
    
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
            if ( filter.list ) datatable.draw( 'full-hold' );
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


