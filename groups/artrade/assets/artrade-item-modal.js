(function ( )
{
    var block =
        '\
            <div class="artrade-ticket-mini">\
                <div class="artrade-ticket-mini-copy">\
                    <strong class="artrade-ticket-mini-title">Artrade Ticket</strong>\
                    <span>Trade rare or exclusive Plato items with trusted <strong>Artrade Merchants</strong>.</span>\
                </div>\
                <a class="artrade-ticket-mini-button" href="/groups/artrade">Trade</a>\
            </div>\
        ';

    $( document ).on
    (
        'show.bs.modal',
        '#popup-item',
        function ( )
        {
            var modal_body = $( this ).find( '.modal-body' );

            if ( modal_body.find( '.artrade-ticket-mini' ).length ) return;

            modal_body.append( block );
        }
    );

    document.addEventListener( 'touchstart', function ( ) { }, { passive : true } );

    $( document ).on
    (
        'pointerdown',
        '#popup-item .artrade-ticket-mini-button',
        function ( )
        {
            this.classList.add( 'pressed' );
        }
    );

    $( document ).on
    (
        'pointerup',
        '#popup-item .artrade-ticket-mini-button',
        function ( )
        {
            var button = this;
            setTimeout( function ( ) { button.classList.remove( 'pressed' ) }, 60 );
        }
    );

    $( document ).on
    (
        'pointerleave pointercancel',
        '#popup-item .artrade-ticket-mini-button',
        function ( )
        {
            this.classList.remove( 'pressed' );
        }
    );

    $( document ).on
    (
        'click',
        '#popup-item .artrade-ticket-mini-button',
        function ( )
        {
            if ( navigator.vibrate ) navigator.vibrate( [ 20, 30, 20 ] );
        }
    );
}
)( );
