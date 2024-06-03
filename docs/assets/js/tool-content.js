(function(){

/* ////////////////////////////////////////////////// */

/*
* SyoTimer v.3.1.1 | under MIT license
* https://mrfratello.github.io/SyoTimer
*/
!function(e){"use strict";e.syotimerLang={rus:{second:["секунда","секунды","секунд"],minute:["минута","минуты","минут"],hour:["час","часа","часов"],day:["день","дня","дней"],handler:function(e,t){return e%100>4&&e%100<20?t[2]:t[[2,0,1,1,1,2][e%10<5?e%10:5]]}},eng:{second:["second","seconds"],minute:["minute","minutes"],hour:["hour","hours"],day:["day","days"]},por:{second:["segundo","segundos"],minute:["minuto","minutos"],hour:["hora","horas"],day:["dia","dias"]},spa:{second:["segundo","segundos"],minute:["minuto","minutos"],hour:["hora","horas"],day:["día","días"]},heb:{second:["שניה","שניות"],minute:["דקה","דקות"],hour:["שעה","שעות"],day:["יום","ימים"]}};var t="day",i="hour",n="minute",o="second",s=86400,r=3600,a=60,d={d:t,h:i,m:n,s:o},l={list:[o,n,i,t],next:function(e){var t=this.list.indexOf(e);return t<this.list.length?this.list[t+1]:null},prev:function(e){var t=this.list.indexOf(e);return t>0?this.list[t-1]:null}},u={second:!1,minute:!1,hour:!1,day:!1},c={date:0,layout:"dhms",periodic:!1,periodInterval:7,periodUnit:"d",doubleNumbers:!0,effectType:"none",lang:"eng",headTitle:"",footTitle:"",afterDeadline:function(e){e.bodyBlock.html('<p style="font-size: 1.2em;">The countdown is finished!</p>')},itemTypes:["day","hour","minute","second"],itemsHas:e.extend({},u)};function m(e){switch(e){case"d":case t:return s;case"h":case i:return r;case"m":case n:return a;default:return 1}}var h=function(e,t){return 1===e?t[0]:t[1]};function y(e,t,i){return($.syotimerLang[t].handler||h)(e,$.syotimerLang[t][i])}var p=function(){function i(t,i){this.element=e(t),this.element.data("syotimer-options",i),this.render()}return i.prototype.render=function(){for(var t,i,n,o=this.element.data("syotimer-options"),s=(t=$("<div/>",{class:"syotimer-cell__value",text:"0"}),i=$("<div/>",{class:"syotimer-cell__unit"}),(n=$("<div/>",{class:"syotimer-cell"})).append(t).append(i),n),r=e("<div/>",{class:"syotimer__head"}).html(o.headTitle),a=e("<div/>",{class:"syotimer__body"}),d=e("<div/>",{class:"syotimer__footer"}).html(o.footTitle),l={},u=0;u<o.itemTypes.length;u+=1){var c=s.clone();c.addClass("syotimer-cell_type_".concat(o.itemTypes[u])),a.append(c),l[o.itemTypes[u]]=c}var m={headBlock:r,bodyBlock:a,footBlock:d};this.element.data("syotimer-blocks",m).data("syotimer-items",l).addClass("syotimer").append(r).append(a).append(d)},i.prototype.tick=function(){var t=this.element.data("syotimer-options");e(".syotimer-cell > .syotimer-cell__value",this.element).css("opacity",1);var i=(new Date).getTime(),n=function(e,t){var i,n=e/1e3;if(n=Math.floor(n),!t.periodic)return n;var o=m(t.periodUnit),s=e/(1e3*o);s=Math.ceil(s),s=Math.abs(s),n>=0?(i=0==(i=s%t.periodInterval)?t.periodInterval:i,i-=1):i=t.periodInterval-s%t.periodInterval;var r=n%o;return 0===r&&n<0&&(i-=1),Math.abs(i*o+r)}((t.date instanceof Date?t.date.getTime():t.date)-i,t);if(n>=0)this.refreshUnitsDom(n),this.applyEffectSwitch(t.effectType);else{var o=e.extend(this.element,this.element.data("syotimer-blocks"));t.afterDeadline(o)}},i.prototype.refreshUnitsDom=function(i){var n,o,s=this.element.data("syotimer-options"),r=this.element.data("syotimer-items"),a=s.itemTypes,d=function(e){var i=e,n=t,o={day:0,hour:0,minute:0,second:0};do{var s=m(n);o[n]=Math.floor(i/s),i%=s}while(n=l.prev(n));return o}(i);s.itemsHas.day||(d.hour+=24*d.day),s.itemsHas.hour||(d.minute+=60*d.hour),s.itemsHas.minute||(d.second+=60*d.minute);for(var u=0;u<a.length;u+=1){var c=a[u],h=d[c],p=r[c];p.data("syotimer-unit-value",h),e(".syotimer-cell__value",p).html((n=h,o=c!==t&&s.doubleNumbers,n<=9&&o?"0".concat(n):String(n))),e(".syotimer-cell__unit",p).html(y(h,s.lang,c))}},i.prototype.applyEffectSwitch=function(t,i){var n=this;if(void 0===i&&(i=o),"opacity"!==t)setTimeout((function(){return n.tick()}),1e3);else{var s=this.element.data("syotimer-items")[i];if(s){var r=l.next(i),a=s.data("syotimer-unit-value");e(".syotimer-cell__value",s).animate({opacity:.1},1e3,"linear",(function(){return n.tick()})),r&&0===a&&this.applyEffectSwitch(t,r)}}},i}();function f(t,i){var n=e.extend({},c,i||{});n.itemTypes=function(e){for(var t=[],i=0;i<e.length;i+=1)t.push(d[e[i]]);return t}(n.layout),n.itemsHas=e.extend({},u);for(var o=0;o<n.itemTypes.length;o+=1)n.itemsHas[n.itemTypes[o]]=!0;return t.each((function(){new p(this,n).tick()}))}var v={setOption:function(t,i){var n=e(this),o=n.data("syotimer-options");Object.prototype.hasOwnProperty.call(o,t)&&(o[t]=i,n.data("syotimer-options",o))}};e.fn.extend({syotimer:function(t,i,n){return"string"==typeof t&&"setOption"===t?this.each((function(){v[t].apply(this,[i,n])})):null==t||"object"==typeof t?f(this,t):e.error("SyoTimer. Error in call methods: methods is not exist")}})}(jQuery);

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

const Tool_Content_conf =
{
    
};

/* ////////////////////////////////////////////////// */

function Tool_Content ( deferred )
{
    var that = null;
    
    //
    
  //var query = decodeURI( location.hash.substr( 1 ) );
  //history.replaceState( null, null, ' ' );
    
    //
    
    var content           = $( '.content' );
    
    var content_contents  = content.find( '.content-contents'  );
    var content_carousel  = content.find( '.content-carousel'  );
    var content_collapse  = content.find( '.content-collapse'  );
    var content_webpage   = content.find( '.content-webpage'   );
    var content_image     = content.find( '.content-image'     );
    var content_link      = content.find( '.content-link'      );
    var content_report    = content.find( '.content-report'    );
    var content_countdown = content.find( '.content-countdown' );
    var content_table     = content.find( '.content-table'     );
    var content_collect   = content.find( '.content-collect'   );
    
    var content_count     = content_contents.length  +
                            content_carousel.length  +
                            content_collapse.length  +
                            content_webpage.length   +
                            content_image.length     +
                            content_link.length      +
                            content_report.length    +
                            content_countdown.length +
                            content_table.length     +
                            content_collect.length;
    
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
    
    content_link.each( function ( ) {
        
        var element = $( this );
        var url     = element.data( 'url'  ) || '#';
        var text    = element.data( 'text' ) || url;
        var copy    = element.data( 'copy' ) || false;
        
        var elementb = $( '<p></p>' );
        elementb.append( '<a href="' + url + '">' + text + '</a>' );
        if ( copy ) elementb.append( ' <a class="btn btn-sm btn-field btn-copy icon font-weight-normal" href="' + url + '">&#xf24d;</a>' );
        
        elementb.appendTo( element );
        
        content_callback( );
        
    } );
    
    content_report.each( function ( ) {
        
        var element = $( this );
        var type    = element.data( 'type'  );
        var query   = element.data( 'query' );
        
        var html = null;
        
        if      ( type == 'count' ) { html = $( query ).length; html = html.toLocaleString( 'en-US' ) }
        else if ( type == 'total' ) { html = 0; $( query ).each( function ( ) { html += $( this ).html( ).replace( /[^\d]/g, '' ) * 1 } ); html = html.toLocaleString( 'en-US' ) }
        
        element.html( html );
        
        content_callback( );
        
    } );
    
    content_countdown.each( function ( ) {
        
        var element  = $( this );
        var html     = element.html( );
        var datetime = element.data( 'datetime' );
        
        element.empty( );
        
        element.syotimer
        (
            {
                date          : new Date( datetime ),
                afterDeadline : function ( syotimer ) { syotimer.bodyBlock.html( html ) },
            }
        );
        
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
                    
                    container.wrap( '<form autocomplete="off"></form>' );
                    container.find( 'input, select' ).attr( 'autocomplete', 'off' );
                    
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
                    
                    container.wrap( '<form autocomplete="off"></form>' );
                    container.find( 'input, select' ).attr( 'autocomplete', 'off' );
                    
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

})()


