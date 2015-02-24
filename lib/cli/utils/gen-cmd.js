/**
 * Gen-cmd
 * ---
 * Defines an actionable route for application to deadend at
 * Similar in conception to [koa-route](https://github.com/koajs/route)
 */


var commands = {};

export default function cmd( command ) {

    // Immediately return if the name is not unique
    if ( commands[ command.name ] ) {
        return null;
    }

    // Wrap the action so that it’ll only be called when the command matches the name
    var origAction = command.action;
    command.action = function *( next ) {
        if ( commands[ this.command ] ) {
            this.gen.emit( this.command );
            yield commands[ this.command ].call( this, this.argv );
            return;
        }

        yield next;
    };

    commands[ command.name ] = origAction;

    // Return the command object so that general can register description & options and stuff
    return command;
}
