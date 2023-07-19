/* ////////////////////////////////////////////////// */

$( document ).ready
(
    function ( )
    {
        var deferred = $.Deferred( );
        $.when( deferred ).then( function ( ) { $( '.loaded-b' ).attr( 'style', 'display:block !important' ) } );
        Tool_Content( deferred );
    }
);

/* ////////////////////////////////////////////////// */

function Tool_Content ( deferred )
{
    var that = null;
    
    //
    
  //var query = decodeURI( location.hash.substr( 1 ) );
  //history.replaceState( null, null, ' ' );
    
    //
    
    var content          = $( '.content' );
    
    var content_contents = content.find( '.content-contents' );
    var content_carousel = content.find( '.content-carousel' );
    var content_collapse = content.find( '.content-collapse' );
    var content_webpage  = content.find( '.content-webpage'  );
    var content_image    = content.find( '.content-image'    );
    var content_table    = content.find( '.content-table'    );
    var content_collect  = content.find( '.content-collect'  );
    
    var content_count    = content_contents.length + content_carousel.length + content_collapse.length + content_webpage.length + content_image.length + content_table.length + content_collect.length;
    
    var content_callback = function ( ) { if ( --content_count !== -1 ) return; if ( typeof deferred !== 'undefined' ) deferred.resolve( ) };
    
    //
    
    content_contents.each( function ( ) {
    
        var element = $( this );
        var open    = element.data( 'open' );
        var icon    = element.data( 'icon' );
        
        open = ( open ) ? [ '', 'true', 'show' ] : [ 'collapsed', 'false', 'hide' ] ;
        icon = ( icon ) ? icon.split( ',', 2 )   : [ '', '' ]                       ;

        element.wrapInner( '<a class="' + open[0] + '" href="#content-contents-list-' + content_count + '" data-toggle="collapse" aria-expanded="' + open[1] + '" aria-controls="content-contents-list-' + content_count + '"></a>' );
        element.find( 'embed' ).replaceWith( '<i class="fa" data-icon-o="' + icon[0] + '" data-icon-c="' + icon[1] + '"></i>' );
        var list = $( '<ul id="content-contents-list-' + content_count + '" class="collapse ' + open[2] + '"></ul>' ).appendTo( element );

        element.parent( ).find( 'h2' ).each( function ( ) { // element.siblings( 'h2' ).each( function ( ) {

            var elementb = $( this );
            var id       = elementb.attr( 'id' );
            var text     = elementb.text( );

            list.append( '<li><a href="#' + id + '">' + text + '</a></li>' );

        } );
        
        content_callback( );
    
    } );
    
    content_carousel.each( function ( ) {
        
        var element = $( this );
        var id      = 'content-carousel-' + content_count;
        
        var elementb =
        $( '\
            <div id="' + id + '" class="carousel slide"></div>\
        ' );
 
        element.children( 'div' ).each( function ( i ) {
            
            var content = $( this ).html( );

            elementb.append
            ( '\
                <div class="carousel-item">\
                    ' + content + '\
                </div>\
            ' );
            
        } );
        
        elementb.children( ).first( ).addClass( 'active' );
        elementb.wrapInner( '<div class="carousel-inner"></div>' );
        elementb.append
        ( '\
            <button class="carousel-control-prev" type="button" data-target="#' + id + '" data-slide="prev">\
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>\
                <span class="sr-only">Previous</span>\
            </button>\
            <button class="carousel-control-next" type="button" data-target="#' + id + '" data-slide="next">\
                <span class="carousel-control-next-icon" aria-hidden="true"></span>\
                <span class="sr-only">Next</span>\
            </button>\
        ' );
        
        element.empty( ).append( elementb );
        
        elementb.carousel
        ( {
            ride     : 'carousel',
            interval : 4000,
        } );
        
        content_callback( );
        
    } );
    
    content_collapse.each( function ( ) {
        
        var element = $( this );
        var id      = 'content-collapse-' + content_count;
        
        var elementb =
        $( '\
            <div id="' + id + '" class="accordion"></div>\
        ' );
        
        element.children( 'div' ).each( function ( i ) {

            var heading = $( this ).children( ).first( ':header' ).detach( ).text( );
            var content = $( this ).html( );
            var idb     = id + '-heading-'  + i;
            var idc     = id + '-collapse-' + i;
            
            elementb.append
            ( '\
                <div class="card">\
                    <div id="' + idb + '" class="card-header">\
                        <h4 class="mb-0">\
                            <button class="btn btn-block text-left" type="button" data-toggle="collapse" data-target="#' + idc + '" aria-expanded="false" aria-controls="' + idc + '">\
                                ' + heading + '\
                            </button>\
                        </h2>\
                    </div>\
                    <div id="' + idc + '" class="collapse" aria-labelledby="' + idb + '" data-parent="#' + id + '">\
                        <div class="card-body">\
                            ' + content + '\
                        </div>\
                    </div>\
                </div>\
            ' );
            
        } );
        
        element.empty( ).append( elementb );
        
        content_callback( );
        
    } );
    
    content_webpage.each( function ( ) {
        
        var element = $( this );
        var url     = element.data( 'url'    );
        var height  = element.data( 'height' );

        var elementb =
        $( '\
            <iframe src="' + url + '" style="min-height:' + height + '"></iframe>\
        ' );
        
        elementb.appendTo( element );
        
        elementb.on( 'load',  function ( ) { content_callback( ) } );
      //elementb.on( 'error', function ( ) { content_callback( ) } );
      
      //content_callback( );

    } );

    content_image.each( function ( ) {

        var element = $( this );
        var url     = element.data( 'url'   );
        var width   = element.data( 'width' );
        var label   = element.data( 'label' );
        
        var elementb =
        $( '\
            <figure class="figure">\
                <img src="' + url + '" alt="' + label + '" title="' + label + '" style="max-width:' + width + '" />\
                <figcaption class="figure-caption">' + label + '</figcaption>\
            </figure>\
        ' );
        
        if ( ! label ) elementb.find( '.figure-caption' ).css( 'display', 'none' );
        
        elementb.appendTo( element );

      //elementb.on( 'load',  function ( ) { content_callback( ) } );
      //elementb.on( 'error', function ( ) { content_callback( ) } );
      
        content_callback( );

    } );
    
    content_table.each( function ( ) {
        
        var element  = $( this );
        var elementb = element.find( 'table' );
        
        var table = elementb.DataTable
        (
            {
                'dom'        : "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                'lengthMenu' : [ 10, 100 ],
                'pageLength' : 100,
                'order'      : [ ],
                
                'language' :
                {
                    'emptyTable'        : '',
                    'lengthMenu'        : '_MENU_ entries',
                    'info'              : '_START_ to _END_ of _TOTAL_ entries',
                    'infoFiltered'      : '(_MAX_ total entries)',
                    'infoEmpty'         : '0 to 0 of 0 entries',
                    'zeroRecords'       : '&nbsp;',
                    'search'            : '',
                    'searchPlaceholder' : '',
                    'paginate'          : { 'previous' : '&lt;', 'next' : '&gt;' },
                },
                
                'initComplete' : function ( )
                {
                    var table     = this;
                    var datatable = table.api( );
                    var container = $( datatable.table( ).container( ) );
                    
                    var menu = $.map
                    (
                        Tool_Content_Tablemenu( datatable, table.find( 'thead tr' ), table.find( 'thead tr th' ) ),
                        function ( obj ) { return [ obj, '<br/>' ] }
                    );
                    
                    container.find( '.dataTables_filter' ).prepend( menu );
                    
                  //datatable.columns(       ).visible( false );
                  //datatable.columns( [ 0 ] ).visible( true  );
                    
                    content_callback( );
                },
            }
        );
        
        table.on( 'search.dt', function ( ) {
        
          //history.replaceState( null, null, '#' + table.search( ) );
                
        } );
            
        table.on( 'page.dt', function ( ) {
        
            $( 'html, body' ).animate( { scrollTop : elementb.offset( ).top }, 'fast' );
            elementb.find( 'thead tr th:first-child' ).focus( ).blur( );
        
        } );
        
    } );
    
    content_collect.each( function ( ) {
        
        var element  = $( this );
        var elementb = element.find( 'table' );
        
        var table = elementb.DataTable
        (
            {
                'dom'        : "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                'lengthMenu' : [ 10, 100 ],
                'pageLength' : 1000,
                'order'      : [ ],
                
                'language' :
                {
                    'emptyTable'        : '',
                    'lengthMenu'        : '_MENU_ entries',
                    'info'              : '_START_ to _END_ of _TOTAL_ entries',
                    'infoFiltered'      : '(_MAX_ total entries)',
                    'infoEmpty'         : '0 to 0 of 0 entries',
                    'zeroRecords'       : '',
                    'search'            : '',
                    'searchPlaceholder' : '',
                    'paginate'          : { 'previous' : '&lt;', 'next' : '&gt;' },
                },
                
                'initComplete' : function ( )
                {
                    var table     = this;
                    var datatable = table.api( );
                    var container = $( datatable.table( ).container( ) );
                    
                    var menu = $.map
                    (
                        Tool_Content_Tablemenu( datatable, table.find( 'thead tr' ), table.find( 'thead tr th' ) ),
                        function ( obj ) { return [ obj, '<br/>' ] }
                    );
                    
                    container.find( '.dataTables_filter' ).prepend( menu );
                    
                    datatable.columns(       ).visible( false );
                    datatable.columns( [ 0 ] ).visible( true  );
                    
                    content_callback( );
                },
            }
        );
            
        table.on( 'search.dt', function ( ) {
        
          //history.replaceState( null, null, '#' + table.search( ) );
                
        } );
            
        table.on( 'page.dt', function ( ) {
        
            $( 'html, body' ).animate( { scrollTop : elementb.offset( ).top }, 'fast' );
            elementb.find( 'thead tr th:first-child' ).focus( ).blur( );
        
        } );
        
    } );
    
    //
    
    content_callback( );
    
    //
    
    return that;
}

