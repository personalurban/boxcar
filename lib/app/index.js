/* es6:babel */
/**
 * Boxcar main app object
 */

import EventEmitter from 'eventemitter3';
import createFolders from './utils/createFolders';
import leveldb from './utils/leveldb';
import config from './store/configStore';

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

        createFolders()
            .then( leveldb.create() )
            .then( () => {
                return this.config.connect();
            })
            .then( () => {
                this.emit( 'ready' );
            });
    }

    /**
     * Closes connections and tidies up
     */
    close() {
        setImmediate( () => {
            this.config.socket.end();
            leveldb.close();
        });
    }

    /**
     * Returns the version number from the package
     */
    get version() {
        console.log( 'getting version' );
        var run = function *() {
            console.log( 'inside generator' );
            var con = yield leveldb.connect();
            con.client.get( 'version', function( err, res ) {
                console.log( err, res );
            });
        };
        run();

        leveldb.connect()
            .then( function( con ) {
                con.client.sublevel( 'config' ).get( 'version', function( err, res ) {
                    console.log( 'result' );
                    console.log(err,res);
                });
            });


        this.config.updateVersion( pkg.version );
        return pkg.version;
    }
}


module.exports = new App();
