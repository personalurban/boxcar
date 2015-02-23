/**
 * version
 * ---
 *
 * Just returns the version
 */

import app from '../../app';
import { Command } from '../utils/general';
import print from '../utils/print';

/**
 * Start action
 */
var version = function *( args ) {
    print.log( app.version );
};

/**
 * Expose the 'start' command object
 */
export default new Command()
    .name( 'version' )
    .description( 'Displays boxcar version' )
    .action( version );
