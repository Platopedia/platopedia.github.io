/* ////////////////////////////////////////////////// */

$.fn.dataTable.Api.register
(
    'row().prev()',
    function ( )
    {
        var rows = this.table( ).rows( { filter : 'applied' } );
        var crp = rows[0].indexOf( this.index( ) ); // curr row position
        if ( crp < 0 ) return this.table( ).row( ':last', { filter : 'applied' } ); // return this;
        var prp = crp - 1; // prev row position
        var pri = rows[0][prp]; // prev row index
        if ( typeof pri == 'undefined' ) return this.table( ).row( ':last', { filter : 'applied' } ); // return this;
        return this.table( ).row( pri );
    }
);

$.fn.dataTable.Api.register
(
    'row().next()',
    function ( )
    {
        var rows = this.table( ).rows( { filter : 'applied' } );
        var crp = rows[0].indexOf( this.index( ) ); // curr row position
        if ( crp < 0 ) return this.table( ).row( ':first', { filter : 'applied' } ); // return this;
        var nrp = crp + 1; // next row position
        var nri = rows[0][nrp]; // next row index
        if ( typeof nri == 'undefined' ) return this.table( ).row( ':first', { filter : 'applied' } ); // return this;
        return this.table( ).row( nri );
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
            'element'     : null,
            'query'       : '',
            'wordentries' : 'entries',
            'init'        : null,
            'rowclick'    : null,
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
                dom        : "<'row'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
                lengthMenu : [ 10, 100 ],
                pageLength : 100,
                order      : [ ],
                
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
                    
                    element.find( 'tbody' ).on
                    (
                        'click',
                        'tr',
                        function ( event )
                        {
                            var row = datatable.row( $( this ) );
                            if ( that.param.rowclick ) that.param.rowclick( datatable, row );
                        }
                    );
                    
                    element.find( 'tbody' ).on
                    (
                        'click',
                        'tr a',
                        function ( event )
                        {
                            event.stopPropagation( );
                        }
                    );
                    
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


