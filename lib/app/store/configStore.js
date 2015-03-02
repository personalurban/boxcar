/**
 * config store
 * ---
 * Grabs config info from the db
 */

import fs from 'fs';
import path from 'path';
import merge from 'lodash.merge';
import EventEmitter from 'eventemitter3';
import config from '../constants/config';

function get( pathname ) {
    try {
        return JSON.parse( fs.readFileSync( pathname ) );
    } catch( err ) {
        if ( err.code === 'ENOENT' ) {
            // bury file not found errors, not existing is fine
            return null;
        }
        
        console.error( 'Error reading config file\n', err );
    }
}

/**
 * The config store is responsible for accessing config options
 */
class ConfigStore extends EventEmitter {
    /**
     * @constructs
     */
    constructor() {
        // Creates config from default, app config and user config files
        // User config is most important, then app, then defuault
        this.config = merge.apply( null, [
             config,
             get( path.join( config.path.app, 'config.json' ) ),
             get( path.join( config.path.user, 'config.json' ) )
         ]);
    }
}

/**
 * Export the store
 */
export var store = new ConfigStore();

/**
 * Usually just the config object is required so export that as default
 */
export default store.config;
