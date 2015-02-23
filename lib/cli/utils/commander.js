
var EventEmitter = require( 'eventemitter3' );


/**
 *
 */
export class Commander extends EventEmitter {
    constructor() {
        this.commands = {};
    }

    /**
     * Uses a specific command object of the following form
     *   @name <String> 'command to call'
     *   @options: <Array:String> 'options to call with'
     *   @action( opts ): <Function>
     */
    use( command ) {
        if ( this.commands[ command.name ] ) {
            this.emit( 'error', {
                code: 'USE',
                message: 'Duplicate command name'
            });
            return;
        }

        this.commands[ command.name ] = command;
    }

    /**
     * Executes associated commands, passing through any arguments
     */
    run( argv ) {
        var action = argv._[ 0 ];

        if ( !this.commands[ action ] ) {
            this.emit( 'error', {
                code: 'RUN',
                message: 'Action not found'
            });
            return;
        }

        this.emit( action );
        this.commands[ action ].action( argv );
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
export default new Commander();
