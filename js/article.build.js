var mousemove_timeout = -1;
var tools_appearing = false;

function onMouseOutTools( ) {
   if ( mousemove_timeout != -1 ) {
      clearTimeout( mousemove_timeout );
      mousemove_timeout = -1;
    }
    
    mousemove_timeout = setTimeout( 'toolsHide()', 1500 );
}

function onMouseOverTools( ) {
   if ( mousemove_timeout != -1 ) {
      clearTimeout( mousemove_timeout );
      mousemove_timeout = -1;
    }
}

function onMouseMove( ) {
   if ( !tools_appearing ) {
    tools_appearing = true;
    if ( mousemove_timeout != -1 ) {
      clearTimeout( mousemove_timeout );
      mousemove_timeout = -1;
    }
    $( "#tools" ).fadeIn();
    $( "#tools" ).center( { vertical: false } );
    var new_top = 5 * ( ($( window ).height() - $( "#tools" ).outerHeight()) / 6 ) ;
    $( "#tools" ).css( 'top', new_top );
    
    mousemove_timeout = setTimeout( 'toolsHide()', 1500 );
   }
}

function toolsHide() {
  $( "#tools" ).fadeOut();
  tools_appearing = false;
}

function build() {
   $( "button" ).button();
   $( "#btn_home" ).click(function() {
      transitionOut( function() {
	window.location = 'index.html';
      } );
    });
   
   try {
    $( "#btn_audio" ).click(function() {
	document.getElementById('audio1').play();
      });
   } catch (e) {
   }

   $( "#tools" ).center( { vertical: false } );
   $( "#tools" ).hide();
   $( "#tools" ).mouseover( onMouseOverTools );
   $( "#tools" ).mouseout( onMouseOutTools );
   $( "body" ).mousemove( onMouseMove );
}
