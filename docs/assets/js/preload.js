var images = [ ];
var audios = [ ];

function preload ( ) {
    
    for ( var i = 0; i < arguments.length; i++ ) {
        
        images[i]         = new Image( );
      //images[i].onload  = function ( ) { alert( 'onload: '  + this.src ) }
      //images[i].onerror = function ( ) { alert( 'onerror: ' + this.src ) }
        images[i].src     = arguments[i];
        
    }
    
}

preload
(
    'docs/assets/images/loading.gif',
    'docs/assets/images/loaded.png',
    'docs/assets/images/search.png',
);


