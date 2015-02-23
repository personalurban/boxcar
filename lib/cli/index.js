/* es6:babel */

import cmdr from './utils/commander';

var argv = require( 'minimist' )( process.argv.slice( 2 ) );

cmdr.on( 'error', function onError( err ) {
    console.error( err.code, err.message );
});

cmdr.use( require( './commands/start' ) );

cmdr.run( argv );
