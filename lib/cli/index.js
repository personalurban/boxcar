/* es6:babel */

import gen from './utils/general';
import cmd from './utils/gen-cmd';
import timing from './utils/timing';

var argv = require( 'minimist' )( process.argv.slice( 2 ) );

gen.on( 'error', function onError( err ) {
    console.error( err.code, err.message );
});

gen.use( timing() );

gen.use( cmd( require( './commands/start' ) ) );
gen.use( cmd( require( './commands/version' ) ) );

gen.run( argv );
