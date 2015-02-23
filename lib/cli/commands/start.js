/**
 * start
 * ---
 *
 * Starts a server listening
 */

import Server from '../../server';
import { Command, Option } from '../utils/general';
import print from '../utils/print';

/**
 * Start action
 */
var start = function *( args ) {
    var port = args.p || args.port;
    print.log( 'Starting server', port ? 'on port ' + port  : '' );
    var server = new Server( port );
    server.start();
};

/**
 * Expose the 'start' command object
 */
export default new Command()
    .name( 'start' )
    .option( new Option()
        .name( '-p', '--port' )
        .description( 'specify port to listen to' )
        .action()
    )
    .description( 'Starts the boxcar server' )
    .action( start );
