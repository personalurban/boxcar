/**
 * Prints output to stdout
 */

import chalk from 'chalk';

var pkg = require( '../../../package.json' );

var logtable = {
    'silly': 6,
    'debug': 5,
    'verbose': 4,
    'info': 3,
    'warn': 2,
    'error': 1
};

/**
 * General config for printing
 * Externally update with config( opts )
 */
var conf = {
    /**
     * loglevel of logs to be output
     * Uses the const levels log table
     */
    loglevel: logtable.info,

    /**
     * Most outputs include an opening brace, this defines the size of it in characters
     */
    initialTab: 10
};


/**
 * Wraps up the string in squares braces
 */
var wrap = function( str ) {
    var brace = '[' + chalk.gray( str ) +']';
    while ( brace.length < 10 ) {
        brace += ' ';
    }
    return brace;
};


/**
 * Expose the logtable as { levels }
 */
export const levels = logtable;


/**
 * Sets config options
 */
export function config( opts ) {
    conf = Object.assign( conf, opts );
}

/**
 * Default export is the print object for logging, erroring, debuging etc
 */
export default {
    log: function( ...args ) {
        if ( conf.level > levels.info ) {
            return;
        }

        args.unshift( wrap( pkg.name ) );

        process.stdout.write( args.join( ' ' ) + '\n' );
    }
};
