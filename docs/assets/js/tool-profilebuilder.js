(function(){

/* ////////////////////////////////////////////////// */

$( document ).ready
(
    function ( )
    {
        var deferred = $.Deferred( );
        $.when( deferred ).then( function ( ) { $( '.loaded-b' ).attr( 'style', 'display:block !important' ) } );
        Tool_Profilebuilder( deferred );
        
        $( '[data-toggle="tooltip"]' ).tooltip
        (
            {
                container         : $( '#popup-update' ),
                boundary          : 'viewport',
                trigger           : 'hover focus',
                placement         : 'top',
                fallbackPlacement : [ 'top' ],
            }
        );
        
      //$.fn.selectpicker.Constructor.BootstrapVersion = '4';
        setTimeout( function ( ) { $( '.is-selectpicker' ).selectpicker( ) }, 200 );
    }
);

/* ////////////////////////////////////////////////// */

const Tool_Profilebuilder_conf =
{
    'canvaschat' :
    {
        'default' :
        {
            crop_coord_x  : null, // 1,
            crop_coord_y  : null, // 1,
            crop_length_x : null, // 148,
            crop_length_y : null, // 103,
        },
    },
};

const Tool_Profilebuilder_var =
{
    
};

/////

var theme_ref =
{
    'theme.picture.default' :
    {
        'light' : 'https://platopedia.com/docs/assets/images/profilebuilder/picture/default-light.png',
        'dark'  : 'https://platopedia.com/docs/assets/images/profilebuilder/picture/default-dark.png',
    },
    'theme.platoidcolor.default' :
    {
        'light' : '#343A40',
        'dark'  : '#CBC5BF', // #A89E94
    },
    'theme.banner.default' :
    {
        'light' : 'https://platopedia.com/docs/assets/images/profilebuilder/banner/iap_banner_default_light.png',
        'dark'  : 'https://platopedia.com/docs/assets/images/profilebuilder/banner/iap_banner_default_dark.png',
    },
    'theme.chat.default' :
    {
        'light' : 'https://platopedia.com/docs/assets/images/profilebuilder/chat/iap_greybubble_asset.png',
        'dark'  : 'https://platopedia.com/docs/assets/images/profilebuilder/chat/iap_darkbubble_asset.png',
    },
    'theme.chat_color.default' :
    {
        'light' : '#343A40',
        'dark'  : '#CBC5BF', // #A89E94
    },
};

function theme_val ( val, theme = util_theme )
{
    if ( val in theme_ref ) val = theme_ref[val][theme] || theme_ref[val]['light'];
    return val;
}

var Tool_Profilebuilder_canvas_param     = [ ];
var Tool_Profilebuilder_canvaschat_param = [ ];

/* ////////////////////////////////////////////////// */

function Tool_Profilebuilder ( deferred )
{
    var that = null;
    
    var theme_picture_default = theme_val( 'theme.picture.default' ); // 'theme.picture.default'
    
    //
    
    Tool_Profilebuilder_canvas
    (
        deferred,
        $( '#tool_profilebuilder_canvas_default' ),
        theme_picture_default,
        'Platopedia',
        'theme.platoidcolor.default',
        'Platopedia.com/profilebuilder',
        'theme.banner.default',
        undefined,
        undefined,
        'theme.chat.default',
        'theme.chat_color.default',
        undefined,
        undefined,
        undefined,
        0,
    );
    
    // cropper
    
    var cropper_default = Util_Cropper
    (
        {
            'element' : $( '#tool_profilebuilder_form_default_field_picture_media_preview img' ),
        }
    );
    
    // canvas
    
    var canvas_default = $( '#tool_profilebuilder_canvas_default' );
    
    // modal
    
    var modal_default = $( '#popup-update' );
    
    modal_default.on
    (
        'shown.bs.modal',
        function ( event )
        {
            cropper_default.create( );
            
            $( '#tool_profilebuilder_form_default_button_apply .loader' ).removeClass( 'd-inline-flex' ).addClass( 'd-none' );
        }
    );
    
    modal_default.on
    (
        'hidden.bs.modal',
        function ( event )
        {
            cropper_default.datacurr( );
            cropper_default.destroy( );
            
            $( '#tool_profilebuilder_form_default_button_apply .loader' ).removeClass( 'd-inline-flex' ).addClass( 'd-none' );
        }
    );
    
    // form
    
    var form_default = $( '#tool_profilebuilder_form_default' );
    
    // form picture
    
    var form_default_field_picture_button_reset = Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_button_reset' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    _util_popup_confirm
                    (
                        'Do you want to reset your picture?',
                        function ( )
                        {
                            cropper_default.reset( );
                        },
                    );
                },
            },
        }
    );
    
    var form_default_field_picture_button_rotateleft = Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_button_rotateleft' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    cropper_default.rotate( -5 );
                },
            },
        }
    );
    
    var form_default_field_picture_button_rotateright = Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_button_rotateright' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    cropper_default.rotate( 5 );
                },
            },
        }
    );
    
    var form_default_field_picture_button_fliphorizontal = Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_button_fliphorizontal' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    cropper_default.fliphori( );
                },
            },
        }
    );
    
    var form_default_field_picture_button_flipvertical = Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_button_flipvertical' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    cropper_default.flipvert( );
                },
            },
        }
    );
    
    var form_default_field_picture_button_edit = Util_Element_Button_Toggle
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_button_edit' ),
            'callback' :
            {
                'init on' : function ( event )
                {
                    cropper_default.oper( );
                    
                    form_default_field_picture_button_reset         .oper( );
                    form_default_field_picture_button_rotateleft    .oper( );
                    form_default_field_picture_button_rotateright   .oper( );
                    form_default_field_picture_button_fliphorizontal.oper( );
                    form_default_field_picture_button_flipvertical  .oper( );
                },
                'off' : function ( event )
                {
                    cropper_default.unoper( );
                    
                    form_default_field_picture_button_reset         .unoper( );
                    form_default_field_picture_button_rotateleft    .unoper( );
                    form_default_field_picture_button_rotateright   .unoper( );
                    form_default_field_picture_button_fliphorizontal.unoper( );
                    form_default_field_picture_button_flipvertical  .unoper( );
                },
            },
        }
    );
    
    var form_default_field_picture_media_preview = Util_Element_Media_Image
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_media_preview' ),
            'callback' :
            {
                'loaded' : function ( event )
                {
                    cropper_default.datanull( );
                    cropper_default.destroycreate( );
                },
            },
        }
    );
    
    var form_default_field_picture_input_default = Util_Element_Input_File
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_input_default' ),
            'validate' : function ( value, file ) { return file.type.match( /^image\// ) && file.byte < 10485760 },
            'callback' :
            {
                'loaded' : function ( event, url )
                {
                    form_default_field_picture_button_edit.on( false );
                    
                    var picture = url; // theme_val( url );
                    if ( picture === 'theme.picture.default' ) picture = theme_picture_default;
                    
                    form_default_field_picture_media_preview.value( picture );
                },
            },
        }
    );
    
    Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_button_upload' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    form_default_field_picture_input_default.eventexecute( 'click' );
                },
            },
        }
    );
    
    Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_button_download' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    var picture_element = cropper_default.canvascirc( 1000, 1000 );
                    if ( ! picture_element ) return;
                    var picture_url = picture_element.toDataURL( 'image/png' );
                    var picture_name = 'profilebuilder_' + Date.now( ) + '.png';
                    _util_download( picture_url, picture_name );
                },
            },
        }
    );
    
    // form platoid
    
    var form_default_field_platoid_input_default = Util_Element_Input_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_platoid_input_default' ),
            'rebuild'  : false,
            'validate' : function ( value ) { return new RegExp( '^[A-Z0-9_]{3,12}$', 'i' ).test( value ) },
            'callback' :
            {
                'focus' : function ( event )
                {
                    var that = event.data.that;
                    if ( that.value( ) == that.valuedefault ) that.clear( );
                },
            },
        }
    );
    
    // form platoidcolor
    
    var form_default_field_platoidcolor_input_default = Util_Element_Input_Menu
    (
        {
            'element' : $( '#tool_profilebuilder_form_default_field_platoidcolor_input_default' ),
        }
    );
    
    Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_platoidcolor_button_random' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    form_default_field_platoidcolor_input_default.value( form_default_field_platoidcolor_input_default.valuebyrand( ) );
                },
            },
        }
    );
    
    // form bio
    
    var form_default_field_bio_input_default = Util_Element_Input_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_bio_input_default' ),
            'rebuild'  : false,
            'validate' : function ( value ) { return new RegExp( 'platopedia', 'i' ).test( value ) },
        }
    );
    
    // form banner
    
    var preload_banner = null;
    
    var form_default_field_banner_media_preview = Util_Element_Media_Image
    (
        {
            'element' : $( '#tool_profilebuilder_form_default_field_banner_media_preview' ),
        }
    );
    
    var form_default_field_banner_input_default = Util_Element_Input_Menu
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_banner_input_default' ),
            'callback' :
            {
                'init change' : function ( event )
                {
                    var that = event.data.that;
                    var banner = theme_val( that.value( ) );
                    form_default_field_banner_media_preview.value( banner );
                    preload_banner = new Image( ); preload_banner.src = banner; // theme_val( that.item( ).datab( 'banner' ) );
                },
            },
        }
    );
    
    Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_banner_button_random' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    form_default_field_banner_input_default.value( form_default_field_banner_input_default.valuebyrand( ) );
                },
            },
        }
    );
    
    // form frame
    
    var preload_frame = null;
    
    var form_default_field_frame_media_preview = Util_Element_Media_Image
    (
        {
            'element' : $( '#tool_profilebuilder_form_default_field_frame_media_preview' ),
        }
    );
    
    var form_default_field_frame_input_default = Util_Element_Input_Menu
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_frame_input_default' ),
            'callback' :
            {
                'init change' : function ( event )
                {
                    var that = event.data.that;
                    var frame = that.value( );
                    form_default_field_frame_media_preview.value( frame );
                    preload_frame = new Image( ); preload_frame.src = frame; // that.item( ).datab( 'frame' );
                },
            },
        }
    );
    
    Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_frame_button_random' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    form_default_field_frame_input_default.value( form_default_field_frame_input_default.valuebyrand( ) );
                },
            },
        }
    );
    
    // form chat
    
    var preload_chat      = null;
    var preload_chatbadge = null;
    
    var form_default_field_chat_media_preview = Util_Element_Media_Image
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_chat_media_preview' ),
            'callback' : 
            {
                'loaded' : function ( event, url )
                {
                    var that = event.data.that;
                    Tool_Profilebuilder_canvaschat( undefined, that.element.children( ).last( ), url, 400, 100 );
                },
            },
        }
    );
    
    var form_default_field_chat_input_default = Util_Element_Input_Menu
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_chat_input_default' ),
            'callback' :
            {
                'init change' : function ( event )
                {
                    var that = event.data.that;
                    var chat = theme_val( that.value( ) );
                    form_default_field_chat_media_preview.value( chat );                    
                    preload_chat      = new Image( ); preload_chat.src      = chat; // theme_val( that.item( ).datab( 'chat' ) );
                    preload_chatbadge = new Image( ); preload_chatbadge.src = that.item( ).datab( 'chatbadge' );
                },
            },
        }
    );
    
    Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_chat_button_random' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    form_default_field_chat_input_default.value( form_default_field_chat_input_default.valuebyrand( ) );
                },
            },
        }
    );
    
    // form badge
    
    var preload_badge = null;
    
    var form_default_field_badge_media_preview = Util_Element_Media_Image
    (
        {
            'element' : $( '#tool_profilebuilder_form_default_field_badge_media_preview' ),
        }
    );
    
    var form_default_field_badge_input_default = Util_Element_Input_Menu
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_badge_input_default' ),
            'callback' :
            {
                'init change' : function ( event )
                {
                    var that = event.data.that;
                    var badge = that.value( );
                    form_default_field_badge_media_preview.value( badge );                    
                    preload_badge = new Image( ); preload_badge.src = that.item( ).datab( 'badge' );
                },
            },
        }
    );
    
    Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_badge_button_random' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    form_default_field_badge_input_default.value( form_default_field_badge_input_default.valuebyrand( ) );
                },
            },
        }
    );
    
    // form starbadge
    
    var preload_starbadge = null;
    
    var form_default_field_starbadge_input_default = Util_Element_Input_Radiocheck
    (
        {
            'element' : $( '#tool_profilebuilder_form_default_field_starbadge_input_default' ),
            'callback' :
            {
                'init' : function ( event )
                {
                    var that = event.data.that;                   
                    preload_starbadge = new Image( ); preload_starbadge.src = that.element.datab( 'starbadge' );
                },
            },
        }
    );
    
    // form reset
    
    var form_default_button_reset = Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_button_reset' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    var that = event.data.that;
                    
                    _util_popup_confirm
                    (
                        'Do you want to reset your profile?',
                        function ( )
                        {
                            form_default_field_picture_input_default     .reset( );
                            form_default_field_platoid_input_default     .reset( );
                            form_default_field_platoidcolor_input_default.reset( );
                            form_default_field_bio_input_default         .reset( );
                            form_default_field_banner_input_default      .reset( );
                            form_default_field_frame_input_default       .reset( );
                            form_default_field_chat_input_default        .reset( );
                            form_default_field_badge_input_default       .reset( );
                            form_default_field_starbadge_input_default   .reset( );
                            
                            var valid = Tool_Profilebuilder_valid
                            (
                                form_default_field_picture_input_default,
                                form_default_field_platoid_input_default,
                                form_default_field_bio_input_default,
                            );
                            
                            modal_default.modal( 'show' );
                            modal_default.animate( { scrollTop : 0 }, 0 );
                        },
                    );
                },
            },
        }
    );
    
    // form apply
    
    var form_default_button_apply = Util_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_button_apply' ),
            'callback' :
            {
              //'init click' : function ( event )
                'click' : function ( event )
                {
                    var that = event.data.that;
                    
                    _util_popup_null
                    (
                        'Do you want to apply your profile?',
                        function ( )
                        {
                            var valid = Tool_Profilebuilder_valid
                            (
                                form_default_field_picture_input_default,
                                form_default_field_platoid_input_default,
                                form_default_field_bio_input_default,
                            );
                            
                            if ( ! valid )
                            {
                                modal_default.modal( 'show' );
                                modal_default.animate( { scrollTop : 0 }, 0 );
                                return;
                            }
                            
                            that.element.find( '.loader' ).removeClass( 'd-none' ).addClass( 'd-inline-flex' );
                            
                            setTimeout
                            (
                                function ( )
                                {
                                    var picture_element = cropper_default.canvascirc( 1000, 1000 );
                                    if ( ! picture_element ) return;
                                    var picture_url = picture_element.toDataURL( 'image/png' );
                                    
                                    var picture      = picture_url;
                                    var platoid      = form_default_field_platoid_input_default     .value( );
                                    var platoidcolor = form_default_field_platoidcolor_input_default.value( );
                                    var bio          = form_default_field_bio_input_default         .value( );
                                    var banner       = form_default_field_banner_input_default      .item( ).datab( 'banner' );
                                    var frame        = form_default_field_frame_input_default       .item( ).datab( 'frame' );
                                    var frame_layer  = form_default_field_frame_input_default       .item( ).datab( 'frame-layer' );
                                    var chat         = form_default_field_chat_input_default        .item( ).datab( 'chat' );
                                    var chat_color   = form_default_field_chat_input_default        .item( ).datab( 'chat-color' );
                                    var chatbadge    = form_default_field_chat_input_default        .item( ).datab( 'chatbadge' );
                                    var badge        = form_default_field_badge_input_default       .item( ).datab( 'badge' );
                                    var starbadge    = form_default_field_starbadge_input_default   .element.datab( 'starbadge' );
                                    var starbadge_n  = form_default_field_starbadge_input_default   .value( );
                                    
                                    Tool_Profilebuilder_canvas
                                    (
                                        undefined,
                                        canvas_default,
                                        picture,
                                        platoid,
                                        platoidcolor,
                                        bio,
                                        banner,
                                        frame,
                                        frame_layer,
                                        chat,
                                        chat_color,
                                        chatbadge,
                                        badge,
                                        starbadge,
                                        starbadge_n,
                                    );
                                    
                                  //that.element.find( '.loader' ).removeClass( 'd-inline-flex' ).addClass( 'd-none' );
                                    
                                    modal_default.modal( 'hide' );
                                },
                                0
                            );
                        },
                    );
                },
            },
        }
    );
    
    //
    
    var cb_util_theme_out = function ( )
    {
        canvas_default.empty( );
        
        form_default_field_banner_input_default.eventexecute( 'change' );
        form_default_field_chat_input_default  .eventexecute( 'change' );
        
        Tool_Profilebuilder_canvas.apply( null, Tool_Profilebuilder_canvas_param );
    };
    
    $( document ).on( 'util_theme_out', cb_util_theme_out );
  //if ( theme_init !== theme_curr ) cb_util_theme_out( );
    
    //
    
    if ( typeof deferred !== 'undefined' ) deferred.resolve( );
    
    //
    
    return that;
}

