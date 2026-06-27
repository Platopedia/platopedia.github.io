(function ( )
{
    var key = 'artrade_focus_ticket';

    function wants_focus ( )
    {
        try { return sessionStorage.getItem( key ) === '1' }
        catch ( err ) { return false }
    }

    function clear_focus ( )
    {
        try { sessionStorage.removeItem( key ) } catch ( err ) { }
    }

    function on_ready ( callback )
    {
        if ( document.readyState === 'loading' ) document.addEventListener( 'DOMContentLoaded', callback );
        else callback( );
    }

    if ( ! wants_focus( ) ) return;

    document.documentElement.classList.add( 'artrade-ticket-focus-pending' );

    on_ready
    (
        function ( )
        {
            var target = document.getElementById( 'artrade-ticket' );

            clear_focus( );

            if ( ! target )
            {
                document.documentElement.classList.remove( 'artrade-ticket-focus-pending' );
                return;
            }

            requestAnimationFrame
            (
                function ( )
                {
                    target.scrollIntoView( { block : 'start' } );

                    requestAnimationFrame
                    (
                        function ( )
                        {
                            document.documentElement.classList.remove( 'artrade-ticket-focus-pending' );
                            document.documentElement.classList.add( 'artrade-ticket-focus-ready' );

                            setTimeout
                            (
                                function ( )
                                {
                                    document.documentElement.classList.remove( 'artrade-ticket-focus-ready' );
                                },
                                220
                            );
                        }
                    );
                }
            );
        }
    );
}
)( );
