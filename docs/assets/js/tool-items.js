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

var col = { };

$.each
(
    [ 'id', 'type', 'name', 'coins', 'info', 'new', 'disc', 'rare', 'tour', 'rank', 'event' ],
    function ( idx, val ) { col[val] = idx }
);

const Tool_Items_conf =
{
    
};

function Tool_Items ( deferred )
{
    var that = null;
    
    // modal
    
    var modal_default = $( '#tool_items_modal_default' );
    
  //var modal_default_block_head  = modal_default.find( '.modal-header' );
  //var modal_default_block_body  = modal_default.find( '.modal-body'   );
  //var modal_default_block_foot  = modal_default.find( '.modal-footer' );
  //var modal_default_block_title = modal_default.find( '.modal-title'  );
    
    modal_default.on
    (
        'shown.bs.modal',
        function ( event )
        {
            
        }
    );
    
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
    
    // datatable
    
    var datatable_default = Util_Datatable
    (
        {
            'element'     : $( '#tool_items_table_default' ),
            'wordentries' : 'items',
            
            'init' : function ( datatable )
            {
                datatable.columns( ).visible( false );
                datatable.columns( [ col.type, col.name, col.coins, col.info ] ).visible( true );
                
                Tool_Items_menu ( datatable );
                Tool_Items_query( datatable, modal_default );
                
                if ( typeof deferred !== 'undefined' ) deferred.resolve( );
            },
            
            'rowclick' : function ( datatable, row )
            {
                Tool_Items_popup( datatable, modal_default, row );
            },
        }
    );
    
    //
    
    $( document ).on
    (
        'click',
        '#tool_items_modal_default_button_copy',
        function ( event )
        {
            event.preventDefault( );
            var url = $( this ).attr( 'href' );
            _util_copy
            (
                url,
                function (       ) { _util_popup_notice( 'Link copied'  ) },
                function ( error ) { _util_popup_input ( undefined, url ) }
            );
            return false;
        }
    );
    
    //
    
    return that;
}

function Tool_Items_menu ( datatable )
{
    // <select class="form-control is-selectpicker" multiple>
    var menu_cat =
    $( '\
        <select id="tool_items_table_default_field_cat" class="custom-select custom-select-sm form-control form-control-sm">\
            <option value="" selected>Any Category</option>\
            <option value="' + col.new + '=1">New</option>\
            <option value="' + col.disc + '=1">Discounted</option>\
            <option value="' + col.rare + '=1">Rare</option>\
            <option value="' + col.tour + '=1">Tournament Prize</option>\
            <option value="' + col.rank + '=1">Ranked Prize</option>\
            <option value="' + col.event + '=1">Event Prize</option>\
        </select>\
    ' );
    
    // <select class="form-control is-selectpicker" multiple>
    var menu_type =
    $( '\
        <select id="tool_items_table_default_field_type" class="custom-select custom-select-sm form-control form-control-sm">\
            <option value="" selected>Any Type</option>\
        </select>\
    ' );
    
    datatable.column( col.type ).data( ).unique( )
    .sort
    (
        function ( textA, textB )
        {
            return textA.toLowerCase( ).localeCompare( textB.toLowerCase( ) );
        }
    )
    .each
    (
        function ( val )
        {
            menu_type.append( '<option value="' + col.type + '=' + val + '">' + val + '</option>' );
        }
    );
    
    var menus = [ menu_cat, menu_type ];
    
    $.each
    (
        menus,
        function ( )
        {
            $( this ).on
            (
                'change',
                function ( )
                {
                    datatable.columns( ).search( '' );
            
                    $.each
                    (
                        menus,
                        function ( )
                        {
                            var val = $( this ).val( );
                            if ( val == '' ) return;
                            val = val.split( '=', 2 );
                            val[1] = $.fn.dataTable.util.escapeRegex( val[1] );
                            var regexp = '^' + val[1] + '$';
                            datatable.column( val[0] ).search( regexp, true, false );
                        }
                    );
                    
                    datatable.draw( );
                }
            );
        }
    );
    
    $( datatable.table( ).container( ) ).find( '.dataTables_filter' )
    .prepend
    (
        $.map
        (
            menus,
            function ( menu ) { return [ menu, '<br/>' ] }
        )
    );
    
    return true;
}

