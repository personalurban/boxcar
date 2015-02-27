/* es6:babel */

import minimist from 'minimist';

import app from '../app';
import gen from './utils/general';
import cmd from './utils/gen-cmd';
import timing from './utils/timing';
import print, { config as printConf, loglevel } from './utils/print';

// Set up the print configuration
printConf({
    loglevel: process.env.DEBUG ? loglevel.debug : loglevel.info
});



/**
 * Events
 */
gen.on( 'error', function onError( err ) {
    print.error( err.code, err.message );
    print.debug( err.stack );
});

gen.on( 'complete', function onComplete() {
    // app.close();
});


/**
 * Middlewares
 */
gen.use( timing() );


/**
 * Options / Arguments
 */
gen.use( require( './options/loglevel' ) );
gen.use( require( './options/version' ) );


/**
 * Commands
 */
gen.use( cmd( require( './commands/start' ) ) );


/**
 * Get going when the app is setup
 */
app.on( 'ready', function() {
    gen.run( minimist( process.argv.slice( 2 ) ) );
});
