/* es6:babel */

import gen from './utils/general';
import cmd from './utils/gen-cmd';
import perf from './utils/exec-perf';

var argv = require( 'minimist' )( process.argv.slice( 2 ) );

gen.on( 'error', function onError( err ) {
    console.error( err.code, err.message );
});

gen.use( perf() );

gen.use( cmd( require( './commands/start' ) ) );

gen.run( argv );
