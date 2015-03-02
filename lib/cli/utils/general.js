/**
 * General
 * ---
 * Generator based flow control for a cli application
 * Inspired by [Commander](http://tj.github.io/commander.js/) and [Koa](http://koajs.com/)
 *
 * @exports {Command} <Class:Command>
 * @export {Option} <Class:Option>
 * @export default <Class:General>
 */

import EventEmitter from 'eventemitter3';
import co from 'co';
import compose from 'koa-compose';
import print, { config as printConf } from './print';
import chalk from 'chalk';

var pkg = require( '../../../package.json' );

const TYPES = {
    COMMAND: 'command',
    OPTION: 'option'
};


/**
 * The General
 * ---
 * Generator based flow - pretty much a skinny koa
 */
class General extends EventEmitter {
    /**
     * @constructs
     */
    constructor() {
        this.plugins = [];
        this.pluginDeclarations = [];

        // Push the notifier
        this.use( function *notifyComplete( next ) {
            yield next;

            // Catches downstream completion
            if ( !this.keepAlive ) {
                this.gen.emit( 'complete' );
            }
        })

        // Push the help screen
        this.use( this.help( this.pluginDeclarations ) );
    }

    /**
     * Adds a command to the stack
     * @param fn <Class:Command> <Function*> the plugin function to append
     */
    use( fn ) {
        // Handle command object
        if ( fn.type === TYPES.COMMAND ) {
            this.plugins.push( fn.action );
            this.pluginDeclarations.push( fn );
            return;
        }

        // Handle options object
        if ( fn.type === TYPES.OPTION ) {
            this.plugins.push( fn.action );
            this.pluginDeclarations.push( fn );
            return;
        }

        // Fn should be a function or generator so handle that
        this.plugins.push( fn );
    }

    /**
     * Executes associated plugins, passing through any arguments
     * @param argv <Object> the program arguments
     */
    run( argv ) {
        // Catch if no action occurred and emit the error
        this.plugins.push( function *notifyNoAction() {
            // If no action was specified at all then display the help screen
            if ( typeof this.command === 'undefined' ) {
                this.argv.h = true;
                this.gen.emit( 'help' );
                return;
            }

            // Otherwise emit the error
            this.gen.emit( 'error', {
                code: 'Runtime error -',
                message: 'Action not found'
            });
            return;
        });

        // Compose and run middlewares
        var fn = co.wrap( compose( this.plugins ));
        fn.call({
            command: argv._[ 0 ],
            argv: argv,
            gen: this
        })
            .catch( ( err ) => {
                // Pass on errors
                this.emit( 'error', {
                    code: 'Plugin error -',
                    message: err.message,
                    stack: err.stack,
                    err: err
                });
            });
    }


    /*-----------------------------------------------------------*\
     *
     *  Private methods
     *
    \*-----------------------------------------------------------*/

    /**
     * Displays help output
     * @private
     * @param decs <Array:Object> the plugin declaration tree
     */
    help( decs ) {
        /**
         * This function will run in the General running context
         */
        var printHelp = function() {
            console.log( 'yes, displaying' );
            print.log( '' );
            print.log( 'Usage:', pkg.name, chalk.cyan( '[command]' ), chalk.yellow( '[options]' )  )
            print.log( '' );

            printConf({
                forceBrace: 'help'
            });

            function displayOption( option ) {
                print.log( chalk.yellow( option.short + ', ' + option.long ) );
                print.log( ' ', option.description );
            }

            function displayAction( action ) {
                print.log( chalk.cyan( action.name ) );
                print.log( ' ', action.description );

                action.options.forEach( function( option ) {
                    print.log( ' ', chalk.yellow( option.short + ', ' + option.long ), '  ', option.description );
                });
            }

            var control = {};
            control[ TYPES.COMMAND ] = displayAction;
            control[ TYPES.OPTION ] = displayOption;

            decs.forEach( function displayHelp( dec ) {
                try {
                    control[ dec.type ]( dec );
                    print.log( '' );
                } catch( err ) {
                    print.error( 'Error displaying help for plugin', dec );
                }
            });
        }

        // Add a listener so that help can be fired
        this.on( 'help', printHelp );

        // Return the help middleware
        return function *displayHelp( next ) {
            if ( !this.argv.h && !this.argv.help ) {
                yield next;
                return;
            };

            printHelp();
        }
    }

}



/**
 * Command Object
 * ---
 * Defines an object which represents a command for the program to execute
 */
export class Command {
    constructor() {
        this.command = {
            type: TYPES.COMMAND,
            name: null,
            description: null,
            options: [],
            action: null
        };
    }

    name( commandName ) {
        this.command.name = commandName;
        return this;
    }

    description( commandDesc ) {
        this.command.description = commandDesc;
        return this;
    }

    option( opt ) {
        this.command.options.push( opt );
        return this;
    }

    action( fn ) {
        this.command.action = fn;

        // @TODO validate that the object is ready and then return it
        return this.command;
    }
}


/**
 * Options object
 * ---
 * Deifnes an object which represents a global program argument
 */
export class Option {
    constructor() {
        this.option = {
            type: TYPES.OPTION,
            short: null,
            long: null,
            description: null,
            action: null
        };
    }

    name( short, long ) {
        this.option.short = short;
        this.option.long = long;
        return this;
    }

    description( desc ) {
        this.option.description = desc;
        return this;
    }

    action( fn ) {
        this.option.action = fn;
        return this.option;
    }
}

/**
 * Expose the commander class
 */
export default new General();