function Tool_Profilebuilder_valid ( picture, platoid, bio )
{
    var valid_platoid = platoid.validate( );
    var valid_bio     = bio    .validate( );
    var valid         = valid_platoid && valid_bio;
    
    picture.element.removeClass( 'is-invalid' ); // quickfix
    
    return valid;
}

function Tool_Profilebuilder_canvas ( deferred, canvas, picture, platoid, platoidcolor, bio, banner, frame, frame_layer, chat, chat_color, chatbadge, badge, starbadge, starbadge_n )
{
    Tool_Profilebuilder_canvas_param = Array.from( arguments );
    
    platoidcolor = theme_val( platoidcolor );
    banner       = theme_val( banner       );
    chat_color   = theme_val( chat_color   );
    
    if ( canvas instanceof jQuery ) canvas = canvas.get( 0 );
    
    var picture_deferred = $.Deferred( );
    var picture_element = document.createElement( 'img' );
    picture_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_picture' );
    picture_element.onerror = function ( ) { picture_deferred.resolve( ) };
    picture_element.onload  = function ( ) { picture_deferred.resolve( ) };
    picture_element.src = picture || 'data:,';
    
    var platoid_element = document.createElement( 'span' );
    platoid_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_platoid' );
    platoid_element.style['color'] = platoidcolor;
    platoid_element.innerHTML = platoid;
    
    var bio_element = document.createElement( 'span' );
    bio_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_bio' );
    bio_element.style['color'] = chat_color;
    bio_element.innerHTML = bio;
    
    var banner_deferred = $.Deferred( );
    var banner_element = document.createElement( 'img' );
    banner_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_banner' );
    banner_element.onerror = function ( ) { banner_deferred.resolve( ) };
    banner_element.onload  = function ( ) { banner_deferred.resolve( ) };
    banner_element.src = banner || 'data:,';
    
    var frame_deferred = $.Deferred( );
    var frame_element = document.createElement( 'img' );
    if ( typeof frame === 'undefined' ) frame_element.style.display = 'none';
    frame_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_frame' );
    frame_element.setAttribute( 'class', frame_layer );
    frame_element.onerror = function ( ) { frame_deferred.resolve( ) };
    frame_element.onload  = function ( ) { frame_deferred.resolve( ) };
    frame_element.src = frame || 'data:,';
    
    var chat_deferred = $.Deferred( );
    var chat_element = document.createElement( 'canvas' );
    chat_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_chat' );
    Tool_Profilebuilder_canvaschat( chat_deferred, chat_element, chat, 900, 100 );
    
    var chatbadge_deferred = $.Deferred( );
    var chatbadge_element = document.createElement( 'img' );
    if ( typeof chatbadge === 'undefined' ) chatbadge_element.style.display = 'none';
    chatbadge_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_chatbadge' );
    chatbadge_element.onerror = function ( ) { chatbadge_deferred.resolve( ) };
    chatbadge_element.onload  = function ( ) { chatbadge_deferred.resolve( ) };
    chatbadge_element.src = chatbadge || 'data:,';
    
    var badge_deferred = $.Deferred( );
    var badge_element = document.createElement( 'img' );
    if ( typeof badge === 'undefined' ) badge_element.style.display = 'none';
    badge_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_badge' );
    badge_element.onerror = function ( ) { badge_deferred.resolve( ) };
    badge_element.onload  = function ( ) { badge_deferred.resolve( ) };
    badge_element.src = badge || 'data:,';
    
    var starbadge_deferred = $.Deferred( );
    var starbadge_element = document.createElement( 'img' );
    starbadge_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_starbadge' );
    starbadge_element.onerror = function ( ) { starbadge_deferred.resolve( ) };
    starbadge_element.onload  = function ( ) { starbadge_deferred.resolve( ) };
    starbadge_element.src = starbadge || 'data:,';
    
    var compo_element = document.createElement( 'div' );
    compo_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_compo' );
    compo_element.append( platoid_element );
    for ( var n = 0; n < starbadge_n; n++ ) { compo_element.append( starbadge_element.cloneNode( true ) ) }
    compo_element.append( badge_element );
    compo_element.append( chatbadge_element );
    
    $.when( picture_deferred, banner_deferred, frame_deferred, chat_deferred, chatbadge_deferred, badge_deferred, starbadge_deferred ).then
    (
        function ( )
        {
            canvas.innerHTML = '';
            canvas.append( banner_element, frame_element, picture_element, compo_element, chat_element, bio_element );
            
            if ( typeof deferred !== 'undefined' ) deferred.resolve( );
        }
    );
    
    return true;
}

