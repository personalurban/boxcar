/**
 * config store
 * ---
 * Grabs config info from the db
 */

import EventEmitter from 'eventemitter3';


/**
 * The config store is responsible for accessing config options
 */
class ConfigStore extends EventEmitter {
    /**
     * @constructs
     */
    constructor() {
        // Check to see if config files exist
    }

    /**
     * updates the version in the db
     */
    updateVersion( ver ) {
        
    }
}

export default new ConfigStore();
