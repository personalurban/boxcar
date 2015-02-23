/* es6:babel */

var argv = require( 'minimist' )( process.argv.slice( 2 ) );
var Server = require( '../server' );

if ( argv._[ 0 ] === 'start' ) {
    var server = new Server( argv.port );
    server.start();
}