function Tool_Profilebuilder_canvaschat ( deferred, canvas, chat, repeat_x = 0, repeat_y = 0, divide = 0 )
{
  //Tool_Profilebuilder_canvaschat_param = Array.from( arguments );
    
    chat = theme_val( chat );
    
    if ( canvas instanceof jQuery ) canvas = canvas.get( 0 );
    
    var chat_deferred = $.Deferred( );
    var chat_element = document.createElement( 'img' );
    chat_element.onerror = function ( ) { chat_deferred.resolve( ) };
    chat_element.onload  = function ( ) { chat_deferred.resolve( ) };
    chat_element.src = chat || 'data:,';
    
    $.when( chat_deferred ).then
    (
        function ( )
        {
            var conf          = Tool_Profilebuilder_conf['canvaschat'][chat] || Tool_Profilebuilder_conf['canvaschat']['default'];
            var crop_coord_x  = conf.crop_coord_x  || 1;
            var crop_coord_y  = conf.crop_coord_y  || 1;
            var crop_length_x = conf.crop_length_x || chat_element.naturalWidth  - 2;
            var crop_length_y = conf.crop_length_y || chat_element.naturalHeight - 2;
            
            var width       = crop_length_x;
            var widthhalf   = Math.floor( width / 2 );
            var widthhalfb  = width - widthhalf;
            var height      = crop_length_y;
            var heighthalf  = Math.floor( height / 2 );
            var heighthalfb = height - heighthalf;
            
            var canvasb    = document.createElement( 'canvas' );
            canvasb.width  = width;
            canvasb.height = height;
            var contextb   = canvasb.getContext( '2d' );
            contextb.drawImage( chat_element, crop_coord_x, crop_coord_y, width, height, 0, 0, width, height );
            
            var canvasc    = document.createElement( 'canvas' );
            canvasc.width  = width + divide + divide + repeat_x;
            canvasc.height = height;
            var contextc   = canvasc.getContext( '2d' );
            contextc.drawImage( canvasb, 0, 0, widthhalf, canvasc.height, 0, 0, widthhalf, canvasc.height );
            for ( var repeat = 0; repeat < repeat_x; repeat++ ) { contextc.drawImage( canvasb, widthhalfb, 0, 1, canvasc.height, widthhalf + divide + repeat, 0, 1, canvasc.height ) }
            contextc.drawImage( canvasb, widthhalfb, 0, widthhalf, canvasc.height, widthhalf + divide + divide + repeat_x, 0, widthhalf, canvasc.height );
            
            var canvasd    = document.createElement( 'canvas' );
            canvasd.width  = width + divide + divide + repeat_x;
            canvasd.height = height + divide + divide + repeat_y;
            var contextd   = canvasd.getContext( '2d' );
            contextd.drawImage( canvasc, 0, 0, canvasd.width, heighthalf, 0, 0, canvasd.width, heighthalf );
            for ( var repeat = 0; repeat < repeat_y; repeat++ ) { contextd.drawImage( canvasc, 0, heighthalfb, canvasd.width, 1, 0, heighthalf + divide + repeat, canvasd.width, 1 ) }
            contextd.drawImage( canvasc, 0, heighthalfb, canvasd.width, heighthalf, 0, heighthalf + divide + divide + repeat_y, canvasd.width, heighthalf );
            
            canvas.width  = canvasd.width;
            canvas.height = canvasd.height;
            var context   = canvas.getContext( '2d' );
            context.drawImage( canvasd, 0, 0 );
            
            if ( typeof deferred !== 'undefined' ) deferred.resolve( );
        }
    );
    
    return true;
}

/* ////////////////////////////////////////////////// */

})()


