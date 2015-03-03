/**
 * Prints output to stdout
 * ---
 * @export loglevel <Object> the logtable constants
 * @export config( opts ) <Function> accessor to set config
 * @export default <Object> the print object for printing to stdout
 */

import chalk from 'chalk';

var pkg = require( '../../../package.json' );

const logtable = {
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
    initialTab: 18,

    /**
     * Global override for the brace text
     */
    forceBrace: null
};


/**
 * Wraps up the string in squares braces
 */
var wrap = function( str ) {
    var brace = '[' + chalk.gray( conf.forceBrace || str ) +']';
    // brace.length becomes longer due to chalk,
    // where str.length === 0, brace.length === 12
    while ( brace.length < conf.initialTab ) {
        brace += ' ';
    }
    return brace;
};


/**
 * The actual print function
 */
function print({ level=logtable.info, brace=pkg.name, content }) {
    if ( conf.loglevel < level ) {
        return;
    }

    content.unshift( wrap( brace ) );

    process.stdout.write( content.join( ' ' ) + '\n' );
}


/**
 * Expose the logtable as { loglevel }
 */
export const loglevel = logtable;


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
        print({
            content: args
        });
    },

    debug: function( ...args ) {
        args.unshift( chalk.cyan( 'DEBUG:' ) );
        print({
            level: logtable.debug,
            content: args
        });
    },

    silly: function( ...args ) {
        print({
            level: logtable.silly,
            content: args
        });
    },

    verbose: function( ...args ) {
        print({
            level: logtable.verbose,
            content: args
        });
    },

    warn: function( ...args ) {
        args.unshift( chalk.yellow( 'WARN:' ) );
        print({
            level: logtable.warn,
            content: args
        });
    },

    error: function( ...args ) {
        args.unshift( chalk.red( 'ERROR:' ) );
        print({
            level: logtable.error,
            content: args
        });
    },

    /**
     * Deconstructs object/s into keys for debugging
     */
    object: function( ...args ) {
        args.forEach( ( arg ) => {
            if ( typeof arg !== 'object' ) {
                return;
            }

            this.debug( chalk.grey( '---' ) );

            Object.keys( arg ).forEach( ( key ) => {
                this.debug( chalk.blue( key ), ':', chalk.yellow( arg[ key ] ) );
            });
        });

        this.debug( chalk.grey( '---' ) );

    }
};
