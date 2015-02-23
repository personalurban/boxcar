import chalk from 'chalk';
import time from 'pretty-hrtime';

/**
 * Simply logs how long the request took
 */
export default function( opts ) {
    return function *( next ) {
        var start = process.hrtime();
        yield next;
        var end = process.hrtime( start );
        console.log( 'Executed in', chalk.magenta( time( end ) ) );
    };
}
