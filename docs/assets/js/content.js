var content, content_count;

$( document ).ready( on_ready );

function on_ready ( ) {
    
    var query = decodeURI( location.hash.substr( 1 ) );
    history.replaceState( null, null, ' ' );
    
    content = $( '.content' );
    
    var content_contents = content.find( '.content-contents' );
    var content_carousel = content.find( '.content-carousel' );
    var content_collapse = content.find( '.content-collapse' );
    var content_webpage  = content.find( '.content-webpage'  );
    var content_image    = content.find( '.content-image'    );
    var content_table    = content.find( '.content-table'    );
    var content_tableb   = content.find( '.content-tableb'   );
    
    content_count = content_contents.length + 
                    content_carousel.length + 
                    content_collapse.length + 
                    content_webpage.length  + 
                    content_image.length    + 
                    content_table.length    + 
                    content_tableb.length   + 
                    0;

    content_contents.each( function ( ) {
    
        var element = $( this );
        var open    = element.data( 'open' );
        var icon    = element.data( 'icon' );
        
        open = ( open ) ? [ '', 'true', 'show' ] : [ 'collapsed', 'false', 'hide' ] ;
        icon = ( icon ) ? icon.split( ',', 2 )   : [ '', '' ]                       ;

        element.wrapInner( '<a class="' + open[0] + '" href="#content-contents-list-' + content_count + '" data-toggle="collapse" aria-expanded="' + open[1] + '" aria-controls="content-contents-list-' + content_count + '"></a>' );
        element.find( 'embed' ).replaceWith( '<i class="fa" data-icon-o="' + icon[0] + '" data-icon-c="' + icon[1] + '"></i>' );
        var list = $( '<ul id="content-contents-list-' + content_count + '" class="collapse ' + open[2] + '"></ul>' ).appendTo( element );

        element.siblings( 'h2' ).each( function ( ) {

            var elementb = $( this );
            var id       = elementb.attr( 'id' );
            var text     = elementb.text( );

            list.append( '<li><a href="#' + id + '">' + text + '</a></li>' );

        } );
        
        on_load( );
    
    } );
    
    content_carousel.each( function ( ) {
        
        var element = $( this );
        var id      = 'content-carousel-' + content_count;
        
        var elementb =
        $( '\
            <div id="' + id + '" class="carousel slide"></div>\
        ' );
 
        element.children( 'div' ).each( function( i ) {
            
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
        
        on_load( );
        
    } );
    
    content_collapse.each( function ( ) {
        
        var element = $( this );
        var id      = 'content-collapse-' + content_count;
        
        var elementb =
        $( '\
            <div id="' + id + '" class="accordion"></div>\
        ' );
        
        element.children( 'div' ).each( function( i ) {

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
        
        on_load( );
        
    } );
    
    content_webpage.each( function ( ) {
        
        var element = $( this );
        var url     = element.data( 'url'    );
        var height  = element.data( 'height' );

        var elementb =
        $( '\
            <iframe src="' + url + '" style="height:' + height + '"></iframe>\
        ' );
        
        elementb.appendTo( element );
        
        elementb.on( 'load',  function ( ) { on_load( ) } );
      //elementb.on( 'error', function ( ) { on_load( ) } );
      
      //on_load( );

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
                <!--<figcaption class="figure-caption">' + label + '</figcaption>-->\
            </figure>\
        ' );
        
        elementb.appendTo( element );

      //elementb.on( 'load',  function ( ) { on_load( ) } );
      //elementb.on( 'error', function ( ) { on_load( ) } );
      
        on_load( );

    } );
    
    content_table.each( function ( ) {
        
        var element  = $( this );
        var elementb = element.find( 'table' );
        
        var on = on_table;
        if ( element.hasClass( 'content-table-items' ) ) on = on_table_items;
            
        var table = elementb.DataTable
        ( {
            'dom'          : "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            'search'       : { 'search' : query },
            'lengthMenu'   : [ 10, 100 ],
            'pageLength'   : 100,
            'order'        : [ ],
            'initComplete' : on, // function ( ) { setTimeout( on.bind( this ), 1000 ) },
            'language'     :
            {
                'lengthMenu'        : '_MENU_ entries',
                'info'              : '_START_ to _END_ of _TOTAL_ entries',
                'infoFiltered'      : '(_MAX_ total entries)',
                'infoEmpty'         : '0 to 0 of 0 entries',
                'zeroRecords'       : '&nbsp;',
                'search'            : '',
                'searchPlaceholder' : '',
                'paginate'          : { 'previous' : '&lt;', 'next' : '&gt;' },
            },      
        } );
            
        table.on( 'search.dt', function ( ) {
        
          //history.replaceState( null, null, '#' + table.search( ) );
                
        } );
            
        table.on( 'page.dt', function ( ) {
        
            $( 'html, body' ).animate( { scrollTop : elementb.offset( ).top }, 'fast' );
            elementb.find( 'thead tr th:first-child' ).focus( ).blur( );
        
        } );
        
      //on_load( );

    } );
    
    content_tableb.each( function ( ) {
        
        var element  = $( this );
        var elementb = element.find( 'table' );
        
        var on = on_tableb;
      //if ( element.hasClass( 'content-tableb-groups'   ) ) on = on_tableb_groups;
      //if ( element.hasClass( 'content-tableb-concepts' ) ) on = on_tableb_concepts;
            
        var table = elementb.DataTable
        ( {
            'dom'          : "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            'search'       : { 'search' : query },
            'lengthMenu'   : [ 10, 100 ],
            'pageLength'   : 100,
            'order'        : [ ],
            'initComplete' : on, // function ( ) { setTimeout( on.bind( this ), 1000 ) },
            'language'     :
            {
                'lengthMenu'        : '_MENU_ entries',
                'info'              : '_START_ to _END_ of _TOTAL_ entries',
                'infoFiltered'      : '(_MAX_ total entries)',
                'infoEmpty'         : '0 to 0 of 0 entries',
                'zeroRecords'       : '',
                'search'            : '',
                'searchPlaceholder' : '',
                'paginate'          : { 'previous' : '&lt;', 'next' : '&gt;' },
            },      
        } );
            
        table.on( 'search.dt', function ( ) {
        
          //history.replaceState( null, null, '#' + table.search( ) );
                
        } );
            
        table.on( 'page.dt', function ( ) {
        
            $( 'html, body' ).animate( { scrollTop : elementb.offset( ).top }, 'fast' );
            elementb.find( 'thead tr th:first-child' ).focus( ).blur( );
        
        } );
        
      //on_load( );

    } );
    
    on_load( );

}

function on_table ( ) {
    
    var table     = this;
    var api       = table.api( );
    var container = $( api.table( ).container( ) );

    table                       .addClass( 'table table-sm table-bordered' );
    table.find( 'thead'        ).addClass( 'thead-dark'                    );
    container.children( '.row' ).addClass( 'align-items-end'               );
    
    on_load( );
    
}

function on_table_items ( ) {

    var table     = this;
    var api       = table.api( );
    var container = $( api.table( ).container( ) );

    table                       .addClass( 'table table-sm table-bordered' );
    table.find( 'thead'        ).addClass( 'thead-dark'                    );
    container.children( '.row' ).addClass( 'align-items-end'               );
    
    api.columns( [ 4, 5, 6, 7, 8, 9 ] ).visible( false );
  //api.page.len( 100 );
  //api.draw( );
    
    var filter =
    $( '\
        <label>\
            <select class="filter-cat custom-select custom-select-sm form-control form-control-sm">\
                <option value="" selected>Any Category</option>\
                <option value="4=1">New</option>\
                <option value="5=1">Discounted</option>\
                <option value="6=1">Rare</option>\
                <option value="7=1">Tournament Prize</option>\
                <option value="8=1">Ranked Prize</option>\
                <option value="9=1">Event Prize</option>\
            </select>\
        </label>\
        <br />\
        <label>\
            <select class="filter-type custom-select custom-select-sm form-control form-control-sm">\
                <option value="" selected>Any Type</option>\
            </select>\
        </label>\
        <br />\
    ' )
    .prependTo( container.find( '.dataTables_filter' ) );

    var filter_cat  = filter.find( '.filter-cat'  );
    var filter_type = filter.find( '.filter-type' );
    var filters     = $( [ filter_cat, filter_type ] );
    
    var modal =
    $( '\
        <div class="modal fade" tabindex="-1" role="dialog">\
            <div class="modal-dialog modal-dialog-centered">\
                <div class="modal-content">\
                    <div class="modal-header text-center">\
                        <h4 class="modal-title w-100"></h4>\
                        <button class="close" type="button" data-dismiss="modal">&times;</button>\
                    </div>\
                    <div class="modal-body"></div>\
                    <div class="modal-footer"></div>\
                </div>\
            </div>\
        </div>\
    ' )
    .appendTo( container );
    
    var modal_head = modal.find( '.modal-title'  );
    var modal_body = modal.find( '.modal-body'   );
    var modal_foot = modal.find( '.modal-footer' );
    var modals     = null;

    api.column( 0 ).data( ).unique( ).sort( ).each( function ( type ) {
                
        filter_type.append( '<option value="0=' + type + '">' + type + '</option>' );
        
    } );

    filters.each( function ( ) {
    
        $( this ).on( 'change', function ( ) {
        
            api.columns( ).search( '' );
            
            filters.each( function ( ) {
            
                var val = $( this ).val( );
                
                if ( val ) {
                
                    val = $.fn.dataTable.util.escapeRegex( val ).split( '=', 2 );
                    api.column( val[0] ).search( '^' + val[1] + '$', true, false );

                }
            
            } );
        
            api.draw( );
            
        } );
    
    } );
    
    table.find( 'tbody' ).on( 'click', 'tr', function ( ) {

        var id   = $( this ).data( 'id' );
        var name = $( this ).find( 'td:eq(1)' ).text( );

        modal_head.html( name );
        modal_body.css( 'display', 'none' );
        modal_body.empty( );
        
        var images = med[id]['images'];
        var audios = med[id]['audios'];

        if ( typeof images !== 'undefined' && images.length > 0 ) {
        
            $( images ).each( function ( ) {
            
                var type = this['type'];
                var uri  = 'https://profile.platocdn.com/' + this['uri'];

                var image     = new Image( );
                image.onload  = function ( ) { modal_body.css( 'display', 'block' ) }
                image.onerror = function ( ) { modal_body.css( 'display', 'block' ) }
                image.src     = uri;
                
                modal_body.append
                ( '\
                    <div class="row">\
                        <div class="col text-center">\
                            <!--<figure class="figure">-->\
                                <!--<figcaption class="figure-caption">' + type + '</figcaption>-->\
                                <img class="d-block w-100" src="' + uri + '" />\
                            <!--</figure>-->\
                        </div>\
                    </div>\
                ' );
            
            } );
            
        }
        
        if ( typeof audios !== 'undefined' && audios.length > 0 ) {
        
            $( audios ).each( function ( ) {
            
                var type = this['type'];
                var uri  = 'https://game-assets-prod.platocdn.com/' + this['uri'];

                modal_body.append
                ( '\
                    <div class="row">\
                        <div class="col text-center">\
                            <figure class="figure">\
                                <figcaption class="figure-caption">' + type + '</figcaption>\
                                <audio controls controlsList="nodownload"><source type="audio/mp4" src="' + uri + '"><a href="' + uri + '" target="_blank">' + type + '</a></audio>\
                            </figure>\
                        </div>\
                    </div>\
                ' );
            
            } );
            
        }

        modal.modal( 'show' );
    
    } );
    
    table.find( 'tbody' ).on( 'click', 'tr a', function ( e ) {

        e.stopPropagation( );
    
    } );
    
    modal.on( 'hide.bs.modal', function ( ) {

        $( 'audio' ).each( function ( ) {
        
            this.pause( );
            this.currentTime = 0;
            this.setAttribute( 'src', '' );
            this.load( );
          //delete( this );
          //$( this ).remove( );
        
        } );
    
    } );

    on_load( );
    
}

function on_tableb ( ) {
    
    var table     = this;
    var api       = table.api( );
    var container = $( api.table( ).container( ) );
    
    container.children( '.row' ).addClass( 'align-items-end' );
    
    api.columns( [ 1, 2 ] ).visible( false );
  //api.page.len( 100 );
  //api.draw( );
    
    var filter =
    $( '\
        <label>\
            <select class="filter-type custom-select custom-select-sm form-control form-control-sm">\
                <option value="" selected>Any Type</option>\
            </select>\
        </label>\
        <br />\
    ' )
    .prependTo( container.find( '.dataTables_filter' ) );

    var filter_type = filter.find( '.filter-type' );
    var filters     = $( [ filter_type ] );
    
    function sort_lowercase (textA,textB) { return textA.toLowerCase().localeCompare(textB.toLowerCase()) }
    
    api.column( 2 ).data( ).unique( ).sort( sort_lowercase ).each( function ( type ) {
                
        filter_type.append( '<option value="2=' + type + '">' + type + '</option>' );
        
    } );

    filters.each( function ( ) {
    
        $( this ).on( 'change', function ( ) {
        
            api.columns( ).search( '' );
            
            filters.each( function ( ) {
            
                var val = $( this ).val( );
                
                if ( val ) {
                
                    val = $.fn.dataTable.util.escapeRegex( val ).split( '=', 2 );
                    api.column( val[0] ).search( '^' + val[1] + '$', true, false );

                }
            
            } );
        
            api.draw( );
            
        } );
    
    } );
    
    on_load( );
    
}

function on_tableb_groups ( ) {

    

}

function on_tableb_concepts ( ) {

    

}

function on_load ( ) {
    
    if ( --content_count === -1 ) {
        
      //content.css( 'display', 'block' );
        
        $( '.loading'   ).css( 'display', 'none'         );
        
        $( '.loaded-i'  ).css( 'display', 'inline'       );
        $( '.loaded-b'  ).css( 'display', 'block'        );
        $( '.loaded-ib' ).css( 'display', 'inline-block' );
        
      //setTimeout( function ( ) { }, 1000 );
        
    }
    
}


