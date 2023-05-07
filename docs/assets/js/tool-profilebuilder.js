/* ////////////////////////////////////////////////// */

function Tool_Profilebuilder ( param )
{
    var that = null;
    
    // cropper
    
    var cropper_default = Tool_Object_Cropper
    (
        {
            'element' : $( '#tool_profilebuilder_form_default_field_picture_media_preview img' ),
        }
    );
    
    // canvas
    
    var canvas_default = $( '#tool_profilebuilder_canvas_default' );
    
    // modal
    
    var modal_default = $( '#tool_profilebuilder_modal_default' );
    
    modal_default.on
    (
        'shown.bs.modal',
        function ( event )
        {
            cropper_default.create( );
        }
    );
    
    modal_default.on
    (
        'hidden.bs.modal',
        function ( event )
        {
            cropper_default.datacurr( );
            cropper_default.destroy( );
        }
    );
    
    // form
    
    var form_default = $( '#tool_profilebuilder_form_default' );
    
    // form picture
    
    var form_default_field_picture_button_reset = Tool_Element_Button_Default
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
    
    var form_default_field_picture_button_rotateleft = Tool_Element_Button_Default
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
    
    var form_default_field_picture_button_rotateright = Tool_Element_Button_Default
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
    
    var form_default_field_picture_button_fliphorizontal = Tool_Element_Button_Default
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
    
    var form_default_field_picture_button_flipvertical = Tool_Element_Button_Default
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
    
    var form_default_field_picture_button_edit = Tool_Element_Button_Toggle
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
    
    var form_default_field_picture_media_preview = Tool_Element_Media_Image
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
    
    var form_default_field_picture_input_default = Tool_Element_Input_File
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_input_default' ),
            'validate' : function ( value, file ) { return file.type.match( /^image\// ) && file.byte < 10485760 },
            'callback' :
            {
                'loaded' : function ( event, url )
                {
                    form_default_field_picture_button_edit.on( false );
                    form_default_field_picture_media_preview.value( url );
                },
            },
        }
    );
    
    Tool_Element_Button_Default
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
    
    Tool_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_picture_button_download' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    var picture_element = cropper_default.canvascirc( );
                    if ( ! picture_element ) return;
                  //picture_element.width = 100;
                    var picture_url = picture_element.toDataURL( 'image/png' );
                    var picture_name = 'profilebuilder_' + Date.now( ) + '.png';
                    _util_download( picture_url, picture_name );
                },
            },
        }
    );
    
    // form platoid
    
    var form_default_field_platoid_input_default = Tool_Element_Input_Default
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
    
    // form bio
    
    var form_default_field_bio_input_default = Tool_Element_Input_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_bio_input_default' ),
            'rebuild'  : false,
            'validate' : function ( value ) { return new RegExp( 'platopedia', 'i' ).test( value ) },
        }
    );
    
    // form banner
    
    var form_default_field_banner_media_preview = Tool_Element_Media_Image
    (
        {
            'element' : $( '#tool_profilebuilder_form_default_field_banner_media_preview' ),
        }
    );
    
    var form_default_field_banner_input_default = Tool_Element_Input_Menu
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_banner_input_default' ),
            'callback' :
            {
                'init change' : function ( event )
                {
                    var that = event.data.that;
                    form_default_field_banner_media_preview.value( that.value( ) );
                },
            },
        }
    );
    
    Tool_Element_Button_Default
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
    
    var form_default_field_frame_media_preview = Tool_Element_Media_Image
    (
        {
            'element' : $( '#tool_profilebuilder_form_default_field_frame_media_preview' ),
        }
    );
    
    var form_default_field_frame_input_default = Tool_Element_Input_Menu
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_frame_input_default' ),
            'callback' :
            {
                'init change' : function ( event )
                {
                    var that = event.data.that;
                    form_default_field_frame_media_preview.value( that.value( ) );
                },
            },
        }
    );
    
    Tool_Element_Button_Default
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
    
    var form_default_field_chat_media_preview = Tool_Element_Media_Image
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_chat_media_preview' ),
            'callback' : 
            {
                'loaded' : function ( event, url )
                {
                    var that = event.data.that;
                    Tool_Profilebuilder_canvaschat( undefined, that.element.find( 'canvas' ), url, 400, 100 );
                },
            },
        }
    );
    
    var form_default_field_chat_input_default = Tool_Element_Input_Menu
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_chat_input_default' ),
            'callback' :
            {
                'init change' : function ( event )
                {
                    var that = event.data.that;
                    form_default_field_chat_media_preview.value( that.value( ) );
                },
            },
        }
    );
    
    Tool_Element_Button_Default
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
    
    var form_default_field_badge_media_preview = Tool_Element_Media_Image
    (
        {
            'element' : $( '#tool_profilebuilder_form_default_field_badge_media_preview' ),
        }
    );
    
    var form_default_field_badge_input_default = Tool_Element_Input_Menu
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_field_badge_input_default' ),
            'callback' :
            {
                'init change' : function ( event )
                {
                    var that = event.data.that;
                    form_default_field_badge_media_preview.value( that.value( ) );
                },
            },
        }
    );
    
    Tool_Element_Button_Default
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
    
    var form_default_field_starbadge_input_default = Tool_Element_Input_Radiocheck
    (
        {
            'element' : $( '#tool_profilebuilder_form_default_field_starbadge_input_default' ),
        }
    );
    
    // form reset
    
    Tool_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_button_reset' ),
            'callback' :
            {
                'click' : function ( event )
                {
                    _util_popup_confirm
                    (
                        'Do you want to reset your profile?',
                        function ( )
                        {
                            form_default_field_picture_input_default  .reset( );
                            form_default_field_platoid_input_default  .reset( );
                            form_default_field_bio_input_default      .reset( );
                            form_default_field_banner_input_default   .reset( );
                            form_default_field_frame_input_default    .reset( );
                            form_default_field_chat_input_default     .reset( );
                            form_default_field_badge_input_default    .reset( );
                            form_default_field_starbadge_input_default.reset( );

                            var valid = Tool_Profilebuilder_valid
                            (
                                form_default_field_picture_input_default,
                                form_default_field_platoid_input_default,
                                form_default_field_bio_input_default,
                            );
                            
                            if ( valid )
                            {
                                modal_default.modal( 'show' );
                                modal_default.animate( { scrollTop : 0 }, 0 );
                            }
                            else
                            {
                                modal_default.modal( 'show' );
                                modal_default.animate( { scrollTop : 0 }, 0 );
                                return;
                            }
                        },
                    );
                },
            },
        }
    );
    
    // form apply
    
    Tool_Element_Button_Default
    (
        {
            'element'  : $( '#tool_profilebuilder_form_default_button_apply' ),
            'callback' :
            {
              //'init click' : function ( event )
                'click' : function ( event )
                {
                    _util_popup_dummy
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
                            
                            if ( valid )
                            {
                                modal_default.modal( 'hide' );
                            }
                            else
                            {
                                modal_default.modal( 'show' );
                                modal_default.animate( { scrollTop : 0 }, 0 );
                                return;
                            }
                            
                            var picture_element = cropper_default.canvascirc( );
                            if ( ! picture_element ) return;
                            var picture_url = picture_element.toDataURL( 'image/png' );
                            
                            var picture     = picture_url;
                            var platoid     = form_default_field_platoid_input_default  .value( );
                            var bio         = form_default_field_bio_input_default      .value( );
                            var banner      = form_default_field_banner_input_default   .item( ).datab( 'banner' );
                            var frame       = form_default_field_frame_input_default    .item( ).datab( 'frame' );
                            var frame_layer = form_default_field_frame_input_default    .item( ).datab( 'frame-layer' );
                            var chat        = form_default_field_chat_input_default     .item( ).datab( 'chat' );
                            var chat_color  = form_default_field_chat_input_default     .item( ).datab( 'chat-color' );
                            var chatbadge   = form_default_field_chat_input_default     .item( ).datab( 'chatbadge' );
                            var badge       = form_default_field_badge_input_default    .item( ).datab( 'badge' );
                            var starbadge   = form_default_field_starbadge_input_default.element.datab( 'starbadge' );
                            var starbadge_n = form_default_field_starbadge_input_default.value( );
                            
                            Tool_Profilebuilder_canvas
                            (
                                undefined,
                                canvas_default,
                                picture,
                                platoid,
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
                        },
                    );
                },
            },
        }
    );
    
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

