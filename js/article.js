var is_resizing = false;
var resizing_timeout = -1;
var is_ready = false;

const GOLDEN_NUMBER = 5 / 6;

function onResize() {
  if ( is_ready && ! is_resizing ) {
    is_resizing = true;
    
    if ( resizing_timeout != -1 ) {
      clearTimeout( resizing_timeout );
    }
    resizing_timeout = -1;

    var window_width = $( window ).width();
    var window_height = $( window ).height();
    var width_factor =  window_width /  DESIGNER_WIDTH;
    var height_factor =  window_height / DESIGNER_HEIGHT;
    var resize_factor = Math.min( width_factor, height_factor );
    
    $( '#text' ).css( 'width', resize_factor * DESIGNER_WIDTH_TEXT + 'px' );
    $( '#text' ).css( 'height', resize_factor * DESIGNER_HEIGHT_TEXT + 'px' );
    $( '#text' ).css( 'font-size', resize_factor * DESIGNER_FONT_SIZE + 'px' );
    
    $( '.pic' ).attr( 'width', resize_factor * DESIGNER_WIDTH_IMG + 'px' );
    $( '.pic' ).attr( 'height', resize_factor * DESIGNER_HEIGHT_IMG + 'px' );
      
    $( '#content' ).css( 'width', resize_factor * DESIGNER_WIDTH * GOLDEN_NUMBER + 'px' );
    $( '#content' ).css( 'height', resize_factor * DESIGNER_HEIGHT * GOLDEN_NUMBER + 'px' );
    
    try {
      $( '#preview_img' ).attr( 'width', resize_factor * DESIGNER_WIDTH_PREVIEW_IMG + 'px' );
      $( '#preview_img' ).attr( 'height', resize_factor * DESIGNER_HEIGHT_PREVIEW_IMG + 'px' );
    } catch (e) {
    }
    
    try {
      $( '.icon' ).attr( 'width', resize_factor * DESIGNER_HEIGHT_ICON + 'px' );
      $( '.icon' ).attr( 'height', resize_factor * DESIGNER_WIDTH_ICON + 'px' );
    } catch (e) {
    }
    
    $( '#content' ).center();
    
    is_resizing = false;
  } else {
    if ( is_ready ) {
      if ( resizing_timeout != -1 ) {
	clearTimeout( resizing_timeout );
      }
      resizing_timeout = setTimeout( 'onResize()', 200 );
    }
  }
}

function transitionOut( callback ) {
  $( "#content" ).fadeOut( 300, callback );
}

$(window).resize( onResize );

$(document).ready(
  function() {
    is_ready = true;
    build();
    onResize();
    $( "#content" ).hide().fadeIn( 900, 'easeInExpo' );
  }
);