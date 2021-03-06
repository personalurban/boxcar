/**
 * General middleware
 * ---
 * Calculates and displays the time taken to process the request
 */

import chalk from 'chalk';
import time from 'pretty-hrtime';
import print from './print';

/**
 * Simply logs how long the request took
 */
export default function( opts ) {
    return function *preciseTiming( next ) {
        var start = process.hrtime();
        yield next;
        var end = process.hrtime( start );
        print.verbose( 'Executed in', chalk.magenta( time( end ) ) );
    };
}
