/**
 * Get connected to the db
 */

import net from 'net';
import multilevel from 'multilevel';
import level from 'level';
import Sublevel from 'level-sublevel';

var pkg = require( '../../../package.json' );

/**
 * The main database accessor process
 */
class DB {
    /**
     * @constructs
     */
    constructor() {
        this.db = null;
        this.server = null;
    }

    /**
     * Creates the sublevels this database accepts
     */
    createSublevels() {
        if ( !this.db ) {
            throw new Error( 'Attempting to create sublevels before the db is ready' );
        }

        this.db.sublevel( 'config' );
    }

    /**
     * Creates the database server and starts it listening
     * @returns promise
     */
    create() {
        try {
            this.db = new Sublevel( level( '/etc/boxcar/.db/boxcar.db' ) );
        } catch( err ) {
            throw new Error( 'Error creating database server', err );
        }

        this.createSublevels();

        this.db.methods = this.db.methods || {};
        multilevel.writeManifest( this.db, '/etc/boxcar/.db/manifest.json' );

        return new Promise( ( resolve, reject ) => {
            try {
                this.server = net.createServer( ( con ) => {
                    con.pipe( multilevel.server( this.db ) ).pipe( con );
                }).listen({
                    port: pkg.config.dbport
                }, () => {
                    // console.log( 'db server listening on port', pkg.config.dbport );
                    resolve();
                } );
            } catch( err ) {
                reject( err );
            }
        });
    }

    /**
     * Creates a new connection to the database server
     * @param sub <String> connect to a specific sublevel
     * @returns Promise - resolves with a db client
     */
    connect( sub ) {
        return new Promise( ( resolve, reject ) => {
            var client = null;
            try {
                var manifest = require( '/etc/boxcar/.db/manifest.json' );

                client = multilevel.client( manifest );
                var con = net.connect( pkg.config.dbport, () => {
                    // Resolve either the sublevel or the whole db and the connection
                    resolve({
                        client: sub ? client.sublevel( sub ) : client,
                        socket: con
                    });
                });
                con.pipe( client.createRpcStream() ).pipe( con );
            } catch ( err ) {
                reject( err );
            }
        });
    }

    /**
     * Closes the server
     */
    close() {
        this.server.close( function( err ) {
            if ( err ) {
                throw new Error( 'Error closing db server' );
            }

            // console.log( 'db server closed on port', pkg.config.dbport );
        });
    }
}


export default new DB();
