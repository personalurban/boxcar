
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

        this.commands[ action ].actions.forEach( ( act ) => {
            this.emit( action );
            act( argv );
        });
    }

}


export class Command {
    constructor() {
        this.command = {
            name: null,
            description: null,
            options: [],
            actions: []
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
    }

    action( fn ) {
        this.command.actions.push( fn );
    }

    /**
     * Validates and then returns the built command object
     * @TODO validate the command object
     */
    register() {
        return this.command;
    }
}

/**
 * Expose the commander class
 */
export default new Commander();
