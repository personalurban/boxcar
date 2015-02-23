/**
 * version
 * ---
 *
 * Just returns the version
 */

import app from '../../app';
import { Command } from '../utils/general';

/**
 * Start action
 */
var version = function *( args ) {
    console.log( app.version );
};

/**
 * Expose the 'start' command object
 */
export default new Command()
    .name( 'version' )
    .description( 'Displays boxcar version' )
    .action( version );
