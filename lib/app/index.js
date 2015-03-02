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
}


module.exports = new App();
