/**
 * config store
 * ---
 * Grabs config info from the db
 */

import path from 'path';
import merge from 'lodash.merge';
import yml from 'require-yml';
import EventEmitter from 'eventemitter3';
import config from '../constants/config';

/**
 * async get config files
 */
function getConfig( filepath ) {
    return new Promise( ( resolve, reject ) => {
        try {
            yml( filepath, null, resolve );
        } catch( err ) {
            reject( err );
        }
    });
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
             yml( path.join( config.path.app, 'config.yml' ) ),
             yml( path.join( config.path.user, 'config.yml' ) )
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
