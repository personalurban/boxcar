/**
 * start
 * ---
 *
 * Starts a server listening
 */

import Server from '../../server';
import { Command } from '../utils/commander';

/**
 * Start action
 */
var start = function( args ) {
    var server = new Server( args.port );
    server.start();
};

/**
 * Create the command object
 */
var command = new Command();
command
    .name( 'start' )
    .description( 'Starts the boxcar server' )
    .action( start );

/**
 * Expose the command object
 */
export default command.register();
