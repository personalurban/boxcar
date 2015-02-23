
var EventEmitter = require( 'eventemitter3' );
var co = require( 'co' );
var compose = require( 'koa-compose' );

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
    }

    /**
     * Adds a command to the stack
     * @param fn <Class:Command> <Function*> the plugin function to append
     */
    use( fn ) {
        // Handle command object
        if ( fn.type === TYPES.COMMAND ) {
            this.plugins.push( fn.action );
            return;
        }

        // Handle options object
        if ( fn.type === TYPES.OPTION ) {
            this.plugins.push( fn.action );
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
        this.plugins.push( function *() {
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
                    message: err.message
                });
            });
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
        }
    }

    name({ short=null, long=null}) {
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
