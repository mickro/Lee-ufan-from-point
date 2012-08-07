var isFading = false;

function showPreview ( url ) {
  $( "#preview_img" ).attr( 'src', url );
  if ( !isFading ) {
    $( "#preview" ).fadeIn( 400, function() { isFading = false; } );
    isFading = true;
  } else {
    $( "#preview" ).show();
  }
}

function hidePreview () {
  $( "#preview" ).hide();
}

function ppFadeIn() {
  $( "#pic_over" ).fadeIn( 23000, 'easeInBounce', ppFadeOut );
}

function ppFadeOut() {
  $( "#pic_over" ).fadeOut( 23000, 'easeOutBounce', ppFadeIn );
}

function build() {
  $( "#preview" ).hide();
  
  // effect on the paint
  $( "#pic_over" ).hide();
  ppFadeIn();
  
  $( "#link_artist" ).mouseover ( function() {
      showPreview( "./img/portrait.org.jpg" );
    } );
  $( "#link_description" ).mouseover ( function() {
      showPreview( "./img/from_point_mini.jpg" );
    } );
  $( "#link_demo" ).mouseover ( function() {
      showPreview( "./img/web_mini.jpg" );
    } );
  $( "#link_info" ).mouseover ( function() {
      showPreview( "./img/micka_mini.jpg" );
    } );
   $( ".link a" ).mouseout ( function() {
      hidePreview();
    } );
 }
