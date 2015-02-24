/**
 * config store
 * ---
 * Grabs config info from the db
 */

import EventEmitter from 'eventemitter3';
import level from '../utils/leveldb';


/**
 * The config store is responsible for accessing config options both from the
 * database and from disk
 */
class ConfigStore extends EventEmitter {
    /**
     * @constructs
     */
    constructor() {
        this.level = null;
        this.socket = null;
    }

    /**
     * Connects the store to the config db
     */
    connect() {
        return new Promise( ( resolve, reject ) => {

            // Connect to specify config sublevel
            level.connect( 'config' )
                .then( ( connection ) => {
                    this.level = connection.client;
                    this.socket = connection.socket;
                    resolve( this );
                })
                .catch( ( err ) => {
                    console.log( 'error connecting to db', err );
                    reject( err );
                });
        });
    }

    /**
     * updates the version in the db
     */
    updateVersion( ver ) {
        this.level.put( 'version', ver, function( err ) {
            if ( err ) {
                return console.error( 'error updating version in db', err );
            }
        });
    }
}

export default new ConfigStore();