function Tool_Items_query ( datatable, modal )
{
    var query = _util_query( );
    if ( jQuery.isEmptyObject( query ) ) return;
    
    if ( query.id )
    {
        var id = query.id.split( ' ' );
        
        if ( id.some( function ( id ) { return typeof items[id] === 'undefined' } ) )
        {
            _util_popup_notice( 'Invalid item id' );
        }
        else if ( id.length > 1 )
        {
            var regexp = '^(' + id.join( '|' ) + ')$';
            datatable.column( col.id ).search( regexp, true, false );
            datatable.draw( );
        }
        else
        {       
            var row = datatable.row( '#id-' + id[0] );
            Tool_Items_popup( datatable, modal, row );
        }
    }
    else
    {
        if ( query.c )
        {
            var regexp = new RegExp( $.fn.dataTable.util.escapeRegex( query.c ).split( ' ' ).join( '.+' ), 'i' );
            var filter = function ( ) { return regexp.test( $( this ).text( ) ) };
            var menu   = $( '#tool_items_table_default_field_cat' );
            menu.find( 'option' ).not( ':first' ).filter( filter ).first( ).attr( 'selected', true );
            menu.trigger( 'change' );
        }
        
        if ( query.t )
        {
            var regexp = new RegExp( $.fn.dataTable.util.escapeRegex( query.t ).split( ' ' ).join( '.+' ), 'i' );
            var filter = function ( ) { return regexp.test( $( this ).text( ) ) };
            var menu   = $( '#tool_items_table_default_field_type' );
            menu.find( 'option' ).not( ':first' ).filter( filter ).first( ).attr( 'selected', true );
            menu.trigger( 'change' );
        }
        
        if ( query.q   ) datatable.search( query.q );
        
        if ( query.qt  ) datatable.column( col.type  ).search( query.qt,  false, false );
        if ( query.qn  ) datatable.column( col.name  ).search( query.qn,  false, false );
        if ( query.qc  ) datatable.column( col.coins ).search( query.qc,  false, false );
        if ( query.qi  ) datatable.column( col.info  ).search( query.qi,  false, false );
        
        if ( query.qtr ) datatable.column( col.type  ).search( query.qtr, true,  false );
        if ( query.qnr ) datatable.column( col.name  ).search( query.qnr, true,  false );
        if ( query.qcr ) datatable.column( col.coins ).search( query.qcr, true,  false );
        if ( query.qir ) datatable.column( col.info  ).search( query.qir, true,  false );
        
        datatable.draw( );
    }
    
    return true;
}

function Tool_Items_popup ( datatable, modal, row )
{
  //var element = $( row.node( ) );
    
    var row_data = row.data( );
    
    var id     = row_data[col.id   ];
    var type   = row_data[col.type ];
    var name   = row_data[col.name ];
    var coins  = row_data[col.coins];
    var info   = row_data[col.info ];
    var images = items[id]['med']['images'];
    var audios = items[id]['med']['audios'];
    var url    = window.location.href.split( '?' )[0] + '?id=' + id;
    
    var cats = [ 'New', 'Discounted', 'Rare', 'Tournament Prize', 'Ranked Prize', 'Event Prize' ];
    cats = $.grep( cats, function ( cat, idx ) { return row_data[idx + col.new] === '1' } );
    if ( cats.length === 0 ) cats.push( 'None' );
  //cats = $.map( cats, function ( cat, idx ) { return '<span class="badge badge-pill badge-type">' + cat + '</span>' } );
    cats = cats.join( ', ' );
    
    var modal_title = modal.find( '.modal-title' );
    var modal_body  = modal.find( '.modal-body'  );
    
    modal_title.html( name );
    
    modal_body.empty( );
    
    modal_body.append
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
                        <td class="text-left align-top font-weight-bold">Coins:</td>\
                        <td class="text-left">' + coins + '</td>\
                    </tr>\
                    <tr>\
                        <td class="text-left align-top font-weight-bold">Info:</td>\
                        <td class="text-left">' + info + '</td>\
                    </tr>\
                    <tr>\
                        <td class="text-left align-top font-weight-bold">Link:</td>\
                        <td class="text-left"><a id="tool_items_modal_default_button_copy" href="'+ url + '">Click to copy</a></td>\
                    </tr>\
                </tbody>\
            </table>\
        '
    );
    
    var deferred = $.Deferred( );
    $.when( deferred ).then( function ( ) { modal_body.find( '.row' ).removeClass( 'd-none' ) } );
    
    if ( typeof images !== 'undefined' && images.length > 0 )
    {
        $.each
        (
            images,
            function ( idx, val )
            {
                var type = val['type'];
                var uri  = val['uri' ];
                var url  = 'https://profile.platocdn.com/' + uri;
                
                var image     = new Image( );
                image.onload  = function ( ) { deferred.resolve( ) }
                image.onerror = function ( ) { deferred.resolve( ) }
                image.src     = url;
                
                modal_body.append
                (
                    '\
                        <div class="row d-none">\
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
                var type = val['type'];
                var uri  = val['uri' ];
                var url  = 'https://game-assets-prod.platocdn.com/' + uri;
                
                modal_body.append
                (
                    '\
                        <div class="row d-none">\
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
    
    modal.off( 'swiped' )
    .on
    (
        'swiped',
        function ( event )
        {
            var dir = event.detail.dir;
            if      ( dir === 'right' ) Tool_Items_popup( datatable, modal, row.prev( ) );
            else if ( dir === 'left'  ) Tool_Items_popup( datatable, modal, row.next( ) );
        }
    );
    
    return true;
}

/* ////////////////////////////////////////////////// */


