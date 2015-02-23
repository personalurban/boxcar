import chalk from 'chalk';

/**
 * Simply logs how long the request took
 */
export default function( opts ) {
    return function *( next ) {
        var start = process.hrtime();
        yield next;
        var end = process.hrtime( start );
        var precision = end[ 1 ] / 100000;
        var time = end[ 0 ] < 1
            ? precision.toFixed( 1 ) + ' μs'
            : end[ 0 ] + ' ms';
        console.log( 'Executed in', chalk.magenta( time ) );
    };
}
