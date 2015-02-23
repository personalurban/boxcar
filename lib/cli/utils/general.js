
var EventEmitter = require( 'eventemitter3' );
var co = require( 'co' );
var compose = require( 'koa-compose' );


/**
 *
 */
class General extends EventEmitter {
    constructor() {
        this.middleware = [];
    }

    /**
     * Adds a command to the stack
     * @param command <Class:Command> <Function*>
     */
    use( fn ) {
        if ( fn.action ) {
            this.middleware.push( fn.action );
            return;
        }

        this.middleware.push( fn );
    }

    /**
     * Executes associated commands, passing through any arguments
     * @param argv <Object> the program arguments
     */
    run( argv ) {
        // Catch if no action occurred and emit the error
        this.middleware.push( function *() {
            this.gen.emit( 'error', {
                code: 'RUN',
                message: 'Action not found'
            });
        });

        // Compose and run middlewares
        var fn = co.wrap( compose( this.middleware ));
        fn.call({
            command: argv._[ 0 ],
            argv: argv,
            gen: this
        })
            .catch( function( err ) {
                // Pass on errors
                throw new Error( err );
            });
    }
}




export class Command {
    constructor() {
        this.command = {
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
 * Expose the commander class
 */
export default new General();
