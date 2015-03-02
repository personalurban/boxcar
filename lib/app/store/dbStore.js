/**
 * dbStore
 * ---
 * Manages connection to the db
 */

import fs from 'fs';
import Levelable from 'levelable';
import EventEmitter from 'eventemitter3';
import config from './configStore';

var pkg = require( '../../../package.json' );


class DBStore extends EventEmitter {
    /**
     * @constructs
     */
    constructor() {
        this.listening = false;
        this.meta = null;
        this.manifest = null;
        this.server = null;

        try {
            this.manifest = JSON.parse( fs.readFileSync( config.path.db + '/../manifest.json' ) );
        } catch( err ) {
            // It probably doesnt exist so consume
        }

        var sublevels = [
            'users',
            'root'
        ];

        // This will smash over users,root - but they'll probably exist anyway
        try {
            sublevels = Object.keys( this.manifest.sublevels );
        } catch( err ) {
            // It probably just doesnt exist or has no subs so create
        }

        this.level = new Levelable({
            port: pkg.config.dbport,
            path: config.path.db,
            sublevels: sublevels
        });
    }

    init() {
        return new Promise( ( resolve, reject ) => {
            // Try to connect the meta level and create the server if not
            this.connectMeta()
                .then( resolve )
                .catch( ( err ) => {
                    if ( err.code !== 'ECONNREFUSED' ) {
                        console.error( 'Error connecting to database', err );
                        return;
                    }

                    this.startServer()
                        .then( () => {
                            this.connectMeta()
                                .then( resolve )
                                .catch( reject );
                        })
                        .catch( reject );
                });
        });
    }

    connectMeta() {
        return new Promise( ( resolve, reject ) => {
            this.sublevel( 'meta', {
                manifest: this.manifest
            })
                .then( ( con ) => {
                    this.meta = con;
                    resolve();
                })
                .catch( reject );
        });
    }

    startServer() {
        return new Promise( ( resolve, reject ) => {
            this.level.listen()
                .then( ( server )=> {
                    console.log( 'DB ready on %s', this.level.location );

                    this.listening = true;
                    this.server = server;

                    try {
                        this.manifest = JSON.parse( fs.readFileSync( config.path.db + '/../manifest.json' ) );
                    } catch( err ) {
                        console.error( 'Error reading database manifest\n', err );
                        reject( err );
                    }

                    resolve();
                })
                .catch( reject );
        });
    }

    writeManifest( man ) {
        try {
            fs.writeFileSync( config.path.db + '/../manifest.json', JSON.stringify( man ) );
        } catch( err ) {
            console.error( 'Error writing database manifest\n', err );
        }

        this.manifest = man;
    }

    /**
     * closes the server and any loose connections
     */
    close() {
        this.meta.socket.end();

        if ( this.listening ) {
            this.server.close();
        }
    }

    /**
     * Returns the db sublevel
     * @param sub <String> the sublevel to access
     * @async
     */
    sublevel( sub ) {
        return new Promise( ( resolve, reject ) => {
            this.level.connect( sub )
                .then( ( res ) => {
                    resolve( res );
                })
                .catch( reject );
        });
    }
}

var store = new DBStore();

export default store;
