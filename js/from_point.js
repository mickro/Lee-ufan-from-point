const CELL_SIZE = 25;		// ! update CSS too
var resize_factor = 1;
var R = 184;
var G = 85;
var B = 4;
const LINE_COUNT = 20;
const COL_COUNT = 32;
const EROSION_FACTOR = 15;
var tools_appearing = false;

// CONFIG
const CONFIG = {
  ONE_BY_ONE: {
    TIME_LOOP: 160,
    TIME_ANIMATE: 100,
    UPDATE_FUNCTION: 'updateOne()'
  },
  ONE_SHOT: {
    TIME_LOOP: 1600,
    TIME_ANIMATE: 1000,
    UPDATE_FUNCTION: 'updateAll()'
  }
}

// GLOBAL USE
var TIME_LOOP = 160;
var TIME_ANIMATE = 100;
var UPDATE_FUNCTION = '';

var start_interval = -1;
var mousemove_timeout = -1;


var is_resizing = false;
var resizing_timeout = -1;
var is_ready = false;

var current_line = 0;
var c_b = 0;

function getId( line, col ) {
  return 'cell_' + line + '_' + col;
}
 
function range_0_256( n ) {
  n = Math.floor( n );
  n = Math.min( n, 256 );
  n = Math.max( n, 0 );
  return n;
}

function getColor( r, g, b ) {
  return 'rgb( ' + range_0_256( r ) + ', ' + range_0_256( g )+ ', ' + range_0_256( b ) + ')' ;
}

function applyErosion( n, erosion ) {
  return ( 256 - n ) / erosion;
}

function build() {
   for( var line = 0; line < LINE_COUNT; ++line ) {
     for( var b = newBrush( R, G, B, 0); b.n < COL_COUNT; ++b.n ) {
      
      var id = getId( line, b.n );
      
      $( '#grid' ).append( '<div id="' + id + '" class="cell" />' );
      $( '#' + id ).addClass( 'cell' );
     
     }
   }
   
   $( "#method_radio" ).buttonset();
   $( "#method_radio" ).change( onMethodChange );
   
   $( "#tools" ).center( { vertical: false } );
   $( "#tools" ).hide();
   $( "#tools" ).mouseover( onMouseOverTools );
   $( "#tools" ).mouseout( onMouseOutTools );
   $( "body" ).mousemove( onMouseMove );
   
   $("button").button();
    $( "#btn_home" ).click(function() {
	window.location = 'index.html';
    });
   
   try {
    $( "#btn_audio" ).click(function() {
	document.getElementById('audio1').play();
      });
   } catch (e) {
   }
   
  c_b = newBrush( R, G, B, 0 );
}

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

function onMethodChange( ) {
  if ( $('input[type=radio][name=method_radio]:checked').attr('id') == 'method_one_shot' ) {
    config = CONFIG.ONE_SHOT;
  } else {
    config = CONFIG.ONE_BY_ONE;
    c_b = newBrush( R, G, B, 0 );
    current_line = 0;
  }
  
  stop();
  setTimeout( 'restart()', TIME_LOOP * 2 );
  
  TIME_LOOP = config.TIME_LOOP;
  TIME_ANIMATE = config.TIME_ANIMATE;
  UPDATE_FUNCTION = config.UPDATE_FUNCTION;
}

function start( config ) {
  build();
  TIME_LOOP = config.TIME_LOOP;
  TIME_ANIMATE = config.TIME_ANIMATE;
  UPDATE_FUNCTION = config.UPDATE_FUNCTION;
  start_interval = setInterval( UPDATE_FUNCTION, TIME_LOOP );
}

function restart() {
  clearAll( 'onClearAllConplete()' );
}

function onClearAllConplete() {
  start_interval = setInterval( UPDATE_FUNCTION, TIME_LOOP );
}

function newBrush( r, g, b, n ) {
  return {
    r:r,
    g:g,
    b:b,
    n:n,
    applyErosion: function() {
      var erosion = Math.floor( ( Math.random() * EROSION_FACTOR ) ) + 2;
      if ( this.n > 0 ) {
	this.r += applyErosion( this.r, erosion );
	this.g += applyErosion( this.g, erosion );
	this.b += applyErosion( this.b, erosion );
      }
      return this;
    },
    getColor: function() {
      return getColor( this.r, this.g, this.b );
    }
  };
}

function clearAll( functionNameComplete ) {
  for( var line = 0; line < LINE_COUNT; ++line ) {
     for( var n = 0; n < COL_COUNT; ++n ) {
      var id = getId( line, n );
      $( '#' + id ).animate( { backgroundColor: 'transparent' }, TIME_ANIMATE );
      //$( '#' + id ).fadeOut();
     }
   }
   setTimeout( functionNameComplete, TIME_ANIMATE );
}

function updateAll() {
   for( var line = 0; line < LINE_COUNT; ++line ) {
     for( var b = newBrush( R, G, B, 0); b.n < COL_COUNT; ++b.n ) {
      var color = b.applyErosion( ).getColor( );
      
      var id = getId( line, b.n );
      $( '#' + id ).animate( { backgroundColor: color }, TIME_ANIMATE );
     }
   }
}


function updateOne() {
  var color = c_b.applyErosion( ).getColor( );
  var id = getId( current_line, c_b.n );
  $( '#' + id ).animate( { backgroundColor: color }, TIME_ANIMATE );
  
  ++ c_b.n;
  
  if ( c_b.n >= COL_COUNT ) {
    
    ++ current_line;
    
    c_b = newBrush( R, G, B, 0 );
    if ( current_line >= LINE_COUNT ) {
      current_line = 0;
      stop();
      setTimeout( 'restart()', TIME_LOOP * COL_COUNT * 2 );
    }
  }
}

function stop() {
  try {
    clearInterval( start_interval );
  } catch ( e ) {
    console.log( e );
  }
}

function resizeValue( id, prop ) {
   var old_prop = $( '#' + id ).css( prop );
   old_prop = old_prop.split( 'px' )[ 0 ];
   $( '#' + id ).css( prop, old_prop * resize_factor + 'px' );
}

function onResize() {
  if ( is_ready && ! is_resizing ) {
    is_resizing = true;
    
    if ( resizing_timeout != -1 ) {
      clearTimeout( resizing_timeout );
    }
    resizing_timeout = -1;
    
    // my screen optimum is 1366x768
    var width_factor = $( window ).width() /  1366;
    var height_factor = $( window ).height() / 768;
    resize_factor = Math.min( width_factor, height_factor );
    
    var cell_size = CELL_SIZE * resize_factor;
    
    $( '.cell' ).css( 'width', cell_size + 'px' );
    $( '.cell' ).css( 'height', cell_size + 'px' );
    $( '.cell' ).css( 'border-radius', 7 * resize_factor + 'px' );
    
    var margin = CELL_SIZE * .1 * resize_factor;
    var cell_space = cell_size + margin;
    
    for( var line = 0; line < LINE_COUNT; ++line ) {
      for( var n = 0; n < COL_COUNT; ++n ) {
	var id = getId( line, n );
	var x = n * cell_space;
	var y = line * cell_space;
	$( '#' + id ).css( 'left', x );
	$( '#' + id ).css( 'top', y );
      }
    }
    $( '#grid' ).css( 'width', cell_space * COL_COUNT );
    $( '#grid' ).css( 'height', cell_space * LINE_COUNT);
 
    $( '#grid' ).center();
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

$(window).resize( onResize );

$(document).ready(
  function() {
    start( CONFIG.ONE_BY_ONE );
    is_ready = true;
    onResize();
  }
);