function Tool_Profilebuilder_canvas ( deferred, canvas, picture, platoid, bio, banner, frame, frame_layer, chat, chat_color, chatbadge, badge, starbadge, starbadge_n )
{
    if ( canvas instanceof jQuery ) canvas = canvas.get( 0 );
    
    var picture_deferred = $.Deferred( );
    var picture_element = document.createElement( 'img' );
    picture_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_picture' );
    picture_element.onerror = function ( ) { picture_deferred.resolve( ) };
    picture_element.onload  = function ( ) { picture_deferred.resolve( ) };
    picture_element.src = picture || 'data:,';
    
    var platoid_element = document.createElement( 'span' );
    platoid_element.setAttribute( 'id', 'tool_profilebuilder_canvas_default_element_platoid' );
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
            var width       = 148; // chat_element.width - 2;
            var widthhalf   = Math.floor( width / 2 );
            var widthhalfb  = widthhalf + 1;
            var height      = 103; // chat_element.height - 2;
            var heighthalf  = Math.floor( height / 2 );
            var heighthalfb = heighthalf + 1;
            
            var canvasb    = document.createElement( 'canvas' );
            canvasb.width  = width;
            canvasb.height = height;
            var contextb   = canvasb.getContext( '2d' );
            contextb.drawImage( chat_element, 1, 1, canvasb.width, canvasb.height, 0, 0, canvasb.width, canvasb.height );
            
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


