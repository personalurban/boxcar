/**
 * start
 * ---
 *
 * Starts a server listening
 */

import Server from '../../server';
import { Command } from '../utils/general';

/**
 * Start action
 */
var start = function *( args ) {
    var server = new Server( args.port );
    server.start();
};

/**
 * Expose the 'start' command object
 */
export default new Command()
    .name( 'start' )
    .description( 'Starts the boxcar server' )
    .action( start );
