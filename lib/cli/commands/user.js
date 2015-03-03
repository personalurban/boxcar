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
 * Perform
 */
function *user( args ) {

    // add a user
    if ( args.a || args.add ) {
        yield add( args.a || args.add );
    }

    // List users
    if ( args.l || args.list ) {
        yield list();
    }

    return;
}


/**
 * Adds a user to the db if the name is not taken
 * @param userName <String> the user name to add
 */
function *add( userName ) {
    print.log( 'Attempting to add user', chalk.magenta( userName ) );

    var res;
    try {
        res = yield app.addUser( userName );
    } catch( err ) {
        print.error( 'Error adding username -', err );
        return;
    }

    Object.keys( res ).forEach( ( key ) => {
        print.debug( chalk.blue( key ), ':', chalk.yellow( res[ key ] ) );
    });

    print.log( chalk.magenta( res.user ), res.message );

    return;
}


/**
 * Lists all users
 */
function *list() {
    print.log( 'Retrieving list of users' );

    var res;
    try {
        res = yield app.listUsers();
    } catch( err ) {
        print.error( 'Error retrieving user list -', err );
        return;
    }

    Object.keys( res ).forEach( ( key ) => {
        print.debug( chalk.blue( key ), ':', chalk.yellow( res[ key ] ) );
    });

    // If not found
    if ( res.status === 404 ) {
        print.log( chalk.red( res.body ) );
        return;
    }

    res.body.forEach( ( user ) => {
        print.log( '  ', chalk.magenta( user ) );
    });

    return;
}


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
    .option( new Option()
        .name( '-l', '--list' )
        .description( 'List registered users' )
        .action()
    )
    .description( 'Access a user' )
    .action( user );
