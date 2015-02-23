/* es6:babel */

import minimist from 'minimist';

import gen from './utils/general';
import cmd from './utils/gen-cmd';
import timing from './utils/timing';
import print, { config as printConf, loglevel } from './utils/print';

// Set up the print configuration
printConf({
    loglevel: process.env.DEBUG ? loglevel.debug : loglevel.info
});

var argv = minimist( process.argv.slice( 2 ) );



gen.on( 'error', function onError( err ) {
    print.error( err.code, err.message );
});

gen.use( timing() );

gen.use( cmd( require( './commands/start' ) ) );
gen.use( cmd( require( './commands/version' ) ) );

gen.run( argv );
