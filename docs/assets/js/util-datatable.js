/* ////////////////////////////////////////////////// */

/*
$.fn.dataTable.Api.register
(
    'drawb()',
    function ( )
    {
        var element = $( this.table( ).node( ) );
        if ( $._data( element.get( 0 ), 'events' ).drawb ) element.trigger( 'drawb', [ this.draw ] );
        else this.draw( );
        return this;
    }
);
*/

$.fn.dataTable.Api.register
(
    'total()',
    function ( )
    {
        var total = this.data( ).flatten( ).reduce
        (
            function ( a, b )
            {
                if ( typeof a === 'string' ) a = a.replace( /[^-\d.]/g, '' ) * 1;
                if ( typeof b === 'string' ) b = b.replace( /[^-\d.]/g, '' ) * 1;
                return a + b;
            },
            0
        );
        return total;
    }
);

$.fn.dataTable.Api.register
(
    'row().equal()',
    function ( rowb )
    {
        var row = this;
      //if ( row.index( ) === rowb.index( ) ) return true;
        if ( row.id( ) === rowb.id( ) ) return true;
        return false;
    }
);

$.fn.dataTable.Api.register
(
    'row().prev()',
    function ( )
    {
        var row = this;
        var table = row.table( );
        var rows = table.rows( { filter : 'applied' } );
        if ( rows[0].length < 1 ) return row;
        var rowpos = rows[0].indexOf( row.index( ) );
        if ( rowpos < 0 ) return table.row( ':last', { filter : 'applied' } ); // return row;
        var rowprevpos = rowpos - 1;
        var rowprevidx = rows[0][rowprevpos];
        if ( typeof rowprevidx == 'undefined' ) return table.row( ':last', { filter : 'applied' } ); // return row;
        var rowprev = table.row( rowprevidx );
        return rowprev;
    }
);

$.fn.dataTable.Api.register
(
    'row().next()',
    function ( )
    {
        var row = this;
        var table = row.table( );
        var rows = table.rows( { filter : 'applied' } );
        if ( rows[0].length < 1 ) return row;
        var rowpos = rows[0].indexOf( row.index( ) );
        if ( rowpos < 0 ) return table.row( ':first', { filter : 'applied' } ); // return row;
        var rownextpos = rowpos + 1;
        var rownextidx = rows[0][rownextpos];
        if ( typeof rownextidx == 'undefined' ) return table.row( ':first', { filter : 'applied' } ); // return row;
        var rownext = table.row( rownextidx );
        return rownext;
    }
);

$.fn.dataTable.Api.register
(
    'row().page()',
    function ( draw = false, drawtype = 'page' )
    {
        var row = this;
        var table = row.table( );
        var rows = table.rows( { filter : 'applied' } );
        var rowstotal = rows.data( ).length;
        var rowspage = table.page.len( );
        if ( rowstotal <= rowspage ) return 0;
        var page = table.page( );
        var rowpos = rows.nodes( ).indexOf( row.node( ) );
        if ( rowpos < 0 ) return page;
        var rowpage = Math.floor( rowpos / rowspage );
        if ( draw && page !== rowpage ) table.page( rowpage ).draw( drawtype );
        return rowpage;
    }
);

/* ////////////////////////////////////////////////// */

function Util_Datatable ( param )
{
    var that = _util_object
    (
        undefined,
        param,
        {
            'element'          : null,
            'cache'            : false,
            'query'            : '',
            'wordentries'      : 'entries',
            'init'             : null,
            'callbackrowclick' : null,
            'callbackinfo'     : null,
        },
    );
    
    that.element = that.param.element || _util_error( 'element required' );
    
    that.obj      = null;
    that.objready = 0;
    
    that._datatable = function ( )
    {
        var datatable = that.element.DataTable
        (
            {
                stateSave    : that.param.cache,
                dom          : "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                lengthMenu   : [ 10, 100 ],
                pageLength   : 100,
                order        : [ ],
                infoCallback : that.param.callbackinfo,
                
                language :
                {
                    'emptyTable'        : '',
                    'lengthMenu'        : '_MENU_ ' + that.param.wordentries,
                    'info'              : '_START_ to _END_ of _TOTAL_ ' + that.param.wordentries,
                    'infoFiltered'      : '(_MAX_ total ' + that.param.wordentries + ')',
                    'infoEmpty'         : '0 to 0 of 0 ' + that.param.wordentries,
                    'zeroRecords'       : '&nbsp;',
                    'search'            : '',
                    'searchPlaceholder' : '',
                    'paginate'          : { 'previous' : '&lt;', 'next' : '&gt;' },
                },
                
                initComplete : function ( )
                {
                    var element   = this;
                    var datatable = element.api( );
                    
                    if ( that.param.callbackrowclick )
                    {
                        element.find( 'tbody' ).on
                        (
                            'click',
                            'tr',
                            function ( event )
                            {
                                var element = $( this );
                                if ( element.find( 'td.dataTables_empty' ).length ) return;
                                that.param.callbackrowclick( datatable, datatable.row( element ) );
                            }
                        );
                        
                        element.find( 'tbody' ).on
                        (
                            'click',
                            'tr a',
                            function ( event )
                            {
                              //var element = $( this );
                                event.stopPropagation( );
                            }
                        );
                    }
                    
                    if ( that.param.init ) that.param.init( datatable );
                    
                    that.objready = 1;
                },
            }
        );
        
        datatable.on
        (
            'page.dt',
            function ( )
            {
                var element = $( this );
                $( 'html, body' ).animate( { scrollTop : element.offset( ).top }, 'fast' );
                element.find( 'thead tr th:first-child' ).focus( ).blur( );
            }
        );
        
        return datatable;
    };
    
    that.init = function ( )
    {
        that.obj = that._datatable( );
        return that;
    }
    
    that.init( );
    
    return that;
}

/* ////////////////////////////////////////////////// */


