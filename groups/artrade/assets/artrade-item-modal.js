(function ( )
{
    var block =
        '\
            <div class="artrade-ticket-mini">\
                <div class="artrade-ticket-mini-copy">\
                    <strong>Artrade Ticket</strong>\
                    <span>Trade rare or exclusive Plato items with trusted Artrade Merchants.</span>\
                </div>\
                <a class="artrade-ticket-mini-button" href="/groups/artrade#artrade-ticket">Trade Request</a>\
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
}
)( );
