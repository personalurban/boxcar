/* es6:babel */
/**
 * Boxcar main app object
 */

import EventEmitter from 'eventemitter3';
import createFolders from './utils/createFolders';
import config from './store/configStore';
import db from './store/dbStore';

var pkg = require( '../../package' );

/**
 * Main boxcar application functionality
 */
class App extends EventEmitter {
    /**
     * Creates directory structure, sets up database and connections to it.
     * Will emit a ready event when its done initialising.
     * @constructs
     */
    constructor() {
        this.config = config;
        this.user = 'root';

        Promise.resolve()
            .then( createFolders )
            .then( () => {
                return new Promise( ( resolve, reject ) => {
                    db.init()
                        .then( resolve )
                        .catch( reject );
                });
            })
            .then( () => {
                this.emit( 'ready' );
            })
            .catch( ( err ) => {
                console.error( 'Error initialising Boxcar', err );
            });
    }

    destroy() {
        db.close();
    }

    /**
     * Returns the version number from the package
     */
    get version() {
        return pkg.version;
    }

    getVersion() {
        return new Promise( ( resolve, reject ) => {
            // db.level.sublevel( 'miner' )
            //     .then( () => {
            //         db.meta.get( 'sublevels', function( err, res ) {
            //             console.log( err, res);
            //
            //             if ( err ) reject( err );
            //
            //             resolve( res );
            //         });
            //     } )
            //     .catch( ( err ) => {
            //         console.log( 'sublevel error', err );
            //         reject( err );
            //     });
            db.meta.client.get( 'sublevels', function( err, res ) {
                // console.log( err, res);

                if ( err ) {
                    reject( err );
                }

                resolve( res );
            });
        });
    }

    addUser( userName ) {
        return new Promise( ( resolve, reject ) => {
            db.meta.client.get( 'users', function( err, res ) {
                // If the error is a not found then its fine but otherwise spit it
                if ( err && err.type !== 'NotFoundError' ) {
                    reject ( err );
                    return;
                }

                // If it already exists then return
                if ( res && res.includes( userName ) ) {
                    reject( 'Username ' + userName + ' already exists' );
                    return;
                }

                // Add the new userName to the existing list or create
                var users = res
                    ? res.concat( userName )
                    : [ userName ];

                db.meta.client.put( 'users', users, function( err ) {
                    if ( err ) {
                        reject( err );
                    }

                    db.level.sublevel( userName )
                        .then( () => {
                            resolve({
                                status: 200,
                                user: userName,
                                message: 'successfully added'
                            });
                        })
                        .catch( reject );
                });
            });
        });
    }

    listUsers() {
        return new Promise( ( resolve, reject ) => {
            db.meta.client.get( 'users', function( err, res ) {
                // Not found is valid
                if ( err && err.notFound ) {
                    resolve({
                        status: 404,
                        body: 'No registered users found'
                    });
                    return;
                }

                if ( err ) {
                    reject( err );
                }

                // Spit out the registered users array
                resolve({
                    status: 200,
                    body: res
                });
            });


        });
    }
}


module.exports = new App();
