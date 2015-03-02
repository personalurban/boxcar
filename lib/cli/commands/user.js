/**
 * Adds a user
 * ---
 *
 * Adds a new user if the name is not already taken
 */

import app from '../../app';
import { Command, Option } from '../utils/general';
import print from '../utils/print';
import chalk from 'chalk';

/**
 * Start action
 */
var user = function *addUser( args ) {
    var userName = args.a || args.add;

    print.log( 'Attempting to add user', chalk.magenta( userName ) );

    var res;
    try {
        res = yield app.addUser( userName );
    } catch( err ) {
        print.error( 'Error adding username -', err );
        return;
    }

    print.log( chalk.magenta( res.user ), res.message );

    return;
};

/**
 * Expose the 'start' command object
 */
export default new Command()
    .name( 'user' )
    .option( new Option()
        .name( '-a', '--add' )
        .description( 'Specify the user name to add' )
        .action()
    )
    .description( 'Access a user' )
    .action( user );