function Tool_Content_Tablemenu ( datatable, row, cols )
{
    var row_conf = row.data( 'conf' );
    if ( ! row_conf       ) return;
    if ( ! row_conf.menus ) return;
    
    var objs = [ ];
    
    $( row_conf.menus ).each( function ( ) {

        var row_name  = this.name;
        var row_type  = this.type;
        var row_label = row_name.charAt( 0 ).toUpperCase( ) + row_name.slice( 1 ).toLowerCase( );
      //var hook  = window[ 'hook_' + row_type ];
        
        var obj =
        $( '\
            <select class="custom-select custom-select-sm form-control form-control-sm">\
                <option value="" selected>Any ' + row_label + '</option>\
            </select>\
        ' );
        
        cols.each( function ( col_idx ) { var col = $( this );

            var col_conf = col.data( 'conf' );
            if ( ! col_conf       ) return;
            if ( ! col_conf.menus ) return;

            $( col_conf.menus ).each( function ( ) {
                
                var col_name = this.name;
                if ( row_name != col_name ) return;
                var col_label = col.html( );
                
                if ( row_type == 'bool' ) {
                    
                    var val = '1';
                    obj.append( '<option value="' + col_idx + '=' + val + '">' + col_label + '</option>' );
                    
                } else if ( row_type == 'uniq' ) {
                    
                    datatable.column( col_idx ).data( ).unique( ).sort( function ( textA, textB ) { return textA.toLowerCase( ).localeCompare( textB.toLowerCase( ) ) } ).each( function ( val ) {
                    
                        if ( val == '' || typeof( val ) == 'undefined' ) return;
                        obj.append( '<option value="' + col_idx + '=' + val + '">' + val + '</option>' );
                    
                    } );
                    
                }
                
            } );
            
        } );
        
        objs.push( obj );
        
    } );
    
    $( objs ).each( function ( ) {
        
        $( this ).on( 'change', function ( ) {
            
            datatable.columns( ).search( '' );
            
            $( objs ).each( function ( ) {
                
                var val = $( this ).val( );
                
                if ( val ) {
                    
                    val = $.fn.dataTable.util.escapeRegex( val ).split( '=', 2 );
                    datatable.column( val[0] ).search( '^' + val[1] + '$', true, false );
                    
                }
                
            } );
            
            datatable.draw( );
            
        } );
        
    } );
    
    return objs;
}

/* ////////////////////////////////////////////////// */


